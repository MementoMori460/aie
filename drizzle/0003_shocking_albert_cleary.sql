CREATE TABLE `aiPrompts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`promptText` text NOT NULL,
	`isActive` integer DEFAULT false NOT NULL,
	`createdBy` integer NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_auditLogs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer,
	`evaluationId` integer,
	`action` text NOT NULL,
	`details` text,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_auditLogs`("id", "userId", "evaluationId", "action", "details", "createdAt") SELECT "id", "userId", "evaluationId", "action", "details", "createdAt" FROM `auditLogs`;--> statement-breakpoint
DROP TABLE `auditLogs`;--> statement-breakpoint
ALTER TABLE `__new_auditLogs` RENAME TO `auditLogs`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_evaluationIndicators` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`evaluationId` integer NOT NULL,
	`indicatorCode` text NOT NULL,
	`rawValue` text,
	`normalizedScore` real,
	`metadata` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_evaluationIndicators`("id", "evaluationId", "indicatorCode", "rawValue", "normalizedScore", "metadata", "createdAt", "updatedAt") SELECT "id", "evaluationId", "indicatorCode", "rawValue", "normalizedScore", "metadata", "createdAt", "updatedAt" FROM `evaluationIndicators`;--> statement-breakpoint
DROP TABLE `evaluationIndicators`;--> statement-breakpoint
ALTER TABLE `__new_evaluationIndicators` RENAME TO `evaluationIndicators`;--> statement-breakpoint
CREATE TABLE `__new_evaluations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`paperTitle` text NOT NULL,
	`paperAuthors` text,
	`paperDoi` text,
	`paperYear` integer,
	`paperJournal` text,
	`paperAbstract` text,
	`pdfPath` text,
	`boardChairId` integer,
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
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_evaluations`("id", "userId", "paperTitle", "paperAuthors", "paperDoi", "paperYear", "paperJournal", "paperAbstract", "pdfPath", "boardChairId", "evaluationMode", "scoreD1", "scoreD2", "scoreD3", "scoreD4", "scoreHIS", "scoreD5", "scoreD6", "scoreD7", "scoreD8", "scoreD9", "scoreD10", "scoreD11", "scoreD12", "scoreD13", "scoreD14", "scoreD15", "scoreD16", "cascadeMultiplier", "economicMultiplier", "socialMultiplier", "networkEffectScore", "status", "completedAt", "createdAt", "updatedAt") SELECT "id", "userId", "paperTitle", "paperAuthors", "paperDoi", "paperYear", "paperJournal", "paperAbstract", "pdfPath", "boardChairId", "evaluationMode", "scoreD1", "scoreD2", "scoreD3", "scoreD4", "scoreHIS", "scoreD5", "scoreD6", "scoreD7", "scoreD8", "scoreD9", "scoreD10", "scoreD11", "scoreD12", "scoreD13", "scoreD14", "scoreD15", "scoreD16", "cascadeMultiplier", "economicMultiplier", "socialMultiplier", "networkEffectScore", "status", "completedAt", "createdAt", "updatedAt" FROM `evaluations`;--> statement-breakpoint
DROP TABLE `evaluations`;--> statement-breakpoint
ALTER TABLE `__new_evaluations` RENAME TO `evaluations`;--> statement-breakpoint
CREATE TABLE `__new_reviewerAssignments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`evaluationId` integer NOT NULL,
	`userId` integer NOT NULL,
	`status` text DEFAULT 'assigned' NOT NULL,
	`assignedAt` integer NOT NULL,
	`completedAt` integer
);
--> statement-breakpoint
INSERT INTO `__new_reviewerAssignments`("id", "evaluationId", "userId", "status", "assignedAt", "completedAt") SELECT "id", "evaluationId", "userId", "status", "assignedAt", "completedAt" FROM `reviewerAssignments`;--> statement-breakpoint
DROP TABLE `reviewerAssignments`;--> statement-breakpoint
ALTER TABLE `__new_reviewerAssignments` RENAME TO `reviewerAssignments`;--> statement-breakpoint
CREATE TABLE `__new_reviews` (
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
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_reviews`("id", "evaluationId", "reviewerId", "scoreD1", "scoreD2", "scoreD3", "scoreD4", "scoreHIS", "comment", "status", "createdAt", "updatedAt") SELECT "id", "evaluationId", "reviewerId", "scoreD1", "scoreD2", "scoreD3", "scoreD4", "scoreHIS", "comment", "status", "createdAt", "updatedAt" FROM `reviews`;--> statement-breakpoint
DROP TABLE `reviews`;--> statement-breakpoint
ALTER TABLE `__new_reviews` RENAME TO `reviews`;--> statement-breakpoint
CREATE TABLE `__new_systemSettings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`description` text,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_systemSettings`("id", "key", "value", "description", "updatedAt") SELECT "id", "key", "value", "description", "updatedAt" FROM `systemSettings`;--> statement-breakpoint
DROP TABLE `systemSettings`;--> statement-breakpoint
ALTER TABLE `__new_systemSettings` RENAME TO `systemSettings`;--> statement-breakpoint
CREATE UNIQUE INDEX `systemSettings_key_unique` ON `systemSettings` (`key`);--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`openId` text NOT NULL,
	`name` text,
	`email` text,
	`password` text,
	`loginMethod` text,
	`role` text DEFAULT 'user' NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`lastSignedIn` integer NOT NULL,
	`isBlocked` integer DEFAULT false NOT NULL,
	`expertise` text
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "openId", "name", "email", "password", "loginMethod", "role", "createdAt", "updatedAt", "lastSignedIn", "isBlocked", "expertise") SELECT "id", "openId", "name", "email", "password", "loginMethod", "role", "createdAt", "updatedAt", "lastSignedIn", "isBlocked", "expertise" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_openId_unique` ON `users` (`openId`);