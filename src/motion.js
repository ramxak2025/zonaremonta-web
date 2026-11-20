import { gsap } from "gsap";
export function start(){
  const media=gsap.matchMedia();
  media.add("(prefers-reduced-motion: no-preference)",()=>{
    const observer=new IntersectionObserver(items=>{
      for(const item of items){
        if(!item.isIntersecting)continue;
        gsap.fromTo(item.target,{scale:1.055},{scale:1,duration:.85,ease:"power2.out",clearProps:"transform"});
        observer.unobserve(item.target);
      }
    },{threshold:.22});
    document.querySelectorAll(".reveal-media").forEach(el=>observer.observe(el));
    const marks=document.querySelector(".hero-copy .slashes");
    if(marks)gsap.from(marks.children,{scaleY:.4,transformOrigin:"bottom",duration:.62,stagger:.085,ease:"power3.out",clearProps:"transform"});
    const hero=document.querySelector(".hero-visual img");
    const desktop=matchMedia("(min-width: 931px) and (pointer:fine)").matches;
    if(hero&&desktop)gsap.fromTo(hero,{scale:1.028},{scale:1,duration:1.4,ease:"power2.out",clearProps:"transform"});
    const box=document.querySelector("[data-results]");
    const pulse=()=>gsap.fromTo(box.querySelector(".result-amount"),{y:2},{y:0,duration:.27,overwrite:true,ease:"power2.out",clearProps:"transform"});
    box?.addEventListener("zr:calculate",pulse);
    return ()=>{observer.disconnect();box?.removeEventListener("zr:calculate",pulse);};
  });
}

