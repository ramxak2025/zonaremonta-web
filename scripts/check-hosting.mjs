import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { once } from "node:events";
import { tmpdir } from "node:os";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { createHash, randomBytes } from "node:crypto";
import { openDatabase } from "../hosting/database.mjs";
import { defaultEntries } from "../src/business.js";

const root = new URL("../", import.meta.url);
const stateDir = mkdtempSync(path.join(tmpdir(), "zr-host-check-"));
const origin = "https://05auto.ru";
const env = {
  ...process.env, PUBLIC_ORIGIN: origin, ZR_DATA_DIR: stateDir, ZR_ADMIN_PASSWORD_HASH: "",
  ZR_ENV_FILE: process.platform === "win32" ? "NUL" : "/dev/null",
  ZR_METRIKA_ID:"", ZR_RF_ORIGIN:"", HOST: "127.0.0.1", PORT: "0",
};
const password = randomBytes(24).toString("base64url");
let child, exited, base;
async function start() {
  child = spawn(process.execPath, ["app.cjs"], {cwd: root, env, stdio:["ignore","pipe","pipe"]});
  exited = once(child, "exit");
  let output = "";
  child.stdout.on("data", bytes => { output += bytes.toString(); });
  let errors = "";
  child.stderr.on("data", bytes => { errors += bytes.toString(); });
  for (let i=0; i<200; i++) {
    const port = output.match(/порт (\d+)/)?.[1];
    if (port) { base = "http://127.0.0.1:" + port; return; }
    if (child.exitCode !== null) throw new Error("Server failed to start: " + errors);
    await delay(25);
  }
  throw new Error("Server startup timed out.");
}
async function stop() {
  if (!child) return;
  if (child.exitCode === null) child.kill("SIGTERM");
  await exited;
  child = null;
}
const get = (route, options={}) => fetch(base + route, {redirect:"manual",...options});
const post = (route, body, cookie) => get(route, {
  method:"POST", headers:{Origin:origin, ...(cookie?{Cookie:cookie}:{})}, body:new URLSearchParams(body),
});
try {
  const setup = spawnSync(process.execPath, ["scripts/setup-admin.mjs","--stdin"], {cwd:root,env,input:password});
  assert.equal(setup.status,0,setup.stderr.toString());
  const db = openDatabase(stateDir);
  await db.prepare("UPDATE fuel_board SET next_attempt=? WHERE id=1").bind(Date.now()+86400000).run();
  db.close();
  await start();
  const map = await (await get("/sitemap.xml")).text();
  const paths = Array.from(map.matchAll(/<loc>([^<]+)<\/loc>/g), m => {
    const url = new URL(m[1]); assert.equal(url.origin,origin); return url.pathname;
  });
  assert(paths.length >= 34);
  for (const route of paths) {
    const response = await get(route); assert.equal(response.status,200,route);
    assert((await response.text()).includes('<link rel="canonical" href="'+origin+route+'"'),route+" canonical");
  }
  const assets = JSON.parse(readFileSync(new URL("dist/asset-manifest.json",root)));
  for (const route of Object.values(assets)) {
    const response = await get(route); assert.equal(response.status,200,route);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert(bytes.equals(readFileSync(new URL("dist/client"+route,root))),route+" static copy");
    assert(route.startsWith("/a/"+createHash("sha256").update(bytes).digest("hex").slice(0,14)+"-"));
    if (route.endsWith(".woff2")) { assert.equal(bytes.toString("ascii",0,4),"wOF2"); assert.equal(response.headers.get("content-type"),"font/woff2"); }
    if (route.endsWith(".webp")) { assert.equal(bytes.toString("ascii",8,12),"WEBP"); assert.equal(response.headers.get("content-type"),"image/webp"); }
    if (route.endsWith(".png")) { assert.equal(bytes.toString("hex",0,8),"89504e470d0a1a0a"); assert.equal(response.headers.get("content-type"),"image/png"); }
  }
  const contacts = await (await get("/kontakty/")).text();
  assert(contacts.includes('href="tel:+79884444485"') && contacts.includes('href="https://wa.me/79884444485"'));
  const calc = await (await get("/kalkulyator/?dailyKm=79&petrolUse=9.5&install=89000&direct=1&basis=custom")).text();
  assert(calc.includes('value="79"') && calc.includes('value="89000"') && calc.includes('value="1" checked'));
  assert.equal((await get("/privacy/analytics/")).status,200);
  assert.equal((await get("/admin/")).status,200);
  const login = await post("/admin/login/",{username:"zr-admin",password});
  assert.equal(login.status,303);
  const cookieHeader = login.headers.get("set-cookie");
  assert(cookieHeader.includes("Secure") && cookieHeader.includes("HttpOnly"));
  const cookie = cookieHeader.split(";")[0];
  const form = Object.fromEntries(Object.entries(defaultEntries()).map(([k,v])=>[k,v??""]));
  const save = await post("/admin/ceny/",{...form,mpi4:48123,revision:0},cookie);
  assert.equal(save.status,303); assert.match(save.headers.get("location"),/saved=1/);
  assert((await (await get("/ceny/")).text()).includes("48 123"));
  await stop(); await start();
  assert((await (await get("/ceny/")).text()).includes("48 123"),"saved price survives restart");
  assert((await (await get("/admin/",{headers:{Cookie:cookie}})).text()).includes('name="revision"'));
  assert.equal((await post("/admin/logout/",{},cookie)).status,303);
  assert(!(await (await get("/admin/",{headers:{Cookie:cookie}})).text()).includes('name="revision"'));
  if (process.argv.includes("--browser")) {
    const {checkEditorBrowser} = await import("./check-editor-browser.mjs");
    await checkEditorBrowser(stateDir, password, async origin => {
      await stop();
      env.PUBLIC_ORIGIN = origin;
      await start();
      return base;
    });
  }
  console.log(`${paths.length} pages, ${Object.keys(assets).length} assets, calculator, admin login, price persistence and logout passed.`);
} finally {
  await stop();
  rmSync(stateDir,{recursive:true,force:true});
}
