import { db } from './index';
import { $eventos, generar_slug_evento, type InsertEvento, type SelectEvento } from './schema';
import { eq } from 'drizzle-orm';

export async function crear_evento(datos_evento: Omit<InsertEvento, 'slug'>): Promise<SelectEvento> {
  const slug = generar_slug_evento(datos_evento.nombre);
  
  const slug_final = slug;

  const [nuevo_evento] = await db.insert($eventos).values({ ...datos_evento, slug: slug_final }).returning();
  
  return nuevo_evento;
}

/**
 * Get event by slug for URL routing
 */
export async function obtener_evento_por_slug(slug: string): Promise<SelectEvento | undefined> {
  const [evento] = await db.select()
    .from($eventos)
    .where(eq($eventos.slug, slug))
    .limit(1);
    
  return evento;
}

/**
 * Get all events with their slugs
 */
export async function obtener_todos_los_eventos_con_slugs(): Promise<SelectEvento[]> {
  return await db
    .select()
    .from($eventos)
    .orderBy($eventos.fecha_inicio);
}

export async function actualizar_slug_evento(eventoId: number, nuevoSlug: string): Promise<void> {
  await db
    .update($eventos)
    .set({ slug: nuevoSlug })
    .where(eq($eventos.id, eventoId));
}

export function obtener_url_evento(evento: SelectEvento): string {
  return `/eventos/${evento.slug}`;
}