"use server";

import { db } from "@/server/db";
import { $eventos, generar_slug_evento } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function toggleEventoActivo(
  eventoSlug: string,
  redirectTo?: string,
) {
  try {
    // Obtener el evento actual
    const eventoActual = await db
      .select()
      .from($eventos)
      .where(eq($eventos.slug, eventoSlug))
      .limit(1);

    if (eventoActual.length === 0) {
      throw new Error("Evento no encontrado");
    }

    const evento = eventoActual[0];

    if (evento.activo === 1) {
      // Si está activo, desactivarlo
      await db
        .update($eventos)
        .set({
          activo: 0,
          fecha_actualizacion: new Date().toISOString(),
        })
        .where(eq($eventos.id, evento.id));
    } else {
      // Si no está activo, activarlo y desactivar todos los demás
      // Primero desactivar todos los eventos
      await db.update($eventos).set({
        activo: 0,
        fecha_actualizacion: new Date().toISOString(),
      });

      // Luego activar solo este evento
      await db
        .update($eventos)
        .set({
          activo: 1,
          fecha_actualizacion: new Date().toISOString(),
        })
        .where(eq($eventos.id, evento.id));
    }

    if (redirectTo) {
      redirect(redirectTo);
    } else {
      redirect(`/admin/eventos/${eventoSlug}`);
    }
  } catch (error) {
    console.error("Error al cambiar estado del evento:", error);
    throw new Error("Error al cambiar estado del evento");
  }
}

export async function crearEvento(formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const descripcion = formData.get("descripcion") as string;
  const fecha_inicio = formData.get("fecha_inicio") as string;
  const fecha_fin = formData.get("fecha_fin") as string;
  const ubicacion = formData.get("ubicacion") as string;

  // Validaciones básicas
  if (!nombre || !fecha_inicio || !fecha_fin || !ubicacion) {
    throw new Error("Todos los campos requeridos deben ser completados");
  }

  // Generar slug único
  const slug = generar_slug_evento(nombre);

  // Verificar que el slug no exista
  const existeSlug = await db
    .select()
    .from($eventos)
    .where(eq($eventos.slug, slug))
    .limit(1);

  if (existeSlug.length > 0) {
    throw new Error("Ya existe un evento con un nombre similar");
  }

  // Crear el evento
  await db
    .insert($eventos)
    .values({
      nombre,
      slug,
      descripcion: descripcion || null,
      fecha_inicio,
      fecha_fin,
      ubicacion,
      activo: 0, // Por defecto inactivo
    })
    .returning();

  // Redireccionar al evento creado
  redirect(`/admin/eventos/${slug}`);
}
