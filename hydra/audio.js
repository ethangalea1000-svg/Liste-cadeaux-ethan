(()=>{'use strict';
if(window.__hydraAudioV3)return;window.__hydraAudioV3=true;

const KEY='hydra_audio_settings_v3';
const saved=JSON.parse(localStorage.getItem(KEY)||'{}');
const S=Object.assign({enabled:true,volume:.28,ambient:true},saved);
let ctx=null,master=null,ambientBus=null,ambientNodes=null,currentPage=null,lastNav=0;

const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const save=()=>localStorage.setItem(KEY,JSON.stringify(S));

function ensure(){
 if(ctx)return ctx;
 const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;
 ctx=new A();
 master=ctx.createGain();master.gain.value=S.enabled?S.volume:0;master.connect(ctx.destination);
 ambientBus=ctx.createGain();ambientBus.gain.value=S.ambient?.018:0;ambientBus.connect(master);
 return ctx;
}
async function start(){
 const x=ensure();if(!x)return false;
 if(x.state==='suspended')try{await x.resume()}catch{return false}
 if(x.state!=='running')return false;
 if(!ambientNodes)startAmbient();
 return true;
}
function env(g,t,a,d,peak=1){
 g.gain.cancelScheduledValues(t);
 g.gain.setValueAtTime(.0001,t);
 g.gain.exponentialRampToValueAtTime(Math.max(.0001,peak),t+a);
 g.gain.exponentialRampToValueAtTime(.0001,t+a+d);
}
function osc(type,f,t,d,peak=1,dest=master){
 const o=ctx.createOscillator(),g=ctx.createGain();
 o.type=type;o.frequency.setValueAtTime(f,t);
 env(g,t,.008,d,peak);o.connect(g).connect(dest);o.start(t);o.stop(t+d+.03);
 return o;
}
function sweep(type,f1,f2,t,d,peak,dest=master){
 const o=ctx.createOscillator(),g=ctx.createGain();
 o.type=type;o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,f2),t+d);
 env(g,t,.008,d,peak);o.connect(g).connect(dest);o.start(t);o.stop(t+d+.03);
}
function startAmbient(){
 if(ambientNodes||!ctx)return;
 const nodes=[];
 const freqs=[55,82.5,110];
 freqs.forEach((f,i)=>{
  const o=ctx.createOscillator(),g=ctx.createGain();
  o.type=i===1?'triangle':'sine';o.frequency.value=f;g.gain.value=i===0?.035:i===1?.018:.010;
  o.connect(g).connect(ambientBus);o.start();nodes.push(o,g);
 });
 const l=ctx.createOscillator(),lg=ctx.createGain();l.frequency.value=.035;lg.gain.value=7;l.connect(lg);
 nodes[0].detune&&lg.connect(nodes[0].detune);nodes[2].detune&&lg.connect(nodes[2].detune);l.start();nodes.push(l,lg);
 ambientNodes=nodes;
}
const sounds={
 click:async()=>{
  if(!await start())return;
  const t=ctx.currentTime;
  sweep('sine',920,620,t,.055,.055);
  osc('triangle',1380,t+.008,.035,.025);
 },
 hover:async()=>{
  if(!await start())return;
  osc('sine',880,ctx.currentTime,.065,.018);
 },
 open:async()=>{
  if(!await start())return;
  const t=ctx.currentTime;
  sweep('sine',180,360,t,.20,.055);
  osc('triangle',540,t+.07,.18,.028);
  osc('sine',720,t+.12,.24,.022);
 },
 success:async()=>{
  if(!await start())return;
  const t=ctx.currentTime;
  [523.25,659.25,783.99,1046.5].forEach((f,i)=>osc('sine',f,t+i*.055,.34,.045));
  sweep('triangle',260,520,t,.30,.018);
 },
 alert:async()=>{
  if(!await start())return;
  const t=ctx.currentTime;
  [0,.16,.32].forEach((d,i)=>sweep('square',330,250,t+d,.11,.035));
 },
 error:async()=>{
  if(!await start())return;
  const t=ctx.currentTime;
  sweep('sawtooth',210,115,t,.22,.028);
  osc('triangle',145,t+.05,.18,.025);
 },
 boot:async()=>{
  if(!await start())return;
  const t=ctx.currentTime;
  sweep('sine',70,180,t,.42,.045);
  [220,330,440].forEach((f,i)=>osc('triangle',f,t+.12+i*.07,.26,.025));
 },
 navigate:async()=>{
  if(!await start())return;
  const t=ctx.currentTime;
  osc('sine',330,t,.11,.028);
  osc('sine',495,t+.055,.14,.024);
 },
 evidence:async()=>sounds.navigate(),
 finance:async()=>{if(!await start())return;const t=ctx.currentTime;osc('sine',196,t,.18,.035);osc('triangle',294,t+.06,.22,.025)},
 mail:async()=>{if(!await start())return;const t=ctx.currentTime;osc('sine',660,t,.08,.035);osc('sine',880,t+.09,.13,.03)},
 classified:async()=>{if(!await start())return;const t=ctx.currentTime;sweep('triangle',110,75,t,.25,.035)},
 signal:async()=>{if(!await start())return;const t=ctx.currentTime;sweep('sine',480,960,t,.18,.035)},
 radio:async()=>{if(!await start())return;const t=ctx.currentTime;sweep('square',420,280,t,.16,.018)},
 puzzle:async()=>{if(!await start())return;const t=ctx.currentTime;[392,494,587].forEach((f,i)=>osc('triangle',f,t+i*.07,.18,.03))},
 mission:async()=>{if(!await start())return;const t=ctx.currentTime;sweep('sine',65,130,t,.35,.04)},
 terminal:async()=>{if(!await start())return;sweep('square',95,55,ctx.currentTime,.16,.025)}
};
const aliases={docs:'navigate',comms:'navigate',map:'navigate',trust:'navigate',lab:'navigate',surveillance:'alert',news:'navigate',progress:'success',ai:'signal',network:'navigate',drive:'navigate',calendar:'navigate',gallery:'navigate',browser:'navigate',notes:'navigate',forensic:'evidence',intel:'signal',chrono:'navigate',social:'navigate',word:'navigate',sheets:'finance',contacts:'navigate',camera:'alert',qr:'signal',locker:'classified',incidents:'alert',live:'alert',aicore:'signal'};
const pages={overview:'open',indices:'evidence',virements:'finance',mails:'mail',dossiers:'classified',chrono:'chrono',documents:'docs',live:'alert',intel:'intel',classified:'classified',signal:'signal',forensic:'forensic',puzzle:'puzzle',comms:'comms',radio:'radio',map:'map',trust:'trust',incidents:'incidents',lab:'lab',locker:'locker',surveillance:'surveillance',news:'news',progress:'progress',aicore:'aicore',social:'social',word:'word',sheets:'sheets',drive:'drive',calendar:'calendar',contacts:'contacts',notes:'notes',browser:'browser',camera:'camera',photos:'gallery',qr:'signal',mission:'mission',terminal:'terminal'};
const sitePages={index.html:'open',admin.html:'classified',communaute.html:'comms',confidentialite.html:'docs',extension.html:'signal'};

async function tone(kind='click'){if(!S.enabled)return false;const fn=sounds[kind]||sounds[aliases[kind]]||sounds.click;return fn()}
async function chord(page){return tone(pages[page]||'open')}
function setPage(page){
 if(!page||page===currentPage)return;
 currentPage=page;
 if(Date.now()-lastNav>220){chord(page);lastNav=Date.now()}
}
function enabled(v){S.enabled=!!v;save();const x=ensure();if(x)master.gain.setTargetAtTime(S.enabled?S.volume:0,x.currentTime,.06);render()}
function volume(v){S.volume=clamp(Number(v)/100);save();const x=ensure();if(x&&S.enabled)master.gain.setTargetAtTime(S.volume,x.currentTime,.06);render()}
function ambient(v){S.ambient=!!v;save();const x=ensure();if(x&&ambientBus)ambientBus.gain.setTargetAtTime(S.ambient?.018:0,x.currentTime,.2);render()}
function render(){
 const b=document.getElementById('hydraAudioToggle'),r=document.getElementById('hydraAudioVolume'),l=document.getElementById('hydraAudioLabel'),a=document.getElementById('hydraAudioAmbient');
 if(b){b.textContent=S.enabled?'🔊':'🔇';b.setAttribute('aria-label',S.enabled?'Désactiver les sons':'Activer les sons')}
 if(r)r.value=String(Math.round(S.volume*100));
 if(l)l.textContent=Math.round(S.volume*100)+'%';
 if(a){a.textContent=S.ambient?'🌌':'○';a.title=S.ambient?'Désactiver l’ambiance':'Activer l’ambiance'}
}
function ui(){
 if(document.querySelector('.hydra-audio'))return;
 const st=document.createElement('style');st.textContent='.hydra-audio{position:fixed;right:14px;bottom:14px;z-index:100001;display:flex;align-items:center;gap:6px;padding:7px 8px;border:1px solid #304563;border-radius:13px;background:rgba(8,14,24,.94);box-shadow:0 12px 35px #0008}.hydra-audio button{border:1px solid #3b5272;background:#101b2b;color:#eef5ff;border-radius:9px;height:30px;min-width:34px;cursor:pointer}.hydra-audio input{width:70px}.hydra-audio small{color:#8fa5c2;font:700 10px ui-monospace,SFMono-Regular,Consolas,monospace;min-width:30px;text-align:right}@media(max-width:620px){.hydra-audio{right:8px;bottom:8px}.hydra-audio input{width:55px}}';document.head.appendChild(st);
 const h=document.createElement('div');h.className='hydra-audio';h.innerHTML='<button id="hydraAudioToggle" type="button"></button><button id="hydraAudioAmbient" type="button"></button><button id="hydraAudioTest" type="button" title="Tester les nouveaux sons">TEST</button><input id="hydraAudioVolume" type="range" min="0" max="100" step="1"><small id="hydraAudioLabel"></small>';
 document.body.appendChild(h);
 document.getElementById('hydraAudioToggle').onclick=async()=>{if(!S.enabled)enabled(true);await tone('open')};
 document.getElementById('hydraAudioAmbient').onclick=()=>ambient(!S.ambient);
 document.getElementById('hydraAudioTest').onclick=async()=>{if(!S.enabled)enabled(true);await tone('boot');setTimeout(()=>tone('navigate'),420);setTimeout(()=>tone('success'),650)};
 document.getElementById('hydraAudioVolume').oninput=e=>volume(e.target.value);
 render();
}
function detectPage(){
 const active=document.querySelector('[data-vm-section].active,[data-vm-section][aria-current="page"],.vm-start-item.active');
 if(active?.dataset.vmSection)setPage(active.dataset.vmSection);
 else if(currentPage===null){const p=(location.pathname.split('/').pop()||'index.html').toLowerCase();setPage(sitePages[p]||'open')}
}
function bind(){
 document.addEventListener('pointerdown',e=>{
  if(e.target.closest('.hydra-audio')||!S.enabled)return;
  const t=e.target.closest('[data-vm-section],button,.tab,.vm-icon,.vm-task-btn,.mini-btn,.cmd-chip,.forensic-btn');
  if(t)tone('click');
 },{passive:true});
 document.addEventListener('click',e=>{
  const b=e.target.closest('[data-vm-section]');if(b?.dataset.vmSection){setPage(b.dataset.vmSection);return}
  if(e.target.closest('[data-action="success"],[data-success],.success-btn'))tone('success');
  if(e.target.closest('[data-action="alert"],[data-alert],.danger,.alert-btn'))tone('alert');
 },{passive:true});
 document.addEventListener('keydown',e=>{if(S.enabled&&(e.key==='Escape'||e.key==='Enter'))tone('click')},{passive:true});
 const wrap=()=>{if(typeof window.activateHydraTab!=='function'||window.__hydraAudioWrapped)return;const original=window.activateHydraTab;window.activateHydraTab=function(tab,...args){setPage(tab);return original.call(this,tab,...args)};window.__hydraAudioWrapped=true;detectPage()};
 setTimeout(wrap,200);setTimeout(wrap,800);setTimeout(wrap,1800);
}
window.hydraSound=tone;
window.hydraAudio={start,setEnabled:enabled,setVolume:volume,setAmbient:ambient,setPage,state:S,pages};
document.addEventListener('DOMContentLoaded',()=>{ui();bind();setTimeout(detectPage,300);setTimeout(detectPage,900)});
})();