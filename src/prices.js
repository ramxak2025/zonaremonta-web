import { priceRows, defaultEntries } from "./business.js";

export async function catalog(env) {
  const row = await env.DB.prepare("SELECT revision, entries, updated_at FROM price_catalog WHERE id = 1").first();
  if (!row) return {entries:defaultEntries(), revision:0, updated:"2026-09-10"};
  return {entries:{...defaultEntries(), ...JSON.parse(row.entries)}, revision:row.revision, updated:row.updated_at};
}

export function validatePriceForm(form) {
  const revision = form.get("revision");
  if (typeof revision !== "string" || !/^(0|[1-9]\d{0,8})$/.test(revision)) return null;
  const entries = {};
  const legacy = !form.has("di6") && !form.has("di8");
  for (const row of priceRows) {
    if (legacy && (row.key === "di6" || row.key === "di8")) continue;
    const text = form.get(row.key);
    if (typeof text !== "string" || form.getAll(row.key).length !== 1) return null;
    const trimmed = text.trim();
    if (trimmed && !/^(0|[1-9]\d{0,6})$/.test(trimmed)) return null;
    entries[row.key] = trimmed === "" ? null : Number(trimmed);
  }
  return {entries, revision:Number(revision)};
}

export async function saveCatalog(env, data) {
  const entries = Object.hasOwn(data.entries,"di6") ? data.entries : {...(await catalog(env)).entries,...data.entries};
  const values = JSON.stringify(entries);
  const updated = new Date().toISOString();
  const write = data.revision === 0
    ? env.DB.prepare("INSERT INTO price_catalog (id, revision, entries, updated_at) VALUES (1, 1, ?, ?) ON CONFLICT (id) DO NOTHING").bind(values, updated)
    : env.DB.prepare("UPDATE price_catalog SET revision = revision + 1, entries = ?, updated_at = ? WHERE id = 1 AND revision = ?").bind(values, updated, data.revision);
  const result = await write.run();
  return result.meta.changes === 1;
}
