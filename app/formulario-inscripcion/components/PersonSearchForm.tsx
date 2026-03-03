"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface PersonaData {
  nombres: string;
  apellidos: string;
  tipo_identificacion: string;
  numero_identificacion: string;
  fecha_nacimiento: string;
  telefono: string;
  email: string;
  sexo: string;
  necesidades_especiales: string;
}

interface PersonSearchFormProps {
  onPersonSelected: (persona: PersonaData) => void;
  onPersonNotFound: () => void;
  title: string;
  placeholder?: string;
}

const tipos_documento = [
  { value: "", label: "Seleccionar tipo" },
  { value: "cedula", label: "Cédula de Ciudadanía" },
  { value: "cedula_extranjeria", label: "Cédula de Extranjería" },
  { value: "pasaporte", label: "Pasaporte" },
  { value: "tarjeta_identidad", label: "TI - Tarjeta de Identidad" },
];

const opciones_sexo = [
  { value: "", label: "Seleccionar género" },
  { value: "masculino", label: "Masculino" },
  { value: "femenino", label: "Femenino" },
];

const persona_vacia: PersonaData = {
  nombres: "",
  apellidos: "",
  tipo_identificacion: "",
  numero_identificacion: "",
  fecha_nacimiento: "",
  telefono: "",
  email: "",
  sexo: "",
  necesidades_especiales: "",
};

export default function PersonSearchForm({
  onPersonSelected,
  onPersonNotFound,
  title,
  placeholder = "Buscar por número de documento",
}: PersonSearchFormProps) {
  const [tipo_documento, setTipoDocumento] = useState("");
  const [numero_documento, setNumeroDocumento] = useState("");
  const [esta_buscando, setEstaBuscando] = useState(false);
  const [persona_encontrada, setPersonaEncontrada] =
    useState<PersonaData | null>(null);
  const [mostrar_formulario_completo, setMostrarFormularioCompleto] =
    useState(false);
  const [error, setError] = useState("");

  // Form data for new person or editing existing person
  const [forma_persona, setFormaPersona] = useState<PersonaData>({
    ...persona_vacia,
  });

  const buscar_persona = async () => {
    if (!tipo_documento || !numero_documento) {
      setError("Por favor selecciona el tipo y número de documento");
      return;
    }

    setEstaBuscando(true);
    setError("");

    try {
      const response = await fetch(`/api/personas/buscar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cedula: numero_documento }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.encontrada && data.persona) {
          setPersonaEncontrada(data.persona);
          setFormaPersona({
            nombres: data.persona.nombres,
            apellidos: data.persona.apellidos,
            tipo_identificacion: data.persona.tipo_identificacion,
            numero_identificacion: data.persona.numero_identificacion,
            fecha_nacimiento: data.persona.fecha_nacimiento,
            telefono: data.persona.telefono,
            email: data.persona.email || "",
            sexo: data.persona.sexo || "",
            necesidades_especiales: data.persona.necesidades_especiales || "",
          });
        } else {
          // Person not found, show full registration form
          setPersonaEncontrada(null);
          setMostrarFormularioCompleto(true);
          setFormaPersona((prev) => ({
            ...persona_vacia,
            tipo_identificacion: tipo_documento,
            numero_identificacion: numero_documento,
          }));
          onPersonNotFound();
        }
      } else {
        throw new Error("Error en la búsqueda");
      }
    } catch (error) {
      setError("Error al buscar la persona. Intenta nuevamente.");
      console.error("Error en búsqueda:", error);
    } finally {
      setEstaBuscando(false);
    }
  };

  const manejar_cambio_input = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormaPersona((prev) => ({ ...prev, [name]: value }));
  };

  const confirmar_persona = () => {
    if (
      !forma_persona.nombres ||
      !forma_persona.apellidos ||
      !forma_persona.fecha_nacimiento
    ) {
      setError("Por favor completa todos los campos obligatorios");
      return;
    }

    onPersonSelected(forma_persona);
    resetear_formulario();
  };

  const resetear_formulario = () => {
    setTipoDocumento("");
    setNumeroDocumento("");
    setPersonaEncontrada(null);
    setMostrarFormularioCompleto(false);
    setFormaPersona({
      ...persona_vacia,
    });
    setError("");
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      {/* Search Section */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Documento
            </label>
            <select
              value={tipo_documento}
              onChange={(e) => setTipoDocumento(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {tipos_documento.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Documento
            </label>
            <input
              type="text"
              value={numero_documento}
              onChange={(e) => setNumeroDocumento(e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={buscar_persona}
              disabled={esta_buscando}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {esta_buscando ? (
                "Buscando..."
              ) : (
                <>
                  <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                  Buscar
                </>
              )}
            </button>
          </div>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}
      </div>

      {/* Found Person or Full Form Section */}
      {(persona_encontrada || mostrar_formulario_completo) && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          {persona_encontrada && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 font-medium">
                ✓ Persona encontrada en el sistema
              </p>
            </div>
          )}

          {!persona_encontrada && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800 font-medium">
                Persona no encontrada. Por favor completa los datos:
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombres *
              </label>
              <input
                type="text"
                name="nombres"
                value={forma_persona.nombres}
                onChange={manejar_cambio_input}
                disabled={!!persona_encontrada}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellidos *
              </label>
              <input
                type="text"
                name="apellidos"
                value={forma_persona.apellidos}
                onChange={manejar_cambio_input}
                disabled={!!persona_encontrada}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Nacimiento *
              </label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={forma_persona.fecha_nacimiento}
                onChange={manejar_cambio_input}
                disabled={!!persona_encontrada}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={forma_persona.telefono}
                onChange={manejar_cambio_input}
                disabled={!!persona_encontrada}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                disabled={!!persona_encontrada}
                value={forma_persona.email}
                onChange={manejar_cambio_input}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Necesidades Especiales
              </label>
              <p className="text-sm text-zinc-500  mb-3">
                Si usted o sus acompañantes utilizan silla de ruedas, tienen
                movilidad reducida, se encuentran en recuperación médica,
                presentan alguna condición cognitiva o requieren algún apoyo
                adicional, por favor indíquelo aquí. Esta información nos
                ayudará a gestionar el hospedaje de la mejor manera posible y,
                cuando sea necesario, procurar que las personas que requieran
                apoyo puedan alojarse juntas. Las solicitudes se atenderán según
                disponibilidad.
              </p>
              <textarea
                disabled={!!persona_encontrada}
                name="necesidades_especiales"
                value={forma_persona.necesidades_especiales}
                onChange={manejar_cambio_input}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={resetear_formulario}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmar_persona}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              {persona_encontrada ? "Confirmar" : "Registrar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
