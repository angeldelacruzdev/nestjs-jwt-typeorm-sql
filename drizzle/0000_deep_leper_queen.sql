CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`full_name` varchar(255),
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`hashdRt` varchar(255),
	`isActive` boolean DEFAULT true,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
