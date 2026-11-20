CREATE TABLE `admin_attempts` (
	`client_key` text PRIMARY KEY NOT NULL,
	`attempts` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `admin_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`credential_tag` text NOT NULL,
	`expires_at` integer NOT NULL
);
