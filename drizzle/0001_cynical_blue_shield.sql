CREATE TABLE `course_access` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`magicToken` varchar(128),
	`tokenExpiresAt` timestamp,
	`sessionToken` varchar(128),
	`sessionExpiresAt` timestamp,
	`grantedAt` timestamp NOT NULL DEFAULT (now()),
	`isActive` boolean NOT NULL DEFAULT true,
	CONSTRAINT `course_access_id` PRIMARY KEY(`id`),
	CONSTRAINT `course_access_email_unique` UNIQUE(`email`)
);
