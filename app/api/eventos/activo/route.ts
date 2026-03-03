import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { $eventos } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const eventoActivo = await db
      .select()
      .from($eventos)
      .where(eq($eventos.activo, 1))
      .limit(1);

    if (eventoActivo.length === 0) {
      return NextResponse.json({
        evento: null,
        message: "No hay evento activo",
      });
    }

    return NextResponse.json({ evento: eventoActivo[0] });
  } catch (error) {
    console.error("Error al obtener evento activo:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
