import { sql } from 'drizzle-orm';
import { sqliteTable, integer, text, uniqueIndex, index } from "drizzle-orm/sqlite-core";


export const $personas = sqliteTable('personas', {
  id: integer('id').primaryKey(),
  nombres: text('nombres').notNull(),
  apellidos: text('apellidos').notNull(),
  fecha_nacimiento: text('fecha_nacimiento').notNull(), // Using text for date storage in SQLite
  telefono: text('telefono').unique().notNull(),
  email: text('email').unique(),
  tipo_identificacion: text('tipo_identificacion').notNull(),
  numero_identificacion: text('numero_identificacion').unique().notNull(),
  fecha_creacion: text('fecha_creacion').default(sql`CURRENT_TIMESTAMP`).notNull(),
  fecha_actualizacion: text('fecha_actualizacion').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const $grupos_asistencia = sqliteTable('grupos_asistencia', {
  id: integer('id').primaryKey(),
  lider_grupo_id: integer('lider_grupo_id'), // opcional, referencia a persona que lidera el grupo
  fecha_creacion: text('fecha_creacion').default(sql`CURRENT_TIMESTAMP`).notNull(),
  fecha_actualizacion: text('fecha_actualizacion').default(sql`CURRENT_TIMESTAMP`).notNull(),
});


export const $eventos = sqliteTable('eventos', {
  id: integer('id').primaryKey(),
  nombre: text('nombre').notNull(),
  slug: text('slug').unique(),
  descripcion: text('descripcion'),
  fecha_inicio: text('fecha_inicio').notNull(), // Usando text para almacenamiento de fechas en SQLite
  fecha_fin: text('fecha_fin').notNull(), // Usando text para almacenamiento de fechas en SQLite
  ubicacion: text('ubicacion').notNull(),
  fecha_creacion: text('fecha_creacion').default(sql`CURRENT_TIMESTAMP`).notNull(),
  fecha_actualizacion: text('fecha_actualizacion').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const $inscripciones = sqliteTable('inscripciones', {
  id: integer('id').primaryKey(),
  persona_id: integer('persona_id').notNull().references(() => $personas.id),
  evento_id: integer('evento_id').notNull().references(() => $eventos.id),
  requiere_hospedaje: integer('requiere_hospedaje').notNull().default(0), // 0 for no, 1 for yes
  grupo_asistencia_id: integer('grupo_asistencia_id').references(() => $grupos_asistencia.id), // Grupo para esta inscripción específica
  relacion_con_lider: text('relacion_con_lider'), // ej: "esposa", "hijo", "amigo", etc.
  estado: text('estado').notNull().default('pendiente'), // pendiente, confirmado, cancelado, completado, no_asistio
  necesidades_especiales: text('necesidades_especiales'), // Ej: "requiere silla de ruedas", "alergia a alimentos", etc.
  fecha_creacion: text('fecha_creacion').default(sql`CURRENT_TIMESTAMP`).notNull(),
  fecha_actualizacion: text('fecha_actualizacion').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// ============================================================================
// indexes
// ============================================================================
export const inscripcion_persona_evento_idx = uniqueIndex('inscripcion_persona_evento_idx').on($inscripciones.persona_id, $inscripciones.evento_id);
export const inscripcion_estado_idx = index('inscripcion_estado_idx').on($inscripciones.estado);
export const inscripcion_evento_idx = index('inscripcion_evento_idx').on($inscripciones.evento_id);
export const inscripcion_grupo_idx = index('inscripcion_grupo_idx').on($inscripciones.grupo_asistencia_id);
export const personas_email_idx = uniqueIndex('personas_email_idx').on($personas.email);
export const personas_telefono_idx = uniqueIndex('personas_telefono_idx').on($personas.telefono);
export const personas_numero_identificacion_idx = uniqueIndex('personas_numero_identificacion_idx').on($personas.numero_identificacion);
export const eventos_slug_idx = uniqueIndex('eventos_slug_idx').on($eventos.slug);


// ============================================================================
// Types
// ============================================================================
export type InsertGrupoAsistencia = typeof $grupos_asistencia.$inferInsert;
export type SelectGrupoAsistencia = typeof $grupos_asistencia.$inferSelect;

export type InsertPersona = typeof $personas.$inferInsert;
export type SelectPersona = typeof $personas.$inferSelect;

export type InsertInscripcion = typeof $inscripciones.$inferInsert;
export type SelectInscripcion = typeof $inscripciones.$inferSelect;

export type InsertEvento = typeof $eventos.$inferInsert;
export type SelectEvento = typeof $eventos.$inferSelect;

// ============================================================================
// Helper functions
// ============================================================================
export function generar_slug_evento(nombre: string): string {
  return nombre
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Reemplazar espacios con guiones
    .replace(/[\/]/g, '-')          // Reemplazar barras con guiones
    .replace(/["']/g, '')           // Eliminar comillas
    .replace(/&/g, 'y')             // Reemplazar & con 'y' (español para 'y')
    .replace(/[^\w\-]/g, '')        // Eliminar caracteres especiales excepto guiones
    .replace(/--+/g, '-')           // Reemplazar múltiples guiones con un solo guion
    .replace(/^-+|-+$/g, '');       // Eliminar guiones al inicio/final
}