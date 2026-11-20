export const inputs={
  dailyKm:{title:"Пробег в день",unit:"км",min:0,max:5000,step:"any",initial:60},
  petrolUse:{title:"Расход бензина",unit:"л/100 км",min:0.1,max:100,step:"any",initial:10},
  install:{title:"Стоимость установки",unit:"₽",min:0,max:9999999,step:1,initial:45000},
};

export const gasFactor=1.15;

function validNumber(value,field){
  if(typeof value!=="string"||!value.trim())return null;
  const number=Number(value.replace(",","."));
  return Number.isFinite(number)&&number>=field.min&&number<=field.max&&(field.step!==1||Number.isInteger(number))?number:null;
}

export function valuesFrom(query,entries,rates){
  const direct=query?.get("direct")==="1";
  const install=entries[direct?"di4":"mpi4"]??null;
  const values={};
  for(const [key,field] of Object.entries(inputs)){
    values[key]=validNumber(query?.get(key),field)??(key==="install"?install:field.initial);
  }
  const previous=query?.get("basis");
  const custom=validNumber(query?.get("install"),inputs.install);
  const previousDefault=(previous==="mpi"||previous==="di")&&custom===(entries[previous==="di"?"di4":"mpi4"]??null);
  const automatic=custom===null||previousDefault;
  if(automatic)values.install=install;
  // Existing bookmarks used a monthly distance. Convert it to an annual-average day.
  if(query?.has("km")&&!query.has("dailyKm")){
    const monthly=validNumber(query.get("km"),{min:0,max:50000});
    if(monthly!==null)values.dailyKm=Math.round(monthly*12/365*100)/100;
  }
  return {...values,petrolPrice:rates.petrolPrice,gasPrice:rates.gasPrice,direct,automatic};
}

export function calculate(v){
  // Each litre of propane covers the distance of 1 / gasFactor litres of petrol.
  const petrolFraction=v.direct ? 0.05 : 0;
  const gasFraction=1-petrolFraction;
  const totalLitres=v.petrolUse/(gasFraction/gasFactor+petrolFraction);
  const gasLitres=totalLitres*gasFraction;
  const petrolLitres=totalLitres*petrolFraction;
  const monthlyUnits=v.dailyKm*365/12/100;
  const petrol=monthlyUnits*v.petrolUse*v.petrolPrice;
  const onGas=monthlyUnits*(gasLitres*v.gasPrice+petrolLitres*v.petrolPrice);
  const month=petrol-onGas;
  const maximum=Math.max(petrol,onGas,1);
  return {petrol,onGas,gasLitres,petrolLitres,petrolShare:petrol/maximum,gasShare:onGas/maximum,month,year:month*12,
    months:v.install===null?null:v.install===0?0:month>0?Math.ceil(v.install/month):null,needsQuote:v.install===null};
}

const money=new Intl.NumberFormat("ru-RU",{maximumFractionDigits:0});
const litres=new Intl.NumberFormat("ru-RU",{maximumFractionDigits:2});
export function resultWords(r){
  return {
    petrolCost:money.format(r.petrol)+" ₽/мес.",gasCost:money.format(r.onGas)+" ₽/мес.",
    title:r.month<0?"Доплата за год":"Экономия за год",year:money.format(Math.abs(r.year)),month:money.format(Math.abs(r.month))+" ₽",
    monthLabel:r.month<0?"Доплата в месяц":"Экономия в месяц",
    term:r.needsQuote?"Укажите цену":r.months===null?"Не окупится":r.months===0?"Сразу":money.format(r.months)+" мес.",
    volumes:litres.format(r.gasLitres)+" л пропана"+(r.petrolLitres?" + "+litres.format(r.petrolLitres)+" л АИ‑95":"")+" на 100 км",
  };
}
