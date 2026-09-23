'use strict';
const $ = id => document.getElementById(id);
let csrf = '', projects = [], selected = '', offset = 0;
function notice(text) { $('notice').textContent = text; }
function element(tag, text, cls) { const n = document.createElement(tag); if (text !== undefined) n.textContent = text; if (cls) n.className = cls; return n; }
async function api(action, body, id = selected, query = '') {
  const response = await fetch(`api.php?action=${action}${id ? `&id=${encodeURIComponent(id)}` : ''}${query}`, {
    method: body ? 'POST' : 'GET', credentials: 'same-origin', cache: 'no-store',
    headers: body ? { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  const result = await response.json();
  if (!response.ok || !result.ok) {
    if (response.status === 401 || response.status === 403) closeDesk();
    throw new Error(result.error || 'The request could not be confirmed. Refresh before trying again.');
  }
  return result;
}
function closeDesk() { $('desk').hidden = true; $('login').hidden = false; $('logout').hidden = true; $('detail').replaceChildren(); projects = []; $('projects').replaceChildren(); csrf = ''; }
async function run(button, work) { button.disabled = true; notice(''); try { await work(); } catch(e) { notice(e.message); } finally { button.disabled = false; } }
$('send-code').onclick = e => run(e.target, async () => { await api('otp', {email: $('email').value}, ''); notice('Check your email for a one-time access code.'); });
$('login-form').onsubmit = e => { e.preventDefault(); run(e.submitter, async () => {
  const r = await api('verify', {email: $('email').value, code: $('code').value, admin: true}, ''); csrf = r.csrf; $('code').value = ''; await openDesk();
}); };
async function openDesk() { $('login').hidden = true; $('desk').hidden = false; $('logout').hidden = false; await list(); }
async function list() { const r = await api('list', null, '', `&offset=${offset}`); projects = r.projects; renderList(); $('previous').disabled = offset === 0; $('next').disabled = projects.length < 50; }
function renderList() {
  const filter = $('search').value.toLowerCase(); $('projects').replaceChildren();
  projects.filter(p => JSON.stringify(p.contact).toLowerCase().includes(filter)).forEach(p => {
    const b = element('button', undefined, 'project'); b.setAttribute('aria-pressed', String(p.id === selected));
    b.append(element('strong', p.contact.name), element('span', `${p.contact.service} · ${p.contact.city}`), element('span', `${p.status} · ${p.submitted_at ? 'Studio submitted' : p.version ? 'Studio draft' : 'Initial inquiry'}`));
    b.onclick = () => run(b, () => detail(p.id)); $('projects').append(b);
  });
  if (!$('projects').children.length) $('projects').append(element('p', 'No inquiries on this page.'));
}
function definition(container, label, value) { container.append(element('dt', label), element('dd', value || 'Not provided')); }
async function detail(id) {
  selected = id; const {project:p, assets} = await api('detail', null, id); if (selected !== id) return; renderList(); const root = $('detail'); root.replaceChildren();
  root.append(element('p', `REFERENCE ${p.id}`, 'eyebrow'), element('h2', p.contact.name), element('p', p.status, 'badge'));
  root.append(element('p', `Inquiry: ${new Date(p.created_at).toLocaleString()}${p.submitted_at ? ` · Last Studio submission: ${new Date(p.submitted_at).toLocaleString()}` : ' · Studio not submitted'}`));
  const print = element('button', 'Print / save project brief'); print.onclick = () => window.print(); root.append(print);
  const statusLabel = element('label', 'Project status'); const select = element('select');
  ['New Inquiry','Awaiting Details','Ready for Review','Contacted','Archived'].forEach(value => {const option=element('option',value); option.value=value; option.selected=value===p.status; select.append(option);}); statusLabel.append(select); root.append(statusLabel);
  const save=element('button','Update status'); save.onclick=()=>run(save,async()=>{await api('status',{status:select.value},id); await list(); if (selected === id) await detail(id); notice('Project status updated.');}); root.append(save);
  const labels={name:'Client',email:'Email address',phone:'Telephone',city:'Project location',service:'Project type',contact:'Preferred contact method',timing:'Anticipated timing',message:'Initial project description'};
  const contact=element('dl'); Object.entries(p.contact).forEach(([key,value])=>definition(contact,labels[key]||key,value)); root.append(contact);
  const fields={projectType:'Project type',goals:'Goals and layout',existingConditions:'Existing conditions',style:'Style, materials and finishes',priorities:'Priorities',investment:'Investment expectations',timeline:'Desired timing',constraints:'Site, plans and constraints',other:'Additional notes'};
  const draft=p.draft||{};
  const missing=['goals','existingConditions','constraints'].filter(key=>!draft[key]?.trim()).map(key=>fields[key]);
  root.append(element('p',missing.length?`Topics to discuss when preparing an estimate: ${missing.join(', ')}. All Studio answers are optional.`:'Core planning topics have been provided; review details with the client.'));
  function answers(title,data) {
    const section=element('section'); section.append(element('h3',title)); const dl=element('dl');
    Object.entries(fields).forEach(([key,label])=>definition(dl,label,data[key])); section.append(dl);
    (data.references||[]).forEach(ref=> {try {const url=new URL(ref.url); if(!['https:','http:'].includes(url.protocol))return; const a=element('a',ref.url); a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';section.append(a,element('p',ref.note));}catch{ /* Invalid historic link is not rendered as executable content. */ }}); root.append(section);
  }
  answers('Current Studio draft',draft);
  if(p.submitted_draft) answers('Last submitted brief',p.submitted_draft);
  const media=element('section'); media.append(element('h3','Private photographs & documents'));
  if(!assets.length) media.append(element('p','No files uploaded.'));
  assets.forEach(a=>{const card=element('div',undefined,'file');card.append(element('strong',`${a.purpose} · ${a.filename}`),element('p',a.note||'No caption'));
    const button=element('button','Open private file');button.onclick=()=>run(button,async()=>{const r=await api('asset',null,id,`&asset=${encodeURIComponent(a.id)}`); const link=element('a','Download file · link expires in 60 seconds');link.href=r.url;link.target='_blank';link.rel='noopener noreferrer';card.append(link);button.remove();});card.append(button);media.append(card);});root.append(media);
}
$('search').oninput=renderList;
$('refresh').onclick=e=>run(e.target,async()=>{await list();if(selected)await detail(selected);});
$('previous').onclick=e=>run(e.target,async()=>{offset=Math.max(0,offset-50);await list();});
$('next').onclick=e=>run(e.target,async()=>{offset+=50;await list();});
$('logout').onclick=e=>run(e.target,async()=>{try{await api('logout',{});}finally{closeDesk();}});
api('session',null,'').then(async r=>{csrf=r.csrf;await openDesk();}).catch(()=>{});
