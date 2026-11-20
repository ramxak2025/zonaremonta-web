CREATE TABLE `price_catalog` (
	`id` integer PRIMARY KEY NOT NULL,
	`revision` integer NOT NULL,
	`entries` text NOT NULL,
	`updated_at` text NOT NULL
);
