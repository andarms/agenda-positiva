"use client";

import Image from "next/image";
import {
  ExclamationTriangleIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

interface RegistroExistente {
  cedula: string;
  nombres: string;
  apellidos: string;
  tipo_documento: string;
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
  familiares?: FamiliarRegistrado[];
  comentarios_hospedaje?: string;
  fecha_registro: string;
  grupo_asistencia_id?: number;
  relacion_con_lider?: string;
  otros_miembros_grupo?: MiembroGrupo[];
}

interface MiembroGrupo {
  nombres: string;
  apellidos: string;
  cedula: string;
  relacion_con_lider: string;
  requiere_hospedaje: boolean;
}

interface FamiliarRegistrado {
  nombres: string;
  apellidos: string;
  cedula: string;
  celular: string;
  parentesco: string;
  servicios?: string[];
}

interface RegistroExistenteProps {
  registro: RegistroExistente;
  onIniciarNuevoRegistro: () => void;
  evento_titulo?: string;
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

const opciones_parentesco = [
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

export default function RegistroExistente({
  registro,
  onIniciarNuevoRegistro,
  evento_titulo = "Conferencias",
}: RegistroExistenteProps) {
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

        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-zinc-800 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 p-8">
              <div className="text-center mb-8">
                <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-2">
                  Hola {registro.nombres} {registro.apellidos}
                </p>
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  Ya tienes una pre-inscripción registrada
                </h2>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-700/50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  Información de tu registro:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Fecha de registro:
                    </span>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      {registro.fecha_registro}
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Celular:
                    </span>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      {registro.celular}
                    </p>
                  </div>
                  {registro.email && (
                    <div>
                      <span className="text-zinc-600 dark:text-zinc-400">
                        Email:
                      </span>
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">
                        {registro.email}
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Requiere hospedaje:
                    </span>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      {registro.requiere_hospedaje ? "Sí" : "No"}
                    </p>
                  </div>
                </div>

                {/* Sección de Otros Miembros del Grupo */}
                {registro.otros_miembros_grupo &&
                  registro.otros_miembros_grupo.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-zinc-300 dark:border-zinc-600">
                      <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                        Registro junto a:
                      </h4>
                      <div className="space-y-3">
                        {registro.otros_miembros_grupo.map((miembro, index) => (
                          <div
                            key={index}
                            className="bg-white dark:bg-zinc-800 p-4 rounded-lg border-2 border-zinc-200 dark:border-zinc-600"
                          >
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium text-zinc-900 dark:text-zinc-100">
                                {miembro.nombres} {miembro.apellidos}
                              </h5>
                              <span className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-700 px-2 py-1 rounded capitalize">
                                {miembro.relacion_con_lider}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Sección de Familiares */}
                {registro.familiares && registro.familiares.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-zinc-300 dark:border-zinc-600">
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                      Familiares Registrados:
                    </h4>
                    <div className="space-y-3">
                      {registro.familiares.map((familiar, index) => (
                        <div
                          key={index}
                          className="bg-white dark:bg-zinc-800 p-4 rounded-lg border-2 border-zinc-200 dark:border-zinc-600"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-zinc-900 dark:text-zinc-100">
                              {familiar.nombres} {familiar.apellidos}
                            </h5>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-700 px-2 py-1 rounded">
                              {opciones_parentesco.find(
                                (p) => p.value === familiar.parentesco,
                              )?.label || familiar.parentesco}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                            <div>
                              <span className="text-zinc-500 dark:text-zinc-500">
                                Cédula:
                              </span>{" "}
                              {familiar.cedula}
                            </div>
                            <div>
                              <span className="text-zinc-500 dark:text-zinc-500">
                                Celular:
                              </span>{" "}
                              {familiar.celular}
                            </div>
                          </div>
                          {familiar.servicios &&
                            familiar.servicios.length > 0 && (
                              <div className="mt-2">
                                <span className="text-xs text-zinc-500 dark:text-zinc-500">
                                  Servicios:{" "}
                                </span>
                                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                                  {familiar.servicios
                                    .map(
                                      (s) =>
                                        servicios_disponibles.find(
                                          (sd) => sd.value === s,
                                        )?.label,
                                    )
                                    .join(", ")}
                                </span>
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comentarios de Hospedaje */}
                {registro.requiere_hospedaje &&
                  registro.comentarios_hospedaje && (
                    <div className="mt-6 pt-6 border-t border-zinc-300 dark:border-zinc-600">
                      <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                        Comentarios de Hospedaje:
                      </h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-800">
                        {registro.comentarios_hospedaje}
                      </p>
                    </div>
                  )}
              </div>

              <div className="my-8 pt-8 border-t border-zinc-300 dark:border-zinc-600">
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg border-2 border-orange-200 dark:border-orange-800 p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <ExclamationTriangleIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-3">
                        Información importante sobre el pago
                      </h4>
                      <p className="text-sm text-orange-800 dark:text-orange-200 mb-4">
                        Tu pre-inscripción está registrada, pero{" "}
                        <strong>
                          no estarás totalmente inscrito hasta realizar el pago
                          completo de la cuota
                        </strong>
                        .
                      </p>
                      <p className="text-sm text-orange-800 dark:text-orange-200 mb-4">
                        Comunícate con el hermano responsable de tu localidad
                        para gestionar el pago.
                      </p>

                      <div className="flex items-center gap-2 mb-3 mt-4">
                        <CalendarIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        <h5 className="font-semibold text-orange-900 dark:text-orange-100">
                          Fechas de pago:
                        </h5>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start gap-3 bg-white dark:bg-zinc-800 p-3 rounded border border-orange-200 dark:border-orange-800">
                          <span className="font-bold text-blue-600 dark:text-blue-400 min-w-fit">
                            1ª Cuota:
                          </span>
                          <span className="text-sm text-zinc-700 dark:text-zinc-300">
                            Hasta el 17 de abril
                          </span>
                        </div>
                        <div className="flex items-start gap-3 bg-white dark:bg-zinc-800 p-3 rounded border border-orange-200 dark:border-orange-800">
                          <span className="font-bold text-blue-600 dark:text-blue-400 min-w-fit">
                            2ª Cuota:
                          </span>
                          <span className="text-sm text-zinc-700 dark:text-zinc-300">
                            Hasta el 19 de mayo
                          </span>
                        </div>
                        <div className="flex items-start gap-3 bg-white dark:bg-zinc-800 p-3 rounded border border-orange-200 dark:border-orange-800">
                          <span className="font-bold text-blue-600 dark:text-blue-400 min-w-fit">
                            3ª Cuota:
                          </span>
                          <span className="text-sm text-zinc-700 dark:text-zinc-300">
                            Hasta el 16 de junio
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onIniciarNuevoRegistro}
                  className="flex-1 bg-zinc-600 hover:bg-zinc-700 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
                >
                  Registrar otra persona
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
