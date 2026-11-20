import http from "node:http";
import fs from "node:fs";

import { DatabaseSync } from "node:sqlite";
import { execFileSync } from "node:child_process";
execFileSync(process.execPath,["scripts/build.mjs"],{stdio:"inherit"});
const {default:worker}=await import("../dist/server/index.js");
fs.mkdirSync(".sites-runtime",{recursive:true});
const db=new DatabaseSync(".sites-runtime/preview.sqlite");
db.exec("CREATE TABLE IF NOT EXISTS preview_migrations (name TEXT PRIMARY KEY)");
const applied=db.prepare("SELECT 1 FROM preview_migrations WHERE name=?");
for(const file of fs.readdirSync("drizzle").filter(name=>name.endsWith(".sql")).sort()){
  if(applied.get(file))continue;
  const existingBase=file==="0000_catalog.sql"&&db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='price_catalog'").get();
  db.exec("BEGIN");
  try{
    if(!existingBase)db.exec(fs.readFileSync("drizzle/"+file,"utf8"));
    db.prepare("INSERT INTO preview_migrations(name) VALUES (?)").run(file);
    db.exec("COMMIT");
  }catch(error){db.exec("ROLLBACK");throw error;}
}
export function dbAdapter(sqlite){
  return {prepare(sql){
    const stmt=sqlite.prepare(sql);
    const wrap=(args)=>({bind:(...values)=>wrap(values),first:async()=>stmt.get(...args)??null,run:async()=>({meta:{changes:Number(stmt.run(...args).changes)}})});
    return wrap([]);
  }};
}
const argc=process.argv.slice(2);
const arg=(key)=>{const n=argc.indexOf(key);return n<0?undefined:argc[n+1];};
const port=Number(arg("--port")||process.env.PORT||5173);
const hostname=arg("--host")||"0.0.0.0";
const env={DB:dbAdapter(db)};
for(const key of ["PUBLIC_ORIGIN","ZR_ADMIN_PASSWORD_HASH","ZR_OPERATOR_NAME","ZR_OPERATOR_ADDRESS","ZR_RF_ORIGIN","ZR_METRIKA_ID"])env[key]=process.env[key];
const server=http.createServer(async(req,res)=>{
  try{
    const url=(env.PUBLIC_ORIGIN||("http://"+req.headers.host)).replace(/\/$/,"")+req.url;
    const requested=new URL(url);
    if(requested.pathname==="/_preview/mobile/"){
      const width=Number(requested.searchParams.get("width"))||390;
      const size=Math.min(1024,Math.max(320,width));
      const height=Math.min(1366,Math.max(320,Number(requested.searchParams.get("height"))||844));
      res.writeHead(200,{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store"});
      res.end(`<!doctype html><html lang="ru"><title>Проверка мобильной вёрстки</title><style>body{margin:0;background:#303233;display:grid;place-items:center;height:100vh}iframe{border:0;width:${size}px;height:min(${height}px,98vh);background:white}</style><iframe src="/" title="Мобильный сайт"></iframe></html>`);
      return;
    }
    const chunks=[];for await(const chunk of req)chunks.push(chunk);
    const body=chunks.length?Buffer.concat(chunks):undefined;
    const request=new Request(url,{method:req.method,headers:req.headers,body});
    const response=await worker.fetch(request,env);
    res.writeHead(response.status,Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  }catch(error){
    console.error(error.message);
    res.writeHead(500);res.end("Preview error");
  }
});
server.listen(port,hostname,()=>console.log(`Local: http://${hostname}:${port}/`));

