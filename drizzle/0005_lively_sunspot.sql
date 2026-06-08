CREATE TABLE `review_follow_ups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`purchasedAt` timestamp NOT NULL DEFAULT (now()),
	`followUpSentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `review_follow_ups_id` PRIMARY KEY(`id`),
	CONSTRAINT `review_follow_ups_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`stars` int NOT NULL,
	`childAge` varchar(32),
	`beforeText` text,
	`afterText` text,
	`helpfulModule` text,
	`recommendation` text,
	`authorName` varchar(128),
	`missingText` text,
	`email` varchar(320) NOT NULL,
	`approved` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
