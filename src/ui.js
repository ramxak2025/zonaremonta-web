import { urls } from "../.generated/urls.mjs";
import { company, reviewStories, displayPrice, serviceUrl, modelUrl, articleUrl } from "./business.js";
import { icon } from "./icons.js";
import { inputs, calculate, resultWords } from "./calc.js";
import { fuelStation } from "./fuel.js";
import { regionPath } from "./regional.js";

export const esc=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export const asset=key=>urls[key];
export const external='target="_blank" rel="noopener noreferrer"';
export const taxDate="20 ноября 2026";
export const photos={
  install:["workshop","Автомобили с открытыми капотами в боксе «Зоны Ремонта»",1050,625],
  diagnostics:["diagnostics","Проверка параметров двигателя на диагностическом ноутбуке",887,700],
  maintenance:["engine","Редуктор, фильтр и газовые магистрали под капотом",1152,804],
  reducer:["engine","Редуктор пропанового ГБО под капотом",1152,804],
  injectors:["installation","Газовые форсунки и подводящие шланги в моторном отсеке",870,635],
  interior:["interior","Салон автомобиля и боковое зеркало у сервиса",700,430],
  detail:["bay-detail","Мастер работает в моторном отсеке",700,430],
  outside:["exterior","Въезд в «Зону Ремонта» на улице Хаджи Булача",900,544],
};
const smallPhotos=new Set(["workshop","diagnostics","engine","installation"]);
export function photo(key, cls="", sizes="(max-width: 700px) 95vw, 380px", eager=false){
  const [name,alt,w,h]=photos[key]??photos.install;
  const separate=smallPhotos.has(name);
  return `<img class="${cls}" src="${asset(separate?name+"-sm":name)}" ${separate?`srcset="${asset(name+"-sm")} 560w, ${asset(name)} ${w}w" sizes="${sizes}"`:""} width="${w}" height="${h}" alt="${esc(alt)}" loading="${eager?"eager":"lazy"}" decoding="async">`;
}
export function brand(){
  return `<a class="brand" href="/" aria-label="Зона Ремонта — главная"><img src="${asset("brand-wordmark")}" width="524" height="250" alt="Зона Ремонта"></a>`;
}
const pricesLink=["Цены","/ceny/","price"];
const storiesLink=["Статьи","/zhurnal/","book"];
const contactsLink=["Контакты","/kontakty/","pin"];
const navLinks=[
  ["Услуги","/uslugi/","wrench"],pricesLink,
  ["Калькулятор","/kalkulyator/","calculator"],["Автомобили","/avtomobili/","car"],
  storiesLink,contactsLink,
];
const mobileTabs=[["Главная","/","home"],storiesLink,pricesLink,contactsLink];
const menuLinks=[
  ...navLinks.filter(link=>!mobileTabs.includes(link)),
  ["Отзывы","/otzyvy/","review"], ["Из городов Дагестана",regionPath,"map"],
];
function current(path,href){
  if(path===href)return ' aria-current="page"';
  return href!=="/"&&path.startsWith(href)?' aria-current="location"':"";
}
function nav(path,links=navLinks,withIcons=false){
  return links.map(([title,href,symbol])=>`<a href="${href}"${current(path,href)}>${withIcons?icon(symbol,19):""}${title}</a>`).join("");
}
export function header(path){
  return `<a href="#main" class="skip">К содержанию</a>
    <header class="header"><div class="wrap head-row">
      <div class="mast-identity">${brand()}<span class="mast-caption"><strong>Центр ГБО</strong> <small>${esc(company.city)}</small></span></div>
      <nav class="desktop-nav" aria-label="Главное меню">${nav(path)}</nav>
      <a class="head-phone" href="${company.tel}">${icon("phone",18)} <span>${company.phone}</span></a>
      <a class="mast-route" href="${esc(company.route)}" ${external} aria-label="Маршрут до «Зоны Ремонта», ${esc(company.city)}, ${esc(company.street)}. Открыть Яндекс Карты">
        <span class="mast-route-face">${icon("map",16)}Маршрут</span>
      </a>
    </div></header>`;
}
export function buttons(dark=false){
  return `<div class="actions"><a class="btn red" href="${company.tel}">${icon("phone",18)}Позвонить</a><a class="btn ${dark?"outline-light":"outline"}" href="${company.whatsapp}" ${external}>${icon("chat",20)}<span><span class="wa-verb">Написать в </span>WhatsApp</span></a></div>`;
}
export function dock(path){
  const withinMenu=menuLinks.some(([,href])=>path.startsWith(href));
  const tabs=mobileTabs.map(([title,href,symbol])=>
    `<a class="dock-item" href="${href}"${current(path,href)}>${icon(symbol,22)}<span>${title}</span></a>`);
  return `<nav class="mobile-dock" aria-label="Нижняя навигация">
    ${tabs.join("")}
    <details class="dock-menu">
      <summary class="dock-item"${withinMenu?' aria-current="location"':""}><span class="menu-glyph">${icon("menu",22)}${icon("close",22)}</span><span>Меню</span></summary>
      <div class="dock-sheet"><div class="dock-sheet-title">Разделы сайта</div>
        <div class="dock-links">${nav(path,menuLinks,true)}</div>
      </div>
    </details>
  </nav>`;
}
export function footer(analyticsEnabled=false){
  return `<footer class="footer" id="footer"><div class="wrap">
    <div class="foot-main">${brand()}
      <div class="foot-contact"><a class="foot-phone" href="${company.tel}" aria-label="Позвонить в Зону Ремонта, ${company.phone}">${company.phone}</a>
        <a class="foot-chat" href="${company.whatsapp}" aria-label="Написать в WhatsApp" ${external}>${icon("chat",19)}<span>WhatsApp</span></a></div>
      <div class="foot-visit"><a class="foot-route" href="${esc(company.route)}" ${external} aria-label="Построить маршрут: ${esc(company.city)}, ${esc(company.street)}">${icon("navigation",15)}${esc(company.city)}, ${esc(company.street)}</a>
        <div class="foot-hours"><span>Пн–чт, сб–вс 09:00–19:00</span><span>Пт 14:00–19:00</span></div></div>
    </div>
    <div class="foot-meta"><small>© ${new Date().getUTCFullYear()} Зона Ремонта</small>
      <nav class="foot-nav" aria-label="Разделы в подвале"><a href="/uslugi/">Услуги</a><a href="/ceny/">Цены</a><a href="/kalkulyator/">Калькулятор</a><a href="/zhurnal/">Статьи</a><a href="/kontakty/">Контакты</a></nav>
      <a class="foot-policy" href="/privacy/">Политика конфиденциальности</a>${analyticsEnabled?'<a class="foot-settings" href="/privacy/analytics/">Настройки аналитики</a>':""}
      <a class="foot-up" href="#top" aria-label="Наверх">${icon("chevron",15)}</a>
    </div>
  </div></footer>`;
}
export function crumbs(items){
  return `<nav class="crumbs" aria-label="Хлебные крошки"><a href="/">Главная</a>${items.map(([label,href])=>`<span class="crumb-sep" aria-hidden="true">/</span>${href?`<a href="${href}">${esc(label)}</a>`:`<span aria-current="page">${esc(label)}</span>`}`).join("")}</nav>`;
}
export const slashes='<span aria-hidden="true" class="slashes"><i></i><i></i></span>';
export const yaMark='<span class="ya-mark" aria-hidden="true">Я</span>';
export const stars='<span class="stars" aria-hidden="true">★★★★★</span>';
export function homeHero(entries){
  const price=displayPrice(entries,"mpi4");
  return `<section class="hero"><div class="hero-visual"><picture><source media="(max-width: 700px)" srcset="${asset("hero-mobile")}"><img src="${asset("hero")}" alt="Мастер «Зоны Ремонта» у Changan с открытым капотом" width="1550" height="705" fetchpriority="high" decoding="async"></picture></div><div class="wrap hero-inner"><div class="hero-copy"><div class="eyebrow">${slashes} <span class="hero-kind">ЦЕНТР ГБО</span> <span class="fine-dot" aria-hidden="true">/</span> С 2014 ГОДА</div><h1>Установка ГБО <br><em>в Махачкале</em></h1><p>Подберём пропановое оборудование под ваш двигатель. Установим, настроим и возьмём на обслуживание.</p><div class="hero-actions">${buttons(true)}</div></div><a class="hero-price" href="/ceny/"><span>Установка на 4 цилиндра</span><strong>${esc(price)}</strong></a></div></section>`;
}
export function proof(){
  return `<div class="trust"><div class="wrap trust-row"><a href="${company.reviews}" ${external} class="trust-item">${yaMark}<div><span class="trust-main">5,0 ${stars}</span><span class="trust-sub">132 оценки в Яндекс Картах</span></div></a><a href="${company.route}" ${external} class="trust-item"><span class="trust-icon">${icon("pin",25)}</span><div><span class="trust-main">Хаджи Булача, 71</span><span class="trust-sub">Махачкала · Построить маршрут</span></div></a><a href="/kontakty/" class="trust-item"><span class="trust-icon">${icon("clock",25)}</span><div><span class="trust-main">09:00–19:00</span><span class="trust-sub">В пятницу с 14:00</span></div></a></div></div>`;
}
export function sectionHead(title,href,label){
  return `<div class="section-head"><h2>${esc(title)}</h2>${href?`<a class="text-link" href="${href}">${esc(label)}</a>`:""}</div>`;
}
export function serviceCard(s,entries){
  return `<a class="service-card" href="${serviceUrl(s)}"><div class="service-image">${photo(s.photo,"reveal-media")}</div><div class="service-body"><h3>${esc(s.name)}</h3><p>${esc(s.short)}</p><div class="card-meta"><span>${esc(displayPrice(entries,s.price))}</span><span class="card-link">Подробнее</span></div></div></a>`;
}
export const articlePhotos={
  "to-gbo-v-taksi":"maintenance","pokupka-avto-s-gbo":"diagnostics",
  "gaz-ubivaet-dvigatel":"maintenance",
  "mashina-troit-na-gazu":"diagnostics","okupaemost-gbo":"install","gbo-na-neposredstvennyy-vprysk":"injectors","gbo-perekhodit-na-benzin":"detail","raskhod-gaza":"interior","to-i-filtry-gbo":"maintenance","kak-vybrat-ballon":"install","reduktor-gbo":"reducer","kak-rabotaet-gbo-4":"injectors",
};
export function articleCard(a,{home=false}={}){
  const sizes=home?"(max-width: 780px) 185px, (max-width: 1280px) 30vw, 400px":undefined;
  return `<a class="journal-card" data-category="${esc(a.category)}" href="${articleUrl(a)}"${home?` aria-label="${esc(a.title)}"`:""}><div class="journal-photo">${photo(articlePhotos[a.slug],"reveal-media",sizes)}</div><div class="journal-meta"><span>${esc(a.category)}</span><span>${esc(a.readTime)} чтения</span></div><h3>${esc(a.title)}</h3><p>${esc(a.summary)}</p></a>`;
}
export function storyCover(a,{article=false,eager=false,home=false}={}){
  const tag=article?"header":"a";
  const heading=article?"h1":home?"h3":"h2";
  const mobileSize=home?"(max-width: 780px) 185px":"(max-width: 700px) 95vw";
  const coverSizes=mobileSize+", (max-width: 1250px) 72vw, 920px";
  const published=a.published && new Intl.DateTimeFormat("ru-RU",{day:"numeric",month:"long",year:"numeric",timeZone:"Europe/Moscow"}).format(new Date(a.published));
  const attributes=article?"":` href="${articleUrl(a)}"${home?` aria-label="${esc(a.title)}"`:""}`;
  return `<${tag} class="story-cover"${attributes}>
    <div class="story-picture">${photo(articlePhotos[a.slug],"reveal-media",coverSizes,eager)}</div>
    <div class="story-cover-copy">
      <div class="story-meta"><span>${esc(a.category)}</span><span>${esc(a.readTime)} чтения</span></div>
      <${heading}>${esc(a.title)}</${heading}>
      ${article?`<span class="story-byline">Мастерская «Зона Ремонта»${published?` · <time datetime="${esc(a.published)}">${esc(published)}</time>`:""}</span>`:`<p>${esc(a.summary)}</p><span class="story-read">${icon("book",17)}Читать статью</span>`}
    </div></${tag}>`;
}
export function modelLinks(models,{compact=false}={}){
  const detail=compact?icon("chevron",15):'<span class="model-detail">Подробнее</span>';
  return `<div class="model-grid">${models.map(m=>`<a class="model-link" href="${modelUrl(m)}" data-category="${esc(m.category)}"><span>${esc(m.name)}</span>${detail}</a>`).join("")}</div>`;
}
export function faq(items){
  return `<div class="faq-list">${items.map(item=>{const [q,a]=Array.isArray(item)?item:[item.q,item.a];return `<details><summary>${esc(q)}${icon("plus",20)}</summary><p>${esc(a)}</p></details>`}).join("")}</div>`;
}
export function reviewsSection(){
  return `<section class="section reviews"><div class="wrap"><div class="section-head"><h2>Что говорят водители</h2><a class="text-link" href="${company.reviews}" ${external}>Все отзывы в Яндексе</a></div><div class="review-grid"><div class="rating-block"><span class="rating-brand">${yaMark} Яндекс Карты</span><div class="rating-number">5,0 ${stars}</div><p>132 оценки · 70 отзывов</p><small>На ${taxDate} года</small></div>${reviewStories.map(r=>`<article class="review"><h3>${esc(r.title)}</h3><p>${esc(r.text)}</p><a href="${company.reviews}" ${external}>Отзывы на Яндекс Картах</a></article>`).join("")}</div></div></section>`;
}
export function contactChannels(){
  return `<div class="contact-channels">
    <a class="contact-channel channel-call" href="${company.tel}">${icon("phone",24)}<strong>Позвонить</strong><small>${esc(company.phone)}</small></a>
    <a class="contact-channel channel-chat" href="${company.whatsapp}" ${external}>${icon("chat",25)}<strong>WhatsApp</strong><small>Написать<span class="channel-recipient"> мастеру</span></small></a>
  </div>`;
}
export function contacts(section=true){
  const tag=section?"section":"div";
  const addressHeading=section?"h3":"h2";
  return `<${tag} class="${section?"section contacts":"contacts standalone"}"><div class="wrap">
    ${section?sectionHead("Как нас найти"):""}
    <div class="contact-panel"><div class="contact-details">
      <span class="minor-title">Адрес сервиса</span>
      <${addressHeading}>Махачкала, <br>Хаджи Булача, 71</${addressHeading}>
      ${section?`<a class="contact-number" href="${company.tel}">${company.phone}</a>`:""}
      <p>Пн–чт, сб–вс · 09:00–19:00<br>Пятница · 14:00–19:00</p>
      <div class="contact-actions"><a class="btn ${section?"red":"outline"}" href="${esc(company.route)}" ${external}>${icon("navigation",18)}Построить маршрут</a>
        ${section?`<a class="text-link" href="${company.whatsapp}" ${external}>WhatsApp</a>`:""}
      </div><a class="contact-region" href="${regionPath}">Как добраться из городов Дагестана</a></div>
      <div class="map-panel">${photo("outside","map-cover","(max-width: 740px) 100vw, 55vw")}
        <a class="map-button" href="${company.maps}" ${external}>${icon("map",19)} Открыть Яндекс Карты</a>
      </div>
    </div></div></${tag}>`;
}
function numberField(key,values) {
  const f=inputs[key],price=key==="install";
  return `<label class="number-field${price?" installation-input":""}"><span>${esc(f.title)}</span><span class="number-wrap"><input type="number" name="${key}" min="${f.min}" max="${f.max}" step="${f.step}" value="${values[key]??""}" inputmode="${price?"numeric":"decimal"}" ${price?'placeholder="Введите сумму"':"required"}><span>${esc(f.unit)}</span></span></label>`;
}
function fuelBoard(rates){
  const station=fuelStation(rates);
  const date=value=>new Intl.DateTimeFormat("ru-RU",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(value+"T12:00:00Z")).replace(/\s*г\.$/,"");
  const amount=n=>new Intl.NumberFormat("ru-RU",{maximumFractionDigits:2}).format(n);
  const sameDay=rates.petrolDate===rates.gasDate;
  const timing=d=>`<time datetime="${esc(d)}">${date(d)}</time>`;
  const cells=[["АИ‑95",rates.petrolPrice,rates.petrolDate],["Пропан",rates.gasPrice,rates.gasDate]].map(([label,p,d])=>
    `<div><dt>${label}</dt><dd>${amount(p)} <small>₽/л</small></dd>${sameDay?"":`<dd class="fuel-date">${timing(d)}</dd>`}</div>`).join("");
  return `<aside class="local-fuel" aria-label="Цены на топливо в Махачкале"><dl>${cells}</dl>
    <p>${esc(station.name)}${sameDay?`<br>Цены за ${timing(rates.petrolDate)}`:""} · <a href="${esc(station.url)}" ${external}>${esc(station.publisher)}</a></p></aside>`;
}
export function calculator(values,entries,rates,standalone=false) {
  const c=calculate(values),r=resultWords(c);
  const heading=standalone?"h1":"h2";
  return `<section id="raschet" class="section calculator ${standalone?"single-calc":""}"><div class="wrap"><div class="calc-layout">
    <div class="calc-form"><div class="section-kicker">${slashes} КАЛЬКУЛЯТОР ГБО</div><${heading}>Когда окупится ГБО?</${heading}>
    <p>Расход бензина можно взять с бортового компьютера.</p>
    <form action="/kalkulyator/#raschet" method="get" data-calc data-petrol="${rates.petrolPrice}" data-gas="${rates.gasPrice}" data-mpi="${entries.mpi4??""}" data-di="${entries.di4??""}">
      <input type="hidden" name="basis" value="${values.automatic?(values.direct?"di":"mpi"):"custom"}">
      <div class="field-grid">${Object.keys(inputs).map(key=>numberField(key,values)).join("")}</div>
      <p class="install-hint">Подставляем цену для 4 цилиндров. Можно ввести стоимость своего комплекта.</p>
      <label class="injection-switch">
        <input type="checkbox" name="direct" role="switch" aria-labelledby="di-label" aria-describedby="di-caption" value="1"${values.direct?" checked":""}>
        <span class="switch-text"><strong id="di-label">Непосредственный впрыск</strong><span id="di-caption"><span class="di-off">Включите, если у вас такой двигатель</span><span class="di-on">95% пропана + 5% АИ‑95 по объёму</span></span></span>
        <span class="switch-track" aria-hidden="true"></span>
      </label>
      <noscript><button class="btn red" type="submit">Рассчитать</button></noscript>
    </form>${fuelBoard(rates)}</div>
    <div class="calc-result" data-results aria-live="polite" aria-atomic="true"><div class="result-info">
      <span class="result-title">Срок окупаемости</span><div class="result-amount payback-term"><b data-r="term">${r.term}</b></div>
      <div class="result-lines"><div><span data-r="monthLabel">${r.monthLabel}</span><strong data-r="month">${r.month}</strong></div>
      <div><span data-r="title">${r.title}</span><strong><span data-r="year">${r.year}</span> ₽</strong></div></div>
      <div class="fuel-bars" data-bars><div class="fuel-bar"><span>На АИ‑95 <b data-r="petrolCost">${r.petrolCost}</b></span><i><em data-bar="petrol" style="transform:scaleX(${c.petrolShare})"></em></i></div>
      <div class="fuel-bar"><span>С ГБО <b data-r="gasCost">${r.gasCost}</b></span><i><em data-bar="gas" style="transform:scaleX(${c.gasShare})"></em></i></div></div>
      <p><span data-r="volumes">${r.volumes}</span>. Расчёт на прогретом моторе. Доли топлива зависят от настройки. ТО оплачивается отдельно.</p>
      <a class="calc-chat" data-calc-chat href="${company.whatsapp}" ${external}>${icon("chat",17)} Обсудить расчёт в WhatsApp</a>
    </div><span class="calc-stripes" aria-hidden="true"></span></div></div></div></section>`;
}
export function nativeCta(title,body){
  return `<aside class="native-cta"><div class="section-kicker">${slashes} ЗОНА РЕМОНТА</div><h2>${esc(title)}</h2><p>${esc(body)}</p>${buttons(true)}</aside>`;
}

