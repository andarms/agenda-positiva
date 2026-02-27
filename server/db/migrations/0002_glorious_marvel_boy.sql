CREATE TABLE `usuarios_sistema` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`nombre` text,
	`activo` integer DEFAULT 1 NOT NULL,
	`fecha_creacion` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`fecha_actualizacion` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `usuarios_sistema_email_unique` ON `usuarios_sistema` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `usuarios_sistema_email_idx` ON `usuarios_sistema` (`email`);