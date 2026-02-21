import Link from "next/link";
import { obtener_todos_los_eventos_con_slugs } from "@/server/db/eventos";
import type { SelectEvento } from "@/server/db/schema";

export default async function ListaEventos() {
  const eventos: SelectEvento[] = await obtener_todos_los_eventos_con_slugs();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Gestión de Eventos
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            Administra los eventos de conferencias
          </p>
        </div>
        
        <Link
          href="/admin/eventos/nuevo"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <span>➕</span>
          Nuevo Evento
        </Link>
      </div>

      {eventos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            No hay eventos registrados
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Crea tu primer evento para comenzar a gestionar inscripciones
          </p>
          <Link
            href="/admin/eventos/nuevo"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <span>➕</span>
            Crear Primer Evento
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {eventos.map((evento) => (
            <EventoCard key={evento.id} evento={evento} />
          ))}
        </div>
      )}
    </div>
  );
}

function EventoCard({ evento }: { evento: SelectEvento }) {
  const fecha_inicio = new Date(evento.fecha_inicio);
  const fecha_fin = new Date(evento.fecha_fin);
  const es_evento_pasado = fecha_fin < new Date();
  
  const formato_fecha = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`bg-white dark:bg-zinc-800 rounded-lg border ${
      es_evento_pasado 
        ? 'border-zinc-200 dark:border-zinc-700 opacity-75' 
        : 'border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md'
    } transition-all duration-200`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2">
            {evento.nombre}
          </h3>
          {es_evento_pasado && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
              Finalizado
            </span>
          )}
        </div>
        
        {evento.descripcion && (
          <p className="text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-3">
            {evento.descripcion}
          </p>
        )}
        
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-500">📍</span>
            <span className="text-zinc-700 dark:text-zinc-300">{evento.ubicacion}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-500">🗓️</span>
            <span className="text-zinc-700 dark:text-zinc-300">
              {formato_fecha(fecha_inicio)}
              {fecha_inicio.toDateString() !== fecha_fin.toDateString() && 
                ` - ${formato_fecha(fecha_fin)}`
              }
            </span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Link
            href={`/eventos/${evento.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <span>👁️</span>
            Ver Evento
          </Link>
          
          <Link
            href={`/eventos/${evento.slug}/inscripciones`}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <span>📝</span>
            Inscripciones
          </Link>
        </div>
      </div>
    </div>
  );
}