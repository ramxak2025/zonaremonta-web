import { files } from "../.generated/assets.mjs";
import { policyPath, preferencesPath, choicePath, privacyConfig, readChoice, storeChoice, returnPath } from "./consent.js";
import { consentBanner } from "./privacy.js";
import { company, services, serviceUrl, articleUrl, modelUrl, priceRows } from "./business.js";
import { header, footer, dock, esc, asset, brand } from "./ui.js";
import { catalog, validatePriceForm, saveCatalog } from "./prices.js";
import { hasSession, signIn, signOut } from "./admin-auth.js";
import { fuelMcp } from "./fuel-mcp.js";
import { initialFuel, readFuel, refreshFuel, fuelDue, fuelStation } from "./fuel.js";
import { privacyPage,analyticsPreferences,adminLoginPage,models,articles,routes,homePage,servicesPage,servicePage,pricesPage,calcPage,modelsPage,modelPage,vestaDiagnostics,vestaPath,journalPage,articlePage,contactPage,reviewPage,cabinetPage,messagePage } from "./pages.js";

const defaultOrigin="https://zr-auto-gbo.ramxak.chatgpt.site";
const byService=new Map(services.map(s=>[serviceUrl(s),s]));
const byModel=new Map(models.map(m=>[modelUrl(m),m]));
const byArticle=new Map(articles.map(a=>[articleUrl(a),a]));
const commonHeaders={"X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer","X-DNS-Prefetch-Control":"off"};
const infoHeaders={"Content-Security-Policy":"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src 'none'; base-uri 'none'; form-action 'self'; object-src 'none'","Permissions-Policy":"camera=(), microphone=(), geolocation=()"};
function serveAsset(path,req) {
  const f=files[path];if(!f) return new Response("Не найдено",{status:404});
  const h={...commonHeaders,"Content-Type":f.type,"Cache-Control":"public,max-age=31536000,immutable","ETag":f.etag};
  if(req.headers.get("If-None-Match")===f.etag) return new Response(null,{status:304,headers:h});
  if(req.method==="HEAD") return new Response(null,{headers:h});
  const data=Uint8Array.fromBase64?Uint8Array.fromBase64(f.data):Uint8Array.from(atob(f.data),c=>c.charCodeAt(0));
  return new Response(data,{headers:h});
}
function organization(origin){
  return {"@type":"AutoRepair","@id":origin+"/#service-center",name:"Зона Ремонта",alternateName:"ZR AUTO",url:origin+"/",telephone:"+79884444485",image:origin+asset("exterior"),logo:origin+asset("brand-wordmark"),description:"Установка, диагностика, обслуживание и ремонт пропанового ГБО в Махачкале.",address:{"@type":"PostalAddress",addressCountry:"RU",addressRegion:"Республика Дагестан",addressLocality:"Махачкала",streetAddress:"улица Хаджи Булача, 71",postalCode:"367004"},areaServed:{"@type":"City",name:"Махачкала"},geo:{"@type":"GeoCoordinates",latitude:42.95142,longitude:47.53403},openingHoursSpecification:[{"@type":"OpeningHoursSpecification",dayOfWeek:["Monday","Tuesday","Wednesday","Thursday","Saturday","Sunday"],opens:"09:00",closes:"19:00"},{"@type":"OpeningHoursSpecification",dayOfWeek:"Friday",opens:"14:00",closes:"19:00"}],hasMap:company.maps,sameAs:[company.maps]};
}
function metadata(p,origin,path) {
  const canonical=origin+path;
  const imageUrl=origin+asset(p.primaryImage||"hero");
  const graph=[organization(origin)];
  if(p.trail.length>1) graph.push({"@type":"BreadcrumbList",itemListElement:p.trail.map((item,i)=>({"@type":"ListItem",position:i+1,name:item.name,item:origin+item.url}))});
  if(p.service) graph.push({"@type":"Service",name:p.service,serviceType:p.service,description:p.description,url:canonical,provider:{"@id":origin+"/#service-center"},areaServed:"Махачкала"});
  if(p.article) graph.push({"@type":"BlogPosting",headline:p.article.title,description:p.article.summary,datePublished:p.article.published||"2026-11-20T02:09:55+03:00",...(p.article.modified?{dateModified:p.article.modified}:{}),inLanguage:"ru",image:imageUrl,mainEntityOfPage:canonical,author:{"@type":"Organization",name:"Зона Ремонта","@id":origin+"/#service-center"},publisher:{"@id":origin+"/#service-center"},articleSection:p.article.category});
  if(p.faq?.length) graph.push({"@type":"FAQPage",mainEntity:p.faq.map(([q,a])=>({"@type":"Question",name:q,acceptedAnswer:{"@type":"Answer",text:a}}))});
  return `<title>${esc(p.title)}</title><meta name="description" content="${esc(p.description)}"><meta name="robots" content="${p.noindex?"noindex,nofollow":"index,follow,max-image-preview:large"}"><link rel="canonical" href="${esc(canonical)}"><meta property="og:locale" content="ru_RU"><meta property="og:site_name" content="Зона Ремонта"><meta property="og:type" content="${p.article?"article":"website"}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:title" content="${esc(p.title)}"><meta property="og:description" content="${esc(p.description)}"><meta property="og:image" content="${esc(imageUrl)}"><meta name="twitter:card" content="summary_large_image">${p.noindex?"":`<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@graph":graph}).replace(/</g,"\\u003c")}</script>`}`;
}
function render(p,origin,path,status=200,privatePage=false,requestMethod="GET",analytics=null){
  const enabled=Boolean(analytics?.config.counter)&&!privatePage&&status===200;
  const legal=path===policyPath||path===preferencesPath;
  const permitted=enabled&&!legal&&!p.noindex&&analytics.safeLanding&&analytics.choice==="yes";
  const prompt=enabled&&!legal&&!p.noindex&&analytics.safeLanding&&!analytics.choice?consentBanner(analytics.back):"";
  const localControls=enabled?`<script type="module" src="${asset("analytics")}" data-analytics="${permitted?analytics.config.counter:""}"></script>`:"";
  const head=`<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="theme-color" content="#17191a">${metadata(p,origin,path)}<link rel="icon" href="${asset("favicon")}" type="image/png"><link rel="apple-touch-icon" sizes="180x180" href="${asset("touch-icon")}"><link rel="preload" href="${asset("display-cyr")}" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="${asset("styles")}"><script type="module" src="${asset("client")}" data-motion="${asset("motion")}"></script>${localControls}</head>`;
  const mast = privatePage
    ? `<header class="admin-mast"><div class="wrap">${brand()}<nav aria-label="Ссылки для сотрудника"><a href="${policyPath}">Конфиденциальность</a><a href="/">На сайт</a></nav></div></header>`
    : header(path)+dock(path);
  const html=head+`<body id="top">${mast}${prompt}<main id="main">${p.body}</main>${privatePage?"":footer(enabled)}</body></html>`;
  const headers={...commonHeaders,...infoHeaders,"Content-Type":"text/html; charset=utf-8","Content-Language":"ru","Cache-Control":privatePage||enabled||status>=400?"private,no-store":"no-cache"};
  if(permitted){
    for(const directive of ["script-src","img-src","connect-src"]){
      headers["Content-Security-Policy"]=headers["Content-Security-Policy"].replace(directive+" 'self'",directive+" 'self' https://mc.yandex.ru");
    }
  }
  if(privatePage||p.noindex)headers["X-Robots-Tag"]="noindex";
  if(privatePage){
    headers["X-Robots-Tag"]="noindex, nofollow";
    // Native form POSTs need the origin for internal requests.
    headers["Referrer-Policy"]="same-origin";
    headers["X-Frame-Options"]="DENY";
    headers["Content-Security-Policy"]+="; frame-ancestors 'none'";
  }
  return new Response(requestMethod==="HEAD"?null:html,{status,headers});
}
function isOwner(request,env){
  const id=request.headers.get("oai-authenticated-user-id");
  const email=request.headers.get("oai-authenticated-user-email")?.trim().toLowerCase();
  return Boolean(id&&email&&env.ZR_OWNER_EMAIL&&email===env.ZR_OWNER_EMAIL.trim().toLowerCase());
}
async function adminReply(request, env, url, origin) {
  const show = (page, status = 200) => render(page, origin, "/admin/", status, true, request.method);
  const reply = (status, headers = {}) => new Response(null, {status, headers:{
    "Cache-Control":"private,no-store", "X-Robots-Tag":"noindex, nofollow", ...headers
  }});
  const redirect = (location, cookie) => reply(303, cookie ? {Location:location, "Set-Cookie":cookie} : {Location:location});
  const path = url.pathname;
  try {
    if (path === "/admin/") {
      if (!["GET","HEAD"].includes(request.method)) return reply(405, {Allow:"GET, HEAD"});
      if (!await hasSession(request, env)) return show(adminLoginPage());
      const prices = await catalog(env);
      const saved = prices.revision > 0 && url.searchParams.get("saved") === String(prices.revision);
      return show(cabinetPage(prices, saved ? "Цены сохранены. Прайс уже обновлён." : "", saved ? "success" : ""));
    }
    if (!["/admin/login/", "/admin/logout/", "/admin/ceny/"].includes(path)) return reply(404);
    if (request.method !== "POST") return reply(405, {Allow:"POST"});
    if (request.headers.get("Origin") !== url.origin || request.headers.get("Sec-Fetch-Site") === "cross-site") {
      return show(messagePage("Откройте редактор цен ещё раз", "Не удалось подтвердить, откуда отправлена форма. Откройте кабинет и повторите действие.", origin + "/admin/", "Открыть кабинет"), 403);
    }
    if (path === "/admin/logout/") return redirect("/admin/", await signOut(request, env));
    if (path === "/admin/ceny/" && !await hasSession(request, env)) {
      return show(adminLoginPage("Войдите, чтобы изменить прайс."), 401);
    }
    if (request.headers.get("Content-Type")?.split(";")[0].trim() !== "application/x-www-form-urlencoded") return reply(415);
    const limit = path === "/admin/login/" ? 1024 : 4096;
    if (Number(request.headers.get("Content-Length")) > limit) return reply(413);
    const payload = await request.text();
    if (payload.length > limit) return reply(413);
    const form = new URLSearchParams(payload);
    if (path === "/admin/login/") {
      const auth = await signIn(request, env, form);
      if (auth.limited) {
        const response = show(adminLoginPage("Слишком много попыток входа. Попробуйте через несколько минут."), 429);
        response.headers.set("Retry-After", String(auth.limited));
        return response;
      }
      if (!auth.cookie) return show(adminLoginPage("Проверьте логин и пароль."), 401);
      return redirect("/admin/", auth.cookie);
    }
    const data = validatePriceForm(form);
    if (!data) return show(cabinetPage(await catalog(env), "Введите целые суммы от 0 до 9 999 999 ₽ или оставьте поле пустым.", "error"), 422);
    if (!await saveCatalog(env, data)) return show(cabinetPage(await catalog(env), "Прайс изменился в другой вкладке. Проверьте свежие цены и сохраните изменения.", "error"), 409);
    return redirect("/admin/?saved=" + (data.revision + 1));
  } catch {
    return show(messagePage("Кабинет временно недоступен", "Попробуйте открыть редактор ещё раз.", "/admin/", "Открыть кабинет"), 503);
  }
}
async function route(request,env,ctx) {
  const url=new URL(request.url);
  const origin=(env.PUBLIC_ORIGIN||defaultOrigin).replace(/\/$/,"");
  const path=url.pathname;
  if(path===choicePath)return storeChoice(request,env,privacyConfig(env,url),routes);
  if(path==="/mcp")return fuelMcp(request,env,isOwner(request,env));
  if(path.startsWith("/admin/"))return adminReply(request,env,url,origin);
  if(["/admin","/kabinet","/kabinet/"].includes(path)&&(request.method==="GET"||request.method==="HEAD"))return new Response(null,{status:308,headers:{Location:"/admin/","Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}});
  if(request.method!=="GET"&&request.method!=="HEAD")return new Response(null,{status:405,headers:{Allow:"GET, HEAD"}});
  if(path==="/api/toplivo/"){
    const headers={"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Robots-Tag":"noindex"};
    if(request.method==="HEAD")return new Response(null,{headers});
    if(privacyConfig(env,url).domestic){
      const cleanup=env.DB.prepare("DELETE FROM analytics_consent WHERE expires_at<=?").bind(Date.now()).run().catch(()=>{});
      if(ctx?.waitUntil)ctx.waitUntil(cleanup);else await cleanup;
    }
    try{
      const data=await refreshFuel(env.DB,await readFuel(env.DB));
      const station=fuelStation(data.rates);
      return Response.json({station:station.name,source:station.url,...data.rates,checkedAt:data.checkedAt},{headers});
    }catch{return Response.json({error:"Данные АЗС временно недоступны"},{status:503,headers});}
  }
  if(path.startsWith("/a/"))return serveAsset(path,request);
  if(path==="/favicon.ico")return new Response(null,{status:302,headers:{Location:asset("favicon")}});
  const txt=(v,type)=>new Response(request.method==="HEAD"?null:v,{headers:{...commonHeaders,"Content-Type":type+"; charset=UTF-8","Cache-Control":"public,max-age=900"}});
  if(path==="/robots.txt")return txt("User-agent: *\nAllow: /\nSitemap: "+origin+"/sitemap.xml\n","text/plain");
  if(path==="/sitemap.xml")return txt('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+routes.map(p=>"<url><loc>"+esc(origin+p)+"</loc></url>").join("")+"</urlset>","application/xml");
  if(!path.endsWith("/")&&routes.includes(path+"/"))return new Response(null,{status:308,headers:{Location:path+"/"+url.search}});
  if(!routes.includes(path))return render(messagePage("Страница не найдена","Вернитесь на главную или откройте раздел услуг в меню.","/","На главную"),origin,path,404,false,request.method);
  const config=privacyConfig(env,url);
  const choice=await readChoice(env,request,config);
  // Skip analytics on calculator inputs, filters and arbitrary query strings.
  const safeLanding=[...url.searchParams].every(([key,value])=>
    key==="yclid"?/^\d{1,32}$/.test(value):/^utm_(source|medium|campaign|content|term)$/.test(key)&&/^[a-z0-9_-]{1,80}$/i.test(value));
  const analytics={config,choice,safeLanding,back:returnPath(url.pathname+url.search,routes)};
  const show=(p,status=200)=>render(p,origin,path,status,false,request.method,analytics);
  if(path===policyPath)return show(privacyPage(config));
  if(path===preferencesPath)return show(analyticsPreferences(config,choice));
  if(path==="/zhurnal/")return show(journalPage(url.searchParams));
  if(path==="/avtomobili/")return show(modelsPage(url.searchParams));
  if(path==="/kontakty/")return show(contactPage());
  if(path==="/otzyvy/")return show(reviewPage());
  if(byArticle.has(path))return show(articlePage(byArticle.get(path)));
  let c;
  try{c=await catalog(env);}catch{
    if(path==="/ceny/")return show(messagePage("Прайс временно недоступен","Стоимость работ можно уточнить по телефону "+company.phone+".",company.tel,"Позвонить"),503);
    c={revision:0,entries:Object.fromEntries(priceRows.map(p=>[p.key,null])),updated:"2026-09-10"};
  }
  if(path==="/"||path==="/kalkulyator/"){
    let rates=initialFuel;
    try{
      const snapshot=await readFuel(env.DB);
      rates=snapshot.rates;
      if(ctx?.waitUntil&&fuelDue(snapshot))ctx.waitUntil(refreshFuel(env.DB,snapshot).catch(()=>{}));
    }catch{}
    return show(path==="/"?homePage(c,rates):calcPage(c,url.searchParams,rates));
  }
  if(path==="/uslugi/")return show(servicesPage(c));
  if(path==="/ceny/")return show(pricesPage(c));
  if(path===vestaPath)return show(vestaDiagnostics(c));
  if(byService.has(path))return show(servicePage(byService.get(path),c));
  return show(modelPage(byModel.get(path),c));
}
export default {fetch:route};

