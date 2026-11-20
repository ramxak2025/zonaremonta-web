import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

const configDir = path.join(homedir(), ".config", "zonaremonta");
const envFile = process.env.ZR_ENV_FILE || path.join(configDir, "05auto.env");
if (process.env.ZR_ENV_FILE || existsSync(envFile)) process.loadEnvFile(envFile);

export const stateDir = path.resolve(process.env.ZR_DATA_DIR || path.join(homedir(), ".local", "share", "zonaremonta-05auto"));
export const hashFile = path.join(stateDir, "admin.hash");

export function workerSettings() {
  const origin = new URL(process.env.PUBLIC_ORIGIN || "https://05auto.ru");
  if (origin.protocol !== "https:" || origin.href !== origin.origin + "/") {
    throw new Error("PUBLIC_ORIGIN must be a single HTTPS origin.");
  }
  const hash = process.env.ZR_ADMIN_PASSWORD_HASH || (existsSync(hashFile) ? readFileSync(hashFile, "utf8").trim() : "");
  if (!/^[0-9a-f]{32}\.[0-9a-f]{64}$/.test(hash)) {
    throw new Error("Configure the editor with node scripts/setup-admin.mjs or ZR_ADMIN_PASSWORD_HASH.");
  }
  return {
    PUBLIC_ORIGIN: origin.origin,
    ZR_ADMIN_PASSWORD_HASH: hash,
    ZR_OPERATOR_NAME: process.env.ZR_OPERATOR_NAME,
    ZR_OPERATOR_ADDRESS: process.env.ZR_OPERATOR_ADDRESS,
    ZR_RF_ORIGIN: process.env.ZR_RF_ORIGIN,
    ZR_METRIKA_ID: process.env.ZR_METRIKA_ID,
  };
}
