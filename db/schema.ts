import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const priceCatalog = sqliteTable("price_catalog", {
  id: integer("id").primaryKey(),
  revision: integer("revision").notNull(),
  entries: text("entries").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const fuelBoard = sqliteTable("fuel_board", {
  id: integer("id").primaryKey(),
  payload: text("payload"),
  checkedAt: text("checked_at"),
  nextAttempt: integer("next_attempt").notNull(),
});

export const priceEditor = sqliteTable("price_editor", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull(),
  invitationHash: text("invitation_hash").notNull(),
});

export const adminSessions = sqliteTable("admin_sessions", {
  tokenHash: text("token_hash").primaryKey(),
  credentialTag: text("credential_tag").notNull(),
  expiresAt: integer("expires_at").notNull(),
});

export const adminAttempts = sqliteTable("admin_attempts", {
  clientKey: text("client_key").primaryKey(),
  attempts: integer("attempts").notNull(),
  expiresAt: integer("expires_at").notNull(),
});

export const analyticsConsent = sqliteTable("analytics_consent", {
  receipt: text("receipt").primaryKey(),
  version: text("version").notNull(),
  operator: text("operator").notNull(),
  counter: text("counter").notNull(),
  acceptedAt: integer("accepted_at").notNull(),
  expiresAt: integer("expires_at").notNull(),
});
