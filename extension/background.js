const SUPABASE_URL="https://ckasbsnzxgwfwfnctioe.supabase.co";
const SUPABASE_ANON_KEY="sb_publishable_e9u2wbkr12SRgxPDIB-EkA_I4QnQsF4";
const SITE_ORIGIN="https://ethangalea1000-svg.github.io";

async function sendTelemetry(event){
  const data=await chrome.storage.local.get({telemetryConsent:false});
  if(data.telemetryConsent!==true)return false;

  const r=await fetch(SUPABASE_URL+"/rest/v1/rpc/extension_log_event",{
    method:"POST",
    headers:{
      apikey:SUPABASE_ANON_KEY,
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      p_installation_id:event.installationId,
      p_session_id:event.sessionId,
      p_event_type:event.type,
      p_page_path:event.page,
      p_event_label:event.label||null,
      p_metadata:event.metadata||{}
    })
  });
  return r.ok;
}

chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
  (async()=>{
    try{
      if(!message||message.type!=="telemetry_event"){
        sendResponse({ok:false});
        return;
      }

      const isConsentEvent=message.event?.type==="consent_granted";
      const senderUrl=sender?.url||"";
      const allowedPage=isConsentEvent || senderUrl.startsWith(SITE_ORIGIN+"/Liste-cadeaux-ethan/");
      if(!allowedPage){
        sendResponse({ok:false,error:"source_not_allowed"});
        return;
      }

      const ok=await sendTelemetry(message.event);
      sendResponse({ok});
    }catch(error){
      sendResponse({ok:false,error:String(error?.message||error)});
    }
  })();
  return true;
});