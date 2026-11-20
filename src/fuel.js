export const stationUrl="https://benzinstatus.ru/azs/42957-azs-mahachkala-prospekt-ali-gadzhi-akushinskogo-34a/";
export const stationName="АСКО · просп. Али-Гаджи Акушинского, 34а";
export const reserveUrl="https://fuelprice.ru/mahachkala/";
const primary={name:stationName,url:stationUrl,publisher:"БензинСтатус"};
const secondary={name:"АСКО №16 · просп. Амет-Хана Султана, 11/1",url:reserveUrl,publisher:"FuelPrice"};
export const fuelStation=rates=>rates.provider==="fuelprice"?secondary:primary;
export const initialFuel={petrolPrice:110,gasPrice:47,petrolDate:"2026-11-20",gasDate:"2026-11-20"};

const months="января февраля марта апреля мая июня июля августа сентября октября ноября декабря".split(" ");
const dateMsk=ms=>new Date(ms+3*3600000).toISOString().slice(0,10);

function priceDate(day,month,year,now){
  const today=dateMsk(now);
  const format=y=>[y,String(month+1).padStart(2,"0"),String(day).padStart(2,"0")].join("-");
  let y=year?Number(year):Number(today.slice(0,4));
  let value=format(y);
  if(!year && value>today && month===11 && today.slice(5,7)==="01")value=format(--y);
  const actual=new Date(value+"T00:00:00Z");
  if(!Number.isFinite(actual.getTime())||actual.toISOString().slice(0,10)!==value||value>today)return null;
  return value;
}

export function parseStation(html,now=Date.now()){
  const plain=s=>s.replace(/<[^>]*>/g," ").replace(/&(?:nbsp|thinsp|#160|#8239|#x0*a0);/gi," ")
    .replace(/&(?:#8381|#x20bd);/gi,"₽").replace(/[\u2010-\u2014\u2212]/g,"-").replace(/\s+/g," ").trim();
  const heading=plain(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]||"");
  if(!/asko|аско/i.test(heading)||!heading.includes("Махачкала")||!/34\s*[аa]/i.test(heading))return null;
  const sections=html.split(/<h2\b[^>]*>/i);
  const prices=sections.find(section=>/^Цены$/i.test(plain(section.split(/<\/h2\s*>/i)[0])));
  if(!prices)return null;
  const content=plain(prices.split(/<\/h2\s*>/i)[1]||"");
  function quote(label){
    const pattern="(?:^|\\s)"+label+"\\s+(\\d{1,3}(?:[.,]\\d{1,2})?)\\s*₽(?:\\s*\\/\\s*л)?\\s+(\\d{1,2})\\s+("+months.join("|")+")(?:\\s+(20\\d{2}))?(?=\\s|[.,]|$)";
    const match=content.match(new RegExp(pattern,"iu"));
    if(!match)return null;
    const price=Number(match[1].replace(",","."));
    const date=priceDate(Number(match[2]),months.indexOf(match[3].toLowerCase()),match[4],now);
    return date&&price>0&&price<=500?{price,date}:null;
  }
  const petrol=quote("АИ\\s*-\\s*95");
  const gas=quote("(?:Газ(?:\\s*\\(пропан-бутан\\))?|Пропан(?:-бутан)?|СУГ)");
  return petrol&&gas?{petrolPrice:petrol.price,gasPrice:gas.price,petrolDate:petrol.date,gasDate:gas.date}:null;
}

export function parseReserve(html,now=Date.now()){
  const card=html.split(/<header\b[^>]*>/i).find(part=>/data-id=["']35127["']/.test(part.slice(0,400)));
  if(!card)return null;
  const text=card.replace(/<[^>]+>/g," ").replace(/&nbsp;|&#160;/gi," ").replace(/\s+/g," ").trim();
  if(!/Asko\s*№\s*16/i.test(text)||!/Махачкала,\s*пр-кт Амет-Хана Султана,\s*11\/1\b/i.test(text))return null;
  function amount(label){
    const m=text.match(new RegExp(label+"\\s*:\\s*(\\d{1,3}(?:[.,]\\d{1,2})?)\\s*₽\\s*(\\d{4}-\\d{2}-\\d{2})","i"));
    if(!m||m[2]>dateMsk(now)||m[2]<"2026-01-01")return null;
    const n=Number(m[1].replace(",","."));
    return n>0&&n<=500?{price:n,date:m[2]}:null;
  }
  const petrol=amount("Аи[-‑]95"), gas=amount("Газ СПБТ");
  return petrol&&gas?{provider:"fuelprice",petrolPrice:petrol.price,gasPrice:gas.price,petrolDate:petrol.date,gasDate:gas.date}:null;
}
async function loadBoard(fetchPage,source,parse,now){
  try{
    const response=await fetchPage(source.url,{redirect:"manual",signal:AbortSignal.timeout(8000),headers:{Accept:"text/html"}});
    if(!response.ok)throw Error("HTTP "+response.status);
    const rates=parse(await response.text(),now);
    if(!rates)throw Error("нет датированного прайса станции");
    return rates;
  }catch(error){
    console.warn("Fuel source "+source.publisher+": "+error.message);
    return null;
  }
}
export async function readFuel(db){
  const row=await db.prepare("SELECT payload, checked_at, next_attempt FROM fuel_board WHERE id = 1").first();
  return {rates:row?.payload?JSON.parse(row.payload):initialFuel, checkedAt:row?.checked_at??null, nextAttempt:row?.next_attempt??0};
}

const firstReadingRetry=5*60000;
export function fuelDue(snapshot,now=Date.now()){
  return snapshot.nextAttempt<=now||(!snapshot.checkedAt&&snapshot.nextAttempt>now+firstReadingRetry);
}
export async function refreshFuel(db,snapshot,fetchPage=fetch,now=Date.now()){
  if(!fuelDue(snapshot,now))return snapshot;
  const lease=now+60000;
  const claim=await db.prepare(`INSERT INTO fuel_board (id,next_attempt) VALUES (1,?)
    ON CONFLICT(id) DO UPDATE SET next_attempt=excluded.next_attempt WHERE fuel_board.next_attempt=?`).bind(lease,snapshot.nextAttempt).run();
  if(!claim.meta.changes)return readFuel(db);
  try{
    let rates=await loadBoard(fetchPage,primary,parseStation,now);
    const today=dateMsk(now);
    if(!rates||rates.petrolDate<today||rates.gasDate<today){
      const backup=await loadBoard(fetchPage,secondary,parseReserve,now);
      if(backup&&(!rates||(backup.petrolDate>=rates.petrolDate&&backup.gasDate>=rates.gasDate&&(backup.petrolDate>rates.petrolDate||backup.gasDate>rates.gasDate))))rates=backup;
    }
    if(!rates)throw Error("Нет подтверждённых значений из доступных источников.");
    const current=await readFuel(db);
    if(fuelStation(rates)!==fuelStation(current.rates)&&(rates.petrolDate<current.rates.petrolDate||rates.gasDate<current.rates.gasDate))rates={...current.rates};
    for(const kind of ["petrol","gas"]){
      const dt=kind+"Date",amount=kind+"Price";
      if(rates[dt]<current.rates[dt]){rates[dt]=current.rates[dt];rates[amount]=current.rates[amount];}
    }
    // Recheck at 10:00 Moscow time and retry later if either price is from an earlier date.
    const morning=Date.parse(today+"T10:00:00+03:00");
    const nextMorning=now<morning?morning:morning+86400000;
    const next=rates.gasDate<today||rates.petrolDate<today?Math.min(nextMorning,now+3*3600000):nextMorning;
    await db.prepare("UPDATE fuel_board SET payload=?,checked_at=?,next_attempt=? WHERE id=1 AND next_attempt=?")
      .bind(JSON.stringify(rates),new Date(now).toISOString(),next,lease).run();
  }catch(error){
    console.warn("Fuel source unavailable: "+error.message);
    await db.prepare("UPDATE fuel_board SET next_attempt=? WHERE id=1 AND next_attempt=?").bind(now+(snapshot.checkedAt?30*60000:firstReadingRetry),lease).run();
  }
  return readFuel(db);
}

export async function recordObservedFuel(db,observation,now=Date.now()){
  if(!observation||![stationUrl,reserveUrl].includes(observation.source))throw Error("Укажите один из настроенных источников АСКО.");
  const today=dateMsk(now);
  const rates=observation.source===reserveUrl?{provider:"fuelprice"}:{};
  for(const kind of ["petrol","gas"]){
    const amount=observation[kind+"Price"],day=observation[kind+"Date"];
    if(typeof amount!=="number"||!Number.isFinite(amount)||amount<=0||amount>500||Math.abs(amount*100-Math.round(amount*100))>1e-8)throw Error("Проверьте цену за литр.");
    if(typeof day!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(day)||day>today||day<"2026-01-01")throw Error("Нужна дата цены, указанная АЗС.");
    if(new Date(day+"T12:00:00Z").toISOString().slice(0,10)!==day)throw Error("Недопустимая дата.");
    rates[kind+"Price"]=amount;
    rates[kind+"Date"]=day;
  }
  const morning=Date.parse(today+"T10:00:00+03:00");
  let next=now<morning?morning:morning+86400000;
  if(rates.petrolDate<today||rates.gasDate<today)next=Math.min(next,now+3*3600000);
  const at=new Date(now).toISOString();
  // Compare both source dates in the statement so a delayed read cannot overwrite newer quotes.
  if(rates.petrolDate<initialFuel.petrolDate||rates.gasDate<initialFuel.gasDate)throw Error("Уже есть более свежие цены.");
  const saved=await db.prepare(`INSERT INTO fuel_board(id,payload,checked_at,next_attempt) VALUES(1,?,?,?)
    ON CONFLICT(id) DO UPDATE SET payload=excluded.payload,checked_at=excluded.checked_at,next_attempt=excluded.next_attempt
    WHERE fuel_board.payload IS NULL OR (json_extract(fuel_board.payload,'$.petrolDate')<=? AND json_extract(fuel_board.payload,'$.gasDate')<=?)`)
    .bind(JSON.stringify(rates),at,next,rates.petrolDate,rates.gasDate).run();
  if(!saved.meta.changes)throw Error("В базе уже есть более свежие цены.");
  return readFuel(db);
}
