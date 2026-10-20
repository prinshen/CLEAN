(function () {
'use strict';
const C=CleanCore, KEY='clean.phase2.v1', app=document.querySelector('#app');
const examples=[
 {id:'bath',name:'Rengør badeværelse',group:'regular',interval:10,estimate:15,items:['Toilet','Håndvask og armatur','Spejl','Bruseområde','Overflader','Gulv']},
 {id:'bed',name:'Støvsug soveværelse',group:'regular',interval:7,estimate:5,items:['Gulv','Under sengen','Hjørner og langs paneler']},
 {id:'linen',name:'Skift sengetøj',group:'regular',interval:14,estimate:8,items:['Tag sengetøjet af','Læg rent sengetøj på','Læg brugt sengetøj til vask']},
 {id:'kitchen',name:'Rengør køkken',group:'regular',interval:7,estimate:12,items:['Bordplader','Komfur','Vask og armatur','Låger og håndtag']},
 {id:'windows',name:'Puds vinduer',group:'rare',interval:90,estimate:30,items:['Vindueskarme','Glas indvendigt','Glas udvendigt, hvor det er tilgængeligt']},
 {id:'vent',name:'Rengør ventilationsrist',group:'rare',interval:90,estimate:10,items:['Fjern støv fra risten','Tør de tilgængelige overflader af']}
].map(t=>({...t,history:[]}));
let state={tasks:examples,session:null,result:null}, view='home', selected=null, expanded=false;
const warn=text=>document.querySelector('#notice').textContent=text;
let blocked=false;
try{const raw=localStorage.getItem(KEY);if(raw){const parsed=JSON.parse(raw);if(!Array.isArray(parsed.tasks)||parsed.tasks.some(t=>!Array.isArray(t.history)||!Array.isArray(t.items))||parsed.session&&(!parsed.tasks.some(t=>t.id===parsed.session.taskId)||!Number.isFinite(parsed.session.accumulated)||(parsed.session.startedAt!==null&&!Number.isFinite(parsed.session.startedAt))))throw Error('Invalid data');state=parsed;}}
catch(e){blocked=true;warn('Dine gemte data kunne ikke læses. De er ikke overskrevet. Genindlæs appen eller kontrollér browserens lager før brug.');}
function save(){if(blocked)return false;try{localStorage.setItem(KEY,JSON.stringify(state));warn('');return true;}catch(e){warn('Kunne ikke gemme på telefonen. Din seneste handling er ikke gemt. Kontrollér ledig plads og browserens lager.');return false;}}
function change(fn){const previous=JSON.stringify(state);fn();if(!save()){state=JSON.parse(previous);return false;}return true;}
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const time=ms=>{const s=Math.floor(ms/1000);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');};
const date=x=>new Date(x).toLocaleDateString('da-DK',{day:'numeric',month:'long'});
const last=t=>t.history.length?t.history[t.history.length-1]:null;
const left=t=>C.daysLeft(last(t)?.at,t.interval,Date.now());
const status=t=>{const n=left(t);return n===null?'Ikke udført endnu':n<0?Math.abs(n)+' dage over tid':n===0?'Tid i dag':'Om '+n+' dage';};
const nextDate=(at,interval)=>{const d=new Date(at);d.setDate(d.getDate()+interval);return date(d);};
const button=(action,label,cls='text-button')=>'<button class="'+cls+'" data-action="'+action+'">'+label+'</button>';
const renderHeader=()=>'<header>'+button('home','← Overblik')+'<span class="eyebrow">CLEAN</span></header>';
function list(t){return '<ul class="checklist">'+t.items.map(i=>'<li>'+esc(i)+'</li>').join('')+'</ul>';}
function row(t){const h=last(t);return '<button class="row" data-task="'+esc(t.id)+'"><div class="topline"><span class="row-name">'+esc(t.name)+'</span><span class="estimate">~'+t.estimate+' min</span></div><div class="status '+(left(t)!==null&&left(t)<=0?'due':'')+'">'+status(t)+'</div><div class="last">'+(h?'Sidst '+date(h.at)+' · '+(C.day(Date.now())-C.day(h.at))+' dage siden':'Ingen registreret rengøring')+'</div></button>';}
function home(){const sorted=[...state.tasks].sort((a,b)=>(left(a)??-Infinity)-(left(b)??-Infinity));const count=state.tasks.filter(t=>left(t)!==null&&left(t)<=0).length;const rare=sorted.filter(t=>t.group==='rare');const rareDue=rare.filter(t=>left(t)!==null&&left(t)<=0).length;
return '<header><span class="brand">CLEAN</span><span class="edition">Første version</span></header><div class="eyebrow">'+new Date().toLocaleDateString('da-DK',{weekday:'long',day:'numeric',month:'long'})+'</div><p class="subtle">'+(count?count+' opgaver trænger til rengøring.':'Ingen opgaver har overskredet deres interval.')+'</p>'+(state.session?button('timer','Tilbage til igangværende rengøring<br><strong>'+esc(state.tasks.find(t=>t.id===state.session.taskId).name)+'</strong>','banner'):'')+'<h2 class="section-title">Faste opgaver</h2>'+sorted.filter(t=>t.group==='regular').map(row).join('')+'<details class="group" '+(expanded?'open':'')+'><summary>Sjældne opgaver <span>'+rareDue+' trænger</span></summary>'+rare.map(row).join('')+'</details><p class="footnote">Eksempelopgaver<br>Registreringer gemmes på denne enhed. Egne opgaver kommer i næste fase.</p>';}
function detail(t){const h=last(t), b=C.best(t.history);return renderHeader()+'<div class="eyebrow">'+(t.group==='rare'?'Sjælden opgave':'Fast opgave')+'</div><h1>'+esc(t.name)+'</h1><div class="status">'+status(t)+'</div><div class="metrics"><div class="metric"><small>Sidst udført</small><strong>'+(h?date(h.at):'Ikke endnu')+'</strong></div><div class="metric"><small>Interval</small><strong>Hver '+t.interval+'. dag</strong></div><div class="metric"><small>Forventet tid</small><strong>'+t.estimate+' minutter</strong></div><div class="metric"><small>Personlig rekord</small><strong>'+(b===null?'Ingen tid endnu':time(b))+'</strong></div></div><h2 class="section-title">Det skal gøres</h2>'+list(t)+'<div class="actions">'+button('start',state.session?'Til igangværende rengøring':'Start rengøring','primary')+'</div><details class="spacer"><summary>Tidligere rengøringer</summary>'+(t.history.length?[...t.history].reverse().map(h=>'<div class="history-row"><span>'+date(h.at)+'</span><strong>'+time(h.duration)+'</strong></div>').join(''):'<p class="subtle">Din første gennemførelse bliver vist her.</p>')+'</details>';}
function timer(){const s=state.session;if(!s){view='home';return home();}const t=state.tasks.find(t=>t.id===s.taskId);return renderHeader()+'<h2>'+esc(t.name)+'</h2><div class="time" id="clock">'+time(C.elapsed(s))+'</div><div class="timer-label">'+(s.startedAt===null?'På pause':'Rengøring i gang')+'</div><div class="actions timer-actions">'+button(s.startedAt===null?'resume':'pause',s.startedAt===null?'Fortsæt':'Pause','secondary')+button('finish','Afslut','primary')+'</div><h2 class="section-title">Det skal gøres</h2>'+list(t)+button('cancel','Afbryd uden at gemme');}
function result(){const r=state.result;if(!r){view='home';return home();}const t=state.tasks.find(t=>t.id===r.taskId);return '<section class="result"><div class="seal" aria-hidden="true">✓</div><div class="eyebrow">'+esc(t.name)+'</div><h1>Opgave udført.</h1><div class="time">'+time(r.duration)+'</div><p>'+(r.previousBest===null?'Din første registrerede tid.':r.duration<r.previousBest?'Ny personlig rekord.':r.duration===r.previousBest?'Du tangerede din rekord.':'Personlig rekord · '+time(r.previousBest))+'</p><p class="subtle">Næste gang<br><strong>'+nextDate(r.at,t.interval)+'</strong></p><div class="actions">'+button('home','Til overblik','primary')+button('undo','Fortryd afslutning')+'</div></section>';}
function render(){app.innerHTML=view==='home'?home():view==='detail'?detail(state.tasks.find(t=>t.id===selected)):view==='timer'?timer():result();const group=app.querySelector('details.group');if(group)group.addEventListener('toggle',()=>expanded=group.open);}
app.addEventListener('click',e=>{const el=e.target.closest('button');if(!el)return;if(el.dataset.task){selected=el.dataset.task;view='detail';render();window.scrollTo(0,0);return;}const action=el.dataset.action;const now=Date.now();if(action==='home')view='home';
if(action==='timer')view='timer';
if(action==='start'){if(!state.session&&!change(()=>{state.session={taskId:selected,accumulated:0,startedAt:now};state.result=null;}))return;view='timer';}
if(action==='pause'&&state.session){if(!change(()=>state.session=C.pause(state.session,now)))return;}
if(action==='resume'&&state.session){if(!change(()=>state.session=C.resume(state.session,now)))return;}
if(action==='finish'&&state.session){if(!change(()=>{const s=state.session,t=state.tasks.find(t=>t.id===s.taskId);const r={id:crypto.randomUUID(),taskId:t.id,at:now,duration:C.elapsed(s,now),previousBest:C.best(t.history)};t.history.push({id:r.id,at:r.at,duration:r.duration});state.result=r;state.session=null;}))return;view='result';}
if(action==='undo'&&state.result){if(!change(()=>{const r=state.result,t=state.tasks.find(t=>t.id===r.taskId);t.history=t.history.filter(h=>h.id!==r.id);state.session={taskId:r.taskId,accumulated:r.duration,startedAt:null};state.result=null;}))return;view='timer';}
if(action==='cancel'&&state.session){if(!confirm('Afbryd rengøringen? Tiden kasseres, og opgaven bliver ikke registreret som udført.'))return;if(!change(()=>state.session=null))return;view='home';}
render();window.scrollTo(0,0);});
setInterval(()=>{const clock=document.querySelector('#clock');if(clock&&state.session)clock.textContent=time(C.elapsed(state.session));},250);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)render();});
window.addEventListener('storage',e=>{if(e.key===KEY)location.reload();});
if(state.session)view='timer';else if(state.result)view='result';
render();

})();
