import { mkdirSync, writeFileSync } from "node:fs";
import { pbkdf2Sync, randomBytes } from "node:crypto";
import { hashFile, stateDir } from "../hosting/config.mjs";

process.umask(0o077);
const fromInput = process.argv[2] === "--stdin";
if (process.argv.slice(2).length !== (fromInput ? 1 : 0) || (fromInput && process.stdin.isTTY)) {
  throw new Error("Use node scripts/setup-admin.mjs, or pipe a password with --stdin.");
}
let password = "";
if (fromInput) {
  process.stdin.setEncoding("utf8");
  for await (const part of process.stdin) {
    password += part;
    if (password.length > 130) throw new Error("Password is too long.");
  }
  password = password.replace(/\r?\n$/, "");
  if (!password || password.length > 128) throw new Error("Password must be 1–128 characters.");
} else {
  password = randomBytes(24).toString("base64url");
}
const salt = randomBytes(16);
const hash = pbkdf2Sync(password, salt, 100000, 32, "sha256");
mkdirSync(stateDir, {recursive: true, mode: 0o700});
writeFileSync(hashFile, salt.toString("hex") + "." + hash.toString("hex") + "\n", {flag: "wx", mode: 0o600});
console.log("Логин: zr-admin");
if (!fromInput) console.log("Пароль: " + password);
