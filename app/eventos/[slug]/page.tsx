import { notFound } from 'next/navigation';
import { obtener_evento_por_slug } from '@/server/db/eventos';
import { CalendarIcon, MapPinIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface DetalleEventoPageProps {
  params: Promise<{ slug: string }>;
}

function formatear_fecha(fecha_iso: string): string {
  const fecha = new Date(fecha_iso);
  return fecha.toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatear_fecha_corta(fecha_iso: string): string {
  const fecha = new Date(fecha_iso);
  return fecha.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function calcular_duracion_evento(fecha_inicio: string, fecha_fin: string): string {
  const inicio = new Date(fecha_inicio);
  const fin = new Date(fecha_fin);
  const diferencia_ms = fin.getTime() - inicio.getTime();
  const dias = Math.ceil(diferencia_ms / (1000 * 60 * 60 * 24));
  
  if (dias <= 1) {
    return 'Evento de un día';
  } else {
    return `Evento de ${dias} días`;
  }
}

export default async function DetalleEventoPage({ params }: DetalleEventoPageProps) {
  const { slug } = await params;
  const evento = await obtener_evento_por_slug(slug);

  if (!evento) {
    notFound();
  }

  const fecha_inicio_formateada = formatear_fecha(evento.fecha_inicio);
  const fecha_fin_formateada = formatear_fecha(evento.fecha_fin);
  const duracion_evento = calcular_duracion_evento(evento.fecha_inicio, evento.fecha_fin);
  const es_evento_futuro = new Date(evento.fecha_inicio) > new Date();
  const es_evento_en_curso = new Date() >= new Date(evento.fecha_inicio) && new Date() <= new Date(evento.fecha_fin);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Encabezado del evento */}
      <div className="bg-white ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <nav className="flex mb-4" aria-label="Navegación de migas de pan">
                <ol className="flex items-center space-x-2 text-sm text-gray-500">
                  <li>
                    <Link href="/" className="hover:text-blue-600 transition-colors">
                      Inicio
                    </Link>
                  </li>
                  <li>
                    <span>/</span>
                  </li>
                  <li>
                    <Link href="/eventos" className="hover:text-blue-600 transition-colors">
                      Eventos
                    </Link>
                  </li>
                  <li>
                    <span>/</span>
                  </li>
                  <li className="text-gray-900 font-medium">{evento.nombre}</li>
                </ol>
              </nav>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {evento.nombre}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                {es_evento_en_curso && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    En curso
                  </span>
                )}
                {es_evento_futuro && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    Próximamente
                  </span>
                )}
                {!es_evento_futuro && !es_evento_en_curso && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Finalizado
                  </span>
                )}
                <span className="text-gray-600">{duracion_evento}</span>
              </div>
            </div>

            {es_evento_futuro && (
              <div className="mt-6 lg:mt-0 lg:ml-8">
                <Link
                  href={`/eventos/${evento.slug}/inscripciones`}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg border text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  <UserGroupIcon className="w-5 h-5 mr-2" />
                  Inscribirse al evento
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Información principal del evento */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Descripción del evento
              </h2>
              <div className="prose prose-lg prose-blue max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {evento.descripcion || 'Descripción no disponible para este evento.'}
                </p>
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-white rounded-xl border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Información adicional
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CalendarIcon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Fechas del evento</h3>
                    <p className="text-gray-700">
                      <span className="font-medium">Inicio:</span> {fecha_inicio_formateada}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Finalización:</span> {fecha_fin_formateada}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPinIcon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Ubicación</h3>
                    <p className="text-gray-700">{evento.ubicacion}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <ClockIcon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Duración</h3>
                    <p className="text-gray-700">{duracion_evento}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel lateral */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Tarjeta de información rápida */}
              <div className="bg-white rounded-xl border p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Información rápida
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Fecha inicio:</span>
                    <span className="font-medium text-gray-900">
                      {formatear_fecha_corta(evento.fecha_inicio)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Fecha fin:</span>
                    <span className="font-medium text-gray-900">
                      {formatear_fecha_corta(evento.fecha_fin)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Duración:</span>
                    <span className="font-medium text-gray-900">{duracion_evento}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Estado:</span>
                    <span className={`font-medium ${
                      es_evento_en_curso 
                        ? 'text-green-600' 
                        : es_evento_futuro 
                        ? 'text-blue-600' 
                        : 'text-gray-600'
                    }`}>
                      {es_evento_en_curso ? 'En curso' : es_evento_futuro ? 'Próximo' : 'Finalizado'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl border p-6 text-white">
                <h3 className="text-lg font-bold mb-4">¿Interesado en participar?</h3>
                <p className="text-blue-100 mb-6 text-sm">
                  {es_evento_futuro 
                    ? 'Regístrate ahora y asegura tu lugar en este evento transformador.'
                    : es_evento_en_curso
                    ? 'El evento está en curso. ¡Aún puedes unirte!'  
                    : 'Este evento ya finalizó, pero puedes ver otros eventos disponibles.'
                  }
                </p>
                
                {(es_evento_futuro || es_evento_en_curso) ? (
                  <Link
                    href={`/eventos/${evento.slug}/inscripciones`}
                    className="w-full inline-flex items-center justify-center px-4 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
                  >
                    <UserGroupIcon className="w-5 h-5 mr-2" />
                    Inscribirse ahora
                  </Link>
                ) : (
                  <Link
                    href="/eventos"
                    className="w-full inline-flex items-center justify-center px-4 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
                  >
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    Ver otros eventos
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: DetalleEventoPageProps) {
  const { slug } = await params;
  const evento = await obtener_evento_por_slug(slug);
  
  if (!evento) {
    return {
      title: 'Evento no encontrado',
    };
  }

  return {
    title: `${evento.nombre} | Agenda Positiva`,
    description: evento.descripcion || `Información sobre ${evento.nombre}`,
  };
}
