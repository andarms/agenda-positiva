import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { $eventos } from "@/server/db/schema";
import { gte } from "drizzle-orm";

export async function GET() {
  try {
    const ahora = new Date();

    const eventos = await db
      .select({
        id: $eventos.id,
        nombre: $eventos.nombre,
        slug: $eventos.slug,
        descripcion: $eventos.descripcion,
        fecha_inicio: $eventos.fecha_inicio,
        fecha_fin: $eventos.fecha_fin,
        ubicacion: $eventos.ubicacion,
      })
      .from($eventos)
      .where(gte($eventos.fecha_fin, ahora.toISOString()))
      .orderBy($eventos.fecha_inicio);

    return NextResponse.json(eventos);
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
