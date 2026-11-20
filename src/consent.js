export const policyPath = "/privacy/";
export const preferencesPath = "/privacy/analytics/";
export const choicePath = "/privacy/choice/";
export const termsVersion = "2026-11-20.1";
const cookieName = "__Host-zr_analytics";
const lifetime = 180 * 24 * 60 * 60;
const tokenPattern = /^yes\.([a-f0-9]{32})$/;
const revokedPattern = /^revoke\.([a-f0-9]{32})$/;

export function privacyConfig(env, url) {
  const name = env.ZR_OPERATOR_NAME?.trim() || "";
  const address = env.ZR_OPERATOR_ADDRESS?.trim() || "";
  const sites = url.hostname === "chatgpt.site" || url.hostname.endsWith(".chatgpt.site");
  // Set the exact origin only after the operator verifies hosting, backups, logs and processors.
  const domestic = !sites && url.protocol === "https:" && env.ZR_RF_ORIGIN === url.origin;
  const id = String(env.ZR_METRIKA_ID || "").trim();
  const counter = domestic && name && address && /^[1-9]\d{0,11}$/.test(id) ? id : "";
  return {name, address, sites, domestic, counter};
}

function cookieValue(request) {
  const prefix = cookieName + "=";
  return (request.headers.get("Cookie") || "").split(";").map(c => c.trim()).find(c => c.startsWith(prefix))?.slice(prefix.length) || "";
}

async function hashToken(token) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, "0")).join("");
}

export async function readChoice(env, request, config) {
  if (!config.domestic) return "off";
  const value = cookieValue(request);
  const revoked = revokedPattern.exec(value)?.[1];
  if (revoked) {
    try { await env.DB.prepare("DELETE FROM analytics_consent WHERE receipt=?").bind(await hashToken(revoked)).run(); } catch {}
    return config.counter ? "no" : "off";
  }
  if (!config.counter) return tokenPattern.test(value) ? "off-consent" : "off";
  if (value === "no." + termsVersion) return "no";
  const token = tokenPattern.exec(value)?.[1];
  if (!token) return "";
  try {
    const row = await env.DB.prepare(
      "SELECT 1 AS valid FROM analytics_consent WHERE receipt=? AND version=? AND operator=? AND counter=? AND expires_at>?"
    ).bind(await hashToken(token), termsVersion, config.name, config.counter, Date.now()).first();
    return row ? "yes" : "";
  } catch { return ""; }
}

export function returnPath(input, routes) {
  if (!input || !input.startsWith("/") || input.startsWith("//") || input.includes("\\")) return preferencesPath;
  const base = "https://site.invalid";
  try {
    const url = new URL(input, base);
    if (url.origin !== base || !routes.includes(url.pathname)) return preferencesPath;
    const click = url.searchParams.get("yclid");
    return url.pathname + (click && /^\d{1,32}$/.test(click) ? "?yclid=" + click : "");
  } catch { return preferencesPath; }
}

export async function storeChoice(request, env, config, routes) {
  const headers = {"Cache-Control":"private,no-store", "X-Robots-Tag":"noindex", "Referrer-Policy":"no-referrer"};
  const reply = (status, extra={}) => new Response(null,{status,headers:{...headers,...extra}});
  if (request.method !== "POST") return reply(405,{Allow:"POST"});
  const url = new URL(request.url);
  if (request.headers.get("Origin") !== url.origin || request.headers.get("Sec-Fetch-Site") === "cross-site") return reply(403);
  if (!config.domestic) return reply(303,{Location:preferencesPath});
  if (request.headers.get("Content-Type")?.split(";")[0] !== "application/x-www-form-urlencoded") return reply(415);
  if (Number(request.headers.get("Content-Length")) > 2048) return reply(413);
  const raw = await request.text();
  if (raw.length > 2048) return reply(413);
  const form = new URLSearchParams(raw);
  const choice = form.get("choice");
  if (form.getAll("choice").length !== 1 || !["yes","no"].includes(choice) || form.get("version") !== termsVersion) return reply(400);
  if (choice === "yes" && !config.counter) return reply(303,{Location:preferencesPath});
  const previous = (tokenPattern.exec(cookieValue(request)) || revokedPattern.exec(cookieValue(request)))?.[1];
  const now = Date.now();
  let value = "no." + termsVersion;
  try {
    await env.DB.prepare("DELETE FROM analytics_consent WHERE expires_at<=?").bind(now).run();
    if (choice === "yes") {
      if (await readChoice(env, request, config) === "yes") return reply(303,{Location:returnPath(form.get("back"),routes)});
      const token = crypto.randomUUID().replaceAll("-","");
      await env.DB.prepare("INSERT INTO analytics_consent (receipt,version,operator,counter,accepted_at,expires_at) VALUES (?,?,?,?,?,?)")
        .bind(await hashToken(token), termsVersion, config.name, config.counter, now, now + lifetime * 1000).run();
      value = "yes." + token;
    }
    if (previous) await env.DB.prepare("DELETE FROM analytics_consent WHERE receipt=?").bind(await hashToken(previous)).run();
  } catch {
    // A withdrawal must still stop this browser when storage is temporarily unavailable.
    if (choice === "yes") return reply(503,{Location:preferencesPath});
    if (previous) value = "revoke." + previous;
  }
  return reply(303,{
    Location:returnPath(form.get("back"),routes),
    "Set-Cookie":cookieName+"="+value+"; Path=/; Secure; SameSite=Lax; Max-Age="+lifetime
  });
}
