import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { once } from "node:events";
import { readFileSync } from "node:fs";
import http from "node:http";
import https from "node:https";
import { createRequire } from "node:module";
import path from "node:path";

// Runs only against the temporary price database created by check-hosting.
export async function checkEditorBrowser(stateDir, password, restartAt) {
  const {chromium} = createRequire(import.meta.url)(process.env.ZR_TEST_PLAYWRIGHT);
  const key = path.join(stateDir, "loopback.key"), cert = path.join(stateDir, "loopback.crt");
  execFileSync("openssl", ["req","-x509","-newkey","rsa:2048","-nodes","-days","1",
    "-subj","/CN=127.0.0.1","-addext","subjectAltName=IP:127.0.0.1","-keyout",key,"-out",cert], {stdio:"ignore"});
  let backend, browser, reproduceOldPolicy = true;
  const posts = [];
  const proxy = https.createServer({key:readFileSync(key),cert:readFileSync(cert)}, (req, res) => {
    const upstream = http.request(new URL(req.url, backend), {method:req.method,headers:req.headers}, result => {
      if (req.method === "POST") posts.push([req.url, req.headers.origin, result.statusCode]);
      const headers = {...result.headers};
      if (reproduceOldPolicy && req.url === "/admin/") headers["referrer-policy"] = "no-referrer";
      res.writeHead(result.statusCode, headers);
      result.pipe(res);
    });
    upstream.on("error", () => res.writeHead(502).end());
    req.pipe(upstream);
  });
  try {
    proxy.listen(0, "127.0.0.1");
    await once(proxy, "listening");
    const origin = "https://127.0.0.1:" + proxy.address().port;
    backend = await restartAt(origin);
    browser = await chromium.launch({executablePath:process.env.CHROME_BIN});
    for (const javaScriptEnabled of [false, true]) {
      const context = await browser.newContext({ignoreHTTPSErrors:true, javaScriptEnabled, viewport:{width:375,height:667}, isMobile:true});
      const page = await context.newPage();
      async function logIn() {
        await page.goto(origin + "/admin/");
        await page.getByLabel("Логин", {exact:true}).fill("zr-admin");
        await page.getByLabel("Пароль", {exact:true}).fill(password);
        await page.getByRole("button", {name:"Войти",exact:true}).click();
      }
      if (reproduceOldPolicy) {
        await logIn();
        await page.getByRole("heading", {name:"Откройте редактор цен ещё раз"}).waitFor();
        assert.deepEqual(posts.pop(), ["/admin/login/", "null", 403]);
        reproduceOldPolicy = false;
      }
      await logIn();
      const price = javaScriptEnabled ? "49322" : "49321";
      await page.locator("input[name=mpi4]").fill(price);
      assert.equal(await page.locator("form.price-form input[type=number]").count(), 9);
      await page.getByRole("button", {name:"Сохранить цены"}).click();
      await page.getByRole("status").waitFor();
      assert.match(await page.getByRole("status").textContent(), /Цены сохранены/);
      await page.reload();
      assert.equal(await page.locator("input[name=mpi4]").inputValue(), price);
      await page.getByRole("link", {name:"Открыть прайс"}).click();
      const publicPrice = new Intl.NumberFormat("ru-RU").format(Number(price));
      assert((await page.locator("main").textContent()).includes(publicPrice));
      await page.goto(origin + "/admin/");
      await page.getByRole("button", {name:"Выйти из кабинета"}).click();
      await page.getByLabel("Пароль", {exact:true}).waitFor();
      assert.deepEqual(posts.splice(0), ["/admin/login/", "/admin/ceny/", "/admin/logout/"].map(route => [route, origin, 303]));
      await context.close();
    }
    console.log("Old blank-login condition reproduced. Native browser login, save, public price and logout passed with JavaScript off and on.");
  } finally {
    await browser?.close();
    proxy.closeAllConnections();
    await new Promise(resolve => proxy.close(resolve));
  }
}
