import { db } from "@/server/db";
import { $eventos, $inscripciones, $personas } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export default async function AdminPage() {
  // Obtener el evento activo
  const eventoActivo = await db
    .select()
    .from($eventos)
    .where(eq($eventos.activo, 1))
    .limit(1);

  let estadisticasInscripciones = null;

  if (eventoActivo.length > 0) {
    // Obtener estadísticas del evento activo
    const inscripciones = await db
      .select({
        id: $inscripciones.id,
        estado: $inscripciones.estado,
        requiere_hospedaje: $inscripciones.requiere_hospedaje,
      })
      .from($inscripciones)
      .where(eq($inscripciones.evento_id, eventoActivo[0].id));

    estadisticasInscripciones = {
      total: inscripciones.length,
      confirmadas: inscripciones.filter((i) => i.estado === "confirmado")
        .length,
      pendientes: inscripciones.filter((i) => i.estado === "pendiente").length,
      conHospedaje: inscripciones.filter((i) => i.requiere_hospedaje).length,
    };
  }

  return (
    <div className="p-6 bg-white text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>

      {eventoActivo.length > 0 ? (
        <div className="space-y-6">
          {/* Evento activo */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-green-800">
                Evento Activo
              </h2>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Activo
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium text-green-700 mb-2">
                  {eventoActivo[0].nombre}
                </h3>
                <p className="text-green-600 mb-2">
                  {eventoActivo[0].descripcion}
                </p>
                <div className="space-y-1 text-sm text-green-600">
                  <p>
                    <strong>Fecha inicio:</strong>{" "}
                    {new Date(
                      eventoActivo[0].fecha_inicio,
                    ).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Fecha fin:</strong>{" "}
                    {new Date(eventoActivo[0].fecha_fin).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Ubicación:</strong> {eventoActivo[0].ubicacion}
                  </p>
                </div>
              </div>

              {estadisticasInscripciones && (
                <div>
                  <h3 className="text-lg font-medium text-green-700 mb-2">
                    Inscripciones
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded p-3 text-center">
                      <div className="text-2xl font-bold text-gray-800">
                        {estadisticasInscripciones.total}
                      </div>
                      <div className="text-xs text-gray-600">Total</div>
                    </div>
                    <div className="bg-white rounded p-3 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {estadisticasInscripciones.confirmadas}
                      </div>
                      <div className="text-xs text-gray-600">Confirmadas</div>
                    </div>
                    <div className="bg-white rounded p-3 text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {estadisticasInscripciones.pendientes}
                      </div>
                      <div className="text-xs text-gray-600">Pendientes</div>
                    </div>
                    <div className="bg-white rounded p-3 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {estadisticasInscripciones.conHospedaje}
                      </div>
                      <div className="text-xs text-gray-600">Con Hospedaje</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 space-x-3">
              <a
                href={`/admin/eventos/${eventoActivo[0].slug}`}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
              >
                Ver Evento
              </a>
              <a
                href={`/admin/eventos/${eventoActivo[0].slug}/inscripciones`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
              >
                Ver Inscripciones
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-yellow-800">
              Sin Evento Activo
            </h2>
          </div>
          <p className="text-yellow-700 mb-4">
            No hay ningún evento activo en este momento. Activa un evento para
            comenzar a recibir inscripciones.
          </p>
          <a
            href="/admin/eventos"
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded text-sm"
          >
            Gestionar Eventos
          </a>
        </div>
      )}
    </div>
  );
}
