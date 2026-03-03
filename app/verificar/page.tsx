"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface DatosEvento {
  titulo: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  slug: string;
  descripcion?: string;
  ubicacion?: string;
}

const tipos_documento = [
  { value: "", label: "Seleccionar tipo" },
  { value: "cedula", label: "Cédula de Ciudadanía" },
  { value: "cedula_extranjeria", label: "Cédula de Extranjería" },
  { value: "pasaporte", label: "Pasaporte" },
  { value: "tarjeta_identidad", label: "TI - Tarjeta de Identidad" },
];

export default function VerificarPage() {
  const router = useRouter();
  const [datos_evento, setDatosEvento] = useState<DatosEvento | null>(null);
  const [tipo_documento, setTipoDocumento] = useState("");
  const [numero_documento, setNumeroDocumento] = useState("");
  const [verificando, setVerificando] = useState(false);

  useEffect(() => {
    cargar_datos_evento();
  }, []);

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

  const manejar_cambio_numero_documento = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const valor = e.target.value.replace(/\D/g, ""); // Solo permite números
    setNumeroDocumento(valor);
  };

  const manejar_verificacion = async () => {
    if (!tipo_documento || numero_documento.length < 6) {
      alert(
        "Por favor seleccione el tipo de documento e ingrese un número válido",
      );
      return;
    }

    setVerificando(true);
    try {
      const response = await fetch(`/api/verificar-documento`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo_documento,
          numero_documento,
        }),
      });

      if (!response.ok) {
        throw new Error("Error en la verificación del documento");
      }

      const data = await response.json();

      if (data.existe && data.ya_registrado) {
        // Already registered, redirect to existing registration page
        const params = new URLSearchParams({
          tipo_documento,
          numero_documento,
        });
        router.push(`/registro-existente?${params.toString()}`);
      } else {
        // New registration or person exists but not registered
        const params = new URLSearchParams({
          tipo_documento,
          numero_documento,
        });
        router.push(`/formulario-inscripcion?${params.toString()}`);
      }
    } catch (error) {
      console.error("Error al verificar documento:", error);
      alert("Error al verificar el documento. Intente nuevamente.");
    } finally {
      setVerificando(false);
    }
  };

  const formatear_fecha = (fecha_iso?: string) => {
    if (!fecha_iso) return "";
    const fecha = new Date(fecha_iso);
    return fecha.toLocaleDateString("es-CO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        {/* Header */}
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32">
            <Image
              src="/logos/Espanhol Branco@2x.png"
              alt="Agenda Positiva"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md">
            {/* Verification Form */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Verificar Documento
                </h2>
                <p className="text-gray-600 text-sm">
                  Ingrese su información para continuar con la inscripción
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  manejar_verificacion();
                }}
                className="space-y-4"
              >
                {/* Document Type */}
                <div>
                  <label
                    htmlFor="tipo-documento"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Tipo de Documento
                  </label>
                  <select
                    id="tipo-documento"
                    value={tipo_documento}
                    onChange={(e) => setTipoDocumento(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    disabled={verificando}
                  >
                    {tipos_documento.map((tipo) => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Document Number */}
                <div>
                  <label
                    htmlFor="numero-documento"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Número de Documento
                  </label>
                  <input
                    type="text"
                    id="numero-documento"
                    value={numero_documento}
                    onChange={manejar_cambio_numero_documento}
                    placeholder="Ingrese el número de documento"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    disabled={verificando}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={
                    verificando ||
                    !tipo_documento ||
                    numero_documento.length < 6
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {verificando ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Verificando...
                    </>
                  ) : (
                    "Continuar"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-white/80 text-sm mt-8">
          <p>¿Necesitas ayuda? Contacta a nuestro equipo de soporte</p>
        </div>
      </div>
    </div>
  );
}
