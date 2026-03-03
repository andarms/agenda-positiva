import { db } from "@/server/db";
import {
  $eventos,
  $inscripciones,
  $personas,
  $grupos_asistencia,
} from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function AdminEventoInscripcionesPage({ params }: Props) {
  const resolvedParams = await params;

  // Verificar que el evento existe y está activo
  const evento = await db
    .select()
    .from($eventos)
    .where(and(eq($eventos.slug, resolvedParams.slug), eq($eventos.activo, 1)))
    .limit(1);

  if (evento.length === 0) {
    notFound();
  }

  const eventoData = evento[0];

  // Crear alias para la tabla personas para el líder del grupo
  const $lider = alias($personas, "lider");

  // Obtener todas las inscripciones del evento con información de la persona y líder del grupo
  const inscripciones = await db
    .select({
      inscripcion_id: $inscripciones.id,
      persona_nombres: $personas.nombres,
      persona_apellidos: $personas.apellidos,
      persona_telefono: $personas.telefono,
      persona_email: $personas.email,
      persona_tipo_identificacion: $personas.tipo_identificacion,
      persona_numero_identificacion: $personas.numero_identificacion,
      requiere_hospedaje: $inscripciones.requiere_hospedaje,
      estado: $inscripciones.estado,
      relacion_con_lider: $inscripciones.relacion_con_lider,
      necesidades_especiales: $inscripciones.necesidades_especiales,
      grupo_asistencia_id: $inscripciones.grupo_asistencia_id,
      fecha_inscripcion: $inscripciones.fecha_creacion,
      lider_nombres: $lider.nombres,
      lider_apellidos: $lider.apellidos,
    })
    .from($inscripciones)
    .innerJoin($personas, eq($inscripciones.persona_id, $personas.id))
    .leftJoin(
      $grupos_asistencia,
      eq($inscripciones.grupo_asistencia_id, $grupos_asistencia.id),
    )
    .leftJoin($lider, eq($grupos_asistencia.lider_grupo_id, $lider.id))
    .where(eq($inscripciones.evento_id, eventoData.id))
    .orderBy($inscripciones.fecha_creacion);

  // Agrupar por estado para estadísticas
  const estadisticas = inscripciones.reduce(
    (acc, inscripcion) => {
      acc[inscripcion.estado] = (acc[inscripcion.estado] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const totalConHospedaje = inscripciones.filter(
    (i) => i.requiere_hospedaje,
  ).length;

  return (
    <div className="p-6 h-full bg-white text-gray-900">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Inscripciones - {eventoData.nombre}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
            Evento Activo
          </span>
          <span>Total inscripciones: {inscripciones.length}</span>
          <span>Requieren hospedaje: {totalConHospedaje}</span>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(estadisticas).map(([estado, cantidad]) => (
          <div key={estado} className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-800">{cantidad}</div>
            <div className="text-sm text-gray-600 capitalize">{estado}</div>
          </div>
        ))}
      </div>

      {/* Lista de inscripciones */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b">
          <h3 className="text-lg font-semibold">Lista de Inscritos</h3>
        </div>

        {inscripciones.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No hay inscripciones para este evento
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Persona
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Identificación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hospedaje
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Necesidades Especiales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Inscripción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inscripciones.map((inscripcion) => (
                  <tr
                    key={inscripcion.inscripcion_id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {inscripcion.persona_nombres}{" "}
                          {inscripcion.persona_apellidos}
                        </div>
                        {inscripcion.grupo_asistencia_id && (
                          <div className="text-xs text-gray-500">
                            {inscripcion.relacion_con_lider &&
                              inscripcion.relacion_con_lider.toLowerCase() !==
                                "lider" && (
                                <span>{inscripcion.relacion_con_lider}</span>
                              )}
                            {inscripcion.lider_nombres &&
                              inscripcion.lider_apellidos &&
                              inscripcion.relacion_con_lider &&
                              inscripcion.relacion_con_lider.toLowerCase() !==
                                "lider" && (
                                <span>
                                  {" de "}
                                  {inscripcion.lider_nombres}{" "}
                                  {inscripcion.lider_apellidos}
                                </span>
                              )}
                          </div>
                        )}
                        {!inscripcion.grupo_asistencia_id &&
                          inscripcion.relacion_con_lider && (
                            <div className="text-xs text-gray-500">
                              Relación: {inscripcion.relacion_con_lider}
                            </div>
                          )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>{inscripcion.persona_tipo_identificacion}</div>
                        <div className="text-xs text-gray-500">
                          {inscripcion.persona_numero_identificacion}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>{inscripcion.persona_telefono}</div>
                        {inscripcion.persona_email && (
                          <div className="text-xs text-gray-500">
                            {inscripcion.persona_email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          inscripcion.estado === "confirmado"
                            ? "bg-green-100 text-green-800"
                            : inscripcion.estado === "pendiente"
                              ? "bg-yellow-100 text-yellow-800"
                              : inscripcion.estado === "cancelado"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {inscripcion.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inscripcion.requiere_hospedaje ? (
                        <span className="text-green-600">Sí</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {inscripcion.necesidades_especiales ? (
                        <span className="text-orange-600">
                          {inscripcion.necesidades_especiales}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(
                        inscripcion.fecha_inscripcion,
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
