import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { $eventos } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolved_params = await params;
    const slug_evento = resolved_params.slug;

    const evento = await db
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
      .where(eq($eventos.slug, slug_evento))
      .limit(1);

    if (evento.length === 0) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ evento: evento[0] });

  } catch (error) {
    console.error('Error al obtener evento:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}