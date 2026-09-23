(() => {
  const key="events";
  const save=async event=>{
    const data=await chrome.storage.local.get({[key]:[]});
    const events=Array.isArray(data[key])?data[key]:[];
    events.push({
      time:new Date().toISOString(),
      page:location.pathname,
      type:event
    });
    await chrome.storage.local.set({[key]:events.slice(-1000)});
  };
  save("page_view");
  document.addEventListener("click",e=>{
    const button=e.target.closest("button,a");
    if(button)save("click:"+((button.innerText||button.getAttribute("aria-label")||button.getAttribute("href")||"element").trim().slice(0,120)));
  });
})();