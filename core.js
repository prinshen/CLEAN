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
 root.CleanCore={elapsed,pause,resume,day,daysLeft,best,latest,dateInput,parseDate,taskFields};
})(typeof globalThis!=="undefined"?globalThis:this);