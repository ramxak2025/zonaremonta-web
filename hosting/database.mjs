import { mkdirSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const migrations = new URL("../drizzle/", import.meta.url);
const snapshot = JSON.parse(readFileSync(new URL("./public-seed.json", import.meta.url), "utf8"));

export function openDatabase(directory) {
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(path.join(directory, "site.sqlite"));
  try {
    db.exec("PRAGMA busy_timeout=10000; PRAGMA foreign_keys=ON; BEGIN IMMEDIATE");
    db.exec("CREATE TABLE IF NOT EXISTS host_migrations (name TEXT PRIMARY KEY NOT NULL)");
    const applied = db.prepare("SELECT 1 FROM host_migrations WHERE name=?");
    const record = db.prepare("INSERT INTO host_migrations(name) VALUES (?)");
    for (const name of readdirSync(migrations).filter(n => n.endsWith(".sql")).sort()) {
      if (applied.get(name)) continue;
      db.exec(readFileSync(new URL(name, migrations), "utf8"));
      record.run(name);
    }
    if (!applied.get("sites-public-v11")) {
      const prices = db.prepare("INSERT OR IGNORE INTO price_catalog(id,revision,entries,updated_at) VALUES(?,?,?,?)");
      for (const row of snapshot.price_catalog) prices.run(row.id, row.revision, row.entries, row.updated_at);
      const fuel = db.prepare("INSERT OR IGNORE INTO fuel_board(id,payload,checked_at,next_attempt) VALUES(?,?,?,?)");
      for (const row of snapshot.fuel_board) fuel.run(row.id, row.payload, row.checked_at, row.next_attempt);
      record.run("sites-public-v11");
    }
    db.exec("COMMIT");
  } catch (error) {
    if (db.isTransaction) db.exec("ROLLBACK");
    db.close();
    throw error;
  }
  return {
    close: () => db.close(),
    prepare(sql) {
      const stmt = db.prepare(sql);
      const withArgs = (args) => ({
        bind: (...values) => withArgs(values),
        first: async () => stmt.get(...args) ?? null,
        run: async () => ({meta: {changes: Number(stmt.run(...args).changes)}}),
      });
      return withArgs([]);
    },
  };
}
