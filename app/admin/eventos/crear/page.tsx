import CrearEventoForm from "./components/CrearEventoForm";

export default function CrearEventoPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Crear Nuevo Evento</h1>
        <p className="text-gray-600">
          Complete la información para crear un nuevo evento
        </p>
      </div>

      <CrearEventoForm />
    </div>
  );
}
