import { inputs, calculate, resultWords } from "./calc.js";

const form=document.querySelector("[data-calc]");
if(form){
  const fields=form.elements;
  const resultBox=document.querySelector("[data-results]");
  const calcChat=resultBox.querySelector("[data-calc-chat]");
  const bars=resultBox.querySelector("[data-bars]");
  const targets=[...resultBox.querySelectorAll("[data-r]")];
  form.addEventListener("input",event=>{
    const rateType=fields.direct.checked?"di":"mpi";
    if(event.target===fields.install)fields.basis.value="custom";
    if(event.target===fields.direct&&fields.basis.value!=="custom"){
      fields.install.value=form.dataset[rateType];
      fields.basis.value=rateType;
    }
    if(!form.checkValidity()){
      for(const el of targets)if(!["title","monthLabel"].includes(el.dataset.r))el.textContent="—";
      bars.hidden=true;
      calcChat.hidden=true;
      resultBox.setAttribute("aria-label","Заполните поля допустимыми числами");
      return;
    }
    resultBox.removeAttribute("aria-label");
    const values=Object.fromEntries(Object.keys(inputs).map(key=>[key,fields[key].value===""?null:fields[key].valueAsNumber]));
    values.direct=fields.direct.checked;
    values.petrolPrice=Number(form.dataset.petrol);
    values.gasPrice=Number(form.dataset.gas);
    const c=calculate(values),r=resultWords(c);
    bars.hidden=false;
    bars.querySelector('[data-bar="petrol"]').style.transform="scaleX("+c.petrolShare+")";
    bars.querySelector('[data-bar="gas"]').style.transform="scaleX("+c.gasShare+")";
    calcChat.hidden=false;
    for(const el of targets)el.textContent=r[el.dataset.r];
    resultBox.dispatchEvent(new Event("zr:calculate"));
  });
}
const menu=document.querySelector(".dock-menu");
if(menu){
  const toggle=menu.querySelector("summary");
  document.addEventListener("click",event=>{
    if(menu.open&&!menu.contains(event.target))menu.open=false;
  });
  document.addEventListener("keydown",event=>{
    if(event.key!=="Escape"||!menu.open)return;
    menu.open=false;
    toggle.focus({preventScroll:true});
  });
  menu.addEventListener("focusout",event=>{
    if(event.relatedTarget&&!menu.contains(event.relatedTarget))menu.open=false;
  });
  window.addEventListener("pageshow",event=>{if(event.persisted)menu.open=false;});
}
if(!matchMedia("(prefers-reduced-motion: reduce)").matches&&!navigator.connection?.saveData){
  const path=document.querySelector("script[data-motion]")?.dataset.motion;
  const start=()=>{if(path)import(path).then(m=>m.start()).catch(()=>{});};
  const idle=()=>window.requestIdleCallback?window.requestIdleCallback(start,{timeout:1800}):setTimeout(start,250);
  if(document.readyState==="complete")idle();else window.addEventListener("load",idle,{once:true});
}

