"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import PersonSearchForm from "./components/PersonSearchForm";
import FamilyMemberForm from "./components/FamilyMemberForm";

interface DatosEvento {
  titulo: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  slug: string;
  descripcion?: string;
  ubicacion?: string;
}

interface DepartamentoData {
  id: number;
  departamento: string;
  ciudades: string[];
}

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

interface DatosFormulario {
  nombres: string;
  apellidos: string;
  tipo_documento: string;
  numero_documento: string;
  sexo: string;
  fecha_nacimiento: string;
  celular: string;
  email: string;
  localidad: string;
  participa_primer_evento: boolean;
  requiere_hospedaje: boolean;
  necesidades_especiales: string;
  esta_sirviendo: boolean;
  servicios: string[];

  // Nuevos campos para hospedaje con acompañantes
  viaja_con_pareja: boolean;
  parejas: FamiliarData[];
  viaja_con_hijos: boolean;
  hijos: FamiliarData[];
  viaja_con_otros_familiares: boolean;
  otros_familiares: FamiliarData[];
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

export default function FormularioInscripcionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [esta_enviando, setEstaEnviando] = useState(false);
  const [datos_evento, setDatosEvento] = useState<DatosEvento | null>(null);
  const [datos_persona_existente, setDatosPersonaExistente] = useState<
    any | null
  >(null);
  const [departamento_seleccionado, setDepartamentoSeleccionado] = useState("");
  const [municipio_seleccionado, setMunicipioSeleccionado] = useState("");
  const [departamentos, setDepartamentos] = useState<DepartamentoData[]>([]);

  // Get initial data from URL params
  const tipo_documento = searchParams.get("tipo_documento") || "";
  const numero_documento = searchParams.get("numero_documento") || "";

  const [datos_formulario, setDatosFormulario] = useState<DatosFormulario>({
    nombres: "",
    apellidos: "",
    tipo_documento,
    numero_documento,
    sexo: "",
    fecha_nacimiento: "",
    celular: "",
    email: "",
    localidad: "",
    participa_primer_evento: false,
    requiere_hospedaje: false,
    necesidades_especiales: "",
    esta_sirviendo: false,
    servicios: [],

    // Nuevos campos para hospedaje con acompañantes
    viaja_con_pareja: false,
    parejas: [],
    viaja_con_hijos: false,
    hijos: [],
    viaja_con_otros_familiares: false,
    otros_familiares: [],
  });

  useEffect(() => {
    cargar_datos_evento();
    cargar_departamentos();

    if (!tipo_documento || !numero_documento) {
      router.push("/verificar");
      return;
    }

    cargar_datos_persona();
  }, []);

  const cargar_departamentos = async () => {
    try {
      const response = await fetch("/colombia.min.json");
      const data = await response.json();
      setDepartamentos(data);
    } catch (error) {
      console.error("Error cargando departamentos:", error);
    }
  };

  const get_municipios = (dep_id: string) => {
    const dept = departamentos.find(
      (d) => d.id.toString() === dep_id.toString(),
    );
    return dept?.ciudades || [];
  };

  const cargar_datos_evento = async () => {
    try {
      const respuesta = await fetch(`/api/eventos/activo`);
      if (respuesta.ok) {
        const data = await respuesta.json();
        setDatosEvento({
          titulo: data.evento.nombre,
          fecha_inicio: data.evento.fecha_inicio,
          fecha_fin: data.evento.fecha_fin,
          slug: data.evento.slug,
          descripcion: data.evento.descripcion,
          ubicacion: data.evento.ubicacion,
        });
      } else {
        throw new Error("Evento activo no encontrado");
      }
    } catch (error) {
      console.error("Error al cargar datos del evento:", error);
      setDatosEvento({
        titulo: "Evento Activo",
        slug: "activo",
      });
    }
  };

  const cargar_datos_persona = async () => {
    try {
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
        if (data.existe && data.ya_registrado) {
          router.push(
            `/registro-existente?tipo_documento=${tipo_documento}&numero_documento=${numero_documento}`,
          );
          return;
        }

        if (data.existe && data.persona) {
          setDatosPersonaExistente(data.persona);
          setDatosFormulario((prev) => ({
            ...prev,
            nombres: data.persona.nombres || "",
            apellidos: data.persona.apellidos || "",
            fecha_nacimiento: data.persona.fecha_nacimiento || "",
            celular: data.persona.telefono || "",
            email: data.persona.email || "",
          }));
        }
      }
    } catch (error) {
      console.error("Error al verificar documento:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setDatosFormulario((prev) => ({ ...prev, [name]: checked }));
    } else {
      setDatosFormulario((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleServiciosChange = (servicio: string) => {
    setDatosFormulario((prev) => ({
      ...prev,
      servicios: prev.servicios.includes(servicio)
        ? prev.servicios.filter((s) => s !== servicio)
        : [...prev.servicios, servicio],
    }));
  };

  // Nuevas funciones para manejo de acompañantes
  const handleParejasChange = (parejas: FamiliarData[]) => {
    setDatosFormulario((prev) => ({
      ...prev,
      parejas: parejas,
    }));
  };

  const handleHijosChange = (hijos: FamiliarData[]) => {
    setDatosFormulario((prev) => ({
      ...prev,
      hijos: hijos,
    }));
  };

  const handleOtrosFamiliaresChange = (familiares: FamiliarData[]) => {
    setDatosFormulario((prev) => ({
      ...prev,
      otros_familiares: familiares,
    }));
  };

  const manejar_envio = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !datos_formulario.nombres ||
      !datos_formulario.apellidos ||
      !datos_formulario.sexo ||
      !datos_formulario.fecha_nacimiento ||
      !datos_formulario.celular ||
      !departamento_seleccionado ||
      !municipio_seleccionado
    ) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    setEstaEnviando(true);

    try {
      // Combinar departamento y municipio en localidad
      const dept_obj = departamentos.find(
        (d) => d.id.toString() === departamento_seleccionado,
      );
      const localidad_combinada = `${dept_obj?.departamento} / ${municipio_seleccionado}`;

      // Preparar datos para envío con lista unificada de familiares
      const familiares_unificados: any[] = [];

      // Agregar parejas
      datos_formulario.parejas.forEach((pareja) => {
        familiares_unificados.push({
          nombres: pareja.persona.nombres,
          apellidos: pareja.persona.apellidos,
          tipo_documento: pareja.persona.tipo_identificacion,
          numero_documento: pareja.persona.numero_identificacion,
          fecha_nacimiento: pareja.persona.fecha_nacimiento,
          celular: pareja.persona.telefono,
          email: pareja.persona.email,
          sexo: pareja.persona.sexo || "",
          localidad: datos_formulario.localidad,
          requiere_hospedaje: true,
          necesidades_especiales: pareja.persona.necesidades_especiales || "",
          esta_sirviendo: false,
          servicios: [],
          relacion_con_lider: pareja.relacion,
        });
      });

      // Agregar hijos
      datos_formulario.hijos.forEach((hijo) => {
        familiares_unificados.push({
          nombres: hijo.persona.nombres,
          apellidos: hijo.persona.apellidos,
          tipo_documento: hijo.persona.tipo_identificacion,
          numero_documento: hijo.persona.numero_identificacion,
          fecha_nacimiento: hijo.persona.fecha_nacimiento,
          celular: hijo.persona.telefono,
          email: hijo.persona.email,
          sexo: hijo.persona.sexo || "",
          localidad: datos_formulario.localidad,
          requiere_hospedaje: true,
          necesidades_especiales: hijo.persona.necesidades_especiales || "",
          esta_sirviendo: false,
          servicios: [],
          relacion_con_lider: hijo.relacion,
        });
      });

      // Agregar otros familiares
      datos_formulario.otros_familiares.forEach((familiar) => {
        familiares_unificados.push({
          nombres: familiar.persona.nombres,
          apellidos: familiar.persona.apellidos,
          tipo_documento: familiar.persona.tipo_identificacion,
          numero_documento: familiar.persona.numero_identificacion,
          fecha_nacimiento: familiar.persona.fecha_nacimiento,
          celular: familiar.persona.telefono,
          email: familiar.persona.email,
          sexo: familiar.persona.sexo || "",
          localidad: datos_formulario.localidad,
          requiere_hospedaje: true,
          necesidades_especiales: familiar.persona.necesidades_especiales || "",
          esta_sirviendo: false,
          servicios: [],
          relacion_con_lider: familiar.relacion,
        });
      });

      // Preparar datos del formulario principal
      const datos_envio = {
        nombres: datos_formulario.nombres,
        apellidos: datos_formulario.apellidos,
        tipo_documento: datos_formulario.tipo_documento,
        numero_documento: datos_formulario.numero_documento,
        sexo: datos_formulario.sexo,
        fecha_nacimiento: datos_formulario.fecha_nacimiento,
        celular: datos_formulario.celular,
        email: datos_formulario.email,
        localidad: localidad_combinada,
        participa_primer_evento: datos_formulario.participa_primer_evento,
        requiere_hospedaje: datos_formulario.requiere_hospedaje,
        necesidades_especiales: datos_formulario.necesidades_especiales,
        esta_sirviendo: datos_formulario.esta_sirviendo,
        servicios: datos_formulario.servicios,
        familiares: familiares_unificados,
      };

      const response = await fetch(`/api/inscripciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos_envio),
      });

      if (!response.ok) {
        const error_data = await response.json();
        throw new Error(error_data.error || "Error al procesar la inscripción");
      }

      alert("¡Inscripción enviada correctamente! Gracias por registrarte.");
      router.push("/verificar");
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      const error_message =
        error instanceof Error
          ? error.message
          : "Por favor intente nuevamente.";
      alert(`Error al enviar la inscripción: ${error_message}`);
    } finally {
      setEstaEnviando(false);
    }
  };

  const manejar_volver = () => {
    router.push("/verificar");
  };

  if (!datos_evento) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
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
          <div className="bg-white 0 rounded-lg border-2 border-zinc-200  p-8 w-full max-w-4xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-zinc-900  mb-2">
                Formulario de Inscripción
              </h1>
              <p className="text-zinc-600 ">{datos_evento.titulo}</p>
              {datos_persona_existente && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600">
                    Hemos prellenado tu información con datos de registros
                    anteriores. Revisa y actualiza los datos si es necesario.
                  </p>
                </div>
              )}
            </div>

            <form onSubmit={manejar_envio} className="space-y-8">
              {/* Información Personal */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-900  mb-6">
                  Información Personal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700  mb-2">
                      Nombres *
                    </label>
                    <input
                      type="text"
                      name="nombres"
                      required
                      value={datos_formulario.nombres}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border-2 border-zinc-300  rounded-lg bg-white  text-zinc-900  focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700  mb-2">
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      name="apellidos"
                      required
                      value={datos_formulario.apellidos}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border-2 border-zinc-300  rounded-lg bg-white  text-zinc-900  focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700  mb-2">
                      Género *
                    </label>
                    <select
                      name="sexo"
                      required
                      value={datos_formulario.sexo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border-2 border-zinc-300  rounded-lg bg-white  text-zinc-900  focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {opciones_sexo.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700  mb-2">
                      Tipo de Documento *
                    </label>
                    <select
                      name="tipo_documento"
                      required
                      value={datos_formulario.tipo_documento}
                      onChange={handleInputChange}
                      disabled
                      className="w-full px-3 py-2 border-2 border-zinc-300  rounded-lg bg-gray-100  text-zinc-900 "
                    >
                      {tipos_documento.map((tipo) => (
                        <option key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700  mb-2">
                      Número de Documento *
                    </label>
                    <input
                      type="text"
                      name="numero_documento"
                      required
                      value={datos_formulario.numero_documento}
                      onChange={handleInputChange}
                      disabled
                      className="w-full px-3 py-2 border-2 border-zinc-300  rounded-lg bg-gray-100  text-zinc-900 "
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700  mb-2">
                      Fecha de Nacimiento *
                    </label>
                    <input
                      type="date"
                      name="fecha_nacimiento"
                      required
                      value={datos_formulario.fecha_nacimiento}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border-2 border-zinc-300  rounded-lg bg-white  text-zinc-900  focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Contacto y Ubicación */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700  mb-2">
                      Celular *
                    </label>
                    <input
                      type="tel"
                      name="celular"
                      required
                      value={datos_formulario.celular}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border-2 border-zinc-300  rounded-lg bg-white  text-zinc-900  focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700  mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={datos_formulario.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border-2 border-zinc-300  rounded-lg bg-white  text-zinc-900  focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700  mb-2">
                      Departamento *
                    </label>
                    <select
                      value={departamento_seleccionado}
                      onChange={(e) => {
                        setDepartamentoSeleccionado(e.target.value);
                        setMunicipioSeleccionado("");
                      }}
                      className="w-full px-3 py-2 border-2 border-zinc-300  rounded-lg bg-white  text-zinc-900  focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Seleccionar departamento</option>
                      {departamentos.map((depto) => (
                        <option key={depto.id} value={depto.id}>
                          {depto.departamento}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700  mb-2">
                      Municipio *
                    </label>
                    <select
                      value={municipio_seleccionado}
                      onChange={(e) => setMunicipioSeleccionado(e.target.value)}
                      disabled={!departamento_seleccionado}
                      className="w-full px-3 py-2 border-2 border-zinc-300  rounded-lg bg-white  text-zinc-900  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">Seleccionar municipio</option>
                      {get_municipios(departamento_seleccionado).map(
                        (municipio) => (
                          <option key={municipio} value={municipio}>
                            {municipio}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </div>

                {/* Necesidades Especiales */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-zinc-700  mb-2">
                    Necesidades Especiales
                  </label>
                  <p className="text-sm text-zinc-500  mb-3">
                    Si usted o sus acompañantes utilizan silla de ruedas, tienen
                    movilidad reducida, se encuentran en recuperación médica,
                    presentan alguna condición cognitiva o requieren algún apoyo
                    adicional, por favor indíquelo aquí. Esta información nos
                    ayudará a gestionar el hospedaje de la mejor manera posible
                    y, cuando sea necesario, procurar que las personas que
                    requieran apoyo puedan alojarse juntas. Las solicitudes se
                    atenderán según disponibilidad.
                  </p>
                  <textarea
                    name="necesidades_especiales"
                    value={datos_formulario.necesidades_especiales}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border-2 border-zinc-300  rounded-lg bg-white  text-zinc-900  focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Información del Evento */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-900  mb-6">
                  Información del Evento
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="requiere_hospedaje"
                      checked={datos_formulario.requiere_hospedaje}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-zinc-700 ">
                      Requiero hospedaje
                    </span>
                  </label>
                </div>

                {/* Secciones de hospedaje con acompañantes */}
                {datos_formulario.requiere_hospedaje && (
                  <div className="mt-6 space-y-6">
                    {/* Preguntas sobre acompañantes */}
                    <div className="space-y-4">
                      <div className="space-y-6">
                        {/* Pareja */}
                        <div className="space-y-3">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="viaja_con_pareja"
                              checked={datos_formulario.viaja_con_pareja}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              ¿Viajas con tu esposa/esposo?
                            </span>
                          </label>

                          {/* Sección de pareja */}
                          {datos_formulario.viaja_con_pareja && (
                            <div className="">
                              <FamilyMemberForm
                                title="Pareja que viaja contigo"
                                relationshipLabel="Pareja"
                                allowedRelationships={["esposo", "esposa"]}
                                onFamilyMembersChange={handleParejasChange}
                                maxMembers={1}
                              />
                            </div>
                          )}
                        </div>

                        {/* Hijos */}
                        <div className="space-y-3">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="viaja_con_hijos"
                              checked={datos_formulario.viaja_con_hijos}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              ¿Viajas con tus hijos?
                            </span>
                          </label>

                          {/* Sección de hijos */}
                          {datos_formulario.viaja_con_hijos && (
                            <div className="">
                              <FamilyMemberForm
                                title="Hijos que viajan contigo"
                                relationshipLabel="Hijo"
                                allowedRelationships={["hijo", "hija"]}
                                onFamilyMembersChange={handleHijosChange}
                                maxMembers={15}
                              />
                            </div>
                          )}
                        </div>

                        {/* Otros familiares */}
                        <div className="space-y-3">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="viaja_con_otros_familiares"
                              checked={
                                datos_formulario.viaja_con_otros_familiares
                              }
                              onChange={handleInputChange}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              ¿Viajas con algún otro familiar?
                            </span>
                          </label>

                          {/* Sección de otros familiares */}
                          {datos_formulario.viaja_con_otros_familiares && (
                            <div className="">
                              <FamilyMemberForm
                                title="Otros familiares que viajan contigo"
                                relationshipLabel="Familiar"
                                onFamilyMembersChange={
                                  handleOtrosFamiliaresChange
                                }
                                maxMembers={10}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Servicios */}

                <div className="mt-6">
                  <label className="block text-sm font-medium text-zinc-700  mb-4">
                    ¿Actualmente en la iglesia está participando de alguno de
                    estos servicios?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {servicios_disponibles.map((servicio) => (
                      <label key={servicio.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={datos_formulario.servicios.includes(
                            servicio.value,
                          )}
                          onChange={() => handleServiciosChange(servicio.value)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-zinc-700 ">
                          {servicio.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-between pt-6 border-t border-zinc-200 dark:border-zinc-700">
                <button
                  type="button"
                  onClick={manejar_volver}
                  className="px-6 py-3 border border-zinc-300  rounded-lg text-zinc-700  hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={esta_enviando}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center"
                >
                  {esta_enviando ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    "Enviar Inscripción"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
