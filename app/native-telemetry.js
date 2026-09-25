(() => {
  const SUPABASE_URL="https://ckasbsnzxgwfwfnctioe.supabase.co";
  const SUPABASE_ANON_KEY="sb_publishable_e9u2wbkr12SRgxPDIB-EkA_I4QnQsF4";
  const CONSENT_KEY="ethan_native_telemetry_consent";
  const INSTALLATION_KEY="ethan_native_installation_id";
  const SESSION_KEY="ethan_native_session_id";
  const VERSION="1.0.0";

  const native=Boolean(
    window.__TAURI_INTERNALS__ ||
    window.__TAURI__ ||
    window.Capacitor?.isNativePlatform?.()
  );
  if(!native)return;

  function uuid(){
    return crypto.randomUUID ? crypto.randomUUID() :
      ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,c=>
        (c^crypto.getRandomValues(new Uint8Array(1))[0]&15>>c/4).toString(16)
      );
  }

  async function ids(){
    let installationId=localStorage.getItem(INSTALLATION_KEY);
    if(!installationId){
      installationId=uuid();
      localStorage.setItem(INSTALLATION_KEY,installationId);
    }
    let sessionId=sessionStorage.getItem(SESSION_KEY);
    if(!sessionId){
      sessionId=uuid();
      sessionStorage.setItem(SESSION_KEY,sessionId);
    }
    return {installationId,sessionId};
  }

  function safePage(){return location.pathname;}

  async function send(type,label="",metadata={}){
    if(localStorage.getItem(CONSENT_KEY)!=="accepted")return;
    const {installationId,sessionId}=await ids();
    try{
      await fetch(SUPABASE_URL+"/rest/v1/rpc/extension_log_event",{
        method:"POST",
        headers:{apikey:SUPABASE_ANON_KEY,"Content-Type":"application/json"},
        body:JSON.stringify({
          p_installation_id:installationId,
          p_session_id:sessionId,
          p_event_type:type,
          p_page_path:safePage(),
          p_event_label:label||null,
          p_metadata:{...metadata,extensionVersion:VERSION,source:"native-app"}
        })
      });
    }catch{}
  }

  function technical(){
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
      connectionType:connection?.effectiveType||null
    };
  }

  function mountConsent(){
    if(document.getElementById("nativeTelemetryConsent"))return;
    const box=document.createElement("div");
    box.id="nativeTelemetryConsent";
    box.style.cssText="position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;background:#17192a;color:#fff;border-radius:16px;padding:16px;box-shadow:0 12px 40px rgba(0,0,0,.3);font:14px system-ui";
    box.innerHTML='<strong>📡 Télémétrie de l’application</strong><div style="margin:8px 0 12px;line-height:1.45">Cette application peut enregistrer les pages, clics et quelques informations techniques pour améliorer la liste. Les mots de passe, codes d’accès et contenus de formulaires ne sont pas collectés. Tu peux accepter ou refuser.</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button id="nativeTelemetryAccept" style="border:0;border-radius:10px;padding:9px 12px;font-weight:700">J’accepte</button><button id="nativeTelemetryReject" style="border:0;border-radius:10px;padding:9px 12px;font-weight:700">Je refuse</button></div>';
    document.body.appendChild(box);

    box.querySelector("#nativeTelemetryAccept").onclick=async()=>{
      localStorage.setItem(CONSENT_KEY,"accepted");
      box.remove();
      await send("consent_granted","",{source:"native-app-popup"});
      await send("page_view","",technical());
    };
    box.querySelector("#nativeTelemetryReject").onclick=()=>{
      localStorage.setItem(CONSENT_KEY,"rejected");
      box.remove();
    };
  }

  function start(){
    const consent=localStorage.getItem(CONSENT_KEY);
    if(!consent)mountConsent();
    if(consent==="accepted")send("page_view","",technical());

    document.addEventListener("click",event=>{
      const el=event.target.closest("button,a");
      if(!el)return;
      const label=(el.innerText||el.getAttribute("aria-label")||"element").trim().slice(0,120);
      send("click",label);
    });
    window.addEventListener("online",()=>send("network_online"));
    window.addEventListener("offline",()=>send("network_offline"));
    document.addEventListener("visibilitychange",()=>{
      if(document.visibilityState==="hidden")send("visibility_hidden");
    });
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();