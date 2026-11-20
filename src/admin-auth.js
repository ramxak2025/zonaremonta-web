const username = "zr-admin";
const cookieName = "__Secure-zr_price";
const cookieOptions = "Path=/admin/; HttpOnly; Secure; SameSite=Strict";
const sessionSeconds = 12 * 60 * 60;
const windowSeconds = 15 * 60;
const maxAttempts = 10;
const encoder = new TextEncoder();
const hex = bytes => Array.from(new Uint8Array(bytes), n => n.toString(16).padStart(2, "0")).join("");
const digest = async value => hex(await crypto.subtle.digest("SHA-256", encoder.encode(value)));

function credential(env) {
  const match = /^([0-9a-f]{32})\.([0-9a-f]{64})$/.exec(env.ZR_ADMIN_PASSWORD_HASH || "");
  if (!match) throw new Error("Admin credential unavailable");
  return {salt: match[1], hash: match[2]};
}

function sessionToken(request) {
  for (const part of (request.headers.get("Cookie") || "").split(";")) {
    const [name, value] = part.trim().split("=");
    if (name === cookieName && /^[a-f0-9]{64}$/.test(value || "")) return value;
  }
  return null;
}

export async function hasSession(request, env) {
  const config = credential(env);
  const token = sessionToken(request);
  if (!token) return false;
  const row = await env.DB.prepare(
    "SELECT 1 AS valid FROM admin_sessions WHERE token_hash=? AND credential_tag=? AND expires_at>?"
  ).bind(await digest(token), await digest(config.hash), Date.now()).first();
  return Boolean(row);
}

async function verifyPassword(config, password) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const salt = Uint8Array.from(config.salt.match(/../g), byte => parseInt(byte, 16));
  const bits = await crypto.subtle.deriveBits({name:"PBKDF2", hash:"SHA-256", iterations:100000, salt}, key, 256);
  const candidate = hex(bits);
  let difference = 0;
  for (let i = 0; i < candidate.length; i++) difference |= candidate.charCodeAt(i) ^ config.hash.charCodeAt(i);
  return difference === 0;
}

export async function signIn(request, env, form) {
  const config = credential(env);
  const now = Date.now();
  const expiresAt = now + windowSeconds * 1000;
  const client = await digest(config.salt + ":" + (request.headers.get("CF-Connecting-IP") || "site"));
  const attempt = await env.DB.prepare(
    `INSERT INTO admin_attempts (client_key, attempts, expires_at) VALUES (?, 1, ?)
     ON CONFLICT(client_key) DO UPDATE SET
       attempts=CASE WHEN expires_at<=? THEN 1 ELSE attempts+1 END,
       expires_at=CASE WHEN expires_at<=? THEN excluded.expires_at ELSE expires_at END
     RETURNING attempts, expires_at`
  ).bind(client, expiresAt, now, now).first();
  if (attempt.attempts > maxAttempts) return {limited: Math.max(1, Math.ceil((attempt.expires_at - now) / 1000))};
  const login = form.get("username") || "";
  const password = form.get("password") || "";
  if (form.getAll("username").length !== 1 || form.getAll("password").length !== 1 || login.length > 64 || !password || password.length > 128) return {};
  if (!await verifyPassword(config, password) || login !== username) return {};

  const token = hex(crypto.getRandomValues(new Uint8Array(32)));
  await env.DB.prepare("DELETE FROM admin_attempts WHERE client_key=? OR expires_at<=?").bind(client, now).run();
  await env.DB.prepare("DELETE FROM admin_sessions WHERE expires_at<=?").bind(now).run();
  await env.DB.prepare("INSERT INTO admin_sessions (token_hash,credential_tag,expires_at) VALUES (?,?,?)")
    .bind(await digest(token), await digest(config.hash), now + sessionSeconds * 1000).run();
  return {cookie:`${cookieName}=${token}; ${cookieOptions}; Max-Age=${sessionSeconds}`};
}

export async function signOut(request, env) {
  const token = sessionToken(request);
  if (token) await env.DB.prepare("DELETE FROM admin_sessions WHERE token_hash=?").bind(await digest(token)).run();
  return `${cookieName}=; ${cookieOptions}; Max-Age=0`;
}
