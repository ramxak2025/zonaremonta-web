CREATE TABLE `analytics_consent` (
	`receipt` text PRIMARY KEY NOT NULL,
	`version` text NOT NULL,
	`operator` text NOT NULL,
	`counter` text NOT NULL,
	`accepted_at` integer NOT NULL,
	`expires_at` integer NOT NULL
);
