export default function ServicioPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Servicio
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Servicios generales del evento
          </p>
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔧</div>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Módulo en Desarrollo
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
              Esta sección estará disponible próximamente. Aquí podrás gestionar todos los servicios 
              generales y de apoyo para el evento.
            </p>
          </div>

          {/* Placeholder for future features */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg">
              <h3 className="font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Servicios Técnicos
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-500">
                Audio, video y equipamiento técnico
              </p>
            </div>
            <div className="p-6 border border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg">
              <h3 className="font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Catering y Alimentación
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-500">
                Gestión de servicios de alimentación
              </p>
            </div>
            <div className="p-6 border border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg">
              <h3 className="font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Transporte y Logística
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-500">
                Coordinación de transporte y logística
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}