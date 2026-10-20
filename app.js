(function () {
'use strict';
const C=CleanCore, KEY='clean.phase2.v1', app=document.querySelector('#app');
let state={tasks:[],session:null,result:null}, view='home', selected=null, expanded=false, dirty=false;
const warn=text=>document.querySelector('#notice').textContent=text;
let blocked=false;
try{const raw=localStorage.getItem(KEY);if(raw)state=C.validateState(JSON.parse(raw));}
catch(e){blocked=true;warn('Gemte data kunne ikke læses. De er bevaret. Åbn Indstillinger for at eksportere, importere eller nulstille.');}
function save(){if(blocked)return false;try{localStorage.setItem(KEY,JSON.stringify(state));warn('');return true;}catch(e){warn('Kunne ikke gemme på telefonen. Din seneste handling er ikke gemt. Kontrollér ledig plads og browserens lager.');return false;}}
function change(fn){const previous=JSON.stringify(state);fn();if(!save()){state=JSON.parse(previous);return false;}return true;}
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const time=ms=>{const s=Math.floor(ms/1000);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');};
const date=x=>new Date(x).toLocaleDateString('da-DK',{day:'numeric',month:'long'});
const last=t=>C.latest(t.history);
const left=t=>C.daysLeft(last(t)?.at,t.interval,Date.now());
const age=t=>last(t)?Math.max(0,C.day(Date.now())-C.day(last(t).at)):null;
const tone=t=>{const days=age(t);return days===null||days<t.interval?'neutral':days<t.interval+2?'amber':'red';};
const status=t=>{const days=age(t);return days===null?'Ikke udført endnu':days===0?'Sidst udført i dag':days===1?'Sidst udført i går':'Sidst udført for '+days+' dage siden';};
const nextDate=(at,interval)=>{const d=new Date(at);d.setDate(d.getDate()+interval);return date(d);};
const button=(action,label,cls='text-button')=>'<button type="button" class="'+cls+'" data-action="'+action+'">'+label+'</button>';
const renderHeader=()=>'<header>'+button('home','← Opgaver')+'<span class="eyebrow">CLEAN</span></header>';
function list(t){return '<ul class="checklist">'+t.items.map(i=>'<li>'+esc(i)+'</li>').join('')+'</ul>';}
const icon=(kind)=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(kind==='arrow'?'<path d="m9 5 7 7-7 7"/>':kind==='settings'?'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="var(--bg)"/><circle cx="16" cy="17" r="3" fill="var(--bg)"/>':'<rect x="5" y="4" width="14" height="17" rx="3"/><path d="M9 3h6M9 10h6M9 15h4"/>')+'</svg>';
function row(t){return '<button type="button" class="task-row" data-task="'+esc(t.id)+'"><span class="task-icon">'+icon('task')+'</span><span class="task-copy"><span class="row-name">'+esc(t.name)+'</span><span class="status '+tone(t)+'">'+status(t)+'</span></span><span class="task-end">'+(state.settings?.showEstimates===false?'':'<span class="estimate">'+t.estimate+' min</span>')+icon('arrow')+'</span></button>';}
function home(){const sorted=[...state.tasks].sort((a,b)=>(left(a)??-Infinity)-(left(b)??-Infinity));const regular=sorted.filter(t=>t.group==='regular');const rare=sorted.filter(t=>t.group==='rare');const attention=rare.filter(t=>tone(t)!=='neutral').length;
return '<div class="home-page"><header class="home-header"><span class="brand">CLEAN</span>'+button('new','+ Ny opgave','new-task')+'</header>'+(state.session?button('timer','<span class="eyebrow">'+(state.session.startedAt===null?'På pause':'I gang')+'</span><br><strong>'+esc(state.tasks.find(t=>t.id===state.session.taskId).name)+'</strong>','banner'):'')+'<div class="group-heading"><h1>Faste opgaver</h1><span class="count">'+regular.length+'</span></div><div class="task-list">'+(regular.length?regular.map(row).join(''):'<div class="empty">Ingen faste opgaver.</div>')+'</div><details class="group" '+(expanded?'open':'')+'><summary><span class="group-label">Sjældne opgaver</span><span class="group-meta">'+(attention?attention+' markeret · ':'')+rare.length+'</span><span class="disclosure" aria-hidden="true">⌄</span></summary><div class="task-list">'+(rare.length?rare.map(row).join(''):'<div class="empty">Ingen sjældne opgaver.</div>')+'</div></details><footer class="home-footer">'+button('settings',icon('settings')+'<span>Indstillinger</span>','settings-link')+'</footer></div>';}
function settings(){return renderHeader()+'<h1>Indstillinger</h1><section class="settings-panel"><h2>Visning</h2><button type="button" class="setting-toggle" data-action="estimates" role="switch" aria-checked="'+(state.settings?.showEstimates!==false)+'"><span>Vis tidsestimater</span><span class="switch '+(state.settings?.showEstimates===false?'':'on')+'" aria-hidden="true"><span></span></span></button></section><section class="settings-panel"><h2>Statusfarver</h2><p class="settings-description">Teksten viser tiden siden seneste rengøring.</p><div class="legend"><span class="neutral">Grå</span><span>Inden det valgte interval</span></div><div class="legend"><span class="amber">Gul</span><span>Når intervallet nås og dagen efter</span></div><div class="legend"><span class="red">Rød</span><span>Fra to dage efter intervallet</span></div></section><section class="settings-panel"><h2>Data</h2>'+button('export',blocked?'Eksportér gemte data':'Eksportér backup','secondary')+button('import','Importér backup','secondary')+'<input type="file" id="backup-file" accept=".json,application/json" hidden><p class="field-hint">Import erstatter opgaver, historik og indstillinger. En gemt timer gendannes pauset.</p></section><section class="settings-panel"><h2>Nulstilling</h2>'+button('reset-history','Nulstil historik og rekorder','danger-button')+button('reset-all','Slet alle data','danger-button')+'</section><section class="settings-panel"><h2>App</h2><p class="settings-description">På iPhone: åbn CLEAN i Safari, vælg Del og Føj til hjemmeskærm.</p><p id="offline-state" class="field-hint">Offlineadgang kræver, at appens filer er hentet online først.</p><p class="field-hint">Version 6</p></section><p class="subtle">Registreringer gemmes på denne enhed. Gem en backup før du sletter browserdata.</p>';}
function detail(t){const h=last(t), b=C.best(t.history);return '<header>'+button('home','← Opgaver')+button('edit','Rediger')+'</header>'+'<div class="eyebrow">'+(t.group==='rare'?'Sjælden opgave':'Fast opgave')+'</div><h1>'+esc(t.name)+'</h1><div class="status '+tone(t)+'">'+status(t)+'</div><div class="metrics"><div class="metric"><small>Sidst udført</small><strong>'+(h?date(h.at):'Ikke endnu')+'</strong></div><div class="metric"><small>Interval</small><strong>Hver '+t.interval+'. dag</strong></div><div class="metric"><small>Forventet tid</small><strong>'+t.estimate+' minutter</strong></div><div class="metric"><small>Personlig rekord</small><strong>'+(b===null?'Ingen tid endnu':time(b))+'</strong></div></div><h2 class="section-title">Det skal gøres</h2>'+list(t)+'<div class="actions">'+button('start',state.session?'Til igangværende rengøring':'Start rengøring','primary')+button('manual','Registrer uden timer','secondary')+'</div><details class="spacer"><summary>Tidligere rengøringer</summary>'+(t.history.length?[...t.history].sort((a,b)=>b.at-a.at).map(h=>'<div class="history-row"><span>'+new Date(h.at).toLocaleDateString('da-DK',{day:'numeric',month:'long',year:'numeric'})+'</span><strong>'+(h.duration===null?'Uden timer':time(h.duration))+'</strong></div>').join(''):'<p class="subtle">Din første gennemførelse bliver vist her.</p>')+'</details>';}
function timer(){const s=state.session;if(!s){view='home';return home();}const t=state.tasks.find(t=>t.id===s.taskId);return renderHeader()+'<h2>'+esc(t.name)+'</h2><div class="time" id="clock">'+time(C.elapsed(s))+'</div><div class="timer-label">'+(s.startedAt===null?'På pause':'Rengøring i gang')+'</div><div class="actions timer-actions">'+button(s.startedAt===null?'resume':'pause',s.startedAt===null?'Fortsæt':'Pause','secondary')+button('finish','Afslut','primary')+'</div>'+(t.items.length?'<h2 class="section-title">Det skal gøres</h2>'+list(t):'')+button('cancel','Afbryd uden at gemme');}
function result(){const r=state.result;if(!r){view='home';return home();}const t=state.tasks.find(t=>t.id===r.taskId);if(!t){view='home';return home();}const measured=Number.isFinite(r.duration);return '<section class="result"><div class="seal" aria-hidden="true">✓</div><div class="eyebrow">'+esc(t.name)+'</div><h1>Opgave udført</h1>'+(measured?'<div class="time">'+time(r.duration)+'</div><p>'+(r.previousBest===null?'Første registrerede tid':r.duration<r.previousBest?'Ny personlig rekord':r.duration===r.previousBest?'Samme tid som din rekord':'Personlig rekord · '+time(r.previousBest))+'</p>':'<p>Registreret '+date(r.at)+' uden timer.</p>')+'<p class="subtle">Næste gang<br><strong>'+nextDate(last(t).at,t.interval)+'</strong></p><div class="actions">'+button('home','Til opgaver','primary')+button('undo',measured?'Fortryd afslutning':'Fortryd registrering')+'</div></section>';}
function formHeader(){return '<header>'+button('form-cancel','Annuller')+'<span class="eyebrow">CLEAN</span></header>';}
function editor(){const t=selected?state.tasks.find(t=>t.id===selected):null;return formHeader()+'<h1>'+(t?'Rediger opgave':'Ny opgave')+'</h1><form id="task-form"><label for="task-name">Navn</label><input id="task-name" name="name" maxlength="100" required value="'+esc(t?.name||'')+'" autocomplete="off"><label for="task-group">Gruppe</label><select id="task-group" name="group"><option value="regular" '+(t?.group!=='rare'?'selected':'')+'>Fast opgave</option><option value="rare" '+(t?.group==='rare'?'selected':'')+'>Sjælden opgave</option></select><div class="form-pair"><div><label for="task-interval">Interval · dage</label><input id="task-interval" name="interval" type="number" inputmode="numeric" min="1" max="3650" step="1" required value="'+(t?.interval||7)+'"></div><div><label for="task-estimate">Tid · minutter</label><input id="task-estimate" name="estimate" type="number" inputmode="numeric" min="1" max="1440" step="1" required value="'+(t?.estimate||10)+'"></div></div><label for="task-items">Underopgaver <span class="optional">valgfrit</span></label><textarea id="task-items" name="items" rows="5" maxlength="10050" aria-describedby="items-hint">'+esc(t?.items.join('\n')||'')+'</textarea><p id="items-hint" class="field-hint">Én underopgave pr. linje.</p>'+(!t?'<label for="last-date">Sidst udført <span class="optional">valgfrit</span></label><input id="last-date" type="date" name="lastDate" max="'+C.dateInput()+'"><p class="field-hint">Lad feltet stå tomt, hvis opgaven ikke er udført endnu.</p>':'')+'<p id="form-error" role="alert" class="red"></p><div class="actions"><button type="submit" class="primary">Gem opgave</button>'+(t?button('delete','Slet opgave','danger-button'):'')+'</div></form>';}
function manual(){const t=state.tasks.find(t=>t.id===selected);return formHeader()+'<h1>Registrer rengøring</h1><p>'+esc(t.name)+'</p><form id="manual-form"><label for="completed-date">Udført den</label><input id="completed-date" name="completedDate" type="date" required max="'+C.dateInput()+'" value="'+C.dateInput()+'"><p class="field-hint">Registreres uden tid og påvirker ikke din rekord.</p><p id="form-error" class="red" role="alert"></p><div class="actions"><button type="submit" class="primary">Registrer som udført</button></div></form>';}
function render(){app.className='view-'+view;app.innerHTML=view==='home'?home():view==='settings'?settings():view==='edit'?editor():view==='manual'?manual():view==='detail'?detail(state.tasks.find(t=>t.id===selected)):view==='timer'?timer():result();const offline=app.querySelector('#offline-state');if(offline&&window.cleanOfflineStatus)offline.textContent=window.cleanOfflineStatus;const group=app.querySelector('details.group');if(group)group.addEventListener('toggle',()=>expanded=group.open);}
app.addEventListener('click',e=>{const el=e.target.closest('button');if(!el||(el.type==='submit'&&el.form))return;if(el.dataset.task){selected=el.dataset.task;view='detail';render();window.scrollTo(0,0);return;}const action=el.dataset.action;const now=Date.now();if(action==='home'){if(state.result&&!blocked&&!change(()=>state.result=null))return;view='home';}
if(blocked&&!['settings','home','export','import','reset-all'].includes(action)){warn('Åbn Indstillinger for at eksportere, importere eller nulstille de gemte data.');return;}
if(action==='new'){selected=null;dirty=false;view='edit';}
if(action==='edit'||action==='manual'){if(state.session?.taskId===selected){alert('Afslut eller afbryd den igangværende rengøring først.');return;}dirty=false;view=action==='edit'?'edit':'manual';}
if(action==='form-cancel'){if(dirty&&!confirm('Kassér ændringerne?'))return;dirty=false;view=selected?'detail':'home';}
if(action==='delete'){if(state.session?.taskId===selected){alert('Afslut eller afbryd rengøringen først.');return;}if(!confirm('Slet opgaven og hele dens historik? Dette kan ikke fortrydes.'))return;if(!change(()=>{state.tasks=state.tasks.filter(t=>t.id!==selected);if(state.result?.taskId===selected)state.result=null;}))return;dirty=false;selected=null;view='home';}
if(action==='timer')view='timer';
if(action==='settings')view='settings';
if(action==='export'){exportData();return;}
if(action==='import'){document.querySelector('#backup-file').click();return;}
if(action==='reset-history'||action==='reset-all'){
const all=action==='reset-all';if(!confirm(all?'Slet alle opgaver, historik, rekorder, indstillinger og den eventuelle timer? Dette kan ikke fortrydes.':'Nulstil al historik og alle rekorder? Opgaver og indstillinger bevares. En eventuel timer afsluttes uden registrering.'))return;
if(!replaceData(C.resetState(state,all)))return;selected=null;dirty=false;expanded=false;view='home';
}
if(action==='estimates'){if(!change(()=>{state.settings={...state.settings,showEstimates:state.settings?.showEstimates===false};}))return;}
if(action==='start'){if(!state.session&&!change(()=>{state.session={taskId:selected,accumulated:0,startedAt:now};state.result=null;}))return;view='timer';}
if(action==='pause'&&state.session){if(!change(()=>state.session=C.pause(state.session,now)))return;}
if(action==='resume'&&state.session){if(!change(()=>state.session=C.resume(state.session,now)))return;}
if(action==='finish'&&state.session){if(!change(()=>{const s=state.session,t=state.tasks.find(t=>t.id===s.taskId);const r={id:crypto.randomUUID(),taskId:t.id,at:now,duration:C.elapsed(s,now),previousBest:C.best(t.history)};t.history.push({id:r.id,at:r.at,duration:r.duration});state.result=r;state.session=null;}))return;view='result';}
if(action==='undo'&&state.result){const measured=Number.isFinite(state.result.duration);if(measured&&state.session){alert('Afslut den igangværende timer først.');return;}selected=state.result.taskId;if(!change(()=>{const r=state.result,t=state.tasks.find(t=>t.id===r.taskId);t.history=t.history.filter(h=>h.id!==r.id);if(measured)state.session={taskId:r.taskId,accumulated:r.duration,startedAt:null};state.result=null;}))return;view=measured?'timer':'detail';}
if(action==='cancel'&&state.session){if(!confirm('Afbryd rengøringen? Tiden kasseres, og opgaven bliver ikke registreret som udført.'))return;if(!change(()=>state.session=null))return;view='home';}
render();window.scrollTo(0,0);});


function replaceData(next){try{localStorage.setItem(KEY,JSON.stringify(next));state=next;blocked=false;warn('');return true;}catch(e){warn('Kunne ikke gemme ændringen. De eksisterende data er bevaret.');return false;}}
function exportData(){try{
const text=blocked?localStorage.getItem(KEY):JSON.stringify(C.backup(state),null,2);
if(text===null)throw Error('Ingen gemte data.');
const blob=new Blob([text],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');
link.href=url;link.download='CLEAN-'+(blocked?'gendannelse-':'backup-')+C.dateInput()+'.json';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
}catch(e){warn('Eksport mislykkedes: '+e.message);}}
async function importFile(input){const file=input.files?.[0];if(!file)return;
try{if(file.size>5*1024*1024)throw Error('Filen må højst være 5 MB.');const before=localStorage.getItem(KEY),next=C.parseBackup(await file.text());
if(before!==localStorage.getItem(KEY))throw Error('Data er ændret i en anden fane. Genindlæs før import.');
if(!confirm('Erstat alle nuværende data med '+next.tasks.length+' opgaver og '+next.tasks.reduce((n,t)=>n+t.history.length,0)+' registreringer fra backupfilen? Eksportér først, hvis du vil bevare de nuværende data.'))return;
if(!replaceData(next))return;dirty=false;selected=null;view=state.session?'timer':'home';render();window.scrollTo(0,0);
}catch(e){warn('Import blev ikke gennemført: '+e.message);}finally{input.value='';}}

app.addEventListener('input',()=>{if(view==='edit'||view==='manual')dirty=true;});
app.addEventListener('change',e=>{if(e.target.id==='backup-file'){return importFile(e.target);}if(view==='edit'||view==='manual')dirty=true;});
app.addEventListener('submit',e=>{e.preventDefault();const form=e.target;if(!['task-form','manual-form'].includes(form.id)||!form.reportValidity())return;
try{
const values=Object.fromEntries(new FormData(form));
if(form.id==='task-form'){
const fields=C.taskFields(values),existing=selected?state.tasks.find(t=>t.id===selected):null;
if(selected&&!existing)throw Error('Opgaven findes ikke længere.');
if(state.session?.taskId===selected)throw Error('Afslut den igangværende rengøring først.');
const at=!existing&&values.lastDate?C.parseDate(values.lastDate):null;
const id=existing?existing.id:crypto.randomUUID();
if(!change(()=>{if(existing)Object.assign(existing,fields);else state.tasks.push({...fields,id,history:at===null?[]:[{id:crypto.randomUUID(),at,duration:null}]});state.result=null;}))return;
selected=id;
}else{
if(state.session?.taskId===selected)throw Error('Afslut den igangværende rengøring først.');
const at=C.parseDate(values.completedDate),t=state.tasks.find(t=>t.id===selected);if(!t)throw Error('Opgaven findes ikke længere.');
if(!change(()=>{const entry={id:crypto.randomUUID(),at,duration:null};t.history.push(entry);state.result={...entry,taskId:t.id,previousBest:C.best(t.history)};}))return;
}
dirty=false;view=form.id==='task-form'?'detail':'result';render();window.scrollTo(0,0);
}catch(error){document.querySelector('#form-error').textContent=error.message;}
});
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});

setInterval(()=>{const clock=document.querySelector('#clock');if(clock&&state.session)clock.textContent=time(C.elapsed(state.session));},250);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&view!=='edit'&&view!=='manual')render();});
window.addEventListener('storage',e=>{if(e.key===KEY){if(dirty){blocked=true;warn('Data er ændret i en anden fane. Genindlæs før du gemmer.');}else location.reload();}});
if(state.session)view='timer';else if(state.result)view='result';
render();

})();
