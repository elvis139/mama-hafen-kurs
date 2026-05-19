CREATE TABLE `community_questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userEmail` varchar(320) NOT NULL,
	`userName` text,
	`question` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `community_questions_id` PRIMARY KEY(`id`)
);
