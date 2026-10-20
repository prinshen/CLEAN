/* Shared deterministic timer and calendar logic. */
(function(root){
 const elapsed=(session,now=Date.now())=>session.accumulated+(session.startedAt===null?0:Math.max(0,now-session.startedAt));
 const pause=(s,now)=>({...s,accumulated:elapsed(s,now),startedAt:null});
 const resume=(s,now)=>({...s,startedAt:s.startedAt===null?now:s.startedAt});
 const day=(value)=>{const d=new Date(value);return Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000};
 const daysLeft=(last,interval,now)=>last?day(last)+interval-day(now):null;
 const best=(history)=>{const times=history.filter(h=>Number.isFinite(h.duration)).map(h=>h.duration);return times.length?Math.min(...times):null};
 const latest=history=>history.reduce((a,b)=>!a||b.at>a.at?b:a,null);
 const dateInput=(value=Date.now())=>{const d=new Date(value);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');};
 const parseDate=(value,now=Date.now())=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(value))throw Error('Vælg en gyldig dato.');const [y,m,d]=value.split('-').map(Number);const result=new Date(y,m-1,d,12);if(dateInput(result)!==value||day(result)>day(now))throw Error('Datoen skal være i dag eller tidligere.');return Math.min(result.getTime(),now);};
 const taskFields=values=>{const name=String(values.name||'').trim(),interval=Number(values.interval),estimate=Number(values.estimate),group=values.group;
 if(!name||name.length>100)throw Error('Navnet skal være mellem 1 og 100 tegn.');
 if(!Number.isInteger(interval)||interval<1||interval>3650)throw Error('Intervallet skal være mellem 1 og 3650 hele dage.');
 if(!Number.isInteger(estimate)||estimate<1||estimate>1440)throw Error('Tidsestimatet skal være mellem 1 og 1440 hele minutter.');
 if(!['regular','rare'].includes(group))throw Error('Vælg en opgavegruppe.');
 const items=String(values.items||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);if(items.length>50||items.some(x=>x.length>200))throw Error('Brug højst 50 underopgaver med højst 200 tegn hver.');
 return {name,interval,estimate,group,items};};

 const validateState=(input)=>{
 if(!input||typeof input!=='object'||!Array.isArray(input.tasks)||input.tasks.length>2000)throw Error('Ugyldig opgaveliste.');
 const ids=new Set();
 const tasks=input.tasks.map(t=>{
 if(!t||typeof t.id!=='string'||!t.id||t.id.length>200||ids.has(t.id))throw Error('Ugyldigt eller gentaget opgave-id.');ids.add(t.id);
 if(!Array.isArray(t.items)||t.items.some(x=>typeof x!=='string')||!Array.isArray(t.history)||t.history.length>50000)throw Error('Ugyldige underopgaver eller historik.');
 const fields=taskFields({...t,items:t.items.join('\n')});
 const historyIds=new Set();
 const history=t.history.map(h=>{
 if(!h||typeof h.id!=='string'||!h.id||historyIds.has(h.id)||!Number.isFinite(h.at)||h.at<0||h.at>8640000000000000||day(h.at)>day(Date.now())||(h.duration!==null&&(!Number.isFinite(h.duration)||h.duration<0)))throw Error('Ugyldig registrering i historikken.');
 historyIds.add(h.id);return {id:h.id,at:h.at,duration:h.duration};
 });
 return {id:t.id,...fields,history};
 });
 let session=null;
 if(input.session!=null){const s=input.session;if(!ids.has(s.taskId)||!Number.isFinite(s.accumulated)||s.accumulated<0||(s.startedAt!==null&&(!Number.isFinite(s.startedAt)||s.startedAt<0||s.startedAt>Date.now()+60000)))throw Error('Ugyldig timer.');
 session={taskId:s.taskId,accumulated:s.accumulated,startedAt:s.startedAt};}
 let result=null;
 if(input.result!=null){const r=input.result,t=tasks.find(t=>t.id===r.taskId),h=t?.history.find(h=>h.id===r.id);if(!h)throw Error('Ugyldigt resultat.');
 result={...h,taskId:t.id,previousBest:best(t.history.filter(x=>x.id!==h.id))};}
 return {tasks,session,result,settings:{showEstimates:input.settings?.showEstimates!==false}};
 };
 const backup=(state,now=Date.now())=>{const clean=validateState(state);if(clean.session)clean.session=pause(clean.session,now);return {app:'CLEAN',version:1,exportedAt:new Date(now).toISOString(),data:clean};};
 const parseBackup=text=>{const envelope=JSON.parse(text);if(envelope?.app!=='CLEAN'||envelope.version!==1)throw Error('Vælg en CLEAN-backup i version 1.');
 const data=validateState(envelope.data);if(data.session&&data.session.startedAt!==null)throw Error('Backupfilens timer skal være pauset.');return data;};
 const resetState=(state,all)=>all?{tasks:[],session:null,result:null,settings:{showEstimates:true}}:{...state,tasks:state.tasks.map(t=>({...t,history:[]})),session:null,result:null};
 root.CleanCore={elapsed,pause,resume,day,daysLeft,best,latest,dateInput,parseDate,taskFields,validateState,backup,parseBackup,resetState};
})(typeof globalThis!=="undefined"?globalThis:this);