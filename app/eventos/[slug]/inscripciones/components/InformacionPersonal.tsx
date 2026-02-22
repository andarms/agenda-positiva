'use client';

import { MiembroFamiliar } from './FormularioInscripcion';

export interface DatosPersonales {
  nombres: string;
  apellidos: string;
  tipo_documento: string;
  numero_documento: string;
  sexo: string;
  fecha_nacimiento: string;
  celular: string;
  email?: string;
  departamento: string;
  municipio: string;
  participa_primer_evento: boolean;
}

interface InformacionPersonalProps {
  datos: DatosPersonales;
  onChange: (campo: keyof DatosPersonales, valor: any) => void;
  mostrarEmail?: boolean;
  mostrarNumeroDocumento?: boolean;
  requerido?: {
    nombres?: boolean;
    apellidos?: boolean;
    tipo_documento?: boolean;
    numero_documento?: boolean;
    sexo?: boolean;
    fecha_nacimiento?: boolean;
    celular?: boolean;
    email?: boolean;
    departamento?: boolean;
    municipio?: boolean;
  };
  className?: string;
  titulo?: string;
  subtitulo?: string;
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

const departamentos = [
  { value: "", label: "Seleccionar departamento" },
  { value: "cundinamarca", label: "Cundinamarca" },
  { value: "antioquia", label: "Antioquia" },
  { value: "valle", label: "Valle del Cauca" },
  { value: "atlantico", label: "Atlántico" },
  { value: "bolivar", label: "Bolívar" },
];

const municipios = [
  { value: "", label: "Seleccionar municipio" },
  { value: "bogota", label: "Bogotá" },
  { value: "medellin", label: "Medellín" },
  { value: "cali", label: "Cali" },
  { value: "barranquilla", label: "Barranquilla" },
  { value: "cartagena", label: "Cartagena" },
];

export default function InformacionPersonal({
  datos,
  onChange,
  mostrarEmail = false,
  mostrarNumeroDocumento = true,
  requerido = {},
  className = "",
  titulo,
  subtitulo
}: InformacionPersonalProps) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      onChange(name as keyof DatosPersonales, checked);
    } else {
      onChange(name as keyof DatosPersonales, value);
    }
  };

  return (
    <div className={className}>
      {titulo && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {titulo}
          </h3>
          {subtitulo && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              {subtitulo}
            </p>
          )}
        </div>
      )}

      <div className="space-y-6">
        {/* Nombres y Apellidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nombres" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Nombres {requerido.nombres !== false && '*'}
            </label>
            <input
              type="text"
              id="nombres"
              name="nombres"
              required={requerido.nombres !== false}
              value={datos.nombres}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="apellidos" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Apellidos {requerido.apellidos !== false && '*'}
            </label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              required={requerido.apellidos !== false}
              value={datos.apellidos}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Información de Documento */}
        <div className={`grid grid-cols-1 ${mostrarNumeroDocumento ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
          <div>
            <label htmlFor="tipo_documento" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Tipo de Documento {requerido.tipo_documento !== false && '*'}
            </label>
            <select
              id="tipo_documento"
              name="tipo_documento"
              required={requerido.tipo_documento !== false}
              value={datos.tipo_documento}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {tipos_documento.map(tipo => (
                <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
              ))}
            </select>
          </div>
          {mostrarNumeroDocumento && (
            <div>
              <label htmlFor="numero_documento" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Número de Documento {requerido.numero_documento !== false && '*'}
              </label>
              <input
                type="text"
                id="numero_documento"
                name="numero_documento"
                required={requerido.numero_documento !== false}
                value={datos.numero_documento}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
          <div>
            <label htmlFor="sexo" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Género {requerido.sexo !== false && '*'}
            </label>
            <select
              id="sexo"
              name="sexo"
              required={requerido.sexo !== false}
              value={datos.sexo}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {opciones_sexo.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Información de Contacto y Ubicación */}
        <div className={`grid grid-cols-1 ${mostrarEmail ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
          <div>
            <label htmlFor="departamento" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Departamento {requerido.departamento !== false && '*'}
            </label>
            <select
              id="departamento"
              name="departamento"
              required={requerido.departamento !== false}
              value={datos.departamento}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {departamentos.map(dept => (
                <option key={dept.value} value={dept.value}>{dept.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="municipio" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Municipio {requerido.municipio !== false && '*'}
            </label>
            <select
              id="municipio"
              name="municipio"
              required={requerido.municipio !== false}
              value={datos.municipio}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {municipios.map(mun => (
                <option key={mun.value} value={mun.value}>{mun.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Fecha de Nacimiento {requerido.fecha_nacimiento !== false && '*'}
            </label>
            <input
              type="date"
              id="fecha_nacimiento"
              name="fecha_nacimiento"
              required={requerido.fecha_nacimiento !== false}
              value={datos.fecha_nacimiento}
              onChange={handleChange}
              className="w-full px-3 py-2 border-2 border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="celular" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Celular {requerido.celular !== false && '*'}
            </label>
            <input
              type="tel"
              id="celular"
              name="celular"
              required={requerido.celular !== false}
              value={datos.celular}
              onChange={handleChange}
              placeholder="3001234567"
              className="w-full px-3 py-2 border-2 border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {mostrarEmail && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Correo Electrónico {requerido.email !== false && '*'}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required={requerido.email !== false}
                value={datos.email || ''}
                onChange={handleChange}
                placeholder="ejemplo@dominio.com"
                className="w-full px-3 py-2 border-2 border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>

        {/* Participación en Primer Evento */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="participa_primer_evento"
            name="participa_primer_evento"
            checked={datos.participa_primer_evento}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 bg-zinc-100 border-zinc-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-zinc-800 focus:ring-2 dark:bg-zinc-700 dark:border-zinc-600"
          />
          <label htmlFor="participa_primer_evento" className="ml-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Participa en primer evento (opcional)
          </label>
        </div>
      </div>
    </div>
  );
}

// Función helper para crear datos personales desde DatosFormulario
export const extraerDatosPersonales = (datos: any): DatosPersonales => ({
  nombres: datos.nombres || '',
  apellidos: datos.apellidos || '',
  tipo_documento: datos.tipo_documento || '',
  numero_documento: datos.numero_documento || '',
  sexo: datos.sexo || '',
  fecha_nacimiento: datos.fecha_nacimiento || '',
  celular: datos.celular || '',
  email: datos.email || '',
  departamento: datos.departamento || 'cundinamarca',
  municipio: datos.municipio || 'bogota',
  participa_primer_evento: datos.participa_primer_evento || false,
});

// Función helper para crear datos personales desde MiembroFamiliar
export const extraerDatosPersonalesFamiliar = (familiar: MiembroFamiliar): DatosPersonales => ({
  nombres: familiar.nombres,
  apellidos: familiar.apellidos,
  tipo_documento: familiar.tipo_documento,
  numero_documento: familiar.cedula,
  sexo: familiar.sexo,
  fecha_nacimiento: familiar.fecha_nacimiento,
  celular: familiar.celular,
  departamento: familiar.departamento,
  municipio: familiar.municipio,
  participa_primer_evento: familiar.participa_primer_evento,
});