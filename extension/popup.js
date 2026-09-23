const status=document.getElementById("status");
document.getElementById("export").addEventListener("click",async()=>{
  const data=await chrome.storage.local.get({events:[]});
  const blob=new Blob([JSON.stringify(data.events||[],null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download="mes-donnees-liste-ethan.json";
  a.click();
  URL.revokeObjectURL(url);
  status.textContent="Export créé.";
});
document.getElementById("takeout").addEventListener("click",()=>{
  chrome.tabs.create({url:"https://takeout.google.com/"});
});