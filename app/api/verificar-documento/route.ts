import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { $personas, $inscripciones, $eventos } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { tipo_documento, numero_documento } = await request.json();

    if (!tipo_documento || !numero_documento) {
      return NextResponse.json(
        { error: "Tipo y número de documento son obligatorios" },
        { status: 400 }
      );
    }

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

    // Look for the person
    const persona = await db
      .select()
      .from($personas)
      .where(
        and(
          eq($personas.tipo_identificacion, tipo_documento),
          eq($personas.numero_identificacion, numero_documento)
        )
      )
      .limit(1);

    if (persona.length === 0) {
      // Person doesn't exist, proceed to registration
      return NextResponse.json({
        existe: false,
        mensaje: "Documento no encontrado, proceder con el registro",
      });
    }

    const persona_encontrada = persona[0];

    // Check if already registered for active event
    const inscripcion_existente = await db
      .select()
      .from($inscripciones)
      .where(
        and(
          eq($inscripciones.persona_id, persona_encontrada.id),
          eq($inscripciones.evento_id, evento.id)
        )
      )
      .limit(1);

    if (inscripcion_existente.length > 0) {
      // Already registered for this event
      return NextResponse.json({
        existe: true,
        ya_registrado: true,
        mensaje: "Esta persona ya está registrada para el evento activo",
        inscripcion: inscripcion_existente[0],
        persona: persona_encontrada,
      });
    }

    // Person exists but not registered for this event
    return NextResponse.json({
      existe: true,
      ya_registrado: false,
      mensaje: "Persona encontrada, datos prellenados",
      persona: persona_encontrada,
    });
  } catch (error: any) {
    console.error("Error al verificar documento:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
