CREATE TABLE `checkout_test_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`status` enum('success','error') NOT NULL,
	`message` text NOT NULL,
	`errorCode` varchar(128),
	`responseTime` int,
	`testedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `checkout_test_logs_id` PRIMARY KEY(`id`)
);
