import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { $personas } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { cedula } = await request.json();

    if (!cedula || cedula.trim() === '') {
      return NextResponse.json(
        { error: 'Número de cédula es requerido' },
        { status: 400 }
      );
    }

    const persona = await db
      .select({
        id: $personas.id,
        nombres: $personas.nombres,
        apellidos: $personas.apellidos,
        fecha_nacimiento: $personas.fecha_nacimiento,
        telefono: $personas.telefono,
        email: $personas.email,
        tipo_identificacion: $personas.tipo_identificacion,
        numero_identificacion: $personas.numero_identificacion,
      })
      .from($personas)
      .where(eq($personas.numero_identificacion, cedula.trim()))
      .limit(1);

    if (persona.length === 0) {
      return NextResponse.json({
        encontrada: false,
        mensaje: 'Persona no encontrada en el sistema'
      });
    }

    return NextResponse.json({
      encontrada: true,
      persona: persona[0]
    });

  } catch (error) {
    console.error('Error al buscar persona:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}