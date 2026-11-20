import http from "node:http";
import { isIP } from "node:net";
import { openDatabase } from "./database.mjs";
import { stateDir, workerSettings } from "./config.mjs";
import worker from "../dist/server/index.js";

process.umask(0o077);
const settings = workerSettings();
const db = openDatabase(stateDir);
const env = {...settings, DB: db};
const tasks = new Set();
const ctx = {waitUntil(work) {
  const done = Promise.resolve(work).catch(() => console.error("Background update failed."));
  tasks.add(done);
  done.finally(() => tasks.delete(done));
}};
const publicHeaders = ["accept", "content-type", "content-length", "cookie", "origin", "sec-fetch-site", "if-none-match"];
const maxBody = 16 * 1024;

async function readBody(req) {
  if (req.method === "GET" || req.method === "HEAD") return;
  if (Number(req.headers["content-length"]) > maxBody) {
    req.resume();
    throw Object.assign(new Error("Payload too large"), {status: 413});
  }
  let length = 0;
  const parts = [];
  for await (const part of req.iterator({destroyOnReturn: false})) {
    length += part.length;
    if (length > maxBody) {
      req.resume();
      throw Object.assign(new Error("Payload too large"), {status: 413});
    }
    parts.push(part);
  }
  return Buffer.concat(parts);
}

const server = http.createServer({maxHeaderSize: 16384, requestTimeout: 30000}, async (req, res) => {
  try {
    if (!req.url.startsWith("/") || req.url.startsWith("//") || req.url.includes("\\")) {
      res.writeHead(400).end();
      return;
    }
    const headers = new Headers();
    for (const key of publicHeaders) {
      if (typeof req.headers[key] === "string") headers.set(key, req.headers[key]);
    }
    const peer = req.socket.remoteAddress || "local";
    const realIp = req.headers["x-real-ip"];
    const localProxy = ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(peer);
    const trusted = process.env.ZR_TRUST_LOCAL_PROXY === "1" && localProxy && typeof realIp === "string" && isIP(realIp);
    headers.set("cf-connecting-ip", trusted ? realIp : peer);
    const request = new Request(settings.PUBLIC_ORIGIN + req.url, {
      method: req.method, headers, body: await readBody(req),
    });
    const answer = await worker.fetch(request, env, ctx);
    const output = Object.fromEntries(answer.headers);
    const cookies = answer.headers.getSetCookie();
    if (cookies.length) output["set-cookie"] = cookies;
    const bytes = req.method === "HEAD" || !answer.body ? null : Buffer.from(await answer.arrayBuffer());
    res.writeHead(answer.status, output);
    res.end(bytes);
  } catch (error) {
    if (!res.headersSent) res.writeHead(error.status || 500, {"Cache-Control":"no-store"});
    res.end();
    if (!error.status) console.error("Site request failed.");
  }
});
server.listen(Number(process.env.PORT || 3105), process.env.HOST || "127.0.0.1", () => {
  const addr = server.address();
  console.log("Зона Ремонта готова" + (addr && addr.port ? " · порт " + addr.port : ""));
});
function shutdown() {
  server.close(async () => { await Promise.allSettled(tasks); db.close(); });
}
process.once("SIGTERM", shutdown);
process.once("SIGINT", shutdown);
