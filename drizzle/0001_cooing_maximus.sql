CREATE TABLE `fuel_board` (
	`id` integer PRIMARY KEY NOT NULL,
	`payload` text,
	`checked_at` text,
	`next_attempt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `price_editor` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`invitation_hash` text NOT NULL
);
