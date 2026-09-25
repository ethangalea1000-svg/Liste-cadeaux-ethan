const status=document.getElementById("status");

async function getState(){
  return chrome.storage.local.get({
    events:[],
    detailedCollection:false,
    cookieChoice:null,
    telemetryConsent:false
  });
}

function formatDate(value){
  if(!value)return "—";
  try{return new Date(value).toLocaleString("fr-FR");}catch{return "—"}
}

async function refresh(){
  const data=await getState();
  const events=Array.isArray(data.events)?data.events:[];
  document.getElementById("eventCount").textContent=events.length;
  document.getElementById("pageCount").textContent=new Set(events.map(e=>e.page).filter(Boolean)).size;
  document.getElementById("lastActivity").textContent=formatDate(events.at(-1)?.time);
  document.getElementById("detailStatus").textContent=data.detailedCollection?"activée":"désactivée";
  const consentLabel=document.getElementById("telemetryStatus");
  if(consentLabel)consentLabel.textContent=data.telemetryConsent?"serveur + local":"désactivée";
  const toggle=document.getElementById("toggleDetails");
  toggle.textContent=data.detailedCollection?"Désactiver la collecte détaillée":"Activer la collecte détaillée";
  document.getElementById("cookieCard").style.display=data.cookieChoice?"none":"block";
}

document.getElementById("cookieAccept").addEventListener("click",async()=>{
  await chrome.storage.local.set({cookieChoice:"accepted",telemetryConsent:true});
  const local=await chrome.storage.local.get({installationId:null});
  const installationId=local.installationId||crypto.randomUUID();
  await chrome.storage.local.set({installationId});
  const sessionId=crypto.randomUUID();
  chrome.runtime.sendMessage({
    type:"telemetry_event",
    event:{
      installationId,
      sessionId,
      type:"consent_granted",
      page:"/extension-popup",
      label:null,
      metadata:{extensionVersion:"1.1.0",source:"popup"}
    }
  }).catch(()=>{});
  status.textContent="Préférence enregistrée. Aucun cookie réel n’a été activé.";
  refresh();
});

document.getElementById("cookieReject").addEventListener("click",async()=>{
  await chrome.storage.local.set({cookieChoice:"rejected",telemetryConsent:false});
  status.textContent="Préférence enregistrée. Aucun cookie réel n’est utilisé.";
  refresh();
});

document.getElementById("toggleDetails").addEventListener("click",async()=>{
  const data=await getState();
  await chrome.storage.local.set({detailedCollection:!data.detailedCollection});
  status.textContent=!data.detailedCollection
    ?"Collecte détaillée activée."
    :"Collecte détaillée désactivée.";
  refresh();
});

document.getElementById("export").addEventListener("click",async()=>{
  const data=await getState();
  const blob=new Blob([JSON.stringify({
    exportedAt:new Date().toISOString(),
    detailedCollection:!!data.detailedCollection,
    cookieChoice:data.cookieChoice,
    events:Array.isArray(data.events)?data.events:[],
    telemetryConsent:!!data.telemetryConsent
  },null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download="mes-donnees-liste-ethan.json";
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  status.textContent="Export créé.";
});

document.getElementById("takeout").addEventListener("click",()=>{
  chrome.tabs.create({url:"https://takeout.google.com/"});
});

document.getElementById("clear").addEventListener("click",async()=>{
  if(!confirm("Supprimer toutes les données enregistrées par l’extension sur cet appareil ?"))return;
  await chrome.storage.local.clear();
  status.textContent="Données locales supprimées. La télémétrie est désactivée jusqu’à un nouveau consentement.";
  refresh();
});

refresh();