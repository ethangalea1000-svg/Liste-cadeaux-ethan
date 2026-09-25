(() => {
  const key="events";

  function safePage(){
    return location.origin+location.pathname;
  }

  function collectTechnical(){
    const connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
    return {
      title:(document.title||"").slice(0,160),
      language:navigator.language||"",
      languages:Array.isArray(navigator.languages)?navigator.languages.slice(0,5):[],
      timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||"",
      online:navigator.onLine,
      viewport:{width:innerWidth,height:innerHeight},
      screen:{width:screen.width,height:screen.height},
      colorScheme:matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light",
      touchPoints:navigator.maxTouchPoints||0,
      connectionType:connection?.effectiveType||null
    };
  }

  const save=async(event,extra={})=>{
    try{
      const data=await chrome.storage.local.get({
        [key]:[],
        detailedCollection:false
      });
      const events=Array.isArray(data[key])?data[key]:[];
      const item={
        time:new Date().toISOString(),
        page:safePage(),
        type:event,
        ...(data.detailedCollection?extra:{})
      };
      events.push(item);
      await chrome.storage.local.set({[key]:events.slice(-1000)});
    }catch{}
  };

  save("page_view",{technical:collectTechnical()});

  document.addEventListener("click",e=>{
    const button=e.target.closest("button,a");
    if(!button)return;
    const label=(button.innerText||button.getAttribute("aria-label")||"element").trim().slice(0,120);
    save("click",{label});
  });

  window.addEventListener("resize",()=>{
    chrome.storage.local.get({detailedCollection:false}).then(data=>{
      if(data.detailedCollection)save("resize",{viewport:{width:innerWidth,height:innerHeight}});
    }).catch(()=>{});
  });

  window.addEventListener("online",()=>save("network_online"));
  window.addEventListener("offline",()=>save("network_offline"));
})();