import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { build, transform } from "esbuild";
const root=new URL("../",import.meta.url);
process.chdir(root.pathname);
await fs.mkdir(".generated",{recursive:true});
await fs.mkdir("dist/server",{recursive:true});
await fs.mkdir("dist/.openai",{recursive:true});
const urls={};
const files={};
function insert(key,name,data,type){
  const bytes=Buffer.from(data);
  const hash=createHash("sha256").update(bytes).digest("hex").slice(0,14);
  const url="/a/"+hash+"-"+name;
  urls[key]=url;
  files[url]={type,etag:'"'+hash+'"',data:bytes.toString("base64")};
}
for(const file of (await fs.readdir("public/images")).sort()){
  if(!/\.(webp|png)$/.test(file))continue;
  const ext=path.extname(file);
  insert(path.basename(file,ext),file,await fs.readFile("public/images/"+file),"image/"+ext.slice(1));
}
for(const [key,name] of [["body","inter"],["display","roboto-condensed"]]){
  for(const [tag,language] of [["cyr","cyrillic"],["lat","latin"]]){
    const file=`${name}-${language}-wght-normal.woff2`;
    insert(key+"-"+tag,file,await fs.readFile(`public/fonts/${file}`),"font/woff2");
  }
}
for(const name of ["client","motion","analytics"]){
  const r=await build({entryPoints:[`src/${name}.js`],platform:"browser",target:"es2020",format:"esm",bundle:true,minify:true,write:false,legalComments:"inline"});
  insert(name,name+".js",r.outputFiles[0].contents,"text/javascript; charset=utf-8");
}
const css=(await fs.readFile("src/styles.css","utf8")).replace(/%%([^%]+)%%/g,(_,key)=>{if(!urls[key])throw Error("Unknown asset: "+key);return urls[key];});
const outCss=await transform(css,{loader:"css",minify:true,target:["safari16","chrome108","firefox110"]});
insert("styles","site.css",outCss.code,"text/css; charset=utf-8");
const assetsRoot = "dist/client/a";
await fs.mkdir(assetsRoot, {recursive:true});
for (const [url, file] of Object.entries(files)) {
  await fs.writeFile("dist/client" + url, Buffer.from(file.data, "base64"));
}
for (const old of await fs.readdir(assetsRoot)) {
  if (/^[a-f0-9]{14}-/.test(old) && !files["/a/" + old]) await fs.unlink(path.join(assetsRoot, old));
}
await fs.writeFile("dist/asset-manifest.json",JSON.stringify(urls,null,2)+"\n");
await fs.writeFile(".generated/urls.mjs","export const urls="+JSON.stringify(urls)+";");
await fs.writeFile(".generated/assets.mjs","export const files="+JSON.stringify(files)+";");
await build({entryPoints:["src/worker.js"],outfile:"dist/server/index.js",platform:"browser",format:"esm",bundle:true,legalComments:"none",target:"es2022",minify:true});
await fs.copyFile(".openai/hosting.json","dist/.openai/hosting.json");
console.log(`Built ${Object.keys(files).length} fingerprinted assets and the HTML worker.`);

