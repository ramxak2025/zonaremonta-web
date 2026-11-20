const entry = document.querySelector("script[data-analytics]");
const counter = Number(entry?.dataset.analytics || 0);
const eventKey = "zr-analytics-revoked";
const allowed = () => /(?:^|;\s*)__Host-zr_analytics=yes\.[a-f0-9]{32}(?:;|$)/.test(document.cookie);
let script;
let active = false;

function stop() {
  if (active && typeof window.ym === "function") window.ym(counter, "destruct");
  active = false;
  script?.remove();
}

function clearSiteAnalytics() {
  let host = location.hostname;
  const domains = [""];
  while (host.includes(".")) {
    domains.push("; Domain=" + host);
    host = host.slice(host.indexOf(".") + 1);
  }
  for (const field of document.cookie.split(";")) {
    const name = field.trim().split("=")[0];
    if (/^_ym[A-Za-z0-9_]*$/.test(name)) {
      for (const domain of domains) document.cookie = name + "=; Path=/; Max-Age=0; Secure" + domain;
    }
  }
  try {
    for (const key of Object.keys(localStorage)) if (/^_ym/.test(key)) localStorage.removeItem(key);
  } catch {}
}

document.addEventListener("submit", event => {
  if (!event.target.matches("[data-consent-form]") || event.submitter?.value !== "no") return;
  stop();
  clearSiteAnalytics();
  try { localStorage.setItem(eventKey, String(Date.now())); } catch {}
});
window.addEventListener("storage", event => {
  if (event.key === eventKey) stop();
});
window.addEventListener("pageshow", event => {
  if (event.persisted && counter && !allowed()) location.reload();
});
document.addEventListener("visibilitychange", () => { if (!document.hidden && active && !allowed()) stop(); });

if (counter && allowed()) {
  if (typeof window.ym !== "function") {
    const queue = (...args) => queue.a.push(args);
    queue.a = [];
    queue.l = Date.now();
    window.ym = queue;
  }
  script = document.createElement("script");
  script.async = true;
  script.referrerPolicy = "no-referrer";
  script.onload = () => {
    if (!allowed() || typeof window.ym !== "function" || !script.isConnected) return;
    const click = new URL(location.href).searchParams.get("yclid");
    const url = location.origin + location.pathname + (click && /^\d{1,32}$/.test(click) ? "?yclid=" + click : "");
    let source = "";
    try { source = new URL(document.referrer).origin; } catch {}
    window.ym(counter, "init", {defer:true, clickmap:false, trackLinks:false, webvisor:false, accurateTrackBounce:false, sendTitle:false});
    window.ym(counter, "hit", url, {referer:source});
    active = true;
  };
  script.src = "https://mc.yandex.ru/metrika/tag.js";
  document.head.append(script);
  document.addEventListener("click", event => {
    if (!active || !allowed()) return;
    const link = event.target.closest?.("a[href]");
    if (!link) return;
    let goal;
    if (link.protocol === "tel:") goal = "phone_click";
    else if (link.hostname === "wa.me") goal = "whatsapp_click";
    else if (link.hostname === "yandex.ru" && link.pathname === "/maps/" && link.searchParams.has("rtext")) goal = "route_click";
    if (goal) window.ym(counter, "reachGoal", goal);
  }, {capture:true});
}
