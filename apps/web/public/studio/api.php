<?php
declare(strict_types=1);
require __DIR__.'/common.php';
header('Cache-Control: no-store, private');
header('Referrer-Policy: no-referrer');
header('X-Content-Type-Options: nosniff');
function api_body(): array {
    $raw=file_get_contents('php://input',false,null,0,65537);
    if (strlen($raw)>65536) throw new InvalidArgumentException('Request too large.');
    $data=json_decode($raw,true);
    if (!is_array($data)) throw new InvalidArgumentException('Invalid request.');
    return $data;
}
function api_session(): void {
    ini_set('session.use_strict_mode','1');
    session_name('linart_staff');
    session_set_cookie_params(['lifetime'=>0,'path'=>'/studio','secure'=>true,'httponly'=>true,'samesite'=>'Strict']);
    session_start();
}
try {
    if (!(studio_config()['studio_enabled']??false)) studio_reply(503,['ok'=>false,'error'=>'Project Studio is not available yet. Your initial inquiry is unaffected.']);
    $method=$_SERVER['REQUEST_METHOD']??''; $action=$_GET['action']??'';
    if (!in_array($method,['GET','POST'],true)) studio_reply(405,['ok'=>false,'error'=>'Method not allowed.']);
    if ($method==='POST' && isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN']!=='https://linartinc.com') studio_reply(403,['ok'=>false,'error'=>'Origin not allowed.']);
    if ($method==='POST' && in_array($action,['otp','verify'],true)) {
        $data=api_body();
        if (!is_string($data['email']??null)) throw new InvalidArgumentException('Enter a valid email address.');
        $email=strtolower(trim($data['email']));
        if (!filter_var($email,FILTER_VALIDATE_EMAIL) || strlen($email)>180) throw new InvalidArgumentException('Enter a valid email address.');
        $ip=$_SERVER['REMOTE_ADDR']??'unknown';
        studio_rate('auth:'.$action.':'.$ip,$action==='otp'?30:2);
        if ($action==='otp') {
            studio_rate('email:'.$email,60);
            studio_remote('/auth/v1/otp','POST',['email'=>$email,'create_user'=>true]);
            studio_reply(200,['ok'=>true]);
        }
        $code=$data['code']??'';
        if (!is_string($code)) throw new InvalidArgumentException('Enter the code from your email.');
        if (!preg_match('/^[0-9]{6,8}$/',$code)) throw new InvalidArgumentException('Enter the code from your email.');
        $auth=studio_remote('/auth/v1/verify','POST',['email'=>$email,'token'=>$code,'type'=>'email']);
        if (empty($auth['access_token'])) throw new UnexpectedValueException('The code could not be verified.');
        // No refresh token is persisted. Reverification is required after the short session expires.
        if (!empty($data['admin'])) {
            $user=studio_user($auth['access_token']);
            if (!studio_is_admin($user)) throw new OutOfBoundsException('Staff access is required.');
            api_session(); session_regenerate_id(true);
            $_SESSION['token']=$auth['access_token']; $_SESSION['csrf']=bin2hex(random_bytes(32));
            studio_reply(200,['ok'=>true,'csrf'=>$_SESSION['csrf']]);
        }
        studio_reply(200,['ok'=>true,'access_token'=>$auth['access_token'],'expires_in'=>$auth['expires_in']??3600]);
    }
    $bearer=$_SERVER['HTTP_AUTHORIZATION']??'';
    $admin=false;
    if (str_starts_with($bearer,'Bearer ')) { $token=substr($bearer,7); }
    else {
        api_session(); $token=$_SESSION['token']??''; $admin=true;
        if ($method==='POST' && !hash_equals($_SESSION['csrf']??'missing',$_SERVER['HTTP_X_CSRF_TOKEN']??'')) throw new OutOfBoundsException('Refresh your session and try again.');
    }
    $user=studio_user($token);
    if ($admin && !studio_is_admin($user)) throw new OutOfBoundsException('Staff access is required.');
    if ($action==='session' && $method==='GET') studio_reply(200,['ok'=>true,'csrf'=>$admin?$_SESSION['csrf']:null]);
    if ($action==='logout' && $method==='POST') {
        try { studio_remote('/auth/v1/logout','POST',null,$token); } catch(Throwable $e) { /* Local access is always cleared. */ }
        if ($admin) { $_SESSION=[]; session_destroy(); setcookie('linart_staff','',['expires'=>1,'path'=>'/studio','secure'=>true,'httponly'=>true,'samesite'=>'Strict']); }
        studio_reply(200,['ok'=>true]);
    }
    if ($action==='delete-account' && $method==='POST' && !$admin) {
        $data=api_body();
        if (($data['confirmation']??'')!=='DELETE') throw new InvalidArgumentException('Explicit deletion confirmation is required.');
        require __DIR__.'/deletion.php'; studio_delete_client($user);
        studio_reply(200,['ok'=>true]);
    }
    if ($action==='list' && $method==='GET') {
        $filter=$admin?'':'&email=eq.'.rawurlencode(strtolower($user['email']));
        $offset=max(0,min(100000,(int)($_GET['offset']??0)));
        $rows=studio_remote('/rest/v1/linart_inquiries?select=id,contact,status,created_at,submitted_at,version&order=created_at.desc&limit=50&offset='.$offset.$filter);
        studio_reply(200,['ok'=>true,'projects'=>$rows]);
    }
    $id=studio_uuid((string)($_GET['id']??''));
    // Serialize a project's mutations and deletion on this single-host gateway.
    $projectLock = $method==='POST' ? studio_lock('inquiry:'.$id) : null;
    if (is_file(studio_private_dir().'/deleted-'.$id.'.json')) throw new OutOfBoundsException('Project not available.');
    $project=studio_project($id,$user,$admin);
    if ($action==='detail' && $method==='GET') {
        $assets=studio_remote('/rest/v1/linart_assets?inquiry_id=eq.'.$id.'&ready=eq.true&select=id,filename,purpose,note,mime,bytes&order=created_at');
        studio_reply(200,['ok'=>true,'project'=>$project,'assets'=>$assets]);
    }
    if ($action==='save' && $method==='POST' && !$admin) {
        $data=api_body(); $draft=studio_draft($data['draft']??[]);
        if (!isset($data['version']) || !is_int($data['version']) || !is_bool($data['submit']??false)) throw new InvalidArgumentException('Invalid draft version.');
        $saved=studio_remote('/rest/v1/rpc/linart_save_draft','POST',['p_id'=>$id,'p_version'=>$data['version'],'p_draft'=>$draft,'p_submit'=>$data['submit']??false]);
        if (!$saved) studio_reply(409,['ok'=>false,'error'=>'A newer draft is saved. Reload the project before saving again.']);
        studio_reply(200,['ok'=>true,'project'=>$saved[0]]);
    }
    if ($action==='status' && $method==='POST' && $admin) {
        $data=api_body();
        if (!in_array($data['status']??'',['New Inquiry','Awaiting Details','Ready for Review','Contacted','Archived'],true)) throw new InvalidArgumentException('Choose a valid status.');
        studio_remote('/rest/v1/linart_inquiries?id=eq.'.$id,'PATCH',['status'=>$data['status']]);
        studio_reply(200,['ok'=>true]);
    }
    if ($action==='asset' && $method==='GET') {
        $assetId=studio_uuid($_GET['asset']??'');
        $assets=studio_remote('/rest/v1/linart_assets?id=eq.'.$assetId.'&inquiry_id=eq.'.$id.'&ready=eq.true');
        if (!$assets) throw new OutOfBoundsException('File not available.');
        $asset=$assets[0];
        $signed=studio_remote('/storage/v1/object/sign/linart-studio/'.$asset['object_path'],'POST',['expiresIn'=>60]);
        $path=$signed['signedURL']??'';
        if (!str_starts_with($path,'/object/sign/')) throw new RuntimeException('Download unavailable.');
        $url=rtrim(studio_config()['supabase_url'],'/').'/storage/v1'.$path.'&download='.rawurlencode($asset['filename']);
        studio_reply(200,['ok'=>true,'url'=>$url]);
    }
    if ($action==='upload' && $method==='POST' && !$admin) {
        $file=$_FILES['file']??null; $assetId=studio_uuid($_POST['asset_id']??'');
        $purpose=$_POST['purpose']??''; $note=$_POST['note']??'';
        if (!in_array($purpose,['Existing space','Inspiration','Plans or drawings'],true) || !is_string($note) || mb_strlen($note)>500) throw new InvalidArgumentException('Invalid photo details.');
        if (!$file || $file['error']!==UPLOAD_ERR_OK || $file['size']>10*1024*1024 || $file['size']<1) throw new InvalidArgumentException('Choose a JPEG or PDF no larger than 10 MB.');
        $mime=(new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
        $bytes=file_get_contents($file['tmp_name']);
        if ($mime==='image/jpeg') {
            $size=@getimagesize($file['tmp_name']);
            if (!$size || $size[0]*$size[1]>20000000) throw new InvalidArgumentException('Photo dimensions exceed the limit.');
            $img=@imagecreatefromjpeg($file['tmp_name']);
            if (!$img) throw new InvalidArgumentException('This photo could not be read.');
            ob_start(); imagejpeg($img,null,88); $bytes=ob_get_clean(); imagedestroy($img); $ext='jpg';
        } elseif ($mime==='application/pdf' && str_starts_with($bytes,'%PDF-')) {
            $scanner=studio_config()['clamdscan']??'';
            if (!$scanner || !is_executable($scanner)) throw new InvalidArgumentException('Document upload is not enabled yet. Add photos of your plans instead.');
            $proc=proc_open([$scanner,'--no-summary','--fdpass',$file['tmp_name']],[1=>['pipe','w'],2=>['pipe','w']],$pipes);
            if (!is_resource($proc)) throw new RuntimeException('Document scanning unavailable.');
            stream_get_contents($pipes[1]); stream_get_contents($pipes[2]); fclose($pipes[1]); fclose($pipes[2]);
            if (proc_close($proc)!==0) throw new InvalidArgumentException('This document did not pass the safety scan.');
            $ext='pdf';
        } else { throw new InvalidArgumentException('Only JPEG photographs and scanned PDF documents are accepted.'); }
        $filename=basename((string)$file['name']);
        $filename=preg_replace('/[^a-zA-Z0-9._ -]/','_',substr($filename,0,100));
        $object=$id.'/'.$assetId.'.'.$ext;
        $reserved=studio_remote('/rest/v1/rpc/linart_reserve_asset','POST',['p_id'=>$assetId,'p_inquiry'=>$id,'p_filename'=>$filename,'p_path'=>$object,'p_mime'=>$mime,'p_bytes'=>strlen($bytes),'p_purpose'=>$purpose,'p_note'=>$note]);
        if (!$reserved) throw new InvalidArgumentException('The project already has 12 files. Remove a file before adding another.');
        if (!$reserved[0]['ready']) {
            studio_remote('/storage/v1/object/linart-studio/'.$object,'POST',$bytes,null,['Content-Type: '.$mime,'x-upsert: true']);
            studio_remote('/rest/v1/linart_assets?id=eq.'.$assetId.'&inquiry_id=eq.'.$id,'PATCH',['ready'=>true]);
        }
        studio_reply(200,['ok'=>true,'asset_id'=>$assetId]);
    }
    if ($action==='asset-note' && $method==='POST' && !$admin) {
        $data=api_body(); $assetId=studio_uuid($data['asset_id']??''); $note=$data['note']??'';
        if (!is_string($note) || mb_strlen($note)>500) throw new InvalidArgumentException('Keep notes within 500 characters.');
        studio_remote('/rest/v1/linart_assets?id=eq.'.$assetId.'&inquiry_id=eq.'.$id,'PATCH',['note'=>$note]);
        studio_reply(200,['ok'=>true]);
    }
    if ($action==='remove-asset' && $method==='POST' && !$admin) {
        $data=api_body(); $assetId=studio_uuid($data['asset_id']??'');
        $assets=studio_remote('/rest/v1/linart_assets?id=eq.'.$assetId.'&inquiry_id=eq.'.$id);
        if ($assets) {
            studio_remote('/storage/v1/object/linart-studio','DELETE',['prefixes'=>[$assets[0]['object_path']]]);
            studio_remote('/rest/v1/linart_assets?id=eq.'.$assetId.'&inquiry_id=eq.'.$id,'DELETE');
        }
        studio_reply(200,['ok'=>true]);
    }
    studio_reply(404,['ok'=>false,'error'=>'Action not available.']);
} catch(InvalidArgumentException $e) { studio_reply(422,['ok'=>false,'error'=>$e->getMessage()]); }
catch(UnexpectedValueException $e) { studio_reply(401,['ok'=>false,'error'=>$e->getMessage()]); }
catch(OutOfBoundsException $e) { studio_reply(403,['ok'=>false,'error'=>$e->getMessage()]); }
catch(Throwable $e) { studio_reply(503,['ok'=>false,'error'=>'Studio is temporarily unavailable. Your initial inquiry is unaffected. Refresh before trying again.']); }
