(()=>{"use strict";
if(window.__hydraExpansion)return;window.__hydraExpansion=true;
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const toast=m=>window.toast?.(m)||console.info("[HYDRA]",m);

/* ===== TERMINAL CATALOGUE ===== */
const COMMANDS={
HELP:"Affiche la liste des commandes disponibles.",
MAN:"Affiche l’aide détaillée d’une commande : MAN <commande>.",
CLEAR:"Efface l’écran du terminal.",
CLS:"Alias de CLEAR.",
ECHO:"Affiche un texte : ECHO <texte>.",
DATE:"Affiche la date et l’heure de la simulation.",
TIME:"Affiche l’heure de la simulation.",
WHOAMI:"Affiche l’identité de session : MAITRE-DU-JEU.",
PWD:"Affiche le chemin virtuel courant.",
LS:"Liste les fichiers du dossier virtuel courant.",
DIR:"Alias de LS.",
CD:"Change de dossier virtuel : CD <dossier>.",
TREE:"Affiche l’arborescence virtuelle.",
CAT:"Lit un fichier narratif : CAT <fichier>.",
TYPE:"Alias de CAT.",
HEAD:"Affiche le début d’un fichier narratif.",
TAIL:"Affiche la fin d’un fichier narratif.",
GREP:"Recherche un mot dans les fichiers narratifs.",
FIND:"Recherche des fichiers dans le coffre virtuel.",
STAT:"Affiche les métadonnées fictives d’un fichier.",
FILE:"Identifie le type narratif d’un fichier.",
HISTORY:"Affiche l’historique des commandes.",
STATUS:"Affiche l’état de la VM.",
PS:"Liste les processus fictifs de HYDRA-CORE.",
TOP:"Affiche l’activité fictive des processus.",
ENV:"Affiche les variables de session fictives.",
SET:"Définit une variable de session locale.",
UNSET:"Supprime une variable de session locale.",
ALIAS:"Affiche les alias disponibles.",
UPTIME:"Affiche la durée de fonctionnement de la simulation.",
HOSTNAME:"Affiche le nom de la machine virtuelle.",
LOGIN:"Ouvre une session fictive : LOGIN <nom>.",
LOGOUT:"Ferme la session fictive.",
LOCK:"Verrouille l’interface HYDRA.",
APPS:"Liste les applications HYDRA.",
OPEN:"Ouvre une application : OPEN <application>.",
DOSSIERS:"Ouvre les dossiers Hydra.",
EVIDENCE:"Ouvre Evidence Locker.",
MAIL:"Ouvre HYDRA Mail.",
FINANCE:"Ouvre HYDRA Finance.",
BROWSER:"Ouvre HYDRA Browser.",
CAM:"Ouvre HYDRA CAM.",
FILES:"Ouvre l’explorateur de fichiers.",
NOTES:"Ouvre Notes.",
INTEL:"Ouvre Intelligence.",
MIROIR:"Affiche l’état narratif du Protocole Miroir.",
CORE:"Affiche l’état narratif de HYDRA-CORE.",
TRACE:"Affiche une trace narrative : TRACE <mot>.",
SCAN:"Lance une analyse narrative locale : SCAN <mot>.",
PING:"Ping fictif d’un service HYDRA.",
NETWORK:"Affiche la carte réseau fictive.",
MOTD:"Affiche le message du jour.",
ABOUT:"Informations sur HYDRA VM.",
VERSION:"Version de la VM.",
EXIT:"Quitte le terminal (sans quitter la VM)."
};
const FILES={
"README.TXT":"HYDRA VM — environnement narratif local. Toutes les commandes sont simulées.",
"NOTE_INTERNE.TXT":"Suite aux incidents, l’accès aux archives sensibles a été restreint.",
"JOURNAL.LOG":"20:31 Fragment reçu\n21:12 Archive consultée\n21:32 Mouvement financier signalé\n21:47 Corrélation Miroir.",
"ARCHIVE/ORIGINAL.DAT":"Copie narrative de l’archive originale. Statut : CLASSIFIÉ.",
"FINANCE/MIROIR.CSV":"Référence : HYDRA-23MIRROR-021\nMontant : 2 300 000 €\nDestinataire : Structure écran — Miroir Holdings",
"INTELLIGENCE/FRAGMENT-18.TXT":"Zone 2 · traces Alpha · fragment IA 18.",
"INTELLIGENCE/FRAGMENT-21.TXT":"Protocole Miroir · identité de la victime · fragment final.",
"SECURITY/ANOMALIE.LOG":"Anomalie constatée avant l’incident. Chronologie à recouper.",
"DOSSIERS/README.TXT":"Les dossiers sont accessibles depuis l’application Dossiers Hydra."
};
function termPrint(lines){const out=document.querySelector("#terminalOutput");if(!out)return;const prompt=out.querySelector(".term-prompt");for(const line of lines){const d=document.createElement("div");d.className="term-line";d.textContent=line;out.insertBefore(d,prompt)}out.scrollTop=out.scrollHeight}
function virtualPath(p){p=(p||"").trim().replace(/^['"]|['"]$/g,"").replace(/\\/g,"/").toUpperCase();return p}
function commandOutput(raw){
 const parts=raw.trim().split(/\s+/),cmd=(parts.shift()||"").toUpperCase(),arg=parts.join(" ").trim();
 if(!cmd)return[];
 if(cmd==="HELP"){
 const catalog=Array.isArray(window.__hydraTerminalConfig?.catalog)?window.__hydraTerminalConfig.catalog:[];
 if(typeof window.openHydraHelpCatalog==="function"){window.openHydraHelpCatalog("");return[];}
 if(catalog.length){
   const groups={};catalog.forEach(x=>(groups[x.category]??=[]).push(x));
   return ["HYDRA COMMAND CENTER // "+catalog.length+" COMMANDES",...Object.entries(groups).flatMap(([cat,items])=>["","["+cat+"]",...items.flatMap(x=>[String(x.name).toUpperCase(),"  FONCTION : "+String(x.function||x.description||"Commande simulée"),"  PRODUIT  : "+String(x.produces||"Résultat simulé dans la VM."),"  SYNTAXE  : "+String(x.syntax||x.name),""])])];
 }
 return ["HYDRA-SHELL // CHARGEMENT DU CATALOGUE","Le catalogue est en cours de chargement. Tape HELP à nouveau."];
}
if(cmd.startsWith("HELP ")){
 const q=cmd.slice(5).trim().toLowerCase();
 const catalog=Array.isArray(window.__hydraTerminalConfig?.catalog)?window.__hydraTerminalConfig.catalog:[];
 const found=catalog.filter(x=>String(x.name).toLowerCase().includes(q)||String(x.category).toLowerCase().includes(q));
 if(found.length)return ["RECHERCHE HELP : "+q,"",...found.flatMap(x=>["["+x.category+"] "+String(x.name).toUpperCase(),"  FONCTION : "+String(x.function||x.description||"Commande simulée"),"  PRODUIT  : "+String(x.produces||"Résultat simulé dans la VM."),"  SYNTAXE  : "+String(x.syntax||x.name),""])];
 return ["Aucune commande/catégorie trouvée pour : "+q];
}
 if(cmd==="MAN")return COMMANDS[(arg||"HELP").toUpperCase()]?[arg.toUpperCase()+" — "+COMMANDS[(arg||"HELP").toUpperCase()]]:["MAN : commande inconnue. Tape HELP."];
 if(cmd==="CLEAR"||cmd==="CLS"){const o=document.querySelector("#terminalOutput");if(o)o.querySelectorAll(".term-line").forEach(x=>x.remove());return[]}
 if(cmd==="ECHO")return[arg||""];
 if(cmd==="DATE")return[new Date().toLocaleDateString("fr-FR")+" · simulation HYDRA"];
 if(cmd==="TIME")return[new Date().toLocaleTimeString("fr-FR",{hour12:false})];
 if(cmd==="WHOAMI")return["MAITRE-DU-JEU"];
 if(cmd==="PWD")return["/HYDRA"];
 if(cmd==="LS"||cmd==="DIR")return["DOSSIERS/","ARCHIVE/","FINANCE/","INTELLIGENCE/","SECURITY/","README.TXT","JOURNAL.LOG"];
 if(cmd==="TREE")return["/HYDRA","├── DOSSIERS/","├── ARCHIVE/","├── FINANCE/","│   └── MIROIR.CSV","├── INTELLIGENCE/","│   ├── FRAGMENT-18.TXT","│   └── FRAGMENT-21.TXT","├── SECURITY/","│   └── ANOMALIE.LOG","├── README.TXT","└── JOURNAL.LOG"];
 if(cmd==="CAT"||cmd==="TYPE"||cmd==="HEAD"||cmd==="TAIL"){const key=virtualPath(arg);const k=Object.keys(FILES).find(x=>x===key||x.endsWith("/"+key)||x.split("/").pop()===key);return k?FILES[k].split("\n"):["Fichier introuvable dans le système virtuel. Tape FIND <mot>."]}
 if(cmd==="FIND"){const q=(arg||"").toUpperCase();return Object.keys(FILES).filter(x=>!q||x.includes(q)).map(x=>x)||["Aucun résultat."]}
 if(cmd==="GREP"){const q=(arg||"").toLowerCase();return Object.entries(FILES).flatMap(([k,v])=>v.toLowerCase().includes(q)?[k+" : "+v.split("\n").find(l=>l.toLowerCase().includes(q))]:[])||["Aucun résultat."]}
 if(cmd==="STAT"||cmd==="FILE"){const key=virtualPath(arg),k=Object.keys(FILES).find(x=>x===key||x.endsWith("/"+key));return k?[k,"TYPE : document narratif","SOURCE : HYDRA VM","STATUT : simulation locale","TAILLE : "+FILES[k].length+" octets (fiction)"]:["Fichier introuvable."]}
 if(cmd==="HISTORY")return JSON.parse(localStorage.getItem("hydra_terminal_history_v2")||"[]");
 if(cmd==="STATUS")return["HYDRA VM : ONLINE","CORE : ONLINE","MODE : LOCAL SANDBOX","NETWORK : SIMULATED","REAL SYSTEM ACCESS : NONE"];
 if(cmd==="PS"||cmd==="TOP")return["PID 100 · HYDRA-CORE · ACTIVE","PID 120 · MAIL-SERVICE · ACTIVE","PID 140 · EVIDENCE-INDEX · ACTIVE","PID 180 · VM-WINDOWS · ACTIVE","PID 210 · NARRATIVE-ENGINE · ACTIVE"];
 if(cmd==="ENV")return["HYDRA_MODE=LOCAL_SIM","HYDRA_ROLE=GAME_MASTER","HYDRA_NETWORK=SIMULATED","HYDRA_VERSION=2026.09"];
 if(cmd==="SET"){if(!arg.includes("="))return["Usage : SET NOM=VALEUR"];const [k,v]=arg.split("=");localStorage.setItem("hydra_env_"+k.trim(),v.trim());return["Variable "+k.trim()+" définie."]}
 if(cmd==="UNSET"){localStorage.removeItem("hydra_env_"+arg);return["Variable supprimée."]}
 if(cmd==="ALIAS")return["ll = LS","cls = CLEAR","dir = LS","type = CAT"];
 if(cmd==="UPTIME")return["VM active depuis "+Math.floor(performance.now()/1000)+" secondes."];
 if(cmd==="HOSTNAME")return["HYDRA-VM-01"];
 if(cmd==="LOGIN")return["Session fictive ouverte pour "+(arg||"AGENT")+"."];
 if(cmd==="LOGOUT")return["Session terminal fermée. La VM reste active."];
 if(cmd==="LOCK"){document.querySelector("#logoutBtn")?.click();return["Verrouillage demandé."]}
 if(cmd==="APPS")return["Dashboard · Intelligence · Mail · Finance · Browser · Evidence · Files · Terminal · CAM · Notes · Dossiers"];
 if(["DOSSIERS","EVIDENCE","MAIL","FINANCE","BROWSER","CAM","FILES","NOTES","INTEL"].includes(cmd)){const map={DOSSIERS:"dossiers",EVIDENCE:"evidence",MAIL:"mails",FINANCE:"virements",BROWSER:"browser",CAM:"camera",FILES:"documents",NOTES:"notes",INTEL:"intel"};window.activateHydraTab?.(map[cmd],true);return["Application ouverte : "+cmd]}
 if(cmd==="OPEN"){const a=arg.toUpperCase();const map={DOSSIERS:"dossiers",EVIDENCE:"evidence",MAIL:"mails",FINANCE:"virements",BROWSER:"browser",CAM:"camera",FILES:"documents",NOTES:"notes",INTEL:"intel",TERMINAL:"terminal"};if(map[a]){window.activateHydraTab?.(map[a],true);return["Application ouverte : "+a]}return["Application inconnue. Tape APPS."]}
 if(cmd==="MIROIR")return["PROTOCOLE MIROIR : ACTIF","Architecture narrative : identité, preuves et manipulation des traces."];
 if(cmd==="CORE")return["HYDRA-CORE : ONLINE","MODE : ANALYSE NARRATIVE","EXTERNAL AI : OFF"];
 if(cmd==="TRACE"||cmd==="SCAN")return["Analyse locale de : "+(arg||"requête"),"Correspondances : JOURNAL.LOG · FRAGMENT-18 · FINANCE/MIROIR.CSV","Résultat : recoupement disponible dans Intelligence."];
 if(cmd==="PING")return["HYDRA-CORE · 12 ms · SIMULATED","MAIL-SERVICE · 18 ms · SIMULATED","EVIDENCE-INDEX · 9 ms · SIMULATED"];
 if(cmd==="NETWORK")return["HYDRA-CORE","MAIL-SERVICE","EVIDENCE-INDEX","BROWSER-GATEWAY","CAM-SIMULATOR","Tous les nœuds sont fictifs."];
 if(cmd==="MOTD")return["Ne conclue jamais avec un seul indice."];
 if(cmd==="ABOUT")return["HYDRA VM · Poste de contrôle du Maître du Jeu · sandbox narrative locale."];
 if(cmd==="VERSION")return["HYDRA VM 2026.09 · SHELL 2.0"];
 if(cmd==="EXIT")return["Terminal fermé. La VM reste active. Utilise le bureau pour continuer."];
 return ["Commande inconnue : "+cmd+". Tape HELP pour la liste complète."];
}
function installTerminal(){
 const input=document.querySelector("#terminalInput");if(!input||input.dataset.expanded)return;input.dataset.expanded="1";
 input.addEventListener("keydown",e=>{if(e.key!=="Enter")return;e.stopImmediatePropagation();e.preventDefault();const raw=input.value.trim();if(!raw)return;const hist=JSON.parse(localStorage.getItem("hydra_terminal_history_v2")||"[]");hist.push(raw);localStorage.setItem("hydra_terminal_history_v2",JSON.stringify(hist.slice(-100)));termPrint(["> "+raw,...commandOutput(raw)]);input.value=""},true);
 const side=document.querySelector("#termChips");if(side){side.innerHTML=Object.keys(COMMANDS).slice(0,24).map(x=>'<button class="cmd-chip" data-expanded-cmd="'+x+'">'+x+"</button>").join("");side.querySelectorAll("[data-expanded-cmd]").forEach(b=>b.onclick=()=>{input.value=b.dataset.expandedCmd;input.focus()})}
}
 
/* ===== BROWSER DIRECTORY ===== */
const sites=[
["HYDRA Dashboard","https://intra.hydra.local/dashboard","Tableau de bord opérationnel"],
["HYDRA Archive","https://archive.hydra.local","Archives et copies"],
["HYDRA Finance","https://finance.hydra.local","Registre financier"],
["HYDRA Intelligence","https://intel.hydra.local","Graphe de corrélations"],
["HYDRA Mail","https://mail.hydra.local","Messagerie interne"],
["HYDRA Security","https://security.hydra.local","Journal de sécurité"],
["HYDRA News","https://news.hydra.local","Actualités internes"],
["HYDRA Evidence","https://evidence.hydra.local","Coffre de preuves"],
["HYDRA Map","https://map.hydra.local","Carte opérationnelle"],
["HYDRA Core","https://core.hydra.local","État du noyau"],
["HYDRA Docs","https://docs.hydra.local","Documentation"],
["HYDRA Contacts","https://contacts.hydra.local","Annuaire"],
["HYDRA Calendar","https://agenda.hydra.local","Agenda"],
["HYDRA Drive","https://drive.hydra.local","Documents partagés"],
["HYDRA Lab","https://lab.hydra.local","Laboratoire narratif"],
["HYDRA OSINT","https://osint.hydra.local","Recherche de traces"],
["HYDRA CCTV","https://cctv.hydra.local","Surveillance fictive"],
["HYDRA Status","https://status.hydra.local","État des services"],
["GitHub","https://github.com","Code et dépôts publics"],
["MDN Web Docs","https://developer.mozilla.org","Documentation Web"],
["Pix","https://pix.org","Plateforme éducative"],
["Wikipedia","https://fr.wikipedia.org","Encyclopédie"],
["OpenStreetMap","https://www.openstreetmap.org","Cartographie"],
["Supabase","https://supabase.com","Plateforme de données"],
["OpenAI","https://openai.com","Recherche et IA"],
["OWASP","https://owasp.org","Sécurité Web"],
["W3C","https://www.w3.org","Standards du Web"],
["Python Docs","https://docs.python.org/3/","Documentation Python"],
["JavaScript.info","https://javascript.info","Cours JavaScript"],
["Stack Overflow","https://stackoverflow.com","Questions et réponses développeurs"],
["GitLab","https://gitlab.com","Forge Git et CI/CD"],
["npm","https://www.npmjs.com","Packages JavaScript"],
["Can I Use","https://caniuse.com","Compatibilité des fonctionnalités Web"],
["Internet Archive","https://archive.org","Archives du Web"],
["CNIL","https://www.cnil.fr","Protection des données"]
];
function browserRender(url){
 const u=(url||"").trim()||sites[0][1];const match=sites.find(s=>s[1]===u);
 const page=document.querySelector("#browserPage");if(!page)return;
 page.innerHTML='<div class="browser-directory"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><div><b>HYDRA WEB DIRECTORY</b><div class="sub">Sites disponibles dans la simulation</div></div><span class="sim-badge">LOCAL WEB</span></div><input id="hydraSiteSearch" class="input" style="margin:12px 0" placeholder="Rechercher un site…"><div id="hydraSiteGrid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:9px"></div><div id="hydraExternal" style="margin-top:12px"></div></div>';
 const grid=page.querySelector("#hydraSiteGrid"), search=page.querySelector("#hydraSiteSearch");
 const draw=q=>{q=(q||"").toLowerCase();grid.innerHTML=sites.filter(s=>(s[0]+" "+s[2]).toLowerCase().includes(q)).map(s=>'<button class="card hydra-site-card" data-site="'+esc(s[1])+'" style="text-align:left;cursor:pointer"><b>'+esc(s[0])+'</b><div class="sub">'+esc(s[2])+'</div><small>'+esc(s[1])+'</small></button>').join("")};
 draw();search.oninput=()=>draw(search.value);
 grid.addEventListener("click",e=>{const b=e.target.closest("[data-site]");if(!b)return;const s=sites.find(x=>x[1]===b.dataset.site);if(!s)return;document.querySelector("#browserUrl").value=s[1];if(s[1].startsWith("http")&&!s[1].includes(".hydra.local")){page.querySelector("#hydraExternal").innerHTML='<div class="notice"><b>'+esc(s[0])+'</b> est un site externe. <button class="mini-btn" id="hydraOpenExternal">Ouvrir dans un nouvel onglet</button></div>';page.querySelector("#hydraOpenExternal").onclick=()=>window.open(s[1],"_blank","noopener,noreferrer")}else{page.innerHTML='<div class="card"><div class="sub">SITE HYDRA</div><h3>'+esc(s[0])+'</h3><p>'+esc(s[2])+'</p><div class="notice">Simulation locale : '+esc(s[1])+'</div><div class="actions"><button class="mini-btn" id="hydraBackWeb">← Annuaire</button></div></div>';page.querySelector("#hydraBackWeb").onclick=()=>browserRender(sites[0][1])}});
}
function installBrowser(){const u=document.querySelector("#browserUrl"),g=document.querySelector("#browserGo");if(!u||u.dataset.expanded)return;u.dataset.expanded="1";const old=u.value;browserRender(old);if(g){g.onclick=e=>{e.preventDefault();e.stopImmediatePropagation();browserRender(u.value)}}u.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();e.stopImmediatePropagation();browserRender(u.value)}},true)}
 
/* ===== FILE EXPLORER ===== */
function fileWindow(title,content,type){const w=document.createElement("div");w.className="hydra-file-modal";w.innerHTML='<div class="hydra-file-box"><div class="hydra-file-head"><b>'+esc(title)+'</b><button class="mini-btn" data-close>Fermer</button></div><div class="hydra-file-body"></div></div>';document.body.appendChild(w);const body=w.querySelector(".hydra-file-body");if(type==="image"){body.innerHTML='<img style="max-width:100%;max-height:65vh;border-radius:12px" alt="" src="'+content+'">'}else{const pre=document.createElement("pre");pre.textContent=content;pre.style.whiteSpace="pre-wrap";pre.style.maxHeight="65vh";pre.style.overflow="auto";body.appendChild(pre)}w.querySelector("[data-close]").onclick=()=>w.remove()}
async function openLocalFiles(){
 if(window.showOpenFilePicker){try{const handles=await window.showOpenFilePicker({multiple:true});for(const h of handles){const f=await h.getFile();if(f.type.startsWith("image/"))fileWindow(f.name,URL.createObjectURL(f),"image");else fileWindow(f.name,await f.text(),"text")}return}catch(e){if(e.name==="AbortError")return}}
 const inp=document.createElement("input");inp.type="file";inp.multiple=true;inp.accept="*/*";inp.onchange=()=>[...inp.files].forEach(f=>{const r=new FileReader();if(f.type.startsWith("image/")){r.onload=()=>fileWindow(f.name,r.result,"image");r.readAsDataURL(f)}else{r.onload=()=>fileWindow(f.name,r.result,"text");r.readAsText(f)}});inp.click()
}
function installFiles(){
 const section=document.querySelector("#documents");if(!section)return;
 if(!document.querySelector("#hydraFileOpenBtn")){const head=section.querySelector(".section-head");if(head){const b=document.createElement("button");b.id="hydraFileOpenBtn";b.className="btn primary";b.textContent="📂 Ouvrir des fichiers";b.onclick=openLocalFiles;head.appendChild(b)}}
 if(!document.querySelector("#hydraVirtualFiles")){const box=document.createElement("div");box.id="hydraVirtualFiles";box.className="card";box.style.marginTop="12px";box.innerHTML='<div class="panel-title"><h3>📁 Fichiers de la VM</h3><span class="panel-muted">Lecture directe</span></div><div id="hydraVirtualFileGrid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:8px"></div>';section.appendChild(box);const grid=box.querySelector("#hydraVirtualFileGrid");const files=[["README.TXT","HYDRA VM — environnement narratif local. Toutes les commandes sont simulées."],["NOTE_INTERNE.TXT","Suite aux incidents, l’accès aux archives sensibles a été restreint."],["JOURNAL.LOG","20:31 Fragment reçu\n21:12 Archive consultée\n21:32 Mouvement financier signalé\n21:47 Corrélation Miroir."],["FINANCE/MIROIR.CSV","Référence : HYDRA-23MIRROR-021\nMontant : 2 300 000 €\nDestinataire : Structure écran — Miroir Holdings"],["INTELLIGENCE/FRAGMENT-18.TXT","Zone 2 · traces Alpha · fragment IA 18."],["INTELLIGENCE/FRAGMENT-21.TXT","Protocole Miroir · identité de la victime · fragment final."],["SECURITY/ANOMALIE.LOG","Anomalie constatée avant l’incident. Chronologie à recouper."]];grid.innerHTML=files.map((x,i)=>'<button type="button" class="card hydra-vfile" data-vfile="'+i+'" style="text-align:left;cursor:pointer"><b>📄 '+esc(x[0])+'</b><div class="panel-muted">Double-clique ou ouvre pour lire</div></button>').join("");grid.querySelectorAll("[data-vfile]").forEach((b,i)=>b.onclick=()=>fileWindow(files[i][0],files[i][1],"text"))}
 const style=document.createElement("style");style.textContent=".hydra-file-modal{position:fixed;inset:0;z-index:100001;background:rgba(2,6,12,.72);display:grid;place-items:center;padding:18px}.hydra-file-box{width:min(850px,100%);max-height:90vh;overflow:auto;background:#0b1421;border:1px solid #36506f;border-radius:18px;box-shadow:0 30px 90px #000b}.hydra-file-head{display:flex;justify-content:space-between;align-items:center;padding:13px 16px;border-bottom:1px solid #263b55}.hydra-file-body{padding:16px;color:#dce7f7}.hydra-site-card{min-height:80px}";
 document.head.appendChild(style)
}
function installMail(){
 if(document.body.dataset.mailExpansion)return;document.body.dataset.mailExpansion="1";
 document.addEventListener("click",e=>{const b=e.target.closest("#replyMailBtn");if(!b)return;e.preventDefault();e.stopImmediatePropagation();const reader=document.querySelector("#mailReader");if(!reader)return;
 const subject=(reader.querySelector(".mail-reader-subject")?.textContent||"").replace(/^★\s*/,"");const from=(reader.querySelector(".mail-reader-meta")?.textContent.match(/De\s*:\s*([^\n]+)/)||[])[1]?.trim()||"Agent Hydra";const original=reader.querySelector(".mail-reader-body")?.textContent||"";
 document.querySelector("#mailList").classList.remove("hidden");reader.classList.add("hidden");
 document.querySelector("#mailList").innerHTML='<div class="mail-compose"><div class="sub">RÉPONSE · SIMULATION</div><input id="hydraReplyTo" class="input" value="'+esc(from)+'"><input id="hydraReplySubject" class="input" style="margin-top:8px" value="'+esc(/^RE:/i.test(subject)?subject:"RE: "+subject)+'"><textarea id="hydraReplyBody" class="input" style="margin-top:8px;min-height:180px" placeholder="Écris ta réponse…"></textarea><details style="margin-top:9px"><summary>Afficher le message précédent</summary><pre style="white-space:pre-wrap">'+esc(original)+'</pre></details><div class="actions" style="margin-top:10px"><button class="btn primary" id="hydraSendReply">Envoyer</button><button class="btn" id="hydraCancelReply">Annuler</button></div><div class="notice" style="margin-top:10px">Simulation locale : aucun vrai e-mail n’est envoyé.</div></div>';
 document.querySelector("#hydraReplyBody").focus();
 const restoreInbox=()=>{reader.classList.remove("hidden");document.querySelector("#mailList").classList.remove("hidden");if(typeof window.renderMails==="function")window.renderMails();else location.reload();};
 document.querySelector("#hydraCancelReply").onclick=restoreInbox;
 document.querySelector("#hydraSendReply").onclick=()=>{const extra=JSON.parse(localStorage.getItem("hydra_mail_extra")||"[]");const body=document.querySelector("#hydraReplyBody").value.trim();const to=document.querySelector("#hydraReplyTo").value.trim();const subj=document.querySelector("#hydraReplySubject").value.trim();if(!body){toast("Écris un message avant l’envoi.");document.querySelector("#hydraReplyBody").focus();return}extra.push({id:"sent-"+Date.now(),folder:"sent",important:false,unread:false,from:"Ethan",to,folderLabel:"sent",subject:subj,preview:body.slice(0,100),time:new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}),avatar:"E",body:"À : "+to+"\n\n"+body});localStorage.setItem("hydra_mail_extra",JSON.stringify(extra));toast("Réponse enregistrée dans Messages envoyés.");reader.classList.remove("hidden");document.querySelector("#mailList").classList.remove("hidden");if(typeof window.renderMails==="function"){window.renderMails();document.querySelector('[data-folder="sent"]')?.click()}else location.reload()};
 },true)
}
function boot(){installTerminal();installBrowser();installFiles();installMail()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(boot,700));else setTimeout(boot,700);
})();