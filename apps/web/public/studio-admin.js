const $ = (id) => document.getElementById(id);
let projects = [], selected = null, offset = 0;
const blobURLs = [];
const notice = (text) => { $('notice').textContent = text; };
async function api(action, data = {}, binary = false) {
  const response = await fetch('/studio.php', { method: 'POST', credentials: 'same-origin', cache: 'no-store', headers: { 'Content-Type': 'application/json', 'X-Linart-Request': 'studio' }, body: JSON.stringify({ action, ...data }) });
  if (!response.ok) { const error = await response.json().catch(() => ({})); if (response.status === 401) locked(); throw new Error(error.error || 'Could not confirm this action. Refresh before trying again.'); }
  return binary ? response.blob() : response.json();
}
function element(tag, text, parent, className) { const node = document.createElement(tag); if (text) node.textContent = text; if (className) node.className = className; parent?.append(node); return node; }
function locked() { projects = []; selected = null; $('projects').replaceChildren(); $('brief').replaceChildren(); blobURLs.splice(0).forEach(URL.revokeObjectURL); $('login').hidden = false; $('desk').hidden = true; $('logout').hidden = true; }
async function guarded(fn) { try { notice(''); await fn(); } catch (e) { notice(e.message); } }
$('send-code').onclick = () => guarded(async () => { $('send-code').disabled = true; try { await api('send_code', {email: $('email').value}); $('code-label').hidden = false; $('verify').hidden = false; $('code').required = true; $('code').focus(); notice('Check your email for the verification code.'); } finally { setTimeout(() => { $('send-code').disabled = false; }, 60000); } });
$('auth').onsubmit = (event) => { event.preventDefault(); guarded(async () => { await api('verify_code', {email: $('email').value, code: $('code').value, admin: true}); $('code').value = ''; await load(); }); };
$('logout').onclick = () => guarded(async () => { try { await api('logout'); } finally { locked(); } });
async function load(more = false) { const result = await api('list', {offset: more ? offset : 0}); if (!result.admin) throw new Error('Administrator access required'); projects = more ? [...projects, ...result.projects] : result.projects; offset = projects.length; $('more').hidden = result.projects.length < 50; $('login').hidden = true; $('desk').hidden = false; $('logout').hidden = false; renderList(); }
function renderList() { const query = $('search').value.toLowerCase(); $('projects').replaceChildren(); const visible = projects.filter((p) => (!$('filter').value || p.status === $('filter').value) && JSON.stringify(p.contact).toLowerCase().includes(query)); if (!visible.length) element('p', 'No matching inquiries.', $('projects')); visible.forEach((p) => { const button = element('button', p.contact.name, $('projects')); button.setAttribute('aria-current', String(p.id === selected)); element('small', `${p.contact.service} · ${p.contact.city}`, button); const s = p.linart_studios; const stage = !s?.submitted_at ? (s?.revision ? 'Studio draft' : 'Initial inquiry') : s.revision > s.submitted_revision ? 'Submitted · newer draft changes' : 'Studio submitted'; element('small', `${p.status} · ${stage}`, button); button.onclick = () => guarded(() => open(p.id)); }); }
async function open(id) {
  const result = await api('get', {inquiry_id: id}); selected = id; renderList(); blobURLs.splice(0).forEach(URL.revokeObjectURL);
  const root = $('brief'); root.replaceChildren(); const p = result.project, s = result.studio;
  element('span', p.status, root, 'badge'); element('h2', p.contact.name, root); element('p', `${p.contact.service}\n${p.contact.city}\nReceived ${new Date(p.created_at).toLocaleString()}`, root);
  const actions = element('div', '', root, 'actions'); const print = element('button', 'Print / save PDF', actions); print.onclick = () => window.print();
  const statusLabel = element('label', 'Project status', root); const status = element('select', '', statusLabel); ['New Inquiry','Awaiting Details','Ready for Review','Contacted','Archived'].forEach((value) => { const o = element('option', value, status); o.value = value; }); status.value = p.status; status.onchange = () => guarded(async () => { await api('status', {inquiry_id:id,status:status.value}); await load(); await open(id); notice('Project status updated.'); });
  if (p.delivery !== 'accepted') element('p', 'Inquiry recorded; notification email failed. Follow up with the client.', root, 'warning');
  if (p.deletion_requested_at) element('p', 'Client requested deletion. Follow the private-data removal runbook.', root, 'warning');
  const contact = element('section','',root); element('h3','The initial inquiry',contact);
  element('p', `Email: ${p.contact.email}\nPhone: ${p.contact.phone}\nPreferred contact: ${p.contact.contact || 'Not specified'}\nTiming: ${p.contact.timing || 'Not specified'}\n${p.contact.message || 'No description provided.'}`,contact);
  const studio = element('section','',root); element('h3',s?.submitted_at ? 'Project Studio · submitted' : 'Project Studio · optional draft',studio);
  if (s?.submitted_at) element('p',`Last submitted ${new Date(s.submitted_at).toLocaleString()}${s.revision > s.submitted_revision ? '. Changes have been saved since that submission; the current draft is shown below.' : '.'}`,studio);
  const labels = {projectType:'Project type',goals:'Goals & scope',existingConditions:'Existing conditions',style:'Style, materials & finishes',priorities:'Priorities & layout',investment:'Optional investment',timeline:'Optional timing',constraints:'Site considerations & constraints',other:'Additional notes'};
  const answers = s?.answers || {}; const missing = ['goals','existingConditions','constraints'].filter((key) => !answers[key]);
  element('p', missing.length ? `Useful follow-up: ${missing.map((key)=>labels[key].toLowerCase()).join(', ')}. These are optional, not submission requirements.` : 'Core planning context provided.', studio);
  Object.entries(labels).forEach(([key,label]) => { element('h4',label,studio); element('p',answers[key] || 'Not provided',studio); });
  const links = element('section','',root); element('h3','Inspiration links',links); (s?.links||[]).forEach((l) => { const a = element('a',l.url,links); if (/^https?:\/\//i.test(l.url)) { a.href=l.url; a.target='_blank'; a.rel='noopener noreferrer'; } element('p',l.note,links); });
  if (s?.submitted_brief && s.revision > s.submitted_revision) { const snap=element('details','',root); element('summary','View last submitted answers',snap); Object.entries(s.submitted_brief.answers||{}).forEach(([key,value])=>{element('h4',labels[key]||key,snap);element('p',value||'Not provided',snap);}); }
  const media=element('section','',root); element('h3','Private attachments',media);
  for (const asset of result.assets) { const card=element('div','',media); element('h4',asset.purpose,card); element('p',asset.note,card); if (asset.state !== 'ready') { element('p','Transfer needs recovery. Client can retry from Studio.',card); continue; } const button=element('button',asset.mime.startsWith('image/')?'View photo':'Download PDF',card); button.onclick=()=>guarded(async()=>{const blob=await api('download',{inquiry_id:id,asset_id:asset.id},true); if(selected!==id)return; const url=URL.createObjectURL(blob);blobURLs.push(url);if(asset.mime.startsWith('image/')){const img=element('img','',card);img.src=url;img.alt=asset.note||asset.purpose;button.hidden=true;}else{const a=element('a','Save document',card);a.href=url;a.download=asset.filename;a.click();}}); }
}
$('search').oninput=renderList; $('filter').onchange=renderList; $('refresh').onclick=()=>guarded(async()=>{await load();if(selected)await open(selected);}); $('more').onclick=()=>guarded(()=>load(true));
// Inactivity clears visible client records even if the tab stays open.
let idle; function resetIdle(){clearTimeout(idle);idle=setTimeout(()=>{guarded(async()=>{try{await api('logout');}finally{locked();notice('Signed out after inactivity.');}});},15*60*1000);}
['pointerdown','keydown'].forEach(event=>document.addEventListener(event,resetIdle)); resetIdle();
guarded(()=>load());
