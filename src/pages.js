import content from "./content.json";
import { policyBody, preferencesBody } from "./privacy.js";
import { policyPath, preferencesPath } from "./consent.js";
import { company, priceRows, installKeys, services, displayPrice, serviceUrl, modelUrl, articleUrl, cash } from "./business.js";
import { esc, asset, photo, external, homeHero, proof, buttons, sectionHead, serviceCard, articleCard, storyCover, contactChannels, modelLinks, faq, reviewsSection, contacts, calculator, nativeCta, crumbs, slashes, articlePhotos, photos } from "./ui.js";
import { icon } from "./icons.js";
import { valuesFrom } from "./calc.js";
import { cityRoutes, regionPath } from "./regional.js";
import { serviceDetails } from "./service-details.js";
export const {models,articles}=content;
export const vestaPath="/uslugi/diagnostika-gbo/lada-vesta/";
const bySlug=(list,slug)=>list.find(a=>a.slug===slug);
const homeModelSlugs=new Set(["lada-priora","lada-vesta","lada-granta","hyundai-solaris","toyota-camry","changan-cs55-plus"]);
const homeCrumb={name:"Главная",url:"/"};
export const routes=["/","/uslugi/","/ceny/","/kalkulyator/","/avtomobili/","/zhurnal/","/otzyvy/","/kontakty/",policyPath,preferencesPath,vestaPath,regionPath,...serviceDetails.map(item=>item.path),...services.map(serviceUrl),...models.map(modelUrl),...articles.map(articleUrl)];
const introBlock=(title,paragraph)=>`<div class="page-intro"><h1>${esc(title)}</h1>${paragraph?`<p>${esc(paragraph)}</p>`:""}</div>`;
function page(title,description,body,trail=[],extra={}){
  return {title,description,body,trail:[homeCrumb,...trail.map(([name,url])=>({name,url}))],...extra};
}
function kindLinks(slugs){
  const entries=slugs.map(slug=>bySlug(articles,slug)).filter(Boolean);
  return `<div class="read-next">${entries.map(a=>`<a href="${articleUrl(a)}"><span>${esc(a.title)}</span><small>${esc(a.category)}</small></a>`).join("")}</div>`;
}
function sourceList(sources) {
  return sources?.length?`<details class="source-list"><summary>Источники и руководства ${icon("chevron",16)}</summary><ul>${sources.map(s=>`<li><a href="${esc(s.url)}" ${external}>${esc(s.name)}</a></li>`).join("")}</ul></details>`:"";
}
function priceTable(entries,keys){
  const rows=keys?priceRows.filter(p=>keys.includes(p.key)):priceRows;
  return `<div class="price-list">${rows.map(p=>`<div class="price-row"><div><strong>${esc(p.name)}</strong><span>${esc(p.detail)}</span></div><b>${esc(displayPrice(entries,p.key))}</b></div>`).join("")}</div>`;
}
function relatedFooter(slugs,title="По этой теме"){
  return `<section class="related"><h2>${esc(title)}</h2>${kindLinks(slugs)}</section>`;
}
function asidePanel(label,paragraph,price){
  return `<aside class="side-panel"><div class="section-kicker">${slashes} ЦЕНТР ГБО</div><h2>${esc(label)}</h2>${price?`<strong class="side-price">${esc(price)}</strong>`:""}<p>${esc(paragraph)}</p><a class="btn red" href="${company.tel}">${icon("phone",18)} ${company.phone}</a><a class="side-chat" href="${company.whatsapp}" ${external}>${icon("chat",18)}Написать в WhatsApp</a></aside>`;
}
export function homePage(c,rates) {
  return page("Установка ГБО в Махачкале, цены и диагностика | Зона Ремонта","Установка газа на авто, диагностика и обслуживание ГБО в Махачкале для водителей со всего Дагестана. Цены по двигателю, калькулятор и маршрут на Хаджи Булача, 71.",`${homeHero(c.entries)}${proof()}
  <section class="section services-home"><div class="wrap">${sectionHead("Услуги и цены","/ceny/","Весь прайс")}<div class="service-grid">${services.slice(0,3).map(s=>serviceCard(s,c.entries)).join("")}</div><div class="service-foot"><span>Нужен ремонт редуктора или форсунок?</span> <a class="text-link" href="/uslugi/remont-gbo/">Ремонт ГБО</a></div></div></section>
  ${calculator(valuesFrom(null,c.entries,rates),c.entries,rates)}
  <section class="section models-home" id="podbor" aria-labelledby="home-fit-title">
    <div class="wrap two-section">
      <div class="fit-intro">
        <h2 id="home-fit-title">Подойдёт ли ГБО на ваш автомобиль?</h2>
        <p>Напишите марку, модель и год выпуска. Мастер проверит совместимость по двигателю, даже если вашей машины нет среди примеров.</p>
        <div class="fit-actions">
          <a class="btn red" href="${company.whatsapp}" ${external} aria-label="Спросить в WhatsApp">${icon("chat",19)}<span><span class="fit-verb">Спросить в </span>WhatsApp</span></a>
          <a class="fit-call" href="${company.tel}">${icon("phone",16)}Позвонить</a>
        </div>
      </div>
      <div class="fit-examples">
        <div class="fit-examples-head"><h3>Примеры подбора</h3><a class="fit-directory" href="/avtomobili/">Все разборы ${icon("chevron",14)}</a></div>
        ${modelLinks(models.filter(m=>homeModelSlugs.has(m.slug)),{compact:true})}
      </div>
    </div>
  </section>
  <section class="section journal-home" id="stati" aria-labelledby="home-journal-title">
    <div class="wrap">
      <div class="home-journal-head">
        <h2 id="home-journal-title">Журнал о ГБО</h2>
        <a class="journal-all" href="/zhurnal/">Все статьи <span class="story-count">${articles.length}</span>${icon("chevron",15)}</a>
      </div>
      <div class="home-journal-grid" role="group" aria-labelledby="home-journal-title">
        ${storyCover(articles[0],{home:true})}
        ${articles.slice(1,4).map(a=>articleCard(a,{home:true})).join("")}
      </div>
    </div>
  </section>
  ${reviewsSection()}${contacts()}`,[],{home:true,primaryImage:"hero"});
}
export function servicesPage(c){
  return page("Услуги центра ГБО в Махачкале | Зона Ремонта","Установка и настройка пропанового ГБО, диагностика, ремонт и плановое обслуживание газового оборудования в Махачкале.",`<section class="section inner-page"><div class="wrap">${crumbs([["Услуги"]])}${introBlock("Услуги центра ГБО","Выберите работы по своей задаче. Стоимость конкретного комплекта или ремонта мастер уточнит по автомобилю.")}<div class="service-grid four">${services.map(s=>serviceCard(s,c.entries)).join("")}</div><section class="service-directory"><h2>Работы по оборудованию</h2>${workLinks(serviceDetails.map(item=>[item.name,item.path]))}</section></div></section>`,[["Услуги","/uslugi/"]]);
}
export function servicePage(s,c){
  const trail=[["Услуги","/uslugi/"],[s.name,serviceUrl(s)]];
  const list=s.key==="installation"?installKeys:[s.price];
  const mpi=c.entries.mpi4;
  const installationPrice=Number.isInteger(mpi)&&mpi>0?` Для 4 цилиндров с распределённым впрыском — ${displayPrice(c.entries,"mpi4")}.`:"";
  const descriptions={
    installation:"Установка газа на автомобиль в Махачкале."+installationPrice+" Подбор по двигателю, варианты баллона и стоимость монтажа.",
    diagnostics:"Компьютерная диагностика ГБО в Махачкале. Проверим, почему машина троит на газу, дёргается, расходует больше пропана или переключается на бензин.",
    maintenance:"Техническое обслуживание пропанового ГБО в Махачкале. Замена газовых фильтров, проверка герметичности и параметров системы по регламенту комплекта.",
    repair:"Ремонт газового оборудования автомобиля в Махачкале. Проверка редуктора, газовых форсунок и подачи пропана, подбор деталей под установленное ГБО."
  };
  return page(`${s.name} в Махачкале — цены и условия | Зона Ремонта`,descriptions[s.key],`<article class="inner-page"><div class="wrap">${crumbs([trail[0],[s.name]])}<div class="article-grid"><div class="article-main">${introBlock(s.name+" в Махачкале",s.intro)}<div class="detail-image">${photo(s.photo,"","(max-width: 820px) 95vw, 740px",true)}</div><div class="prose"><h2>Как проходят работы</h2>${s.steps.map(([h,p])=>`<h3>${esc(h)}</h3><p>${esc(p)}</p>`).join("")}<h2>Стоимость</h2>${priceTable(c.entries,list)}<p><a href="/ceny/">Полный прайс сервиса</a></p>${s.key==="diagnostics"?`<p><a href="${vestaPath}">Диагностика ГБО на Ладе Весте</a></p>`:""}<h2>Подробнее об услуге</h2>${workLinks(serviceDetails.filter(item=>item.parent===s.key).map(item=>[item.name,item.path]))}<h2>Частые вопросы</h2>${faq(s.faq)}${relatedFooter(s.related)}</div></div>${asidePanel("Обсудить с мастером","Позвоните или отправьте в WhatsApp модель автомобиля и краткое описание задачи.",displayPrice(c.entries,s.price))}</div></div></article>`,trail,{service:s.name,faq:s.faq,primaryImage:({install:"workshop",diagnostics:"diagnostics",maintenance:"engine",reducer:"engine"})[s.photo]});
}
function workLinks(links){
  return `<ul class="work-links">${links.map(([label,href])=>`<li><a href="${esc(href)}">${esc(label)}</a></li>`).join("")}</ul>`;
}

export function serviceDetailPage(item,c){
  const parent=services.find(service=>service.key===item.parent);
  const trail=[["Услуги","/uslugi/"],[parent.name,serviceUrl(parent)],[item.name,item.path]];
  const parts=item.sections.map(([name,body])=>`<section><h2>${esc(name)}</h2><p>${esc(body)}</p></section>`).join("");
  const body=`<article class="section inner-page"><div class="wrap">
    ${crumbs([trail[0],trail[1],[item.name]])}
    <div class="article-grid"><div class="article-main">
      ${introBlock(item.title,item.intro)}
      <div class="prose">${parts}<section><h2>Стоимость в Махачкале</h2><p>${esc(item.priceNote)}</p>
        ${priceTable(c.entries,item.priceKeys)}<p><a href="/ceny/">Открыть весь прайс</a></p>
      </section><h2>По вашей задаче</h2>${workLinks(item.links)}
        ${item.source?sourceList([{name:item.source[0],url:item.source[1]}]):""}
        <p><a href="${regionPath}">Как приехать в мастерскую из своего города</a></p>
      </div>
    </div>${asidePanel("Уточнить у мастера","Махачкала, Хаджи Булача, 71. Расскажите, какой у вас автомобиль и что нужно сделать до поездки в сервис.","")}</div>
  </div></article>`;
  return page(item.title+" | Зона Ремонта",item.description,body,trail,{service:item.name,primaryImage:photos[parent.photo][0]});
}

export function regionPage(){
  const routes=cityRoutes.map(([name,from,start])=>{
    const route=new URL(company.route);
    route.searchParams.set("rtext",start+"~"+company.destination);
    return `<li><a href="${esc(route.href)}" ${external} aria-label="Маршрут из ${esc(from)} до мастерской в Яндекс Картах"><span>${esc(name)}</span>${icon("navigation",18)}</a></li>`;
  }).join("");
  const body=`<article class="inner-page section"><div class="wrap">
    ${crumbs([["Дагестан"]])}
    ${introBlock("Установка и обслуживание ГБО в Дагестане","Мастерская находится в Махачкале, на улице Хаджи Булача, 71. Если вы едете из другого города, заранее уточните комплект, стоимость и свободное время по телефону или в WhatsApp.")}
    <div class="article-grid"><div class="article-main">
      <section class="city-directions"><h2>Из какого города вы едете?</h2>
        <p>Яндекс Карты построят маршрут от центра выбранного города до сервиса. Точку выезда можно изменить в картах.</p>
        <ul class="city-routes">${routes}</ul>
        <a class="text-link" href="${esc(company.route)}" ${external}>Маршрут от моего местоположения</a>
      </section>
      <div class="prose">
        <h2>Если хотите поставить газ</h2>
        <p>Сообщите модель, год, объём и мощность двигателя. Для непосредственного впрыска пригодится код мотора. Уточним совместимость, предложим вариант баллона и согласуем время и стоимость до выезда.</p>
        ${workLinks([["Установка ГБО в Махачкале","/uslugi/ustanovka-gbo/"],["Цены для 4, 6 и 8 цилиндров","/ceny/"],["Рассчитать окупаемость по пробегу","/kalkulyator/"]])}
        <h2>Если газ уже установлен</h2>
        <p>Для планового ТО пришлите название системы и пробег после замены фильтров. Если мотор дёргается или уходит на бензин, уточните, случается ли это на холодную или после прогрева. Мастер подскажет, какой специалист и сколько времени понадобятся.</p>
        ${workLinks([["ТО и замена фильтров","/uslugi/obsluzhivanie-gbo/zamena-filtrov/"],["Диагностика ГБО","/uslugi/diagnostika-gbo/"],["Ремонт газового оборудования","/uslugi/remont-gbo/"]])}
        <h2>Когда приезжать</h2><p>В понедельник–четверг, субботу и воскресенье мастерская открыта с 09:00 до 19:00. В пятницу — с 14:00 до 19:00. Если дорога дальняя, до выезда уточните наличие нужных деталей и время приёма.</p>
        <p><a href="/kontakty/">Телефон, WhatsApp и фотография въезда</a></p>
      </div>
    </div>${asidePanel("Согласовать поездку","Позвоните или напишите, из какого города вы едете и что требуется автомобилю. Принимаем машины по адресу Махачкала, ул. Хаджи Булача, 71.","")}</div>
  </div></article>`;
  return page("ГБО в Дагестане — установка и обслуживание в Махачкале | Зона Ремонта","Где поставить газ на автомобиль или обслужить ГБО в Дагестане. Маршруты из Каспийска, Дербента, Хасавюрта и других городов в мастерскую на Хаджи Булача, 71.",body,[["Дагестан",regionPath]],{primaryImage:"exterior"});
}


export function pricesPage(c){
  const edited=c.revision>0;
  const date=new Intl.DateTimeFormat("ru-RU",{day:"numeric",month:"long",year:"numeric",timeZone:"Europe/Moscow"}).format(new Date(c.updated)).replace(/\sг\.$/u," года");
  return page("Цены на установку, диагностику и обслуживание ГБО в Махачкале | Зона Ремонта","Сколько стоит установить газ на 4, 6 или 8 цилиндров. Отдельные цены для непосредственного впрыска и стоимость сервисных работ.",`<section class="section inner-page"><div class="wrap">${crumbs([["Цены"]])}${introBlock("Цены на ГБО","Для установки важны тип впрыска, число цилиндров и баллон. Уточним комплектацию по модели и двигателю до начала работ.")}<div class="article-grid"><div class="article-main price-content"><h2>Распределённый впрыск</h2>${priceTable(c.entries,["mpi4","mpi6","mpi8"])}<h2>Непосредственный впрыск</h2>${priceTable(c.entries,["di4","di6","di8"])}<p><a href="/uslugi/ustanovka-gbo/neposredstvennyy-vprysk/">Как подбираем ГБО на непосредственный впрыск</a></p><h2>Диагностика и сервис</h2>${priceTable(c.entries,["diagnostics","maintenance","repair"])}<p class="source-note">${edited?"Прайс обновлён сервисом":"Ориентиры установки опубликованы в каталоге OMVL"} ${esc(date)}${edited?".":`. <a href="${company.priceSource}" ${external}>Карточка центра</a>.`} Строки «По запросу» мастер рассчитает по вашей машине.</p></div>${asidePanel("Уточнить цену","Пришлите год, модель и объём двигателя. Если уже стоит газ, добавьте марку оборудования.","")}</div></div></section>`,[["Цены","/ceny/"]]);
}
export function calcPage(c,search,rates){
  return page("Калькулятор экономии и окупаемости ГБО на пропане | Зона Ремонта","Укажите пробег в день, расход бензина и цену установки ГБО. Расчёт по ценам АИ‑95 и пропана в Махачкале, включая режим для непосредственного впрыска.",`<div class="wrap crumb-top">${crumbs([["Калькулятор"]])}</div>${calculator(valuesFrom(search,c.entries,rates),c.entries,rates,true)}<div class="wrap narrow explainer prose"><h2>Что входит в расчёт</h2><p>Умножаем средний пробег в день на 365. Для одинакового пробега принимаем, что пропана по объёму требуется на 15% больше, чем бензина. При непосредственном впрыске считаем смесь из 95% пропана и 5% АИ‑95 по объёму. Фактическая доля бензина зависит от мотора, нагрузки и настройки комплекта.</p><p>Экономию на топливе за год делим на 12. Так получаем среднюю экономию за месяц и считаем, за сколько месяцев она покроет установку. Холодные пуски и обслуживание ГБО могут увеличить этот срок.</p><p><a href="/zhurnal/okupaemost-gbo/">Как оценить окупаемость на реальных заправках</a></p></div>`,[["Калькулятор","/kalkulyator/"]]);
}
function filters(list,label,kind,active) {
  const options=[...new Set(list.map(x=>x.category))];
  return `<nav class="filters" aria-label="${esc(label)}"><a${!active?' class="selected" aria-current="true"':""} href="/${kind}/">Все</a>${options.map(c=>`<a${active===c?' class="selected" aria-current="true"':""} href="/${kind}/?tema=${encodeURIComponent(c)}">${esc(c)}</a>`).join("")}</nav>`;
}
export function modelsPage(query){
  const topic=query.get("tema");const current=models.some(x=>x.category===topic)?topic:null;
  return page("ГБО по маркам и моделям автомобилей в Махачкале | Зона Ремонта","Подбор пропанового ГБО для Lada, УАЗ, Hyundai, Toyota и Changan. Условия установки, особенности двигателя и размещение баллона.",`<section class="section inner-page dir-page"><div class="wrap">${crumbs([["Автомобили"]])}${introBlock("ГБО на ваш автомобиль","Здесь собраны примеры подбора по моделям. Посмотрите варианты для разных двигателей и кузовов. Другую машину тоже можно обсудить с мастером.")}${filters(models,"Марки автомобилей","avtomobili",current)}${modelLinks(current?models.filter(x=>x.category===current):models)}${nativeCta("Вашей модели нет в списке?","Пришлите модель, год выпуска и объём двигателя. Проверим, какие системы для него подходят.")}</div></section>`,[["Автомобили","/avtomobili/"]],{noindex:!!current});
}
export function modelPage(m,c){
  const p=m.slug==="changan-cs55-plus"?"di4":m.slug==="toyota-camry"?null:"mpi4";
  const t=[["Автомобили","/avtomobili/"],[m.name,modelUrl(m)]];
  return page(`${m.heading} в Махачкале — подбор и цена | Зона Ремонта`,m.intro,`<article class="inner-page"><div class="wrap">${crumbs([t[0],[m.name]])}<div class="article-grid"><div class="article-main">${introBlock(m.heading,m.intro)}<div class="prose"><h2>Какой комплект подойдёт</h2><p>${esc(m.engine)}</p><h2>Что уточнить перед установкой</h2><ul class="checks">${m.checks.map(t=>`<li>${esc(t)}</li>`).join("")}</ul><div class="note">${esc(m.note)}</div><h2>Стоимость для ${esc(m.name)}</h2><p>${p?`Ориентир для подходящей конфигурации — <b>${esc(displayPrice(c.entries,p).toLowerCase())}</b>. Итоговую стоимость уточним по двигателю и баллону.`:"Цена зависит от поколения Camry, типа впрыска и числа цилиндров. Для расчёта назовите год выпуска и код двигателя."} <a href="/ceny/">Сравнить цены по двигателям</a>.</p>${m.slug==="lada-vesta"?`<p><a href="${vestaPath}">Диагностика газа на Весте, если оборудование уже установлено</a></p>`:""}<h2>Вопросы по модели</h2>${faq(m.faq)}${sourceList(m.sources)}${relatedFooter(m.related)}</div></div>${asidePanel("Подобрать ГБО","Назовите год и модификацию "+m.name+". Мастер уточнит совместимость и варианты по цене.",p?displayPrice(c.entries,p):"")}</div></div></article>`,t,{service:`Подбор и установка ГБО на ${m.name}`,faq:m.faq.map(x=>[x.q,x.a])});
}
export function vestaDiagnostics(c){
  const title="Диагностика ГБО на Ладе Весте";
  return page(title+" в Махачкале | Зона Ремонта","Vesta дёргается на газу, глохнет на холостых или переключается на бензин. Что сообщить мастеру и как проходит диагностика в Махачкале.",`<article class="inner-page"><div class="wrap">${crumbs([["Услуги","/uslugi/"],["Диагностика","/uslugi/diagnostika-gbo/"],["Lada Vesta"]])}<div class="article-grid"><div class="article-main">${introBlock(title,"Если Веста начала дёргаться на газу, мастеру важно знать версию двигателя и в какой момент появляется сбой. У Вест разных лет отличаются и моторы, и установленное газовое оборудование.")}<div class="prose"><h2>Что сообщить диагносту</h2><p>Назовите год, объём и мощность двигателя, марку ГБО и пробег с последней замены фильтров. Отдельно опишите, как Веста ведёт себя на бензине. Если переключатель пищит, полезно знать, было ли это сразу после прогрева или уже в движении.</p><h2>Троит при разгоне или на холостых</h2><p>Сопоставляем пропуски по цилиндрам и топливные коррекции с давлением и временем газового впрыска. Эти данные помогают выбрать между проверкой зажигания, форсунок и подачи газа.</p><h2>Возвращается на бензин</h2><p>Проверяем, какое условие переключения зафиксировал газовый блок. Падение давления под нагрузкой и недостаточная температура при первом переходе требуют разных проверок. Если у вас заводская Vesta CNG на метане, сообщите об этом заранее. Эта страница посвящена пропановой системе.</p>${priceTable(c.entries,["diagnostics"])}<p><a href="/avtomobili/lada-vesta/">Подбор и установка ГБО на Vesta</a></p>${relatedFooter(["mashina-troit-na-gazu","gbo-perekhodit-na-benzin"])}</div></div>${asidePanel("Обсудить проблему","Расскажите, на каком топливе работает ровно и когда появляется сбой.",displayPrice(c.entries,"diagnostics"))}</div></div></article>`,[["Услуги","/uslugi/"],["Диагностика","/uslugi/diagnostika-gbo/"],["Lada Vesta",vestaPath]],{service:title});
}
export function journalPage(query){
  const topic=query.get("tema");
  const current=articles.some(a=>a.category===topic)?topic:null;
  const visible=current?articles.filter(a=>a.category===current):articles.slice(1);
  return page("Статьи о ГБО — мифы о газе, расход топлива и диагностика | Зона Ремонта",
    "Вредит ли газ двигателю, сколько пропана уходит на 100 км и почему машина троит. Статьи мастерской «Зона Ремонта» с примерами и разбором причин.",
    `<section class="inner-page section story-archive"><div class="wrap">
      ${crumbs([["Статьи"]])}
      ${introBlock("Статьи о ГБО","Что меняется в двигателе после установки ГБО, как проверить расход по чекам и когда ехать на диагностику.")}
      ${current?"":storyCover(articles[0],{eager:true})}
      ${filters(articles,"Темы статей","zhurnal",current)}
      <div class="journal-grid archive">${visible.map(a=>articleCard(a)).join("")}</div>
    </div></section>`,[["Статьи","/zhurnal/"]],{noindex:!!current,primaryImage:"engine"});
}
export function articlePage(a) {
  const service=services.find(s=>s.key===a.ctaService)??services[0];
  const trail=[["Статьи","/zhurnal/"],[a.title,articleUrl(a)]];
  const titleByService={diagnostics:"Обсудить симптом с диагностом",installation:"Подобрать комплект для моей машины",maintenance:"Уточнить регламент обслуживания",repair:"Обсудить ремонт ГБО"};
  const contact=a.contactTitle
    ?`<aside class="native-cta reader-cta"><h2>${esc(a.contactTitle)}</h2><p>${esc(a.cta)}</p><a class="btn red" href="/kontakty/">${icon("phone",18)}Контакты сервиса</a></aside>`
    :nativeCta(titleByService[service.key],a.cta);
  const relevantWorks=serviceDetails.filter(item=>item.links.some(([,href])=>href===articleUrl(a)));
  const contents=a.sections.map((v,i)=>`<li><a href="#razdel-${i+1}">${esc(v.h)}</a></li>`).join("");
  const sections=a.sections.map((item,i)=>{
    const example=item.example?`<figure class="story-example"><figcaption>Пример по чекам</figcaption><span>${esc(item.example.calculation)}</span><strong>${esc(item.example.result)}</strong></figure>`:"";
    const calculatorLink=a.slug==="okupaemost-gbo"&&i===1?'<p><a href="/kalkulyator/">Посчитать окупаемость по своему пробегу</a></p>':"";
    return `<section id="razdel-${i+1}"><h2>${esc(item.h)}</h2>${item.p.map(v=>`<p>${esc(v)}</p>`).join("")}${example}${calculatorLink}</section>`;
  }).join("");
  return page(a.title+" | Статьи Зоны Ремонта",a.summary,
    `<article class="inner-page reader"><div class="reading-progress" aria-hidden="true"></div><div class="wrap">
      ${crumbs([trail[0],["Материал"]])}${storyCover(a,{article:true,eager:true})}
      <div class="article-grid reader-layout"><div class="article-main">
        <p class="reader-intro">${esc(a.intro||a.summary)}</p>
        <details class="reader-toc"><summary>В этой статье ${icon("chevron",17)}</summary><ol>${contents}</ol></details>
        <div class="prose reader-text">${sections}</div>
        <div class="prose reader-end">${contact}${sourceList(a.sources)}${relevantWorks.length?`<section><h2>В мастерской</h2>${workLinks(relevantWorks.map(item=>[item.name,item.path]))}</section>`:""}${relatedFooter(a.related,"Читайте также")}</div>
      </div><aside class="article-index"><span class="minor-title">В этой статье</span><ul>${contents}</ul><a class="text-link" href="${serviceUrl(service)}">${esc(service.name)} в Махачкале</a></aside></div>
    </div></article>`,trail,{article:a,primaryImage:photos[articlePhotos[a.slug]][0]});
}
export function contactPage(){
  return page("Контакты и маршрут, Махачкала, Хаджи Булача, 71 | Зона Ремонта","Телефон и WhatsApp центра ГБО +7 (988) 444-44-85. Часы работы, маршрут в Яндекс Картах и фотография въезда в сервис.",
    `<div class="wrap crumb-top contact-intro">${crumbs([["Контакты"]])}${introBlock("Контакты сервиса","Узнайте цену для своего автомобиля или уточните, когда подъехать в сервис.")}${contactChannels()}</div>
    ${contacts(false)}<div class="wrap contact-follow"><a class="text-link" href="/otzyvy/">Отзывы о сервисе</a></div>`,[["Контакты","/kontakty/"]],{primaryImage:"exterior"});
}
export function reviewPage(){
  return page("Отзывы о центре ГБО «Зона Ремонта» в Махачкале | Яндекс Карты","Оценки клиентов и темы отзывов о работе центра. Перейдите в карточку на Яндекс Картах, чтобы посмотреть все мнения и свежие оценки.",`<div class="wrap crumb-top">${crumbs([["Отзывы"]])}${introBlock("Отзывы о «Зоне Ремонта»","Отзывы публикуют автовладельцы в карточке центра на Яндекс Картах.")}</div>${reviewsSection()}${contacts()}`,[["Отзывы","/otzyvy/"]]);
}
export function privacyPage(config) {
  return page("Политика конфиденциальности сайта | Зона Ремонта","Обработка данных на сайте «Зоны Ремонта», сведения о Яндекс Метрике и Директе, внешних сервисах и правах посетителя.",policyBody(config),[["Конфиденциальность",policyPath]]);
}
export function analyticsPreferences(config, choice) {
  return page("Настройки аналитики и условия согласия | Зона Ремонта","Проверить состояние Яндекс Метрики, условия обработки данных и изменить выбор аналитики для этого браузера.",preferencesBody(config,choice),[["Конфиденциальность",policyPath],["Настройки аналитики",preferencesPath]],{noindex:true});
}
export function adminLoginPage(message=""){
  return page("Вход в редактор цен | Зона Ремонта","",`<section class="admin-login wrap">
    <div class="login-card"><h1>Редактор цен</h1><p>Вход для сотрудников сервиса</p>
      ${message?`<div role="alert" class="feedback error">${esc(message)}</div>`:""}
      <form method="post" action="/admin/login/" class="login-form">
        <label>Логин<input type="text" name="username" autocomplete="username" autocapitalize="none" spellcheck="false" maxlength="64" required></label>
        <label>Пароль<input type="password" name="password" autocomplete="current-password" maxlength="128" required></label>
        <button type="submit" class="btn red">Войти</button>
      </form>
    </div></section>`,[],{noindex:true});
}
export function cabinetPage(c,msg,level=""){
  const rows=priceRows.map(r=>`<label class="edit-row"><span><b>${esc(r.name)}</b><small>${esc(r.detail)}</small></span><span class="edit-amount"><input aria-label="${esc(r.name)}" type="number" min="0" max="9999999" step="1" inputmode="numeric" name="${r.key}" value="${c.entries[r.key]??""}" placeholder="По запросу"> ₽</span></label>`).join("");
  return page("Кабинет сервиса | Цены","","<section class='section inner-page'><div class='wrap narrow'>"+crumbs([["Кабинет"]])+introBlock("Редактор цен","Изменения появятся в прайсе, карточках услуг, подборе по автомобилям и калькуляторе. Пустое поле — «По запросу», ноль — «Бесплатно».")+(msg?`<div role="status" class="feedback ${level}">${esc(msg)}</div>`:"")+`<form method="post" action="/admin/ceny/" class="price-form"><input type="hidden" name="revision" value="${c.revision}">${rows}<div class="admin-foot"><button class="btn red" type="submit">Сохранить цены</button><a class="text-link" href="/ceny/">Открыть прайс</a></div></form><form class="signout" method="post" action="/admin/logout/"><button class="text-link" type="submit">Выйти из кабинета</button></form></div></section>`,[],{noindex:true});
}
export function messagePage(title,body,action,label){
  return page(title+" | Зона Ремонта","",`<div class="wrap narrow status-page"><div class="section-kicker">${slashes} ЗОНА РЕМОНТА</div><h1>${esc(title)}</h1><p>${esc(body)}</p><a class="btn red" href="${esc(action)}" target="_top">${esc(label)}</a></div>`,[],{noindex:true});
}

