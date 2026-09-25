(() => {
  const key="events";
  const extensionVersion="1.2.0";

  async function ids(){
    const local=await chrome.storage.local.get({installationId:null});
    let installationId=local.installationId;
    if(!installationId){
      installationId=crypto.randomUUID();
      await chrome.storage.local.set({installationId});
    }
    let sessionId=sessionStorage.getItem("ethan_extension_session_id");
    if(!sessionId){
      sessionId=crypto.randomUUID();
      sessionStorage.setItem("ethan_extension_session_id",sessionId);
    }
    return {installationId,sessionId};
  }

  function safePage(){
    return location.pathname;
  }

  function technicalData(){
    const connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
    return {
      title:(document.title||"").slice(0,160),
      language:navigator.language||"",
      timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||"",
      online:navigator.onLine,
      viewportWidth:String(innerWidth),
      viewportHeight:String(innerHeight),
      screenWidth:String(screen.width),
      screenHeight:String(screen.height),
      colorScheme:matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light",
      touchPoints:String(navigator.maxTouchPoints||0),
      connectionType:connection?.effectiveType||null,
      extensionVersion
    };
  }

  const save=async(type,metadata={},label=null)=>{
    try{
      const state=await chrome.storage.local.get({
        [key]:[],
        telemetryConsent:false
      });
      if(state.telemetryConsent!==true)return;

      const {installationId,sessionId}=await ids();
      const event={
        time:new Date().toISOString(),
        page:safePage(),
        type,
        label,
        metadata
      };

      const events=Array.isArray(state[key])?state[key]:[];
      events.push({...event,installationId,sessionId});
      await chrome.storage.local.set({[key]:events.slice(-1000)});

      chrome.runtime.sendMessage({
        type:"telemetry_event",
        event:{installationId,sessionId,page:event.page,type:event.type,label:event.label,metadata:event.metadata}
      }).catch(()=>{});
    }catch{}
  };

  chrome.storage.local.get({telemetryConsent:false}).then(state=>{
    if(state.telemetryConsent===true)save("page_view",technicalData());
  }).catch(()=>{});

  document.addEventListener("click",e=>{
    const button=e.target.closest("button,a");
    if(!button)return;
    const label=(button.innerText||button.getAttribute("aria-label")||"element").trim().slice(0,120);
    save("click",{},label);
  });

  window.addEventListener("resize",()=>{
    chrome.storage.local.get({telemetryConsent:false}).then(state=>{
      if(state.telemetryConsent===true){
        save("resize",{
          viewportWidth:String(innerWidth),
          viewportHeight:String(innerHeight),
          extensionVersion
        });
      }
    }).catch(()=>{});
  });

  window.addEventListener("online",()=>save("network_online"));
  window.addEventListener("offline",()=>save("network_offline"));
  document.addEventListener("visibilitychange",()=>{
    if(document.visibilityState==="hidden")save("visibility_hidden");
  });
})();