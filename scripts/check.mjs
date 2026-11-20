import assert from "node:assert/strict";
import fs from "node:fs";
import { runInNewContext } from "node:vm";
import { DatabaseSync } from "node:sqlite";
import { gzipSync, brotliCompressSync } from "node:zlib";
import worker from "../dist/server/index.js";
import { urls } from "../.generated/urls.mjs";
import { pbkdf2Sync, randomBytes } from "node:crypto";
import { initialFuel, stationUrl, reserveUrl, parseStation, parseReserve, readFuel, refreshFuel } from "../src/fuel.js";
import { inputs, valuesFrom, calculate, resultWords } from "../src/calc.js";
import { company, priceRows, defaultEntries } from "../src/business.js";

const origin="https://check.invalid";
const db=new DatabaseSync(":memory:");
for(const file of fs.readdirSync("drizzle").filter(f=>f.endsWith(".sql")).sort())db.exec(fs.readFileSync("drizzle/"+file,"utf8"));
const env={PUBLIC_ORIGIN:origin,ZR_OWNER_EMAIL:"owner@example.invalid",DB:{prepare(text){
  const s=db.prepare(text);
  const bind=args=>({bind:(...params)=>bind(params),first:async()=>s.get(...args)??null,run:async()=>({meta:{changes:Number(s.run(...args).changes)}})});
  return bind([]);
}}};
const run=(p,settings={})=>worker.fetch(new Request(origin+p,settings),env,{});
const sitemap=await (await run("/sitemap.xml")).text();
const paths=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
assert.equal(new Set(paths).size,paths.length);
assert(paths.includes("/avtomobili/lada-priora/"));
assert(paths.includes("/uslugi/diagnostika-gbo/lada-vesta/"));
assert(paths.includes("/zhurnal/mashina-troit-na-gazu/"));
const titles=new Set(), descs=new Set(),allInternal=new Set(),reached=new Set(["/"]),outgoing=new Map();
const docs=new Map();
for(const p of paths){
  const response=await run(p);
  assert.equal(response.status,200,p);
  const text=await response.text();
  docs.set(p,text);
  const mast=text.match(/<header class="header">[\s\S]*?<\/header>/)?.[0];
  assert(mast,p+" site header");
  const route=mast.match(/<a class="mast-route" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
  assert.equal(route?.[1].replaceAll("&amp;","&"),company.route,p+" directions link before JavaScript");
  assert.equal(route[2].replace(/<[^>]*>/g,"").trim(),"Маршрут");
  assert(mast.includes("<strong>Центр ГБО</strong>")&&mast.includes("<small>"+company.city+"</small>"),p+" service and city in header");
  assert(!mast.replace(/<[^>]*>/g,"").includes("Хаджи Булача"),p+" compact mobile header");
  const dockMarkup=text.match(/<nav class="mobile-dock"[^>]*>[\s\S]*?<\/nav>/)?.[0];
  assert(dockMarkup&&!dockMarkup.split(">")[0].includes("hidden"),p+" mobile navigation is present before JavaScript");
  const tabs=[...dockMarkup.matchAll(/<a class="dock-item([^"]*)" href="([^"]+)"([^>]*)>[\s\S]*?<span>([^<]+)<\/span><\/a>/g)];
  assert.deepEqual(tabs.map(m=>[m[2],m[4]]),[["/","Главная"],["/zhurnal/","Статьи"],["/ceny/","Цены"],["/kontakty/","Контакты"]],p+" mobile tab order");
  assert(tabs.every(m=>m[1]===""),p+" all four dock links share the same styling");
  assert(!/tel:|wa\.me/.test(dockMarkup),p+" bottom navigation links to contact page");
  for(const [, ,href,attrs] of tabs){
    const selection=href===p?"page":href!=="/"&&p.startsWith(href)?"location":"";
    assert.equal(attrs.match(/aria-current="(\w+)"/)?.[1]||"",selection,p+" selection "+href);
  }
  const inMenu=!p.startsWith("/privacy/")&&!tabs.some(m=>m[3].includes("aria-current"));
  assert.equal(dockMarkup.includes('<summary class="dock-item" aria-current="location">'),inMenu,p+" menu state");
  assert(dockMarkup.includes("<span>Меню</span>"));
  assert(!/\/(?:admin|kabinet|signin-with-chatgpt)|Кабинет сервиса|type="password"/i.test(text),p+" private editor not linked");
  const foot=text.match(/<footer class="footer" id="footer">([\s\S]*?)<\/footer>/)?.[1];
  assert(foot,p+" site footer");
  assert.equal(response.headers.get("Referrer-Policy"),"no-referrer");
  assert.equal(response.headers.get("Set-Cookie"),null);
  assert(!text.includes("mc.yandex.ru")&&!text.includes("data-analytics=")&&!text.includes("map-widget")&&!text.includes("<iframe"));
  for(const match of text.matchAll(/<a [^>]*href="(https:\/\/wa\.me\/[^"]+)"/g))assert.equal(match[1],company.whatsapp,p+" clean WhatsApp link");
  for(const href of [company.tel,company.whatsapp,company.route.replace("&","&amp;"),"/ceny/","/kontakty/","/kalkulyator/","/zhurnal/","/privacy/","#top"]){
    assert(foot.includes('href="'+href+'"'),p+" footer link "+href);
  }
  assert(foot.includes(company.street)&&foot.includes("14:00–19:00")&&foot.includes("09:00–19:00"));
  assert.equal((text.match(/alt="Зона Ремонта"/g)||[]).length,2,p+" header and footer wordmark");
  assert(text.includes(urls["brand-wordmark"])&&text.includes(urls["touch-icon"]),p+" brand assets");
  assert.equal((text.match(/<h1[> ]/g)||[]).length,1,p);
  const title=text.match(/<title>(.*?)<\/title>/s)?.[1];
  const desc=text.match(/<meta name="description" content="([^"]+)"/)?.[1];
  assert(title&&!titles.has(title),p+" duplicate title");
  assert(desc&&!descs.has(desc),p+" duplicate description");
  titles.add(title);descs.add(desc);
  assert(text.includes(`rel="canonical" href="${origin}${p}"`),p+" canonical");
  assert(text.includes('href="tel:+79884444485"')&&text.includes("https://wa.me/79884444485"),p+" contact links");
  const json=JSON.parse(text.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);assert(json["@graph"].length,p);
  const links=new Set();
  for(const match of text.matchAll(/(?:href|src)="(\/[^"/][^"]*|\/)"/g)){
    const link=match[1].split(/[?#]/)[0];allInternal.add(link);links.add(link);
  }
  for(const anchor of text.matchAll(/href="#([^"]+)"/g))assert(text.includes('id="'+anchor[1]+'"'),p+" anchor "+anchor[1]);
  outgoing.set(p,links);
  assert(!text.includes("undefined")&&!text.includes("%%"),p+" missing data");
}
for(const p of reached)for(const link of outgoing.get(p)||[])if(paths.includes(link))reached.add(link);
assert.equal(paths.filter(p=>!reached.has(p)).length,0,"orphan pages");
for(const p of allInternal){
  if(p.startsWith("/a/"))assert.equal((await run(p,{method:"HEAD"})).status,200,p);
  else assert(paths.includes(p),p);
}
const leadUrl="/zhurnal/gaz-ubivaet-dvigatel/";
const fuelUrl="/zhurnal/raskhod-gaza/";
for(const path of ["/","/zhurnal/"]){
  const markup=docs.get(path);
  const first=markup.indexOf('class="story-cover" href="'+leadUrl+'"');
  assert(first>0&&markup.indexOf('href="'+fuelUrl+'"',first)>first,path+" editorial order");
}
const homepage=docs.get("/");
const homeSection=id=>homepage.match(new RegExp('<section [^>]*id="'+id+'"[^>]*>([\\s\\S]*?)</section>'))?.[1]??"";
const stories=homeSection("stati");
const allStories=paths.filter(path=>path.startsWith("/zhurnal/")&&path!=="/zhurnal/");
assert(stories.includes('href="/zhurnal/">Все статьи <span class="story-count">'+allStories.length+'</span>'));
const previews=[...stories.matchAll(/href="(\/zhurnal\/[^"]+\/)"/g)].map(match=>match[1]);
assert.deepEqual(previews,[leadUrl,fuelUrl,"/zhurnal/mashina-troit-na-gazu/","/zhurnal/okupaemost-gbo/"]);
assert(previews.every(path=>allStories.includes(path)));
assert(stories.includes('<h3>Газ убивает двигатель?</h3>'));
const fit=homeSection("podbor");
assert(fit.includes('<h2 id="home-fit-title">Подойдёт ли ГБО на ваш автомобиль?</h2>'));
assert(fit.includes("Примеры подбора")&&fit.includes("даже если вашей машины нет среди примеров"));
assert(fit.includes('href="/avtomobili/"'));
assert.equal(new Set([...fit.matchAll(/href="(\/avtomobili\/[^"]+\/)"/g)].map(m=>m[1])).size,6);
for(const href of [company.whatsapp,company.tel]){
  const index=fit.indexOf('href="'+href+'"');
  assert(index>=0&&index<fit.indexOf("Примеры подбора"),"can ask about any car before browsing examples");
}
assert(docs.get(leadUrl).includes("prinsautogas.com/")&&docs.get(leadUrl).includes("код двигателя"));
assert(docs.get(fuelUrl).includes("48 л ÷ 400 км × 100")&&docs.get(fuelUrl).includes("12 л/100 км"));
assert(docs.get(leadUrl).includes('"@type":"BlogPosting"'));
const contactsMain=docs.get("/kontakty/").split('<main id="main">')[1].split("</main>")[0];
const addressStart=contactsMain.indexOf("Адрес сервиса");
for(const target of ['href="tel:+79884444485"','href="https://wa.me/79884444485"']){
  const i=contactsMain.indexOf(target);
  assert(i>=0&&i<addressStart,"direct contact before street address");
}
assert(contactsMain.includes("Построить маршрут"));
const myths=await (await run("/zhurnal/?tema="+encodeURIComponent("Мифы о ГБО"))).text();
assert(myths.includes('href="'+leadUrl+'"')&&!myths.includes('href="'+fuelUrl+'"'));
assert.equal((await run("/does-not-exist/")).status,404);
assert.equal((await run("/ceny")).status,308);
const ownerHeaders={"oai-authenticated-user-id":"test-owner","oai-authenticated-user-email":"owner@example.invalid"};
const visitorHeaders={"oai-authenticated-user-id":"test-visitor","oai-authenticated-user-email":"client@example.invalid"};
const privatePaths=/\/(?:admin|kabinet)|signin-with-chatgpt/;
assert(!privatePaths.test(sitemap));
assert(!privatePaths.test(await (await run("/robots.txt")).text()));
assert.equal((await run("/kabinet/")).headers.get("Location"),"/admin/");
assert.equal((await run("/admin")).headers.get("Location"),"/admin/");
const testPassword=randomBytes(24).toString("base64url");
const salt=randomBytes(16);
env.ZR_ADMIN_PASSWORD_HASH=salt.toString("hex")+"."+pbkdf2Sync(testPassword,salt,100000,32,"sha256").toString("hex");
const loginPage=await run("/admin/",{headers:ownerHeaders});
assert.equal(loginPage.status,200);
assert.equal(loginPage.headers.get("X-Robots-Tag"),"noindex, nofollow");
assert(loginPage.headers.get("Cache-Control").includes("no-store"));
const privateMarkup=await loginPage.text();
assert(privateMarkup.includes('autocomplete="username"')&&privateMarkup.includes('type="password"')&&!privateMarkup.includes('name="revision"'));
const post=(path,body,headers={})=>run(path,{method:"POST",headers:{Origin:origin,...headers},body});
const login=(password,headers={})=>post("/admin/login/",new URLSearchParams({username:"zr-admin",password}),headers);
assert.equal((await login("wrong")).status,401);
assert.equal((await login(testPassword,{Origin:"https://example.invalid"})).status,403);
const signedIn=await login(testPassword);
assert.equal(signedIn.status,303);
assert.equal(signedIn.headers.get("Location"),"/admin/");
const setCookie=signedIn.headers.get("Set-Cookie");
for(const flag of ["HttpOnly","Secure","SameSite=Strict","Path=/admin/"])assert(setCookie.includes(flag));
const sessionHeaders={Cookie:setCookie.split(";")[0]};
const editorForm=await (await run("/admin/",{headers:sessionHeaders})).text();
assert(editorForm.includes('name="di6"')&&editorForm.includes('name="di8"')&&editorForm.includes('action="/admin/logout/"'));
const initial=defaultEntries();
assert.equal(priceRows.length,9);
for(const key of ["di6","di8"])assert.equal(initial[key],null);
for(const p of ["/ceny/","/uslugi/ustanovka-gbo/"]){
  for(const n of [4,6,8]) assert(docs.get(p).includes("на "+n+" "+(n===4?"цилиндра":"цилиндров")+" с непосредственным впрыском"),p);
}
for(const p of ["/","/kalkulyator/"]){
  const markup=docs.get(p);
  assert.equal((markup.match(/type="number" name="(?:dailyKm|petrolUse|install)"/g)||[]).length,3);
  assert(!markup.includes('name="gasPrice"')&&!markup.includes('name="petrolPrice"'));
  assert(markup.includes('name="direct" role="switch"')&&markup.includes("95% пропана + 5% АИ‑95")&&markup.includes("БензинСтатус"));
}
const form=(values,revision)=>new URLSearchParams(Object.entries({...values,revision}).map(([k,v])=>[k,v??""]));
const save=(body,headers=sessionHeaders)=>post("/admin/ceny/",body,headers);
const modified={...initial,mpi4:48123,maintenance:0};
assert.equal((await save(form(modified,0),visitorHeaders)).status,401);
assert.equal((await save(form(modified,0),{...sessionHeaders,Origin:"https://other.invalid"})).status,403);
assert.equal((await save(form({...modified,mpi4:-5},0))).status,422);
assert.equal((await save(form(modified,0))).status,303);
assert((await (await run("/ceny/")).text()).includes("48 123"));
assert((await (await run("/avtomobili/lada-priora/")).text()).includes("48 123"));
assert((await (await run("/kalkulyator/")).text()).includes('value="48123"'));
assert((await (await run("/uslugi/obsluzhivanie-gbo/")).text()).includes("Бесплатно"));
assert.equal((await save(form(initial,0))).status,409);
assert.equal((await save(form(initial,1))).status,303);
assert.equal((await save(form({...initial,di6:166666,di8:188888},2))).status,303);
assert((await (await run("/ceny/")).text()).includes("188 888"));
const oldValues={...initial};
delete oldValues.di6; delete oldValues.di8;
assert.equal((await save(form(oldValues,3))).status,303);
assert((await (await run("/ceny/")).text()).includes("166 666"));
const logout=await post("/admin/logout/",new URLSearchParams(),sessionHeaders);
assert.equal(logout.status,303);
assert(logout.headers.get("Set-Cookie").includes("Max-Age=0"));
assert.equal((await save(form(initial,4),sessionHeaders)).status,401);
const anotherLogin=await login(testPassword);
const anotherCookie={Cookie:anotherLogin.headers.get("Set-Cookie").split(";")[0]};
db.exec("UPDATE admin_sessions SET expires_at=0");
assert.equal((await save(form(initial,4),anotherCookie)).status,401);
for(let i=0;i<10;i++)assert.equal((await login("wrong")).status,401);
const limited=await login("wrong");
assert.equal(limited.status,429);
assert(Number(limited.headers.get("Retry-After"))>0);
const fuelHtml='<h1>АЗС Asko — проспект Али-Гаджи Акушинского, 34а, Махачкала</h1><h2>Наличие топлива сейчас</h2>АИ-95 2 ₽ 21 ноября<h2 class="title">Цены</h2><div><b>АИ‑95</b>110,00&nbsp;₽ <time>20 ноября</time></div><div>Метан 29 ₽ 20 ноября</div><div><b>Газ</b>47,00 ₽ <time>20 ноября</time></div><h2>История</h2>';
const now=Date.parse("2026-11-20T10:00:00Z");
assert.deepEqual(parseStation(fuelHtml,now),initialFuel);
assert.equal(parseStation(fuelHtml.replace("<b>Газ</b>","<b>Газ (КПГ)</b>"),now),null);
assert.equal(parseStation(fuelHtml.replace("47,00 ₽ <time>20","47,00 ₽ <time>21"),now),null);
const backupHtml='<header><p data-id="35127">Asko №16</p></header><li>Аи-95 : 95 ₽ 2026-11-20</li><li>Газ СПБТ : 46 ₽ 2026-11-20</li>ASKO г. Махачкала, пр-кт Амет-Хана Султана, 11/1<header>Другая АЗС</header>';
assert.deepEqual(parseReserve(backupHtml,now),{...initialFuel,provider:"fuelprice",petrolPrice:95,gasPrice:46});
assert.equal(parseReserve(backupHtml.replace("Газ СПБТ","Метан"),now),null);
const ratesNext={...initialFuel,gasPrice:48};
const fresh=await refreshFuel(env.DB,await readFuel(env.DB),async (url,options)=>{assert.equal(url,stationUrl);assert.equal(options.redirect,"manual");return new Response(fuelHtml.replace("47,00","48,00"));},now);
assert.deepEqual(fresh.rates,ratesNext);
assert(fresh.checkedAt&&fresh.nextAttempt>now);
assert.deepEqual((await readFuel(env.DB)).rates,ratesNext);
let calls=0;
await refreshFuel(env.DB,fresh,async()=>{calls++;},now+1000);
assert.equal(calls,0);
const fail=await refreshFuel(env.DB,fresh,async()=>new Response("offline",{status:503}),fresh.nextAttempt+1);
assert.deepEqual(fail.rates,ratesNext);
assert.equal(fail.checkedAt,fresh.checkedAt);
const older=await refreshFuel(env.DB,fail,async()=>new Response(fuelHtml.replaceAll("20 ноября","19 ноября")),fail.nextAttempt+1);
assert.deepEqual(older.rates,ratesNext);
const ordinary=valuesFrom(new URLSearchParams("dailyKm=100&petrolUse=10&install=100000"),initial,initialFuel);
const base=calculate(ordinary), direct=calculate({...ordinary,direct:true});
const near=(a,b)=>assert(Math.abs(a-b)<1e-7);
near(base.year,365*(10*110-11.5*47));
near(direct.gasLitres/(direct.gasLitres+direct.petrolLitres),0.95);
near(direct.petrolLitres/(direct.gasLitres+direct.petrolLitres),0.05);
near(direct.gasLitres/1.15+direct.petrolLitres,10);
near(direct.year,365*(10*110-direct.gasLitres*47-direct.petrolLitres*110));
assert(direct.month<base.month);
assert.equal(base.months,Math.ceil(100000/base.month));
assert.equal(calculate({...ordinary,gasPrice:140}).months,null);
assert.equal(calculate({...ordinary,dailyKm:0}).year,0);
assert.equal(calculate({...ordinary,install:0}).months,0);
assert.equal(valuesFrom(new URLSearchParams("km=2000"),initial,initialFuel).dailyKm,65.75);
assert.equal(valuesFrom(new URLSearchParams("dailyKm=-1"),initial,initialFuel).dailyKm,inputs.dailyKm.initial);
const autoDi=valuesFrom(new URLSearchParams("direct=1&basis=mpi&install=45000"),initial,initialFuel);
assert.equal(autoDi.install,125000);
assert.equal(valuesFrom(new URLSearchParams("direct=1&basis=custom&install=45000"),initial,initialFuel).install,45000);
const noQuote=calculate(valuesFrom(null,{...initial,mpi4:null},initialFuel));
assert.equal(resultWords(noQuote).term,"Укажите цену");
const rendered=await (await run("/kalkulyator/?direct=1&dailyKm=100&petrolUse=10&install=100000")).text();
assert(rendered.includes('value="1" checked')&&rendered.includes(resultWords(calculate({...ordinary,direct:true,gasPrice:48})).volumes));
assert.equal((await run("/zhurnal/?tema="+encodeURIComponent("Экономия"))).headers.get("X-Robots-Tag"),"noindex");
const mcp=(method,params,headers={})=>run("/mcp",{method:"POST",headers:{"Content-Type":"application/json",...headers},body:JSON.stringify({jsonrpc:"2.0",id:1,method,params})}).then(response=>response.json());
assert((await mcp("tools/list")).result.tools.some(t=>t.name==="record_station_prices"));
const call={name:"record_station_prices",arguments:{...initialFuel,source:stationUrl}};
assert.equal((await mcp("tools/call",call)).result.isError,true);
assert.equal((await mcp("tools/call",call,visitorHeaders)).result.isError,true);
assert.equal((await mcp("tools/call",call,ownerHeaders)).result.isError,false);
assert.equal((await mcp("tools/call",{...call,arguments:{...call.arguments,source:"https://other.invalid"}},ownerHeaders)).result.isError,true);
assert.equal((await mcp("tools/call",{...call,arguments:{...call.arguments,petrolDate:"2026-11-15"}},ownerHeaders)).result.isError,true);
db.prepare("DELETE FROM fuel_board WHERE id=1").run();
const alternate=await refreshFuel(env.DB,await readFuel(env.DB),async url=>url===reserveUrl?new Response(backupHtml):new Response("",{status:520}),now);
assert.equal(alternate.rates.provider,"fuelprice");
assert.equal(alternate.rates.gasPrice,46);
assert(docs.get("/privacy/").includes('href="/privacy/analytics/"'));
assert(!docs.get("/privacy/analytics/").includes("data-consent-form"));
const hostedOrigin="https://zr-auto-gbo.ramxak.chatgpt.site";
const privacyEnv={...env,ZR_OPERATOR_NAME:"Тестовый оператор",ZR_OPERATOR_ADDRESS:"Тестовый адрес",ZR_RF_ORIGIN:origin,ZR_METRIKA_ID:"7654321"};
const sampleRequest=(path,init={})=>worker.fetch(new Request(origin+path,init),privacyEnv,{});
const anotherOrigin=await worker.fetch(new Request(hostedOrigin+"/"),{...privacyEnv,ZR_RF_ORIGIN:hostedOrigin},{});
assert(!(await anotherOrigin.text()).includes("data-consent-form"),"the Sites domain cannot run analytics");
const beforeConsent=await sampleRequest("/?yclid=2356789");
const prompt=await beforeConsent.text();
assert(prompt.includes('value="yes"')&&prompt.includes('value="no"')&&prompt.includes('href="/privacy/analytics/"'));
assert(prompt.includes('name="back" value="/?yclid=2356789"'));
assert.equal(beforeConsent.headers.get("Set-Cookie"),null);
assert(!beforeConsent.headers.get("Content-Security-Policy").includes("mc.yandex.ru"));
const terms=prompt.match(/name="version" value="([^"]+)"/)[1];
const choose=(choice,cookie="",back="/")=>sampleRequest("/privacy/choice/",{method:"POST",headers:{Origin:origin,Cookie:cookie},body:new URLSearchParams({choice,version:terms,back})});
const accepted=await choose("yes","","/?yclid=2356789");
assert.equal(accepted.status,303);
assert.equal(accepted.headers.get("Location"),"/?yclid=2356789");
const receipt=accepted.headers.get("Set-Cookie").split(";")[0];
const withConsent=await sampleRequest("/ceny/",{headers:{Cookie:receipt}});
assert((await withConsent.text()).includes('data-analytics="7654321"'));
assert(withConsent.headers.get("Content-Security-Policy").includes("https://mc.yandex.ru"));
assert(withConsent.headers.get("Cache-Control").includes("private"));
for(const path of ["/admin/","/privacy/","/privacy/analytics/","/kalkulyator/?dailyKm=60","/zhurnal/?tema=example"]){
  const res=await sampleRequest(path,{headers:{Cookie:receipt}});
  assert(!res.headers.get("Content-Security-Policy").includes("mc.yandex.ru"),path+" tracking disabled");
}
assert((await (await sampleRequest("/privacy/analytics/",{headers:{Cookie:receipt}})).text()).includes("Отозвать согласие"));
const withdrawn=await choose("no",receipt,"https://example.invalid/");
assert.equal(withdrawn.status,303);
assert.equal(withdrawn.headers.get("Location"),"/privacy/analytics/");
const refused=withdrawn.headers.get("Set-Cookie").split(";")[0];
for(const cookie of [receipt,refused]){
  const page=await sampleRequest("/",{headers:{Cookie:cookie}});
  assert(!page.headers.get("Content-Security-Policy").includes("mc.yandex.ru"));
  if(cookie===refused)assert(!(await page.text()).includes("data-consent-form"));
}
assert.equal(db.prepare("SELECT COUNT(*) AS n FROM analytics_consent").get().n,0);
const browserModule=fs.readFileSync("src/analytics.js","utf8");
function browserAnalytics(decision) {
  const docHandlers={}, windowHandlers={}, calls=[], scripts=[];
  const pageUrl=new URL("https://check.invalid/ceny/?yclid=58232");
  const doc={
    cookie:decision, referrer:"https://ref.invalid/path?user=private",
    querySelector:()=>({dataset:{analytics:"7654321"}}),
    addEventListener:(name,fn)=>{docHandlers[name]=fn;},
    createElement:()=>({isConnected:false,remove(){this.isConnected=false;}}),
    head:{append(tag){tag.isConnected=true;scripts.push(tag);}},
  };
  const win={ym:(...args)=>calls.push(args),addEventListener:(name,fn)=>{windowHandlers[name]=fn;}};
  runInNewContext(browserModule,{window:win, document:doc, location:pageUrl, URL, Date});
  return {doc,docHandlers,windowHandlers,calls,scripts};
}
for(const cookie of ["",refused])assert.equal(browserAnalytics(cookie).scripts.length,0);
const simulation=browserAnalytics(receipt);
assert.equal(simulation.scripts[0].src,"https://mc.yandex.ru/metrika/tag.js");
simulation.scripts[0].onload();
assert.equal(simulation.calls[0][1],"init");
assert.equal(simulation.calls[0][2].webvisor,false);
assert.equal(simulation.calls[1][1],"hit");
assert.equal(simulation.calls[1][3].referer,"https://ref.invalid");
for(const [href,goal] of [[company.tel,"phone_click"],[company.whatsapp,"whatsapp_click"],[company.route,"route_click"]]){
  simulation.docHandlers.click({target:{closest:()=>new URL(href)}});
  assert.equal(simulation.calls.at(-1)[2],goal);
}
simulation.doc.cookie=refused;
simulation.windowHandlers.storage({key:"zr-analytics-revoked"});
assert.equal(simulation.calls.at(-1)[1],"destruct");
const afterStop=simulation.calls.length;
simulation.docHandlers.click({target:{closest:()=>new URL(company.tel)}});
assert.equal(simulation.calls.length,afterStop);
const appJs=Buffer.from(await (await run(urls.client)).arrayBuffer());
const desktopImg=Buffer.from(await (await run(urls.hero)).arrayBuffer());
const mobileImg=Buffer.from(await (await run(urls["hero-mobile"])).arrayBuffer());
const html=docs.get("/");
console.log(JSON.stringify({pages:paths.length,uniqueTitles:titles.size,internalDestinations:allInternal.size,pricesEditable:priceRows.length,homeHtmlBrotliBytes:brotliCompressSync(Buffer.from(html)).length,initialClientGzipBytes:gzipSync(appJs).length,heroDesktopBytes:desktopImg.length,heroMobileBytes:mobileImg.length},null,2));

