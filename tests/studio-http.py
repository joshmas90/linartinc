"""Local-only integration tests. Fake HTTPS Supabase and a file-only sendmail sink.
Usage: PHP_BIN=php python3 tests/studio-http.py. No production endpoint is contacted.
"""
import base64, http.server, json, os, pathlib, socket, ssl, subprocess, tempfile, threading, time, urllib.request, urllib.error, uuid
ROOT=pathlib.Path(__file__).resolve().parents[1]
PHP=os.environ.get('PHP_BIN','php')
def port():
    with socket.socket() as s:s.bind(('127.0.0.1',0));return s.getsockname()[1]
def require(condition,message):
    if not condition:raise AssertionError(message)
with tempfile.TemporaryDirectory(prefix='linart-http-') as temp:
    tmp=pathlib.Path(temp); (tmp/'data').mkdir(); (tmp/'sessions').mkdir()
    cert=tmp/'cert.pem'; key=tmp/'key.pem'
    subprocess.run(['openssl','req','-x509','-newkey','rsa:2048','-nodes','-keyout',str(key),'-out',str(cert),'-days','1','-subj','/CN=127.0.0.1','-addext','subjectAltName=IP:127.0.0.1'],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    project=str(uuid.uuid4()); foreign=str(uuid.uuid4()); asset=str(uuid.uuid4())
    records={project:{'id':project,'email':'owner@example.invalid','contact':{'name':'Isolated Test','email':'owner@example.invalid'},'version':0,'draft':{},'status':'New Inquiry'},foreign:{'id':foreign,'email':'other@example.invalid','contact':{},'version':0,'draft':{}}}
    assets={}; calls=[]; deleted_users=set()
    class Mock(http.server.BaseHTTPRequestHandler):
        def log_message(self,*args):pass
        def do_GET(self):self.handle_request()
        def do_POST(self):self.handle_request()
        def do_PATCH(self):self.handle_request()
        def do_DELETE(self):self.handle_request()
        def handle_request(self):
            from urllib.parse import urlsplit, parse_qs
            parsed=urlsplit(self.path); path=parsed.path; q=parse_qs(parsed.query)
            raw=self.rfile.read(int(self.headers.get('Content-Length',0))); body=json.loads(raw) if raw and 'json' in self.headers.get('Content-Type','') else raw
            calls.append((self.command,path));status=200;result={}
            if path=='/auth/v1/user':
                token=self.headers.get('Authorization','').replace('Bearer ','')
                if token in deleted_users or token not in ['owner-token','other-token','staff-token']:status=401
                else:result={'id':str(uuid.UUID(int={'owner-token':1,'other-token':2,'staff-token':3}[token])),'email':{'owner-token':'owner@example.invalid','other-token':'other@example.invalid','staff-token':'staff@example.invalid'}[token],'email_confirmed_at':'2026-01-01T00:00:00Z'}
            elif path.startswith('/auth/v1/admin/users/') and self.command=='DELETE':
                deleted_users.add('owner-token');result={}
            elif path=='/auth/v1/otp':result={}
            elif path=='/auth/v1/verify':result={'access_token':'staff-token' if body.get('email')=='staff@example.invalid' else 'owner-token','expires_in':3600}
            elif path=='/rest/v1/linart_staff':result=[{'user_id':str(uuid.UUID(int=3))}] if q.get('user_id')==['eq.'+str(uuid.UUID(int=3))] else []
            elif path=='/rest/v1/linart_inquiries':
                if self.command=='POST':records.setdefault(body['id'],{**body,'version':0,'draft':{},'status':'New Inquiry'});result={}
                else:
                    result=list(records.values())
                    for field in ['id','email']:
                        if field in q:result=[r for r in result if r[field]==q[field][0][3:]]
                    if self.command=='DELETE':
                        for r in result:records.pop(r['id'])
            elif path=='/rest/v1/linart_assets':
                result=list(assets.values())
                for field in ['id','inquiry_id']:
                    if field in q:result=[r for r in result if r[field]==q[field][0][3:]]
                if self.command=='PATCH':
                    for r in result:r.update(body)
                elif self.command=='DELETE':
                    for r in result:assets.pop(r['id'])
            elif path=='/rest/v1/rpc/linart_reserve_asset':
                aid=body['p_id'];assets.setdefault(aid,{'id':aid,'inquiry_id':body['p_inquiry'],'object_path':body['p_path'],'filename':body['p_filename'],'purpose':body['p_purpose'],'note':body['p_note'],'mime':body['p_mime'],'bytes':body['p_bytes'],'ready':False});result=[assets[aid]]
            elif path=='/rest/v1/rpc/linart_save_draft':
                r=records[body['p_id']]
                if r['version']!=body['p_version']:result=[]
                else:r.update(version=r['version']+1,draft=body['p_draft']);result=[r]
            elif path.startswith('/storage/v1/object/sign/'):
                result={'signedURL':'/object/sign/linart-studio/test.jpg?token=FAKE'}
            elif path.startswith('/storage/v1/object/'):
                if self.command=='POST':require(self.headers.get('Content-Type')=='image/jpeg','Upload content type must be unambiguous')
                result={}
            else:status=404
            encoded=json.dumps(result).encode();self.send_response(status);self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(encoded)));self.end_headers();self.wfile.write(encoded)
    backend=http.server.ThreadingHTTPServer(('127.0.0.1',0),Mock)
    ctx=ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER);ctx.load_cert_chain(cert,key);backend.socket=ctx.wrap_socket(backend.socket,server_side=True)
    threading.Thread(target=backend.serve_forever,daemon=True).start()
    config=tmp/'config.php';config.write_text("<?php return "+"['private_dir'=>"+repr(str(tmp/'data'))+",'supabase_url'=>'https://127.0.0.1:"+str(backend.server_port)+"','service_key'=>'LOCAL-FAKE-KEY','studio_enabled'=>true];")
    sink=tmp/'mail-sink.sh';sink.write_text('#!/bin/sh\nif [ -f '+str(tmp/'mail-fail')+' ]; then cat >/dev/null; exit 1; fi\ncat >> '+str(tmp/'mail.txt')+'\nprintf "accepted\\n" >> '+str(tmp/'mail-count.txt')+'\nexit 0\n');sink.chmod(0o700)
    server_port=port();env=dict(os.environ,LINART_CONFIG_FILE=str(config))
    log=open(tmp/'php.log','w')
    server=subprocess.Popen([PHP,'-d',f'curl.cainfo={cert}','-d',f'sendmail_path={sink}','-d',f'session.save_path={tmp/"sessions"}','-d',f'sys_temp_dir={tmp}','-d','upload_max_filesize=10M','-d','post_max_size=12M','-S',f'127.0.0.1:{server_port}','-t',str(ROOT/'apps/web/public')],env=env,stdout=log,stderr=log)
    def request(path,body=None,token=None,headers=None):
        h=headers or {};h=dict(h)
        if token:h['Authorization']='Bearer '+token
        if isinstance(body,dict):body=json.dumps(body).encode();h['Content-Type']='application/json'
        req=urllib.request.Request(f'http://127.0.0.1:{server_port}'+path,data=body,headers=h)
        try:r=urllib.request.urlopen(req,timeout=10)
        except urllib.error.HTTPError as e:r=e
        raw=r.read()
        try:data=json.loads(raw)
        except:raise AssertionError(f'Invalid response {r.status}: {raw!r}')
        return r.status,data,r.headers
    try:
        for _ in range(100):
            try:
                with socket.create_connection(('127.0.0.1',server_port),.1):break
            except OSError:time.sleep(.03)
        s,_,_=request('/contact.php');require(s==405,'GET must not send mail')
        s,_,_=request('/contact.php',{});require(s==422,'Required inquiry fields')
        inquiry={'name':'Isolated Test','email':'owner@example.invalid','phone':'6095550100','city':'Test ZIP','service':'Kitchen Remodeling','timing':'','contact':'','message':'','request_id':str(uuid.uuid4())}
        before=len(calls);s,r,_=request('/contact.php',inquiry);require(s==200 and r['inquiry_id']==inquiry['request_id'],'Accepted inquiry has stable id');require(len(calls)==before,'Inquiry must never wait for Supabase')
        s,r,_=request('/contact.php',inquiry);require(s==200,'Duplicate must replay acceptance');require((tmp/'mail-count.txt').read_text().count('accepted')==1,'Exactly one mail attempt')
        changed=dict(inquiry,name='Changed');s,_,_=request('/contact.php',changed);require(s==409,'Cannot reuse id for changed lead')
        # A failed transport must never be described as success or silently resent.
        import hashlib
        rate_file=tmp/('linart-rl-'+hashlib.sha256(b'127.0.0.1').hexdigest())
        rate_file.unlink(missing_ok=True); (tmp/'mail-fail').touch()
        failed=dict(inquiry,request_id=str(uuid.uuid4()))
        s,r,_=request('/contact.php',failed);require(s==502 and not r['ok'],'Mail failure is not success')
        s,_,_=request('/contact.php',failed);require(s==409,'Failed/uncertain delivery is never automatically resent')
        (tmp/'mail-fail').unlink()
        # Sync retries are safe: duplicate REST upserts do not mutate original leads.
        subprocess.run([PHP,'-d',f'curl.cainfo={cert}',str(ROOT/'server/sync-inquiries.php'),str(ROOT/'apps/web/public')],env=env,check=True,capture_output=True)
        subprocess.run([PHP,'-d',f'curl.cainfo={cert}',str(ROOT/'server/sync-inquiries.php'),str(ROOT/'apps/web/public')],env=env,check=True,capture_output=True)
        require(sum(p=='/rest/v1/linart_inquiries' and m=='POST' for m,p in calls)==1,'Worker sync is idempotent')
        s,_,_=request('/studio/api.php?action=list');require(s==401,'Anonymous access denied')
        s,r,_=request('/studio/api.php?action=list',token='owner-token');require(s==200 and all(p['email']=='owner@example.invalid' for p in r['projects']),'Only own verified-email projects')
        s,_,_=request('/studio/api.php?action=detail&id='+foreign,token='owner-token');require(s==403,'Cross-client detail denied')
        s,_,_=request('/studio/api.php?action=detail&id='+project,token='other-token');require(s==403,'Other client cannot access own project')
        s,_,_=request('/studio/api.php?action=status&id='+project,{'status':'Archived'},'owner-token');require(s==404,'Client cannot change admin workflow')
        s,_,_=request('/studio/api.php?action=save&id='+project,{'draft':{},'version':0,'submit':True},'owner-token');require(s==200,'Partial brief allowed')
        s,_,_=request('/studio/api.php?action=save&id='+project,{'draft':{'goals':'STALE'},'version':0,'submit':False},'owner-token');require(s==409,'Stale save must fail')
        s,_,_=request('/studio/api.php?action=save&id='+project,{'draft':{},'version':1},'owner-token',{'Origin':'https://attacker.invalid'});require(s==403,'Foreign origin rejected')
        # Exercise actual JPEG validation + metadata stripping + content-type handling.
        jpeg=subprocess.check_output([PHP,'-r','$im=imagecreatetruecolor(10,10); imagejpeg($im);'])
        def upload(aid,payload,mime):
            b='localboundary';parts=[]
            for k,v in [('asset_id',aid),('purpose','Existing space'),('note','North wall')]:parts.append(f'--{b}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode())
            parts.append(f'--{b}\r\nContent-Disposition: form-data; name="file"; filename="room.jpg"\r\nContent-Type: {mime}\r\n\r\n'.encode()+payload+f'\r\n--{b}--\r\n'.encode())
            return request('/studio/api.php?action=upload&id='+project,b''.join(parts),'owner-token',{'Content-Type':'multipart/form-data; boundary='+b})
        s,_,_=upload(asset,jpeg,'image/jpeg');require(s==200,'Valid JPEG upload')
        s,_,_=upload(str(uuid.uuid4()),b'<?php echo "bad"; ?>','image/jpeg');require(s==422,'Spoofed MIME rejected')
        s,_,_=upload(str(uuid.uuid4()),b'%PDF-1.4\n%%EOF','application/pdf');require(s==422,'PDF fails closed without scanner')
        s,r,_=request('/studio/api.php?action=asset&id='+project+'&asset='+asset,token='owner-token');require(s==200 and 'download=' in r['url'],'Private expiring download')
        s,_,_=request('/studio/api.php?action=asset&id='+project+'&asset='+asset,token='other-token');require(s==403,'Private asset denied cross-client')
        s,_,_=request('/studio/api.php?action=otp',{'email':'owner@example.invalid'});require(s==200,'OTP through isolated mail mock')
        s,_,_=request('/studio/api.php?action=otp',{'email':'owner@example.invalid'});require(s==429,'OTP request throttled')
        s,r,h=request('/studio/api.php?action=verify',{'email':'staff@example.invalid','code':'123456','admin':True});require(s==200 and 'access_token' not in r,'Admin token stays server-side')
        cookie=h['Set-Cookie'].split(';')[0];require('HttpOnly' in h['Set-Cookie'] and 'secure' in h['Set-Cookie'].lower(),'Secure HttpOnly session')
        s,_,_=request('/studio/api.php?action=status&id='+project,{'status':'Archived'},headers={'Cookie':cookie});require(s==403,'Admin mutation needs CSRF')
        s,r,_=request('/studio/api.php?action=list',headers={'Cookie':cookie});require(s==200,'Allowlisted staff can list')
        s,_,_=request('/studio/api.php?action=delete-account',{'confirmation':'NO'},'owner-token');require(s==422,'Deletion requires explicit confirmation')
        s,_,_=request('/studio/api.php?action=delete-account',{'confirmation':'DELETE'},'owner-token');require(s==200,'Verified client account deletion')
        require(project not in records and foreign in records,'Deletion is scoped to the verified client')
        require(not list((tmp/'data').glob('inquiry-*.json')),'Deleted inquiry cannot reappear from outbox')
        s,_,_=request('/studio/api.php?action=list',token='owner-token');require(s==401,'Deleted user cannot reuse old token')
        # Preserve accepted inquiries even when Studio is disabled.
        config.write_text(config.read_text().replace("'studio_enabled'=>true","'studio_enabled'=>false"))
        s,_,_=request('/studio/api.php?action=list',token='owner-token');require(s==503,'Feature gate fails closed')
        print('PASS: local HTTP inquiry validation, duplicate replay, one email attempt, independent mail path, outbox retry, auth, ownership, staff allowlist/CSRF, stale saves, JPEG validation, PDF scanner gate, private downloads, deletion and failed mail handling.')
    finally:
        server.terminate();server.wait(timeout=5);backend.shutdown();log.close()
