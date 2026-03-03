import { crearEvento } from "@/server/actions/eventos";

export default function CrearEventoForm() {
  return (
    <form
      action={crearEvento}
      className="space-y-6 bg-white border rounded-lg p-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre del evento */}
        <div className="md:col-span-2">
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nombre del Evento *
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Conferencia Nacional 2026"
          />
        </div>

        {/* Descripción */}
        <div className="md:col-span-2">
          <label
            htmlFor="descripcion"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Descripción detallada del evento..."
          />
        </div>

        {/* Fecha de inicio */}
        <div>
          <label
            htmlFor="fecha_inicio"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Fecha de Inicio *
          </label>
          <input
            type="date"
            id="fecha_inicio"
            name="fecha_inicio"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Fecha de fin */}
        <div>
          <label
            htmlFor="fecha_fin"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Fecha de Fin *
          </label>
          <input
            type="date"
            id="fecha_fin"
            name="fecha_fin"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Ubicación */}
        <div className="md:col-span-2">
          <label
            htmlFor="ubicacion"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Ubicación *
          </label>
          <input
            type="text"
            id="ubicacion"
            name="ubicacion"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Centro de Convenciones, Bogotá, Colombia"
          />
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          Información importante
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• El evento se creará en estado inactivo por defecto</li>
          <li>
            • Se generará automáticamente un slug único basado en el nombre
          </li>
          <li>• Solo un evento puede estar activo a la vez</li>
          <li>• Las fechas deben estar en formato año-mes-día hora:minutos</li>
        </ul>
      </div>

      {/* Botones */}
      <div className="flex gap-4 pt-6 border-t">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Crear Evento
        </button>

        <a
          href="/admin/eventos"
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium text-center"
        >
          Cancelar
        </a>
      </div>
    </form>
  );
}
