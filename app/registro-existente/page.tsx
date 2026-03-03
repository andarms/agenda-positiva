"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface RegistroPreInscripcion {
  cedula: string;
  nombres: string;
  apellidos: string;
  tipo_documento: string;
  sexo: string;
  fecha_nacimiento: string;
  celular: string;
  email: string;
  localidad: string;
  participa_primer_evento: boolean;
  requiere_hospedaje: boolean;
  esta_sirviendo: boolean;
  servicios: string[];
  necesidades_especiales?: string;
  fecha_registro: string;
}

interface MiembroGrupo {
  nombres: string;
  apellidos: string;
  cedula: string;
  relacion_con_lider: string | null;
  requiere_hospedaje: boolean;
}

interface DatosEvento {
  titulo: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  descripcion?: string;
  ubicacion?: string;
  slug: string;
}

export default function RegistroExistentePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [datos_evento, setDatosEvento] = useState<DatosEvento | null>(null);
  const [registro_existente, setRegistroExistente] =
    useState<RegistroPreInscripcion | null>(null);
  const [miembros_grupo, setMiembrosGrupo] = useState<MiembroGrupo[]>([]);
  const [cargando, setCargando] = useState(true);

  const tipo_documento = searchParams.get("tipo_documento") || "";
  const numero_documento = searchParams.get("numero_documento") || "";

  useEffect(() => {
    if (!tipo_documento || !numero_documento) {
      router.push("/verificar");
      return;
    }

    cargar_datos();
  }, []);

  const cargar_datos = async () => {
    try {
      // Load event data
      const respuesta_evento = await fetch(`/api/eventos/activo`);
      if (respuesta_evento.ok) {
        const data = await respuesta_evento.json();
        setDatosEvento({
          titulo: data.evento.nombre,
          fecha_inicio: data.evento.fecha_inicio,
          fecha_fin: data.evento.fecha_fin,
          slug: data.evento.slug,
          descripcion: data.evento.descripcion,
          ubicacion: data.evento.ubicacion,
        });
      }

      // Load registration data
      const response = await fetch(`/api/verificar-documento`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo_documento,
          numero_documento,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (
          data.existe &&
          data.ya_registrado &&
          data.persona &&
          data.inscripcion
        ) {
          // Create registro object from API response
          const registro: RegistroPreInscripcion = {
            cedula: data.persona.numero_identificacion,
            nombres: data.persona.nombres,
            apellidos: data.persona.apellidos,
            tipo_documento: data.persona.tipo_identificacion,
            sexo: "masculino", // Default, we may need to add this field to persona table
            fecha_nacimiento: data.persona.fecha_nacimiento,
            celular: data.persona.telefono,
            email: data.persona.email || "",
            localidad: data.inscripcion.localidad || "",
            participa_primer_evento: false,
            requiere_hospedaje: !!data.inscripcion.requiere_hospedaje,
            esta_sirviendo: false,
            servicios: [],
            necesidades_especiales:
              data.inscripcion.necesidades_especiales || "",
            fecha_registro:
              data.inscripcion.fecha_creacion ||
              new Date().toISOString().split("T")[0],
          };
          setRegistroExistente(registro);

          // Store group members (familiares)
          if (
            data.otros_miembros_grupo &&
            data.otros_miembros_grupo.length > 0
          ) {
            setMiembrosGrupo(data.otros_miembros_grupo);
          }
        } else {
          // Not registered, redirect to verification
          router.push(`/verificar`);
        }
      } else {
        throw new Error("Error al verificar documento");
      }
    } catch (error) {
      console.error("Error al cargar datos del registro:", error);
      router.push("/verificar");
    } finally {
      setCargando(false);
    }
  };

  const manejar_volver = () => {
    router.push("/verificar");
  };

  const iniciar_nuevo_registro = () => {
    router.push("/verificar");
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos de registro...</p>
        </div>
      </div>
    );
  }

  if (!registro_existente) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">
            No hay datos de registro
          </h2>
          <button
            onClick={iniciar_nuevo_registro}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Iniciar nuevo registro
          </button>
        </div>
      </div>
    );
  }

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

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative min-h-screen flex flex-col px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={manejar_volver}
            className="flex items-center text-white hover:text-white/80 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Volver
          </button>
          <div className="relative w-24 h-24">
            <Image
              src="/logos/Espanhol Branco@2x.png"
              alt="Agenda Positiva"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-800 rounded-lg border-2 border-zinc-200  p-8 w-full max-w-4xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                ¡Ya estás registrado!
              </h1>
            </div>

            {/* Registration Details */}
            <div className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                  Información Personal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-zinc-50 dark:bg-zinc-700 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Nombres:
                    </span>
                    <p className="text-zinc-900 dark:text-zinc-100">
                      {registro_existente.nombres}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Apellidos:
                    </span>
                    <p className="text-zinc-900 dark:text-zinc-100">
                      {registro_existente.apellidos}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Documento:
                    </span>
                    <p className="text-zinc-900 dark:text-zinc-100">
                      {registro_existente.tipo_documento}{" "}
                      {registro_existente.cedula}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Fecha de Nacimiento:
                    </span>
                    <p className="text-zinc-900 dark:text-zinc-100">
                      {new Date(
                        registro_existente.fecha_nacimiento,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Celular:
                    </span>
                    <p className="text-zinc-900 dark:text-zinc-100">
                      {registro_existente.celular}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Email:
                    </span>
                    <p className="text-zinc-900 dark:text-zinc-100">
                      {registro_existente.email || "No proporcionado"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Localidad:
                    </span>
                    <p className="text-zinc-900 dark:text-zinc-100">
                      {registro_existente.localidad}
                    </p>
                  </div>
                  {registro_existente.necesidades_especiales && (
                    <div className="col-span-full">
                      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        Necesidades Especiales:
                      </span>
                      <p className="text-zinc-900 dark:text-zinc-100">
                        {registro_existente.necesidades_especiales}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Event Preferences */}
              <div>
                <div className="space-y-3 p-4 bg-zinc-50 dark:bg-zinc-700 rounded-lg">
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded mr-3 flex items-center justify-center ${
                        registro_existente.requiere_hospedaje
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    >
                      {registro_existente.requiere_hospedaje && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      )}
                    </div>
                    <span className="text-zinc-900 dark:text-zinc-100">
                      Requiere hospedaje
                    </span>
                  </div>

                  {registro_existente.servicios &&
                    registro_existente.servicios.length > 0 && (
                      <div className="mt-4">
                        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                          Áreas de servicio:
                        </span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {registro_existente.servicios.map(
                            (servicio, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                              >
                                {servicio}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* Family Members / Group */}
              {registro_existente.requiere_hospedaje &&
                miembros_grupo.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Grupo Familiar
                    </h3>
                    <div className="space-y-3 p-4 bg-zinc-50 dark:bg-zinc-700 rounded-lg">
                      {miembros_grupo.map((miembro, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-md border border-zinc-200 bg-white p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-zinc-900">
                                {miembro.nombres} {miembro.apellidos}
                              </p>
                              <p className="text-xs text-zinc-500">
                                {miembro.relacion_con_lider
                                  ? miembro.relacion_con_lider
                                      .charAt(0)
                                      .toUpperCase() +
                                    miembro.relacion_con_lider.slice(1)
                                  : "Familiar"}
                                {" · "}
                                {miembro.cedula}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                              miembro.requiere_hospedaje
                                ? "bg-green-100 text-green-800"
                                : "bg-zinc-100 text-zinc-600"
                            }`}
                          >
                            {miembro.requiere_hospedaje ? (
                              <svg
                                className="h-3.5 w-3.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="h-3.5 w-3.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                            {miembro.requiere_hospedaje
                              ? "Requiere hospedaje"
                              : "Sin hospedaje"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Payment Notice */}
            <div className="mt-8  border-l-4 border-amber-500 bg-amber-50 p-5">
              <div className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-6 w-6 flex-shrink-0 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h4 className="text-base font-bold text-amber-800">
                    ¡Importante!
                  </h4>
                  <p className="mt-1 text-sm text-amber-700">
                    No estarás completamente inscrito hasta que pagues la
                    totalidad de la cuota de participación. Comunícate con el
                    hermano responsable de tu localidad para gestionar los
                    pagos.
                  </p>
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-amber-800 mb-2">
                      Fechas límite de pago:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="flex items-center gap-2 rounded-md border border-amber-300 bg-amber-100 px-3 py-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                          1
                        </span>
                        <div>
                          <p className="text-xs font-medium text-amber-600">
                            Primera cuota
                          </p>
                          <p className="text-sm font-bold text-amber-900">
                            17 de abril
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-md border border-amber-300 bg-amber-100 px-3 py-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                          2
                        </span>
                        <div>
                          <p className="text-xs font-medium text-amber-600">
                            Segunda cuota
                          </p>
                          <p className="text-sm font-bold text-amber-900">
                            19 de mayo
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-md border border-amber-300 bg-amber-100 px-3 py-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                          3
                        </span>
                        <div>
                          <p className="text-xs font-medium text-amber-600">
                            Tercera cuota
                          </p>
                          <p className="text-sm font-bold text-amber-900">
                            17 de junio
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-8 border-t border-zinc-200  mt-8">
              <button
                onClick={manejar_volver}
                className="px-6 py-3 border border-zinc-300  rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
              >
                Volver
              </button>
              <button
                onClick={iniciar_nuevo_registro}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Nuevo Registro
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
