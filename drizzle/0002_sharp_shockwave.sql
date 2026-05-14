CREATE TABLE `video_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`videoId` varchar(128) NOT NULL,
	`videoTitle` varchar(256) NOT NULL,
	`eventType` enum('start','replay','complete') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `video_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `course_access` ADD `utmSource` varchar(128);--> statement-breakpoint
ALTER TABLE `course_access` ADD `utmMedium` varchar(128);--> statement-breakpoint
ALTER TABLE `course_access` ADD `utmCampaign` varchar(256);--> statement-breakpoint
ALTER TABLE `course_access` ADD `lastLoginAt` timestamp;