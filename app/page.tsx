import Link from "next/link";
import { obtener_todos_los_eventos_con_slugs } from "@/server/db/eventos";
import type { SelectEvento } from "@/server/db/schema";
import { CalendarIcon, MapPinIcon, ClockIcon, UserGroupIcon, EyeIcon } from '@heroicons/react/24/outline';

interface EventoCardProps {
  evento: SelectEvento;
}

function EventoCard({ evento }: EventoCardProps) {
  const fecha_inicio = new Date(evento.fecha_inicio);
  const fecha_fin = new Date(evento.fecha_fin);
  const ahora = new Date();
  
  const es_evento_proximo = fecha_inicio >= ahora;
  const es_evento_en_curso = fecha_inicio <= ahora && fecha_fin >= ahora;
  const dias_restantes = Math.ceil((fecha_inicio.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24));
  
  const formato_fecha_completa = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formato_fecha_corta = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 overflow-hidden">
      <div className="p-6">
        {/* Header con estado del evento */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
              {evento.nombre}
            </h3>
            
            {es_evento_en_curso ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                En curso
              </span>
            ) : es_evento_proximo && dias_restantes <= 7 ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                <ClockIcon className="w-4 h-4 mr-1" />
                Esta semana
              </span>
            ) : es_evento_proximo && dias_restantes <= 30 ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <CalendarIcon className="w-4 h-4 mr-1" />
                Próximo
              </span>
            ) : null}
          </div>
        </div>

        {/* Descripción */}
        {evento.descripcion && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {evento.descripcion}
          </p>
        )}

        {/* Información del evento */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <CalendarIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                {formato_fecha_corta(fecha_inicio)}
                {fecha_inicio.toDateString() !== fecha_fin.toDateString() && 
                  ` - ${formato_fecha_corta(fecha_fin)}`
                }
              </div>
              <div className="text-gray-500 text-xs">
                {formato_fecha_completa(fecha_inicio)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <MapPinIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <span className="text-gray-700">{evento.ubicacion}</span>
          </div>

          {es_evento_proximo && dias_restantes > 0 && (
            <div className="flex items-center gap-3 text-sm">
              <ClockIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span className="text-gray-700">
                {dias_restantes === 1 ? 'Mañana' : `En ${dias_restantes} días`}
              </span>
            </div>
          )}
        </div>
        
        {/* Acciones */}
        <div className="flex gap-3">
          <Link
            href={`/eventos/${evento.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
          >
            <EyeIcon className="w-4 h-4" />
            Ver detalles
          </Link>
          
          <Link
            href={`/eventos/${evento.slug}/inscripciones`}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
          >
            <UserGroupIcon className="w-4 h-4" />
            Inscribirse
          </Link>
        </div>
      </div>
    </div>
  );
}

function EventoDestacado({ evento }: EventoCardProps) {
  const fecha_inicio = new Date(evento.fecha_inicio);
  const fecha_fin = new Date(evento.fecha_fin);
  
  const formato_fecha_hero = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white p-8 md:p-12 mb-12 border border-blue-700">
      <div className="mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Evento destacado
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              {evento.nombre}
            </h2>
            
            {evento.descripcion && (
              <p className="text-blue-100 mb-6 text-lg leading-relaxed">
                {evento.descripcion}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/eventos/${evento.slug}`}
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-blue-50 border border-blue-200 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                <EyeIcon className="w-5 h-5" />
                Ver programa
              </Link>
              
              <Link
                href={`/eventos/${evento.slug}/inscripciones`}
                className="inline-flex items-center justify-center gap-2 bg-transparent text-white hover:bg-white/10 border-2 border-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                <UserGroupIcon className="w-5 h-5" />
                Quiero asistir
              </Link>
            </div>
          </div>
          
          <div className="text-center ">
            <div className="text-6xl md:text-8xl mb-4"><CalendarIcon className="w-24 h-24 md:w-32 md:h-32 mx-auto text-white/80" /></div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{formato_fecha_hero(fecha_inicio)}</div>
              <div className="text-blue-200 flex items-center justify-center gap-2">
                <MapPinIcon className="w-5 h-5" />
                {evento.ubicacion}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const todos_los_eventos: SelectEvento[] = await obtener_todos_los_eventos_con_slugs();
  
  const ahora = new Date();
  const eventos_proximos = todos_los_eventos
    .filter(evento => new Date(evento.fecha_fin) >= ahora)
    .sort((a, b) => new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime());

  const evento_destacado = eventos_proximos[0];
  const otros_eventos = eventos_proximos.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Agenda Positiva
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
            Descubre nuestros próximos eventos y únete a experiencias transformadoras que cambiarán tu vida
          </p>
        </div>

        {/* Evento Destacado */}
        {evento_destacado ? (
          <EventoDestacado evento={evento_destacado} />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 text-center py-16 px-8">
            <CalendarIcon className="w-32 h-32 mx-auto text-gray-300 mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Próximamente
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Estamos preparando eventos increíbles. Mantente atento para las próximas fechas.
            </p>
            <Link
              href="/admin/eventos"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200"
            >
              <UserGroupIcon className="w-6 h-6" />
              Panel administrativo
            </Link>
          </div>
        )}

        {/* Lista de otros eventos */}
        {otros_eventos.length > 0 && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Otros eventos próximos
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {otros_eventos.map((evento) => (
                <EventoCard key={evento.id} evento={evento} />
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-20 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            Plataforma de gestión de conferencias • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
