import { db } from "@/server/db";
import { $inscripciones, $personas, $eventos } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export default async function AdminInscripcionesPage() {
  // Get the active event
  const evento_activo = await db
    .select()
    .from($eventos)
    .where(eq($eventos.activo, 1))
    .limit(1);

  if (evento_activo.length === 0) {
    return (
      <div className="p-6 bg-white text-gray-900">
        <h1 className="text-3xl font-bold mb-6">Inscripciones</h1>
        <div className="text-center py-8">
          <p className="text-gray-600">No hay evento activo configurado.</p>
          <a
            href="/admin/eventos"
            className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Gestionar Eventos
          </a>
        </div>
      </div>
    );
  }

  const evento = evento_activo[0];

  // Get all inscriptions for the active event
  const inscripciones = await db
    .select({
      inscripcion: $inscripciones,
      persona: $personas,
    })
    .from($inscripciones)
    .innerJoin($personas, eq($inscripciones.persona_id, $personas.id))
    .where(eq($inscripciones.evento_id, evento.id))
    .orderBy($inscripciones.fecha_creacion);

  return (
    <div className="p-6 bg-white text-gray-900">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Inscripciones</h1>
          <p className="text-gray-600 mt-1">
            Evento: {evento.nombre} ({inscripciones.length} inscripciones)
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/admin/eventos"
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Gestionar Eventos
          </a>
        </div>
      </div>

      {inscripciones.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            No hay inscripciones registradas para este evento.
          </p>
          <a
            href="/formulario-inscripcion"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Nueva Inscripción
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Persona
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hospedaje
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inscripciones.map(({ inscripcion, persona }) => (
                  <tr key={inscripcion.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {persona.nombres} {persona.apellidos}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(
                          persona.fecha_nacimiento,
                        ).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {persona.tipo_identificacion}
                      </div>
                      <div className="text-sm text-gray-500">
                        {persona.numero_identificacion}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {persona.telefono}
                      </div>
                      {persona.email && (
                        <div className="text-sm text-gray-500">
                          {persona.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {inscripcion.localidad}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          inscripcion.estado === "confirmado"
                            ? "bg-green-100 text-green-800"
                            : inscripcion.estado === "pendiente"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {inscripcion.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          inscripcion.requiere_hospedaje
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {inscripcion.requiere_hospedaje ? "Sí" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(
                        inscripcion.fecha_creacion,
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
