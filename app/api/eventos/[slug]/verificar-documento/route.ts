import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { $personas, $inscripciones, $eventos } from '@/server/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { tipo_documento, numero_documento } = await request.json();
    const resolved_params = await params;
    const slug_evento = resolved_params.slug;

    if (!tipo_documento || !numero_documento) {
      return NextResponse.json(
        { error: 'Tipo de documento y número de documento son requeridos' },
        { status: 400 }
      );
    }

    // 1. Obtener el evento
    const evento = await db
      .select()
      .from($eventos)
      .where(eq($eventos.slug, slug_evento))
      .limit(1);

    if (evento.length === 0) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }

    const evento_id = evento[0].id;

    // 2. Buscar si la persona existe
    const persona = await db
      .select()
      .from($personas)
      .where(eq($personas.numero_identificacion, numero_documento))
      .limit(1);

    if (persona.length === 0) {
      // Persona no registrada en el sistema
      return NextResponse.json({
        esta_registrada: false,
        puede_continuar: true,
        mensaje: 'Documento no registrado. Puede continuar con la inscripción.',
      });
    }

    // 3. Verificar si ya está inscrita a este evento
    const inscripcion = await db
      .select({
        id: $inscripciones.id,
        estado: $inscripciones.estado,
        fecha_creacion: $inscripciones.fecha_creacion,
        requiere_hospedaje: $inscripciones.requiere_hospedaje,
        relacion_con_lider: $inscripciones.relacion_con_lider,
      })
      .from($inscripciones)
      .where(
        and(
          eq($inscripciones.persona_id, persona[0].id),
          eq($inscripciones.evento_id, evento_id)
        )
      )
      .limit(1);

    if (inscripcion.length === 0) {
      // Persona existe pero no está inscrita a este evento
      return NextResponse.json({
        esta_registrada: false,
        puede_continuar: true,
        mensaje: 'Persona registrada en el sistema pero no inscrita a este evento. Puede continuar.',
        datos_persona: {
          nombres: persona[0].nombres,
          apellidos: persona[0].apellidos,
          fecha_nacimiento: persona[0].fecha_nacimiento,
          telefono: persona[0].telefono,
          email: persona[0].email,
          tipo_documento: persona[0].tipo_identificacion,
          numero_documento: persona[0].numero_identificacion,
        }
      });
    }

    // 4. Persona ya inscrita
    return NextResponse.json({
      esta_registrada: true,
      puede_continuar: false,
      mensaje: 'Esta persona ya está inscrita a este evento.',
      inscripcion: {
        id: inscripcion[0].id,
        estado: inscripcion[0].estado,
        fecha_creacion: inscripcion[0].fecha_creacion,
        requiere_hospedaje: inscripcion[0].requiere_hospedaje === 1,
        relacion_con_lider: inscripcion[0].relacion_con_lider,
      },
      datos_persona: {
        nombres: persona[0].nombres,
        apellidos: persona[0].apellidos,
        fecha_nacimiento: persona[0].fecha_nacimiento,
        telefono: persona[0].telefono,
        email: persona[0].email,
        tipo_documento: persona[0].tipo_identificacion,
        numero_documento: persona[0].numero_identificacion,
      }
    });

  } catch (error) {
    console.error('Error al verificar documento:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}