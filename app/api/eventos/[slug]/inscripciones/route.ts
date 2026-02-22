import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { $personas, $grupos_asistencia, $inscripciones, $eventos } from '@/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { DatosFormulario } from '@/app/eventos/[slug]/inscripciones/components/FormularioInscripcion';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const datos: DatosFormulario = await request.json();
    const resolved_params = await params;
    const slug_evento = resolved_params.slug;

    // 1. Obtener el evento
    const evento = await db.select().from($eventos).where(eq($eventos.slug, slug_evento)).limit(1);
    if (evento.length === 0) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }
    const evento_id = evento[0].id;

    // 2. Crear el grupo de asistencia
    const [grupo_asistencia] = await db
      .insert($grupos_asistencia)
      .values({})
      .returning({ id: $grupos_asistencia.id });

    const grupo_id = grupo_asistencia.id;

    // 3. Crear o verificar persona principal
    const persona_principal = await crear_o_obtener_persona({
      nombres: datos.nombres,
      apellidos: datos.apellidos,
      fecha_nacimiento: datos.fecha_nacimiento,
      telefono: datos.celular,
      email: datos.email,
      tipo_identificacion: datos.tipo_documento,
      numero_identificacion: datos.numero_documento,
    });

    // 4. Actualizar el grupo con el líder
    await db
      .update($grupos_asistencia)
      .set({ lider_grupo_id: persona_principal.id })
      .where(eq($grupos_asistencia.id, grupo_id));

    // 5. Inscribir a la persona principal
    await db.insert($inscripciones).values({
      persona_id: persona_principal.id,
      evento_id: evento_id,
      requiere_hospedaje: datos.requiere_hospedaje ? 1 : 0,
      grupo_asistencia_id: grupo_id,
      relacion_con_lider: 'lider',
      estado: 'pendiente',
      necesidades_especiales: datos.comentarios_hospedaje || null,
    });

    // 6. Procesar familiares si requiere hospedaje
    if (datos.requiere_hospedaje) {
      const familiares_a_inscribir = [];

      // Procesar esposa
      if (datos.esposa && datos.viaja_con_esposa) {
        familiares_a_inscribir.push({
          datos: datos.esposa,
          relacion: 'esposa'
        });
      }

      // Procesar hijos
      if (datos.hijos && datos.viaja_con_hijos) {
        datos.hijos.forEach(hijo => {
          familiares_a_inscribir.push({
            datos: hijo,
            relacion: 'hijo'
          });
        });
      }

      // Procesar otros familiares
      if (datos.otros_familiares && datos.viaja_con_otro_familiar) {
        datos.otros_familiares.forEach(familiar => {
          familiares_a_inscribir.push({
            datos: familiar,
            relacion: familiar.parentesco || 'familiar'
          });
        });
      }

      // Inscribir familiares
      for (const familiar_info of familiares_a_inscribir) {
        const familiar = familiar_info.datos;
        
        if (familiar.cedula && familiar.nombres && familiar.apellidos) {
          const persona_familiar = await crear_o_obtener_persona({
            nombres: familiar.nombres,
            apellidos: familiar.apellidos,
            fecha_nacimiento: familiar.fecha_nacimiento,
            telefono: familiar.celular,
            email: '', // Los familiares pueden no tener email
            tipo_identificacion: familiar.tipo_documento,
            numero_identificacion: familiar.cedula,
          });

          await db.insert($inscripciones).values({
            persona_id: persona_familiar.id,
            evento_id: evento_id,
            requiere_hospedaje: 1, // Todos los familiares requieren hospedaje si llegaron hasta acá
            grupo_asistencia_id: grupo_id,
            relacion_con_lider: familiar_info.relacion,
            estado: 'pendiente',
          });
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      mensaje: 'Inscripción creada exitosamente',
      grupo_id: grupo_id 
    });

  } catch (error) {
    console.error('Error al crear inscripción:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

async function crear_o_obtener_persona(datos_persona: {
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  telefono: string;
  email: string;
  tipo_identificacion: string;
  numero_identificacion: string;
}) {
  // Primero intentar encontrar por número de identificación
  const persona_existente = await db
    .select()
    .from($personas)
    .where(eq($personas.numero_identificacion, datos_persona.numero_identificacion))
    .limit(1);

  if (persona_existente.length > 0) {
    // Persona existe, actualizar datos si es necesario
    const persona = persona_existente[0];
    await db
      .update($personas)
      .set({
        nombres: datos_persona.nombres,
        apellidos: datos_persona.apellidos,
        fecha_nacimiento: datos_persona.fecha_nacimiento,
        telefono: datos_persona.telefono,
        email: datos_persona.email || persona.email, // Mantener email existente si no se proporciona uno nuevo
        fecha_actualizacion: new Date().toISOString(),
      })
      .where(eq($personas.id, persona.id));

    return persona;
  }

  // Persona no existe, crear nueva
  const [nueva_persona] = await db
    .insert($personas)
    .values({
      nombres: datos_persona.nombres,
      apellidos: datos_persona.apellidos,
      fecha_nacimiento: datos_persona.fecha_nacimiento,
      telefono: datos_persona.telefono,
      email: datos_persona.email || null,
      tipo_identificacion: datos_persona.tipo_identificacion,
      numero_identificacion: datos_persona.numero_identificacion,
    })
    .returning();

  return nueva_persona;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolved_params = await params;
    const slug_evento = resolved_params.slug;
    
    // Obtener el evento
    const evento = await db.select().from($eventos).where(eq($eventos.slug, slug_evento)).limit(1);
    if (evento.length === 0) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }

    // Obtener inscripciones del evento con información de personas y grupos
    const inscripciones = await db
      .select({
        inscripcion_id: $inscripciones.id,
        persona_nombres: $personas.nombres,
        persona_apellidos: $personas.apellidos,
        persona_documento: $personas.numero_identificacion,
        grupo_id: $inscripciones.grupo_asistencia_id,
        relacion_con_lider: $inscripciones.relacion_con_lider,
        estado: $inscripciones.estado,
        requiere_hospedaje: $inscripciones.requiere_hospedaje,
        fecha_creacion: $inscripciones.fecha_creacion,
      })
      .from($inscripciones)
      .innerJoin($personas, eq($inscripciones.persona_id, $personas.id))
      .where(eq($inscripciones.evento_id, evento[0].id));

    return NextResponse.json({ inscripciones });

  } catch (error) {
    console.error('Error al obtener inscripciones:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}