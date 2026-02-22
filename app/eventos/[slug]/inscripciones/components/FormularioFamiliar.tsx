'use client';

import InformacionPersonal, { DatosPersonales, extraerDatosPersonalesFamiliar } from './InformacionPersonal';
import { MiembroFamiliar } from './FormularioInscripcion';

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

interface FormularioFamiliarProps {
  miembro: MiembroFamiliar;
  onUpdate: (updates: Partial<MiembroFamiliar>) => void;
  mostrarBusquedaCedula?: boolean;
  mostrarParentesco?: boolean;
  onBuscarCedula?: (cedula: string) => Promise<void>;
  className?: string;
}

export default function FormularioFamiliar({
  miembro,
  onUpdate,
  mostrarBusquedaCedula = true,
  mostrarParentesco = false,
  onBuscarCedula,
  className = ""
}: FormularioFamiliarProps) {

  const handlePersonalDataChange = (campo: keyof DatosPersonales, valor: any) => {
    const updates: Partial<MiembroFamiliar> = {};
    
    // Mapear campos de DatosPersonales a MiembroFamiliar
    switch(campo) {
      case 'numero_documento':
        updates.cedula = valor;
        break;
      case 'nombres':
        updates.nombres = valor;
        break;
      case 'apellidos':
        updates.apellidos = valor;
        break;
      case 'tipo_documento':
        updates.tipo_documento = valor;
        break;
      case 'sexo':
        updates.sexo = valor;
        break;
      case 'fecha_nacimiento':
        updates.fecha_nacimiento = valor;
        break;
      case 'celular':
        updates.celular = valor;
        break;
      case 'departamento':
        updates.departamento = valor;
        break;
      case 'municipio':
        updates.municipio = valor;
        break;
      case 'participa_primer_evento':
        updates.participa_primer_evento = valor;
        break;
    }
    
    onUpdate(updates);
  };

  const handleCedulaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cedula = e.target.value;
    onUpdate({ cedula });
    
    if (onBuscarCedula && cedula.length >= 6) {
      await onBuscarCedula(cedula);
    }
  };

  return (
    <div className={className}>
      {/* Búsqueda por Cédula */}
      {mostrarBusquedaCedula && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Cédula *
          </label>
          <div className="relative">
            <input
              type="text"
              value={miembro.cedula}
              onChange={handleCedulaChange}
              placeholder="Ingrese número de cédula"
              className="w-full px-3 py-2 border-2 border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {miembro.esta_buscando && (
              <div className="absolute right-3 top-2.5">
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
          {miembro.fue_encontrado && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              ✓ Persona encontrada en el sistema
            </p>
          )}
          {!miembro.fue_encontrado && miembro.cedula.length >= 6 && !miembro.esta_buscando && (
            <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
              ⚠ Persona no encontrada - complete la información
            </p>
          )}
        </div>
      )}

      {/* Mostrar información si fue encontrada */}
      {miembro.fue_encontrado ? (
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-2 border-green-200 dark:border-green-800">
          <h6 className="font-medium text-green-800 dark:text-green-200 mb-2">Información Registrada</h6>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-zinc-600 dark:text-zinc-400">Nombre:</span>
              <p className="font-medium">{miembro.nombres} {miembro.apellidos}</p>
            </div>
            <div>
              <span className="text-zinc-600 dark:text-zinc-400">Celular:</span>
              <p className="font-medium">{miembro.celular}</p>
            </div>
          </div>
        </div>
      ) : miembro.cedula.length >= 6 && !miembro.esta_buscando ? (
        /* Mostrar formulario solo si no fue encontrada y ya se buscó */
        <div className="space-y-4">
          <InformacionPersonal
            datos={extraerDatosPersonalesFamiliar(miembro)}
            onChange={handlePersonalDataChange}
            mostrarEmail={false}
            mostrarNumeroDocumento={false} // Ya se maneja arriba
            requerido={{
              nombres: true,
              apellidos: true,
              tipo_documento: false, // Opcional para familiares
              sexo: false, // Opcional para familiares
              fecha_nacimiento: true,
              celular: true,
              departamento: false, // Opcional para familiares
              municipio: false, // Opcional para familiares
            }}
          />
          
          {/* Campo de Parentesco */}
          {mostrarParentesco && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Parentesco *
              </label>
              <select
                value={miembro.parentesco}
                onChange={(e) => onUpdate({ parentesco: e.target.value })}
                className="w-full px-3 py-2 border-2 border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {opciones_parentesco.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}