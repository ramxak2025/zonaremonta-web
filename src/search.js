export const productionOrigin = "https://05auto.ru";
export const formerOrigin = "https://zr-auto-gbo.ramxak.chatgpt.site";
export const indexNowKey = "9da46c3158a2c1408eff9eebd675fd3b";
export const indexNowPath = "/" + indexNowKey + ".txt";

const oldPaths = new Map([
  ["/home/ustanovka-gbo/", "/uslugi/ustanovka-gbo/"],
  ["/wp-sitemap.xml", "/sitemap.xml"],
  ["/sitemap_index.xml", "/sitemap.xml"]
]);

export function legacyTarget(path){
  return oldPaths.get(path) || oldPaths.get(path + "/");
}

export function robotsFile(origin){
  return [
    "User-agent: *", "Allow: /", "Disallow: /api/", "Disallow: /mcp", "",
    "User-agent: Yandex", "Allow: /", "Disallow: /api/", "Disallow: /mcp",
    "Clean-param: utm_source&utm_medium&utm_campaign&utm_content&utm_term&yclid&gclid",
    "Clean-param: dailyKm&petrolUse&install&direct&basis /kalkulyator/", "",
    "Sitemap: " + origin + "/sitemap.xml", ""
  ].join("\n");
}
