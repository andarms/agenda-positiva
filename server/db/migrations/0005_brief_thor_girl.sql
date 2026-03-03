DROP INDEX "accounts_user_id_idx";--> statement-breakpoint
DROP INDEX "eventos_slug_unique";--> statement-breakpoint
DROP INDEX "personas_telefono_unique";--> statement-breakpoint
DROP INDEX "personas_email_unique";--> statement-breakpoint
DROP INDEX "personas_numero_identificacion_unique";--> statement-breakpoint
DROP INDEX "sessions_user_id_idx";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
DROP INDEX "users_email_idx";--> statement-breakpoint
DROP INDEX "usuarios_sistema_email_unique";--> statement-breakpoint
DROP INDEX "usuarios_sistema_email_idx";--> statement-breakpoint
ALTER TABLE `inscripciones` ALTER COLUMN "localidad" TO "localidad" text;--> statement-breakpoint
CREATE INDEX `accounts_user_id_idx` ON `accounts` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `eventos_slug_unique` ON `eventos` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `personas_telefono_unique` ON `personas` (`telefono`);--> statement-breakpoint
CREATE UNIQUE INDEX `personas_email_unique` ON `personas` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `personas_numero_identificacion_unique` ON `personas` (`numero_identificacion`);--> statement-breakpoint
CREATE INDEX `sessions_user_id_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `usuarios_sistema_email_unique` ON `usuarios_sistema` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `usuarios_sistema_email_idx` ON `usuarios_sistema` (`email`);