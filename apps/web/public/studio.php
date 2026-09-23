<?php
declare(strict_types=1);
require_once __DIR__ . '/studio-runtime.php';
header('Cache-Control: no-store, private');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('X-Robots-Tag: noindex, nofollow');
function answer(array $data, int $status=200): never { http_response_code($status); header('Content-Type: application/json'); echo json_encode($data); exit; }
function project_record(string $id, array $user, bool $admin=false): array {
    $filter = $admin ? '' : '&owner_id=eq.' . $user['id'] . '&deletion_requested_at=is.null';
    $rows = sb('/rest/v1/linart_inquiries?id=eq.' . $id . $filter . '&select=id,contact,created_at,status,delivery,deletion_requested_at');
    if (!$rows) throw new RuntimeException('Project access is not available.',403);
    return $rows[0];
}
function is_admin(array $user): bool { return count(sb('/rest/v1/linart_admins?user_id=eq.'.uuid_value($user['id']).'&select=user_id')) > 0; }
try {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') answer(['error'=>'Method not allowed'],405);
    if (!studio_configured()) answer(['error'=>'Online Studio is not available yet. Your inquiry is unaffected.'],503);
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin && $origin !== (getenv('LINART_SITE_ORIGIN') ?: 'https://linartinc.com')) answer(['error'=>'Origin not allowed'],403);
    $multipart = str_starts_with($_SERVER['CONTENT_TYPE'] ?? '', 'multipart/form-data');
    if (!$multipart && !str_starts_with($_SERVER['CONTENT_TYPE'] ?? '', 'application/json')) answer(['error'=>'JSON required'],415);
    if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0)>11534336) answer(['error'=>'File too large'],413);
    $data = $multipart ? $_POST : json_decode((string)file_get_contents('php://input',false,null,0,200001),true);
    if (!is_array($data)) answer(['error'=>'Invalid request'],422);
    $action = $data['action'] ?? '';
    if ($action === 'config') answer(['available'=>true,'pdf_enabled'=>is_executable(getenv('LINART_CLAMSCAN') ?: '')]);
    if (in_array($action,['send_code','verify_code'],true)) {
        limit_action($action,$action==='send_code'?60:3);
        $email = trim((string)($data['email'] ?? ''));
        if (!filter_var($email,FILTER_VALIDATE_EMAIL) || strlen($email)>180) answer(['error'=>'Enter a valid email'],422);
        if ($action==='send_code') {
            sb('/auth/v1/otp','POST',['email'=>$email,'create_user'=>true],null,true);
            answer(['ok'=>true]);
        }
        $code = $data['code'] ?? '';
        if (!is_string($code) || !preg_match('/^[0-9]{6,10}$/',$code)) answer(['error'=>'Enter the email verification code'],422);
        $session = sb('/auth/v1/verify','POST',['email'=>$email,'token'=>$code,'type'=>'email'],null,true);
        if (empty($session['access_token'])) answer(['error'=>'Please request another code'],401);
        $u = sb('/auth/v1/user','GET',null,$session['access_token'],true);
        if (empty($u['email_confirmed_at'])) answer(['error'=>'Email verification required'],401);
        if (($data['admin'] ?? false) === true) {
            if (!is_admin($u)) answer(['error'=>'This account is not authorized for LINART administration.'],403);
            session_name('linart_admin'); session_set_cookie_params(['lifetime'=>0,'path'=>'/','secure'=>true,'httponly'=>true,'samesite'=>'Strict']); session_start(); session_regenerate_id(true);
            $_SESSION['access_token']=$session['access_token']; $_SESSION['expires']=time()+min(3600,(int)($session['expires_in']??3600));
            answer(['ok'=>true]);
        }
        answer(['access_token'=>$session['access_token'],'expires_in'=>$session['expires_in']??3600]);
    }
    $bearer = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $cookieAuth = !str_starts_with($bearer,'Bearer ');
    if ($cookieAuth) {
        if (!$origin || ($_SERVER['HTTP_X_LINART_REQUEST'] ?? '')!=='studio') answer(['error'=>'Sign in required'],401);
        session_name('linart_admin'); session_set_cookie_params(['secure'=>true,'httponly'=>true,'samesite'=>'Strict','path'=>'/']); session_start();
        if (($_SESSION['expires']??0)<time()) answer(['error'=>'Please verify your email again.'],401);
        $token = $_SESSION['access_token'] ?? '';
    } else { $token = substr($bearer,7); }
    if (!$token) answer(['error'=>'Sign in required'],401);
    if (is_file(private_dir().'/revoked-'.hash('sha256',$token))) answer(['error'=>'Please verify your email again.'],401);
    $user = sb('/auth/v1/user','GET',null,$token,true);
    if (empty($user['email_confirmed_at'])) answer(['error'=>'Verify your email'],401);
    $user['id']=uuid_value($user['id']);
    $admin = $cookieAuth && is_admin($user);
    if ($cookieAuth && !$admin) answer(['error'=>'Administrator access removed'],403);
    if ($action==='logout') {
        private_write(private_dir().'/revoked-'.hash('sha256',$token),['expires'=>time()+86400]);
        sb('/auth/v1/logout?scope=local','POST',[], $token, true);
        if ($cookieAuth) { $_SESSION=[]; session_destroy(); setcookie('linart_admin','',['expires'=>1,'path'=>'/','secure'=>true,'httponly'=>true,'samesite'=>'Strict']); }
        answer(['ok'=>true]);
    }
    if ($action==='list') {
        $filter = $admin ? '' : '&owner_id=eq.'.$user['id'].'&deletion_requested_at=is.null';
        $offset = max(0,min(100000,(int)($data['offset']??0)));
        answer(['projects'=>sb('/rest/v1/linart_inquiries?select=id,contact,created_at,status,delivery,deletion_requested_at,linart_studios(revision,submitted_at,submitted_revision,updated_at)&order=created_at.desc&limit=50&offset='.$offset.$filter),'admin'=>$admin]);
    }
    $id = uuid_value($data['inquiry_id'] ?? null);
    if ($action==='claim') {
        $receipt = $data['receipt'] ?? '';
        if (!is_string($receipt) || !preg_match('/^[a-f0-9]{64}$/',$receipt)) answer(['error'=>'Invalid invitation'],422);
        rpc('claim',['p_actor'=>$user['id'],'p_email'=>$user['email'],'p_id'=>$id,'p_hash'=>hash('sha256',$receipt)]);
        answer(['ok'=>true]);
    }
    $project = project_record($id,$user,$admin);
    if ($action==='get') {
        $studio = sb('/rest/v1/linart_studios?inquiry_id=eq.'.$id);
        $assets = sb('/rest/v1/linart_assets?inquiry_id=eq.'.$id.'&order=created_at');
        answer(['project'=>$project,'studio'=>$studio[0]??null,'assets'=>$assets]);
    }
    if ($action==='save' || $action==='submit') {
        answer(['studio'=>rpc('save',['p_actor'=>$user['id'],'p_id'=>$id,'p_revision'=>(int)($data['revision']??-1),'p_answers'=>validated_answers($data['answers']??[]),'p_links'=>validated_links($data['links']??[]),'p_submit'=>$action==='submit'])]);
    }
    if ($action==='status') {
        if (!$admin) answer(['error'=>'Administrator required'],403);
        $status=$data['status']??'';
        if (!in_array($status,['New Inquiry','Awaiting Details','Ready for Review','Contacted','Archived'],true)) answer(['error'=>'Invalid status'],422);
        sb('/rest/v1/linart_inquiries?id=eq.'.$id,'PATCH',['status'=>$status]);
        sb('/rest/v1/linart_audit','POST',['actor'=>$user['id'],'inquiry_id'=>$id,'action'=>'status:'.$status]); answer(['ok'=>true]);
    }
    if ($action==='request_deletion') {
        sb('/rest/v1/linart_inquiries?id=eq.'.$id,'PATCH',['deletion_requested_at'=>gmdate('c')]);
        sb('/rest/v1/linart_audit','POST',['actor'=>$user['id'],'inquiry_id'=>$id,'action'=>'request_deletion']); answer(['ok'=>true]);
    }
    if ($action==='upload') {
        limit_upload($user['id']);
        $file=$_FILES['file']??null;
        if (!$file || $file['error']!==UPLOAD_ERR_OK || $file['size']<1 || $file['size']>10485760 || !is_uploaded_file($file['tmp_name'])) answer(['error'=>'Choose a file under 10 MB'],422);
        $mime=(new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
        $bytes=(string)file_get_contents($file['tmp_name']);
        if (in_array($mime,['image/jpeg','image/png'],true)) {
            $size=@getimagesize($file['tmp_name']);
            if (!$size || $size[0]*$size[1]>20000000 || !function_exists('imagecreatefromstring')) answer(['error'=>'Choose a smaller standard image'],422);
            $im=@imagecreatefromstring($bytes); if (!$im) answer(['error'=>'Invalid image'],422);
            ob_start(); imagejpeg($im,null,85); $bytes=(string)ob_get_clean(); imagedestroy($im); $mime='image/jpeg';
        } elseif ($mime==='application/pdf') {
            $scanner=getenv('LINART_CLAMSCAN')?:'';
            if (!is_executable($scanner)) answer(['error'=>'Document uploads are not enabled. You can describe your plans in the notes.'],422);
            if (!str_starts_with($bytes,'%PDF-') || preg_match('/\/(JavaScript|JS|Launch|EmbeddedFile|RichMedia|OpenAction)\b/i',$bytes)) answer(['error'=>'Use a flattened PDF without active content'],422);
            exec(escapeshellarg($scanner).' --no-summary '.escapeshellarg($file['tmp_name']).' 2>&1',$scanOutput,$scanExit);
            if ($scanExit!==0) answer(['error'=>'The document did not pass the security check'],422);
        } else answer(['error'=>'Use JPEG, PNG or a PDF document'],422);
        if (strlen($bytes)>10485760) answer(['error'=>'File too large'],422);
        $asset=uuid_value($data['asset_id']??null); $note=$data['note']??''; $purpose=$data['purpose']??'';
        if (!is_string($note)||mb_strlen($note)>500) answer(['error'=>'Use a shorter caption'],422);
        $filename=$asset.($mime==='application/pdf'?'.pdf':'.jpg');
        $reserved=rpc('reserve_asset',['p_actor'=>$user['id'],'p_id'=>$id,'p_asset'=>$asset,'p_filename'=>$filename,'p_mime'=>$mime,'p_bytes'=>strlen($bytes),'p_purpose'=>$purpose,'p_note'=>$note]);
        if (($reserved['state']??'')==='ready') answer(['ok'=>true]);
        // Object IDs are immutable; an uncertain transfer must be reconciled, never upserted.
        try {
            $existingBytes=storage_request($id.'/'.$asset,'GET');
            if (!hash_equals(hash('sha256',$bytes),hash('sha256',$existingBytes))) throw new RuntimeException('This attachment ID already contains another file.',409);
        } catch (RuntimeException $e) {
            if ($e->getCode()!==404) throw $e;
            storage_request($id.'/'.$asset,'POST',$bytes,$mime);
        }
        rpc('finish_asset',['p_actor'=>$user['id'],'p_id'=>$id,'p_asset'=>$asset]); answer(['ok'=>true]);
    }
    if (in_array($action,['caption','remove_asset'],true)) {
        $asset=uuid_value($data['asset_id']??null);
        $rows=sb('/rest/v1/linart_assets?id=eq.'.$asset.'&inquiry_id=eq.'.$id);
        if (!$rows) answer(['ok'=>true]);
        if ($action==='remove_asset') {
            try { storage_request($id.'/'.$asset,'DELETE'); } catch (RuntimeException $e) { if ($e->getCode()!==404) throw $e; }
        }
        $note=$data['note']??'';
        if (!is_string($note) || mb_strlen($note)>500) answer(['error'=>'Caption too long'],422);
        rpc('asset_change',['p_actor'=>$user['id'],'p_id'=>$id,'p_asset'=>$asset,'p_action'=>$action==='caption'?'caption':'remove','p_note'=>$note]);
        answer(['ok'=>true]);
    }
    if ($action==='download') {
        $asset=uuid_value($data['asset_id']??null);
        $rows=sb('/rest/v1/linart_assets?id=eq.'.$asset.'&inquiry_id=eq.'.$id.'&state=eq.ready');
        if (!$rows) answer(['error'=>'Attachment unavailable'],404);
        $bytes=storage_request($id.'/'.$asset,'GET');
        header('Content-Type: '.$rows[0]['mime']); header('Content-Disposition: attachment; filename="'.$rows[0]['filename'].'"'); echo $bytes; exit;
    }
    answer(['error'=>'Unknown action'],422);
} catch (Throwable $e) {
    $status=in_array($e->getCode(),[401,403,409,413,422,429,503],true)?$e->getCode():503;
    answer(['error'=>$status===503?'Studio is temporarily unavailable. Your inquiry is unaffected.':$e->getMessage()],$status);
}
