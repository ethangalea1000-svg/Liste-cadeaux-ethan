import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const out=path.join(root,"app","web");
const publicFiles=["index.html","communaute.html","confidentialite.html","manifest.webmanifest","sw.js"];
const assetsSrc=path.join(root,"assets");
const assetsOut=path.join(out,"assets");
const telemetrySrc=path.join(root,"app","native-telemetry.js");

fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});
fs.mkdirSync(assetsOut,{recursive:true});

for(const file of publicFiles){
  const src=path.join(root,file);
  if(fs.existsSync(src))fs.copyFileSync(src,path.join(out,file));
}
if(fs.existsSync(assetsSrc)){
  for(const file of fs.readdirSync(assetsSrc)){
    const src=path.join(assetsSrc,file);
    if(fs.statSync(src).isFile())fs.copyFileSync(src,path.join(assetsOut,file));
  }
}

fs.copyFileSync(telemetrySrc,path.join(out,"native-telemetry.js"));

for(const file of fs.readdirSync(out).filter(name=>name.endsWith(".html"))){
  const target=path.join(out,file);
  let html=fs.readFileSync(target,"utf8");
  if(!html.includes('src="native-telemetry.js"')){
    html=html.replace("</head>","<script src="native-telemetry.js"></script></head>");
  }
  fs.writeFileSync(target,html);
}

console.log("Native web bundle prepared:",out);