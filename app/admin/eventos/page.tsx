import { db } from "@/server/db";
import { $eventos } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export default async function AdminEventosPage() {
  const eventos = await db
    .select()
    .from($eventos)
    .orderBy($eventos.fecha_inicio);

  return (
    <div className="p-6 bg-white text-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Eventos</h1>
        <a
          href="/admin/eventos/crear"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Crear Evento
        </a>
      </div>

      <div className="grid gap-6">
        {eventos.map((evento) => (
          <div
            key={evento.id}
            className={`border rounded-lg p-4 ${evento.activo ? "border-green-500 bg-green-50" : "border-gray-300"}`}
          >
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-semibold">{evento.nombre}</h2>
              <div className="flex gap-2">
                {evento.activo && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    Evento Activo
                  </span>
                )}
                <form
                  action={async () => {
                    "use server";
                    if (evento.slug) {
                      const { toggleEventoActivo } =
                        await import("@/server/actions/eventos");
                      await toggleEventoActivo(evento.slug, "/admin/eventos");
                    }
                  }}
                >
                  <button
                    type="submit"
                    className={`px-3 py-1 rounded text-sm ${
                      evento.activo
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    {evento.activo ? "Desactivar" : "Activar"}
                  </button>
                </form>
              </div>
            </div>

            <p className="text-gray-600 mb-2">{evento.descripcion}</p>

            <div className="text-sm text-gray-500 mb-2">
              <p>
                <strong>Fecha inicio:</strong>{" "}
                {new Date(evento.fecha_inicio).toLocaleDateString()}
              </p>
              <p>
                <strong>Fecha fin:</strong>{" "}
                {new Date(evento.fecha_fin).toLocaleDateString()}
              </p>
              <p>
                <strong>Ubicación:</strong> {evento.ubicacion}
              </p>
            </div>

            <div className="flex gap-2">
              <a
                href={`/admin/eventos/${evento.slug}`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm"
              >
                Ver Detalles
              </a>
              {evento.activo && (
                <a
                  href={`/admin/eventos/${evento.slug}/inscripciones`}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded text-sm"
                >
                  Ver Inscripciones
                </a>
              )}
            </div>
          </div>
        ))}

        {eventos.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay eventos registrados
          </div>
        )}
      </div>
    </div>
  );
}
