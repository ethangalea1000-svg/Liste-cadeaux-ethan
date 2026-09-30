(()=>{'use strict';if(window.__hydraAudioV2)return;window.__hydraAudioV2=true;
const K='hydra_audio_settings_v2',old=JSON.parse(localStorage.getItem('hydra_audio_settings_v1')||'{}'),S=Object.assign({enabled:true,volume:.22,ambient:true},old,JSON.parse(localStorage.getItem(K)||'{}'));
let c=null,m=null,started=false,ambient=null,currentPage=null,lastNav=0,wrapped=false;
const save=()=>localStorage.setItem(K,JSON.stringify(S));
function ensure(){if(c)return c;const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;c=new A();m=c.createGain();m.gain.value=S.enabled?S.volume:0;m.connect(c.destination);return c}
async function start(){const x=ensure();if(!x)return false;if(x.state==='suspended')try{await x.resume()}catch{return false}if(x.state!=='running')return false;if(started)return true;started=true;ambient=createAmbient(x);window.__hydraAudioAmbient=ambient;return true}
function createAmbient(x){const master=x.createGain(),o1=x.createOscillator(),o2=x.createOscillator(),lfo=x.createOscillator(),lg=x.createGain(),now=x.currentTime;master.gain.value=S.ambient?0.010:0;o1.type='sine';o2.type='triangle';o1.frequency.value=55;o2.frequency.value=82.5;lfo.frequency.value=.045;lg.gain.value=5;lfo.connect(lg);lg.connect(o1.detune);lg.connect(o2.detune);o1.connect(master);o2.connect(master);master.connect(m);o1.start(now);o2.start(now);lfo.start(now);return{master,o1,o2,lfo}}

// --- HYDRA MUSIC: local instrumental playlist ---
const BGM=[
 {name:'NEON PULSE',src:'hydra/music/neon-pulse.mp3',rate:1},
 {name:'MIDNIGHT DRIVE',src:'hydra/music/midnight-drive.mp3',rate:.94},
 {name:'DIGITAL RUSH',src:'hydra/music/digital-rush.mp3',rate:1.06}
];
let bgm=null,bgmIndex=0,bgmStarted=false;
function ensureBgm(){
 if(bgm)return bgm;
 bgm=document.createElement('audio');bgm.preload='metadata';bgm.loop=false;bgm.volume=0;
 bgm.setAttribute('aria-hidden','true');document.body.appendChild(bgm);
 bgm.addEventListener('ended',()=>{bgmIndex=(bgmIndex+1)%BGM.length;playBgm()});
 bgm.addEventListener('error',()=>{bgmIndex=(bgmIndex+1)%BGM.length;setTimeout(playBgm,250)});
 return bgm;
}
function playBgm(){
 if(!S.enabled)return;
 const a=ensureBgm(),tr=BGM[bgmIndex];a.src=tr.src;a.playbackRate=tr.rate;a.volume=Math.max(0,Math.min(.12,S.volume*.38));
 a.play().then(()=>{bgmStarted=true;updateTrackLabel()}).catch(()=>{});
}
function nextBgm(){bgmIndex=(bgmIndex+1)%BGM.length;playBgm()}
function updateTrackLabel(){
 const el=document.getElementById('hydraAudioTrack');
 if(el)el.textContent=BGM[bgmIndex].name;
}

const siteThemes={
'index.html':{f:185,a:'open'},'admin.html':{f:110,a:'classified'},'communaute.html':{f:220,a:'comms'},
'confidentialite.html':{f:146.8,a:'docs'},'extension.html':{f:261.6,a:'signal'}
};
function sitePage(){const p=(location.pathname.split('/').pop()||'index.html').toLowerCase();return siteThemes[p]?p:'index.html'}
const pages={
overview:{f:55,a:'open'},indices:{f:165,a:'evidence'},virements:{f:73.4,a:'finance'},mails:{f:220,a:'mail'},dossiers:{f:130.8,a:'classified'},chrono:{f:98,a:'chrono'},documents:{f:146.8,a:'docs'},live:{f:110,a:'alert'},intel:{f:196,a:'intel'},classified:{f:123.5,a:'classified'},signal:{f:261.6,a:'signal'},forensic:{f:185,a:'forensic'},puzzle:{f:329.6,a:'puzzle'},comms:{f:233.1,a:'comms'},radio:{f:293.7,a:'radio'},map:{f:174.6,a:'map'},trust:{f:155.6,a:'trust'},incidents:{f:82.4,a:'alert'},lab:{f:246.9,a:'lab'},locker:{f:138.6,a:'evidence'},surveillance:{f:69.3,a:'surveillance'},news:{f:207.7,a:'news'},progress:{f:277.2,a:'progress'},aicore:{f:311.1,a:'ai'},social:{f:185,a:'network'},word:{f:146.8,a:'docs'},sheets:{f:164.8,a:'finance'},drive:{f:123.5,a:'drive'},calendar:{f:196,a:'calendar'},contacts:{f:220,a:'contacts'},notes:{f:110,a:'notes'},browser:{f:185,a:'browser'},camera:{f:92.5,a:'surveillance'},photos:{f:246.9,a:'gallery'},qr:{f:369.9,a:'signal'},mission:{f:61.7,a:'mission'},terminal:{f:49,a:'terminal'}
};
const presets={
click:[520,.045,'square',.015],open:[220,.10,'sine',.035],success:[660,.14,'sine',.045],alert:[150,.20,'sawtooth',.032],boot:[110,.42,'triangle',.038],
evidence:[330,.18,'triangle',.035],finance:[185,.12,'sine',.03],mail:[440,.09,'sine',.028],intel:[247,.18,'triangle',.03],classified:[123,.22,'sawtooth',.025],
chrono:[196,.16,'sine',.025],docs:[293,.08,'sine',.025],signal:[392,.13,'square',.024],forensic:[260,.18,'triangle',.028],puzzle:[523,.12,'square',.025],
comms:[330,.09,'sine',.024],radio:[294,.12,'square',.02],map:[174,.16,'sine',.024],trust:[208,.12,'triangle',.024],lab:[370,.16,'sine',.026],
surveillance:[98,.22,'sawtooth',.024],news:[277,.10,'sine',.023],progress:[415,.12,'triangle',.024],ai:[311,.20,'sine',.028],network:[220,.12,'square',.022],
drive:[165,.12,'sine',.024],calendar:[247,.10,'sine',.022],gallery:[392,.10,'sine',.022],mission:[82,.30,'triangle',.035],terminal:[73.4,.26,'square',.026],
browser:[262,.10,'sine',.023],notes:[196,.08,'sine',.022]
};
async function tone(k='click',freq){
if(!S.enabled)return false;
const ok=await start();if(!ok)return false;
const x=c;if(!x)return false;
const p=presets[k]||presets.click,n=x.currentTime,f=Number(freq)||p[0];
const o=x.createOscillator(),o2=x.createOscillator(),g=x.createGain(),filt=x.createBiquadFilter();
o.type=p[2];o2.type='sine';o.frequency.setValueAtTime(f,n);o2.frequency.setValueAtTime(f*1.5,n);
filt.type='lowpass';filt.frequency.setValueAtTime(k==='click'?3200:1800,n);filt.Q.value=.7;
g.gain.setValueAtTime(.0001,n);
const dur=p[1];
if(k==='click'){o.frequency.exponentialRampToValueAtTime(f*1.08,n+.035);o2.frequency.exponentialRampToValueAtTime(f*1.9,n+.055)}
if(k==='success'){o.frequency.exponentialRampToValueAtTime(f*1.5,n+dur);o2.frequency.exponentialRampToValueAtTime(f*2,n+dur)}
if(k==='alert'){o.frequency.exponentialRampToValueAtTime(Math.max(55,f*.55),n+dur);o2.frequency.exponentialRampToValueAtTime(Math.max(80,f*.8),n+dur)}
g.gain.exponentialRampToValueAtTime(p[3],n+.012);
g.gain.exponentialRampToValueAtTime(p[3]*.45,n+dur*.55);
g.gain.exponentialRampToValueAtTime(.0001,n+dur);
o.connect(filt).connect(g).connect(m);o2.connect(g);
o.start(n);o2.start(n);o.stop(n+dur+.03);o2.stop(n+dur+.03);
return true}
async function chord(page){const p=pages[page]||pages.overview;await tone(p.a,p.f);setTimeout(()=>tone('click',p.f*1.25),70)}
function setPage(page){if(!page||page===currentPage)return;currentPage=page;const p=pages[page]||pages.overview;start();if(ambient){const n=c.currentTime;ambient.master.gain.cancelScheduledValues(n);ambient.master.gain.setTargetAtTime(S.ambient?.010:0,n,.10);ambient.o1.frequency.setTargetAtTime(p.f,n,.35);ambient.o2.frequency.setTargetAtTime(p.f*1.5,n,.35)}if(Date.now()-lastNav>180){chord(page);lastNav=Date.now()}}
function enabled(v){S.enabled=!!v;save();const x=ensure();if(x)m.gain.setTargetAtTime(S.enabled?S.volume:0,x.currentTime,.04);if(S.enabled)playBgm();else if(bgm)bgm.pause();render()}
function volume(v){S.volume=Math.max(0,Math.min(1,Number(v)/100));save();const x=ensure();if(x&&S.enabled)m.gain.setTargetAtTime(S.volume,x.currentTime,.04);if(bgm)bgm.volume=S.volume*.38;render()}
function render(){const b=document.getElementById('hydraAudioToggle'),r=document.getElementById('hydraAudioVolume'),l=document.getElementById('hydraAudioLabel');if(b){b.textContent=S.enabled?'🔊':'🔇';b.setAttribute('aria-label',S.enabled?'Désactiver les sons':'Activer les sons')}if(r)r.value=String(Math.round(S.volume*100));if(l)l.textContent=Math.round(S.volume*100)+'%'}
function ui(){if(document.querySelector('.hydra-audio'))return;const st=document.createElement('style');st.textContent='.hydra-audio{position:fixed;right:14px;bottom:14px;z-index:100001;display:flex;align-items:center;gap:7px;padding:7px 9px;border:1px solid #304563;border-radius:13px;background:rgba(8,14,24,.92);backdrop-filter:blur(12px);box-shadow:0 12px 35px #0008}.hydra-audio button{border:1px solid #3b5272;background:#101b2b;color:#eef5ff;border-radius:9px;width:34px;height:30px;cursor:pointer}.hydra-audio input{width:76px}.hydra-audio small{color:#8fa5c2;font:700 10px ui-monospace,SFMono-Regular,Consolas,monospace;min-width:30px;text-align:right}@media(max-width:620px){.hydra-audio{right:9px;bottom:9px}.hydra-audio input{width:58px}}';document.head.appendChild(st);const h=document.createElement('div');h.className='hydra-audio';h.innerHTML='<button id="hydraAudioToggle" type="button"></button><button id="hydraAudioNext" type="button" title="Morceau suivant">⏭</button><button id="hydraAudioTest" type="button" title="Tester le son">TEST</button><input id="hydraAudioVolume" type="range" min="0" max="100" step="1"><small id="hydraAudioTrack">NEON PULSE</small><small id="hydraAudioLabel"></small>';document.body.appendChild(h);document.getElementById('hydraAudioToggle').onclick=async()=>{if(!S.enabled)enabled(true);await start();await tone('open',440);setTimeout(()=>tone('success',660),100)};document.getElementById('hydraAudioNext').onclick=()=>nextBgm();document.getElementById('hydraAudioTest').onclick=async()=>{if(!S.enabled)enabled(true);const ok=await start();if(!ok)return;await tone('open',440);setTimeout(()=>tone('success',880),120);setTimeout(()=>tone('click',660),280)};document.getElementById('hydraAudioVolume').oninput=e=>{volume(e.target.value);if(S.enabled)start()};render();updateTrackLabel()}
function detectPage(){const active=document.querySelector('[data-vm-section].active,[data-vm-section][aria-current="page"],.vm-start-item.active');if(active?.dataset.vmSection)setPage(active.dataset.vmSection);else {const t=siteThemes[sitePage()];if(t&&currentPage===null){currentPage=sitePage();start();if(ambient){const n=c.currentTime;ambient.o1.frequency.setTargetAtTime(t.f,n,.35);ambient.o2.frequency.setTargetAtTime(t.f*1.5,n,.35)}tone(t.a,t.f)}}}
function bind(){document.addEventListener('pointerdown',e=>{if(e.target.closest('.hydra-audio'))return;if(!S.enabled)return;const target=e.target.closest('[data-vm-section],button,.tab,.vm-icon,.vm-task-btn,.mini-btn,.cmd-chip,.forensic-btn');if(target)start().then(()=>tone('click'))},{passive:true});document.addEventListener('click',e=>{const b=e.target.closest('[data-vm-section]');if(b?.dataset.vmSection){setPage(b.dataset.vmSection);return}if(e.target.closest('[data-action="success"],[data-success],.success-btn'))tone('success');if(e.target.closest('[data-action="alert"],[data-alert],.danger,.alert-btn'))tone('alert')},{passive:true});document.addEventListener('keydown',e=>{if(!S.enabled)return;if(e.key==='Escape'||e.key==='Enter')start().then(()=>tone('click'))},{passive:true});
 const wrap=()=>{if(wrapped||typeof window.activateHydraTab!=='function')return;const original=window.activateHydraTab;window.activateHydraTab=function(tab,...args){setPage(tab);return original.call(this,tab,...args)};wrapped=true;detectPage()};wrap();setTimeout(wrap,300);setTimeout(wrap,1000);setTimeout(wrap,2000)}
window.hydraSound=tone;window.hydraAudio={start,setEnabled:enabled,setVolume:volume,setPage,state:S,pages};document.addEventListener('DOMContentLoaded',()=>{ui();bind();document.querySelectorAll('[data-vm-section]').forEach(el=>{const id=el.dataset.vmSection;if(id&&!pages[id])pages[id]=pages.overview});setTimeout(detectPage,300);setTimeout(detectPage,800);setTimeout(()=>{if(!bgmStarted&&S.enabled)playBgm()},1200);setTimeout(()=>{if(!currentPage){const t=siteThemes[sitePage()];setPage(t?sitePage():'overview')}},1200)});})();
