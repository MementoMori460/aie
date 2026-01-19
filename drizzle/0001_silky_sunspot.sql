CREATE TABLE `evaluationIndicators` (
	`id` int AUTO_INCREMENT NOT NULL,
	`evaluationId` int NOT NULL,
	`indicatorCode` varchar(20) NOT NULL,
	`rawValue` text,
	`normalizedScore` decimal(5,2),
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `evaluationIndicators_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evaluations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`paperTitle` text NOT NULL,
	`paperAuthors` text,
	`paperDoi` varchar(255),
	`paperYear` int,
	`paperJournal` text,
	`paperAbstract` text,
	`scoreD1` decimal(5,2),
	`scoreD2` decimal(5,2),
	`scoreD3` decimal(5,2),
	`scoreD4` decimal(5,2),
	`scoreHIS` decimal(5,2),
	`status` enum('draft','completed') NOT NULL DEFAULT 'draft',
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `evaluations_id` PRIMARY KEY(`id`)
);
