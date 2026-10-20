/* Shared deterministic timer and calendar logic. */
(function(root){
 const elapsed=(session,now=Date.now())=>session.accumulated+(session.startedAt===null?0:Math.max(0,now-session.startedAt));
 const pause=(s,now)=>({...s,accumulated:elapsed(s,now),startedAt:null});
 const resume=(s,now)=>({...s,startedAt:s.startedAt===null?now:s.startedAt});
 const day=(value)=>{const d=new Date(value);return Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000};
 const daysLeft=(last,interval,now)=>last?day(last)+interval-day(now):null;
 const best=(history)=>{const times=history.filter(h=>Number.isFinite(h.duration)).map(h=>h.duration);return times.length?Math.min(...times):null};
 root.CleanCore={elapsed,pause,resume,day,daysLeft,best};
})(typeof globalThis!=="undefined"?globalThis:this);