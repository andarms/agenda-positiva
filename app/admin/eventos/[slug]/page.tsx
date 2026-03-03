import { db } from "@/server/db";
import { $eventos } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function AdminEventoPage({ params }: Props) {
  const resolvedParams = await params;

  const evento = await db
    .select()
    .from($eventos)
    .where(eq($eventos.slug, resolvedParams.slug))
    .limit(1);

  if (evento.length === 0) {
    notFound();
  }

  const eventoData = evento[0];

  return (
    <div className="p-6 bg-white text-gray-900">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{eventoData.nombre}</h1>
        {eventoData.activo && (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
            Evento Activo
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Información del Evento</h3>
          <div className="space-y-2">
            <p>
              <strong>Descripción:</strong>{" "}
              {eventoData.descripcion || "Sin descripción"}
            </p>
            <p>
              <strong>Fecha inicio:</strong>{" "}
              {new Date(eventoData.fecha_inicio).toLocaleDateString()}
            </p>
            <p>
              <strong>Fecha fin:</strong>{" "}
              {new Date(eventoData.fecha_fin).toLocaleDateString()}
            </p>
            <p>
              <strong>Ubicación:</strong> {eventoData.ubicacion}
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              {eventoData.activo ? "Activo" : "Inactivo"}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Acciones</h3>
          <div className="space-y-3">
            <form
              action={async () => {
                "use server";
                const { toggleEventoActivo } =
                  await import("@/server/actions/eventos");
                await toggleEventoActivo(resolvedParams.slug);
              }}
            >
              <button
                type="submit"
                className={`w-full px-4 py-2 rounded ${
                  eventoData.activo
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {eventoData.activo ? "Desactivar Evento" : "Activar Evento"}
              </button>
            </form>

            {eventoData.activo && (
              <a
                href={`/admin/eventos/${resolvedParams.slug}/inscripciones`}
                className="block w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded text-center"
              >
                Ver Inscripciones
              </a>
            )}

            <a
              href="/admin/eventos"
              className="block w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-center"
            >
              Volver a Eventos
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
