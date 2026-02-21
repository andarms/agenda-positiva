CREATE TABLE `attendance_groups` (
	`id` integer PRIMARY KEY NOT NULL,
	`group_leader_id` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`location` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `people` (
	`id` integer PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`age` integer NOT NULL,
	`phone_number` text NOT NULL,
	`email` text,
	`identification_type` text NOT NULL,
	`identification_number` text NOT NULL,
	`date_of_birth` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `people_phone_number_unique` ON `people` (`phone_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `people_email_unique` ON `people` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `people_identification_number_unique` ON `people` (`identification_number`);--> statement-breakpoint
CREATE TABLE `registrations` (
	`id` integer PRIMARY KEY NOT NULL,
	`person_id` integer NOT NULL,
	`event_id` integer NOT NULL,
	`requires_accommodation` integer DEFAULT 0 NOT NULL,
	`attendance_group_id` integer,
	`relationship_to_leader` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`especial_needs` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`person_id`) REFERENCES `people`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`attendance_group_id`) REFERENCES `attendance_groups`(`id`) ON UPDATE no action ON DELETE no action
);
