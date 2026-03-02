"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import GrupoAsistencia from "./GrupoAsistencia";
import InformacionPersonal, {
  DatosPersonales,
  extraerDatosPersonales,
} from "./InformacionPersonal";

export interface DatosFormulario {
  nombres: string;
  apellidos: string;
  tipo_documento: string;
  numero_documento: string;
  sexo: string;
  fecha_nacimiento: string;
  celular: string;
  email: string;
  departamento: string;
  municipio: string;
  participa_primer_evento: boolean;
  requiere_hospedaje: boolean;
  esta_sirviendo: boolean;
  servicios: string[];
  viaja_con_esposa: boolean;
  viaja_con_hijos: boolean;
  viaja_con_otro_familiar: boolean;
  esposa?: MiembroFamiliar;
  hijos: MiembroFamiliar[];
  otros_familiares: MiembroFamiliar[];
  comentarios_hospedaje: string;
}

export interface MiembroFamiliar {
  id: string;
  cedula: string;
  nombres: string;
  apellidos: string;
  tipo_documento: string;
  sexo: string;
  fecha_nacimiento: string;
  celular: string;
  departamento: string;
  municipio: string;
  participa_primer_evento: boolean;
  esta_sirviendo: boolean;
  servicios: string[];
  parentesco: string;
  person_id: number | null;
  esta_buscando: boolean;
  fue_encontrado: boolean;
}

interface FormularioInscripcionProps {
  datos_iniciales: Partial<DatosFormulario>;
  on_volver: () => void;
  on_enviar: (datos: DatosFormulario) => Promise<void>;
  esta_enviando: boolean;
  evento_titulo?: string;
  datos_prellenados?: boolean;
}

const servicios_disponibles = [
  { value: "ninos", label: "Niños" },
  { value: "musica", label: "Música" },
  { value: "jovenes", label: "Jóvenes" },
  { value: "seguridad", label: "Seguridad" },
  { value: "enfermeria", label: "Enfermería" },
  { value: "logistica", label: "Logística" },
  { value: "protocolo", label: "Protocolo" },
  { value: "audiovisuales", label: "Audiovisuales" },
  { value: "limpieza", label: "Limpieza" },
  { value: "cocina", label: "Cocina" },
];

export default function FormularioInscripcion({
  datos_iniciales,
  on_volver,
  on_enviar,
  esta_enviando,
  evento_titulo = "Conferencias",
  datos_prellenados = false,
}: FormularioInscripcionProps) {
  const [datos_formulario, set_datos_formulario] = useState<DatosFormulario>({
    nombres: "",
    apellidos: "",
    tipo_documento: datos_iniciales.tipo_documento || "",
    numero_documento: datos_iniciales.numero_documento || "",
    sexo: "",
    fecha_nacimiento: "",
    celular: "",
    email: "",
    departamento: "cundinamarca",
    municipio: "bogota",
    participa_primer_evento: false,
    requiere_hospedaje: false,
    esta_sirviendo: false,
    servicios: [],
    viaja_con_esposa: false,
    viaja_con_hijos: false,
    viaja_con_otro_familiar: false,
    hijos: [],
    otros_familiares: [],
    comentarios_hospedaje: "",
    ...datos_iniciales,
  });

  const [colombiaData, setColombiaData] = useState<any[]>([]);
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [municipios, setMunicipios] = useState<any[]>([]);

  useEffect(() => {
    const loadColombiaData = async () => {
      try {
        const response = await fetch("/colombia.min.json");
        const data = await response.json();
        setColombiaData(data);

        // Set departamentos with "Seleccionar" and "Internacional" options
        const deptOptions = [
          { value: "", label: "Seleccionar departamento" },
          { value: "internacional", label: "Internacional" },
          ...data.map((dept: any) => ({
            value: dept.departamento.toLowerCase(),
            label: dept.departamento,
          })),
        ];
        setDepartamentos(deptOptions);

        // Set initial municipios for Cundinamarca
        const initialDept = data.find(
          (d: any) => d.departamento.toLowerCase() === "cundinamarca",
        );
        if (initialDept) {
          const munOptions = [
            { value: "", label: "Seleccionar municipio" },
            ...initialDept.ciudades.map((ciudad: string) => ({
              value: ciudad.toLowerCase(),
              label: ciudad,
            })),
          ];
          setMunicipios(munOptions);
        }
      } catch (error) {
        console.error("Error loading Colombia data:", error);
      }
    };

    loadColombiaData();
  }, []);

  const handle_input_change = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      set_datos_formulario((prev) => ({
        ...prev,
        [name]: checked,
        // Limpiar familiares y comentarios si hospedaje se desmarca
        ...(name === "requiere_hospedaje" && !checked
          ? {
              viaja_con_esposa: false,
              viaja_con_hijos: false,
              viaja_con_otro_familiar: false,
              esposa: undefined,
              hijos: [],
              otros_familiares: [],
              comentarios_hospedaje: "",
            }
          : {}),
        // Limpiar familiares específicos cuando se desmarca
        ...(name === "viaja_con_esposa" && !checked
          ? { esposa: undefined }
          : {}),
        ...(name === "viaja_con_hijos" && !checked ? { hijos: [] } : {}),
        ...(name === "viaja_con_otro_familiar" && !checked
          ? { otros_familiares: [] }
          : {}),
      }));
    } else {
      set_datos_formulario((prev) => ({ ...prev, [name]: value }));
    }
  };

  const manejar_cambio_servicios = (servicio: string) => {
    set_datos_formulario((prev) => ({
      ...prev,
      servicios: prev.servicios.includes(servicio)
        ? prev.servicios.filter((s) => s !== servicio)
        : [...prev.servicios, servicio],
    }));
  };

  const manejar_envio = async (e: React.FormEvent) => {
    e.preventDefault();
    await on_enviar(datos_formulario);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Background Image */}
      <Image
        src="/backgrounds/Fundo 1.png"
        alt="Background"
        fill
        className="object-cover"
        priority
        quality={100}
      />

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content Container */}
      <div className="relative min-h-screen flex flex-col px-4 sm:px-6 lg:px-8 py-8">
        {/* Logo */}
        <div className="mb-8 w-full flex justify-center">
          <div className="relative w-24 h-24 sm:w-64 sm:h-64">
            <Image
              src="/logos/Espanhol Branco@2x.png"
              alt="Agenda Positiva"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={on_volver}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white hover:text-white font-medium rounded-lg transition-all duration-200 border border-white/20 hover:border-white/40 mb-4 group"
              >
                <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                Verificar otro documento
              </button>
              <h1 className="text-4xl font-bold text-white mb-4">
                Pre-inscripción
              </h1>
              <p className="text-lg text-white">
                Completa este formulario para registrarte previamente al evento
              </p>
              <p className="text-sm text-white mt-2">
                Documento: {datos_formulario.numero_documento}
              </p>

              {/* Notificación de datos prellenados */}
              {datos_prellenados && (
                <div className="mt-4 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2">
                    <div className="text-green-600 dark:text-green-400 text-lg font-bold">
                      ✓
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Datos encontrados en el sistema
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Hemos prellenado tu información con datos de registros
                        anteriores. Revisa y actualiza los datos si es
                        necesario.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Form */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 p-8">
              <form onSubmit={manejar_envio} className="space-y-8">
                {/* Información Personal */}
                <InformacionPersonal
                  datos={extraerDatosPersonales(datos_formulario)}
                  onChange={(campo, valor) => {
                    if (campo === "departamento") {
                      // Handle department change to update municipalities
                      set_datos_formulario((prev) => ({
                        ...prev,
                        departamento: valor,
                        municipio: "",
                      }));
                      if (valor === "internacional") {
                        // For internacional, just set empty text field option
                        setMunicipios([]);
                      } else {
                        const deptData = colombiaData.find(
                          (d: any) => d.departamento.toLowerCase() === valor,
                        );
                        if (deptData) {
                          const munOptions = [
                            { value: "", label: "Seleccionar municipio" },
                            ...deptData.ciudades.map((ciudad: string) => ({
                              value: ciudad.toLowerCase(),
                              label: ciudad,
                            })),
                          ];
                          setMunicipios(munOptions);
                        }
                      }
                    } else {
                      set_datos_formulario((prev) => ({
                        ...prev,
                        [campo]: valor,
                      }));
                    }
                  }}
                  mostrarEmail={true}
                  titulo="Información Personal"
                  subtitulo="Complete sus datos personales"
                  departamentos={departamentos}
                  municipios={municipios}
                />

                {/* Información de Hospedaje */}
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
                    Información de Hospedaje
                  </h3>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requiere_hospedaje"
                      name="requiere_hospedaje"
                      checked={datos_formulario.requiere_hospedaje}
                      onChange={handle_input_change}
                      className="h-4 w-4 text-blue-600 bg-zinc-100 border-zinc-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-zinc-800 focus:ring-2 dark:bg-zinc-700 dark:border-zinc-600"
                    />
                    <label
                      htmlFor="requiere_hospedaje"
                      className="ml-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      Requiere hospedaje
                    </label>
                  </div>
                </div>

                {/* Sección de Familiares - Solo si requiere hospedaje */}
                {datos_formulario.requiere_hospedaje && (
                  <GrupoAsistencia
                    datos_formulario={datos_formulario}
                    set_datos_formulario={set_datos_formulario}
                    handle_input_change={handle_input_change}
                  />
                )}

                {/* Servicios */}
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
                    ¿Actualmente en la iglesia está participando de alguno de
                    estos servicios?
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {servicios_disponibles.map((servicio) => (
                      <div key={servicio.value} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`servicio-${servicio.value}`}
                          checked={datos_formulario.servicios.includes(
                            servicio.value,
                          )}
                          onChange={() =>
                            manejar_cambio_servicios(servicio.value)
                          }
                          className="h-4 w-4 text-blue-600 bg-zinc-100 border-zinc-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-zinc-800 focus:ring-2 dark:bg-zinc-700 dark:border-zinc-600"
                        />
                        <label
                          htmlFor={`servicio-${servicio.value}`}
                          className="ml-2 text-sm text-zinc-700 dark:text-zinc-300"
                        >
                          {servicio.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botón de Envío */}
                <div className="p-6 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
                  <button
                    type="submit"
                    disabled={esta_enviando}
                    className="w-full text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed hover:opacity-90 disabled:opacity-60"
                    style={{
                      backgroundColor: "var(--button-primary)",
                    }}
                  >
                    {esta_enviando ? "Enviando..." : "Enviar Pre-inscripción"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
