CREATE TABLE `eventos` (
	`id` integer PRIMARY KEY NOT NULL,
	`nombre` text NOT NULL,
	`slug` text,
	`descripcion` text,
	`fecha_inicio` text NOT NULL,
	`fecha_fin` text NOT NULL,
	`ubicacion` text NOT NULL,
	`fecha_creacion` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`fecha_actualizacion` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `eventos_slug_unique` ON `eventos` (`slug`);--> statement-breakpoint
CREATE TABLE `grupos_asistencia` (
	`id` integer PRIMARY KEY NOT NULL,
	`lider_grupo_id` integer,
	`fecha_creacion` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`fecha_actualizacion` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `inscripciones` (
	`id` integer PRIMARY KEY NOT NULL,
	`persona_id` integer NOT NULL,
	`evento_id` integer NOT NULL,
	`requiere_hospedaje` integer DEFAULT 0 NOT NULL,
	`grupo_asistencia_id` integer,
	`relacion_con_lider` text,
	`estado` text DEFAULT 'pendiente' NOT NULL,
	`necesidades_especiales` text,
	`fecha_creacion` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`fecha_actualizacion` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`persona_id`) REFERENCES `personas`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`evento_id`) REFERENCES `eventos`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`grupo_asistencia_id`) REFERENCES `grupos_asistencia`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `personas` (
	`id` integer PRIMARY KEY NOT NULL,
	`nombres` text NOT NULL,
	`apellidos` text NOT NULL,
	`fecha_nacimiento` text NOT NULL,
	`telefono` text NOT NULL,
	`email` text,
	`tipo_identificacion` text NOT NULL,
	`numero_identificacion` text NOT NULL,
	`fecha_creacion` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`fecha_actualizacion` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `personas_telefono_unique` ON `personas` (`telefono`);--> statement-breakpoint
CREATE UNIQUE INDEX `personas_email_unique` ON `personas` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `personas_numero_identificacion_unique` ON `personas` (`numero_identificacion`);