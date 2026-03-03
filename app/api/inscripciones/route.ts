import { NextResponse } from "next/server";
import { db } from "@/server/db";
import {
  $personas,
  $inscripciones,
  $grupos_asistencia,
  $eventos,
  InsertPersona,
  InsertInscripcion,
  InsertGrupoAsistencia,
} from "@/server/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const datos = await request.json();

    // Get active event
    const evento_activo = await db
      .select()
      .from($eventos)
      .where(eq($eventos.activo, 1))
      .limit(1);

    if (evento_activo.length === 0) {
      return NextResponse.json(
        { error: "No hay evento activo configurado" },
        { status: 400 }
      );
    }

    const evento = evento_activo[0];

    // Extract main registrant data
    const {
      tipo_documento,
      numero_documento,
      nombres,
      apellidos,
      fecha_nacimiento,
      celular,
      email,
      localidad,
      requiere_hospedaje,
      necesidades_especiales,
      familiares = [],
      relacion_con_lider,
    } = datos;

    // Validation
    if (
      !tipo_documento ||
      !numero_documento ||
      !nombres ||
      !apellidos ||
      !fecha_nacimiento ||
      !celular ||
      !localidad
    ) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const resultado = await db.transaction(async (tx) => {
      // Check if person already exists
      const persona_existente = await tx
        .select()
        .from($personas)
        .where(eq($personas.numero_identificacion, numero_documento))
        .limit(1);

      let persona_id: number;

      if (persona_existente.length > 0) {
        persona_id = persona_existente[0].id;

        // Update existing person
        await tx
          .update($personas)
          .set({
            nombres,
            apellidos,
            fecha_nacimiento,
            telefono: celular,
            email: email || null,
            tipo_identificacion: tipo_documento,
            fecha_actualizacion: new Date().toISOString(),
          })
          .where(eq($personas.id, persona_id));
      } else {
        // Create new person
        const nueva_persona: InsertPersona = {
          nombres,
          apellidos,
          fecha_nacimiento,
          telefono: celular,
          email: email || null,
          tipo_identificacion: tipo_documento,
          numero_identificacion: numero_documento,
        };

        const [persona_creada] = await tx
          .insert($personas)
          .values(nueva_persona)
          .returning();
        persona_id = persona_creada.id;
      }

      // Check if already registered for this event
      const inscripcion_existente = await tx
        .select()
        .from($inscripciones)
        .where(
          and(
            eq($inscripciones.persona_id, persona_id),
            eq($inscripciones.evento_id, evento.id)
          )
        )
        .limit(1);

      if (inscripcion_existente.length > 0) {
        throw new Error("Esta persona ya está inscrita en el evento activo");
      }

      let grupo_asistencia_id: number | null = null;

      // Create attendance group if there are family members
      if (familiares && familiares.length > 0) {
        const nuevo_grupo: InsertGrupoAsistencia = {
          lider_grupo_id: persona_id,
        };

        const [grupo_creado] = await tx
          .insert($grupos_asistencia)
          .values(nuevo_grupo)
          .returning();
        grupo_asistencia_id = grupo_creado.id;

        // Register family members
        for (const familiar of familiares) {
          // Check if family member already exists
          const familiar_existente = await tx
            .select()
            .from($personas)
            .where(eq($personas.numero_identificacion, familiar.numero_documento))
            .limit(1);

          let familiar_persona_id: number;

          if (familiar_existente.length > 0) {
            familiar_persona_id = familiar_existente[0].id;
          } else {
            // Create new family member
            const nueva_persona_familiar: InsertPersona = {
              nombres: familiar.nombres,
              apellidos: familiar.apellidos,
              fecha_nacimiento: familiar.fecha_nacimiento,
              telefono: familiar.celular,
              email: familiar.email || null,
              tipo_identificacion: familiar.tipo_documento,
              numero_identificacion: familiar.numero_documento,
            };

            const [familiar_creado] = await tx
              .insert($personas)
              .values(nueva_persona_familiar)
              .returning();
            familiar_persona_id = familiar_creado.id;
          }

          // Create family member inscription
          const inscripcion_familiar: InsertInscripcion = {
            persona_id: familiar_persona_id,
            evento_id: evento.id,
            requiere_hospedaje: familiar.requiere_hospedaje ? 1 : 0,
            grupo_asistencia_id,
            relacion_con_lider: familiar.parentesco,
            localidad: familiar.localidad || localidad,
            necesidades_especiales: familiar.necesidades_especiales || null,
          };

          await tx.insert($inscripciones).values(inscripcion_familiar);
        }
      }

      // Create main inscription
      const nueva_inscripcion: InsertInscripcion = {
        persona_id,
        evento_id: evento.id,
        requiere_hospedaje: requiere_hospedaje ? 1 : 0,
        grupo_asistencia_id,
        relacion_con_lider,
        localidad,
        necesidades_especiales: necesidades_especiales || null,
      };

      const [inscripcion_creada] = await tx
        .insert($inscripciones)
        .values(nueva_inscripcion)
        .returning();

      return {
        inscripcion: inscripcion_creada,
        persona_id,
        grupo_asistencia_id,
      };
    });

    return NextResponse.json(
      {
        mensaje: "Inscripción creada exitosamente",
        inscripcion_id: resultado.inscripcion.id,
        persona_id: resultado.persona_id,
        grupo_asistencia_id: resultado.grupo_asistencia_id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error al procesar inscripción:", error);
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}
