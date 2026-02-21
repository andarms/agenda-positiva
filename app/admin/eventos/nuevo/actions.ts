"use server";

import { redirect } from "next/navigation";
import { crear_evento } from "@/server/db/eventos";
import type { InsertEvento } from "@/server/db/schema";

interface ActionResult {
  success: boolean;
  errors?: Record<string, string>;
  data?: any;
}

export async function crear_evento_action(form_data: FormData): Promise<ActionResult> {
  try {
    // Extraer datos del formulario
    const nombre = form_data.get("nombre") as string;
    const descripcion = form_data.get("descripcion") as string;
    const ubicacion = form_data.get("ubicacion") as string;
    const fecha_inicio = form_data.get("fecha_inicio") as string;
    const fecha_fin = form_data.get("fecha_fin") as string;

    // Validaciones
    const errores: Record<string, string> = {};

    if (!nombre || nombre.trim().length === 0) {
      errores.nombre = "El nombre del evento es obligatorio";
    } else if (nombre.trim().length < 3) {
      errores.nombre = "El nombre debe tener al menos 3 caracteres";
    } else if (nombre.trim().length > 200) {
      errores.nombre = "El nombre no puede exceder 200 caracteres";
    }

    if (!ubicacion || ubicacion.trim().length === 0) {
      errores.ubicacion = "La ubicación es obligatoria";
    } else if (ubicacion.trim().length > 200) {
      errores.ubicacion = "La ubicación no puede exceder 200 caracteres";
    }

    if (!fecha_inicio) {
      errores.fecha_inicio = "La fecha de inicio es obligatoria";
    }

    if (!fecha_fin) {
      errores.fecha_fin = "La fecha de fin es obligatoria";
    }

    // Validar que la fecha de fin sea posterior a la fecha de inicio
    if (fecha_inicio && fecha_fin) {
      const inicio = new Date(fecha_inicio);
      const fin = new Date(fecha_fin);
      
      if (inicio >= fin) {
        errores.fecha_fin = "La fecha de fin debe ser posterior a la fecha de inicio";
      }

      // Validar que la fecha de inicio no sea en el pasado (opcional)
      const ahora = new Date();
      if (inicio < ahora) {
        errores.fecha_inicio = "La fecha de inicio no puede ser en el pasado";
      }
    }

    if (descripcion && descripcion.length > 1000) {
      errores.descripcion = "La descripción no puede exceder 1000 caracteres";
    }

    // Si hay errores, retornar
    if (Object.keys(errores).length > 0) {
      return {
        success: false,
        errors: errores,
      };
    }

    // Preparar datos para insertar
    const datos_evento: Omit<InsertEvento, "slug"> = {
      nombre: nombre.trim(),
      descripcion: descripcion ? descripcion.trim() : null,
      ubicacion: ubicacion.trim(),
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin,
    };

    // Crear evento en la base de datos
    const nuevo_evento = await crear_evento(datos_evento);

    return {
      success: true,
      data: nuevo_evento,
    };

  } catch (error) {
    console.error("Error al crear evento:", error);
    
    return {
      success: false,
      errors: {
        general: "Hubo un error interno al crear el evento. Por favor intenta de nuevo.",
      },
    };
  }
}