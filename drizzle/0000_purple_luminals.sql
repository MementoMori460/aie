CREATE TABLE `auditLogs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer,
	`evaluationId` integer,
	`action` text NOT NULL,
	`details` text,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `evaluationIndicators` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`evaluationId` integer NOT NULL,
	`indicatorCode` text NOT NULL,
	`rawValue` text,
	`normalizedScore` real,
	`metadata` text,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `evaluations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`paperTitle` text NOT NULL,
	`paperAuthors` text,
	`paperDoi` text,
	`paperYear` integer,
	`paperJournal` text,
	`paperAbstract` text,
	`evaluationMode` text DEFAULT 'quick' NOT NULL,
	`scoreD1` real,
	`scoreD2` real,
	`scoreD3` real,
	`scoreD4` real,
	`scoreHIS` real,
	`scoreD5` real,
	`scoreD6` real,
	`scoreD7` real,
	`scoreD8` real,
	`scoreD9` real,
	`scoreD10` real,
	`scoreD11` real,
	`scoreD12` real,
	`scoreD13` real,
	`scoreD14` real,
	`scoreD15` real,
	`scoreD16` real,
	`cascadeMultiplier` real,
	`economicMultiplier` real,
	`socialMultiplier` real,
	`networkEffectScore` real,
	`status` text DEFAULT 'draft' NOT NULL,
	`completedAt` integer,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reviewerAssignments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`evaluationId` integer NOT NULL,
	`userId` integer NOT NULL,
	`status` text DEFAULT 'assigned' NOT NULL,
	`assignedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`completedAt` integer
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`evaluationId` integer NOT NULL,
	`reviewerId` integer NOT NULL,
	`scoreD1` real,
	`scoreD2` real,
	`scoreD3` real,
	`scoreD4` real,
	`scoreHIS` real,
	`comment` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`openId` text NOT NULL,
	`name` text,
	`email` text,
	`loginMethod` text,
	`role` text DEFAULT 'user' NOT NULL,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`lastSignedIn` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_openId_unique` ON `users` (`openId`);