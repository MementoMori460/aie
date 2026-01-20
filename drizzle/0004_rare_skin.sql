CREATE TABLE `aiPrompts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`promptText` text NOT NULL,
	`isActive` integer DEFAULT false NOT NULL,
	`createdBy` integer NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `users` ADD `isBlocked` integer DEFAULT false NOT NULL;