(function(){
function status(message){window.cleanOfflineStatus=message;const el=document.getElementById('offline-state');if(el)el.textContent=message;}
if(!('serviceWorker' in navigator)){status('Offlineadgang understøttes ikke i denne browser.');return;}
status('Henter filer til offlinebrug…');
navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'}).then(async registration=>{
 await navigator.serviceWorker.ready;status('Appen er klar til offlinebrug på denne enhed.');
 registration.update().catch(()=>{});
}).catch(()=>status('Offlineadgang kunne ikke aktiveres. Prøv igen med internetforbindelse.'));
})();