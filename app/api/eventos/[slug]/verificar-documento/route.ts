import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import {
  $personas,
  $inscripciones,
  $eventos,
  $grupos_asistencia,
} from "@/server/db/schema";
import { eq, and, ne } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { tipo_documento, numero_documento } = await request.json();
    const resolved_params = await params;
    const slug_evento = resolved_params.slug;

    if (!tipo_documento || !numero_documento) {
      return NextResponse.json(
        { error: "Tipo de documento y número de documento son requeridos" },
        { status: 400 },
      );
    }

    // 1. Obtener el evento
    const evento = await db
      .select()
      .from($eventos)
      .where(eq($eventos.slug, slug_evento))
      .limit(1);

    if (evento.length === 0) {
      return NextResponse.json(
        { error: "Evento no encontrado" },
        { status: 404 },
      );
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
        mensaje: "Documento no registrado. Puede continuar con la inscripción.",
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
        grupo_asistencia_id: $inscripciones.grupo_asistencia_id,
        necesidades_especiales: $inscripciones.necesidades_especiales,
      })
      .from($inscripciones)
      .where(
        and(
          eq($inscripciones.persona_id, persona[0].id),
          eq($inscripciones.evento_id, evento_id),
        ),
      )
      .limit(1);

    if (inscripcion.length === 0) {
      // Persona existe pero no está inscrita a este evento
      return NextResponse.json({
        esta_registrada: false,
        puede_continuar: true,
        mensaje:
          "Persona registrada en el sistema pero no inscrita a este evento. Puede continuar.",
        datos_persona: {
          nombres: persona[0].nombres,
          apellidos: persona[0].apellidos,
          fecha_nacimiento: persona[0].fecha_nacimiento,
          telefono: persona[0].telefono,
          email: persona[0].email,
          tipo_documento: persona[0].tipo_identificacion,
          numero_documento: persona[0].numero_identificacion,
        },
      });
    }

    // 4. Persona ya inscrita - obtener información completa del grupo
    const inscripcion_data = inscripcion[0];
    let otros_miembros_grupo = [];

    // Si tiene grupo de asistencia, obtener otros miembros
    if (inscripcion_data.grupo_asistencia_id) {
      otros_miembros_grupo = await db
        .select({
          nombres: $personas.nombres,
          apellidos: $personas.apellidos,
          cedula: $personas.numero_identificacion,
          relacion_con_lider: $inscripciones.relacion_con_lider,
          requiere_hospedaje: $inscripciones.requiere_hospedaje,
        })
        .from($inscripciones)
        .innerJoin($personas, eq($inscripciones.persona_id, $personas.id))
        .where(
          and(
            eq(
              $inscripciones.grupo_asistencia_id,
              inscripcion_data.grupo_asistencia_id,
            ),
            eq($inscripciones.evento_id, evento_id),
            ne($inscripciones.persona_id, persona[0].id), // Excluir la persona actual
          ),
        );
    }

    // Formatear respuesta según interface RegistroExistente
    const registro_existente = {
      cedula: persona[0].numero_identificacion,
      nombres: persona[0].nombres,
      apellidos: persona[0].apellidos,
      tipo_documento: persona[0].tipo_identificacion,
      sexo: "", // Este campo no está en la base de datos actual
      fecha_nacimiento: persona[0].fecha_nacimiento,
      celular: persona[0].telefono,
      email: persona[0].email || "",
      departamento: "", // Este campo no está en la base de datos actual
      municipio: "", // Este campo no está en la base de datos actual
      participa_primer_evento: false, // Este campo no está en la base de datos actual
      requiere_hospedaje: inscripcion_data.requiere_hospedaje === 1,
      esta_sirviendo: false, // Este campo no está en la base de datos actual
      servicios: [], // Este campo no está en la base de datos actual
      familiares: [], // Este campo no está en la base de datos actual
      comentarios_hospedaje: inscripcion_data.necesidades_especiales || "",
      fecha_registro: inscripcion_data.fecha_creacion,
      grupo_asistencia_id: inscripcion_data.grupo_asistencia_id,
      relacion_con_lider: inscripcion_data.relacion_con_lider,
      otros_miembros_grupo: otros_miembros_grupo.map((miembro) => ({
        nombres: miembro.nombres,
        apellidos: miembro.apellidos,
        cedula: miembro.cedula,
        relacion_con_lider: miembro.relacion_con_lider,
        requiere_hospedaje: miembro.requiere_hospedaje === 1,
      })),
    };

    return NextResponse.json({
      esta_registrada: true,
      puede_continuar: false,
      mensaje: "Esta persona ya está inscrita a este evento.",
      ...registro_existente,
    });
  } catch (error) {
    console.error("Error al verificar documento:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
