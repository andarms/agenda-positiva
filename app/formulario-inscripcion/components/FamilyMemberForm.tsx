"use client";

import { useState } from "react";
import PersonSearchForm from "./PersonSearchForm";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

const opciones_parentesco = [
  { value: "", label: "Seleccionar parentesco" },
  { value: "esposo", label: "Esposo" },
  { value: "esposa", label: "Esposa" },
  { value: "hijo", label: "Hijo" },
  { value: "hija", label: "Hija" },
  { value: "padre", label: "Padre" },
  { value: "madre", label: "Madre" },
  { value: "hermano", label: "Hermano" },
  { value: "hermana", label: "Hermana" },
  { value: "abuelo", label: "Abuelo" },
  { value: "abuela", label: "Abuela" },
  { value: "tio", label: "Tío" },
  { value: "tia", label: "Tía" },
  { value: "primo", label: "Primo" },
  { value: "prima", label: "Prima" },
  { value: "sobrino", label: "Sobrino" },
  { value: "sobrina", label: "Sobrina" },
  { value: "otro", label: "Otro" },
];

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

interface FamiliarData {
  id: string;
  persona: PersonaData;
  relacion: string;
}

interface FamilyMemberFormProps {
  title: string;
  relationshipLabel: string;
  allowedRelationships?: string[];
  onFamilyMembersChange: (familiares: FamiliarData[]) => void;
  maxMembers?: number;
}

const generateId = () =>
  Date.now().toString() + Math.random().toString(36).substr(2, 9);

export default function FamilyMemberForm({
  title,
  relationshipLabel,
  allowedRelationships = [],
  onFamilyMembersChange,
  maxMembers = 10,
}: FamilyMemberFormProps) {
  const [familiares, setFamiliares] = useState<FamiliarData[]>([]);
  const [mostrar_formulario, setMostrarFormulario] = useState(false);

  // Filter relationships based on allowed ones, or use all if none specified
  const opciones_filtradas =
    allowedRelationships.length > 0
      ? opciones_parentesco.filter((op) =>
          allowedRelationships.includes(op.value),
        )
      : opciones_parentesco;

  const agregar_familiar = (persona: PersonaData) => {
    const nuevo_familiar: FamiliarData = {
      id: generateId(),
      persona,
      relacion:
        allowedRelationships.length === 1 ? allowedRelationships[0] : "",
    };

    const nuevos_familiares = [...familiares, nuevo_familiar];
    setFamiliares(nuevos_familiares);
    onFamilyMembersChange(nuevos_familiares);
    setMostrarFormulario(false);
  };

  const actualizar_relacion = (id: string, relacion: string) => {
    const familiares_actualizados = familiares.map((familiar) =>
      familiar.id === id ? { ...familiar, relacion } : familiar,
    );
    setFamiliares(familiares_actualizados);
    onFamilyMembersChange(familiares_actualizados);
  };

  const remover_familiar = (id: string) => {
    const familiares_filtrados = familiares.filter(
      (familiar) => familiar.id !== id,
    );
    setFamiliares(familiares_filtrados);
    onFamilyMembersChange(familiares_filtrados);
  };

  const puede_agregar_mas = familiares.length < maxMembers;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {puede_agregar_mas && (
          <button
            type="button"
            onClick={() => setMostrarFormulario(true)}
            className="inline-flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Agregar {relationshipLabel.toLowerCase()}
          </button>
        )}
      </div>

      {/* List of added family members */}
      {familiares.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-md font-medium text-gray-700">
            {relationshipLabel}s agregado{familiares.length !== 1 ? "s" : ""}: (
            {familiares.length})
          </h4>

          {familiares.map((familiar) => (
            <div
              key={familiar.id}
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {familiar.persona.nombres} {familiar.persona.apellidos}
                    </p>
                    <p className="text-sm text-gray-500">
                      {familiar.persona.tipo_identificacion}:{" "}
                      {familiar.persona.numero_identificacion}
                    </p>
                  </div>
                  {/* Relationship selector */}

                  <div className="min-w-[150px]">
                    <select
                      value={familiar.relacion}
                      onChange={(e) =>
                        actualizar_relacion(familiar.id, e.target.value)
                      }
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar relación</option>
                      {opciones_filtradas.map((opcion) => (
                        <option key={opcion.value} value={opcion.value}>
                          {opcion.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => remover_familiar(familiar.id)}
                className="ml-3 p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                title="Remover"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new family member form */}
      {mostrar_formulario && (
        <div className="mt-4">
          <PersonSearchForm
            title={`Agregar ${relationshipLabel}`}
            placeholder={`Número de documento del ${relationshipLabel.toLowerCase()}`}
            onPersonSelected={agregar_familiar}
            onPersonNotFound={() => {}}
          />

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => setMostrarFormulario(false)}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {!puede_agregar_mas && (
        <div className="text-sm text-gray-500 text-center py-2">
          Máximo de {maxMembers} {relationshipLabel.toLowerCase()}s permitido
          {maxMembers !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
