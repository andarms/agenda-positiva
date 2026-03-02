"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

interface VerificarDocumentoProps {
  onDocumentoVerificado: (
    tipo_documento: string,
    numero_documento: string,
    datos_persona?: any,
  ) => void;
  onRegistroExistente: (registro: any) => void;
  evento_titulo?: string;
  evento_fecha?: string;
  esta_verificando: boolean;
}

const tipos_documento = [
  { value: "", label: "Seleccionar tipo" },
  { value: "cedula", label: "Cédula de Ciudadanía" },
  { value: "cedula_extranjeria", label: "Cédula de Extranjería" },
  { value: "pasaporte", label: "Pasaporte" },
  { value: "tarjeta_identidad", label: "TI - Tarjeta de Identidad" },
];

export default function VerificarDocumento({
  onDocumentoVerificado,
  onRegistroExistente,
  evento_titulo = "Conferencias",
  evento_fecha = "",
  esta_verificando,
}: VerificarDocumentoProps) {
  const [tipo_documento, setTipoDocumento] = useState("");
  const [numero_documento, setNumeroDocumento] = useState("");
  const [verificando, setVerificando] = useState(false);
  const params = useParams();
  const slug_evento = params.slug as string;

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
      const respuesta = await verificar_documento_en_base_datos(
        tipo_documento,
        numero_documento,
      );

      if (respuesta.esta_registrada) {
        onRegistroExistente(respuesta);
      } else {
        // Pasar los datos de persona si existen (persona registrada pero no inscrita al evento)
        onDocumentoVerificado(
          tipo_documento,
          numero_documento,
          respuesta.datos_persona,
        );
      }
    } catch (error) {
      console.error("Error al verificar documento:", error);
      alert("Error al verificar el documento. Intente nuevamente.");
    } finally {
      setVerificando(false);
    }
  };

  // Función para verificar el documento en la API
  const verificar_documento_en_base_datos = async (
    tipo: string,
    numero: string,
  ) => {
    const response = await fetch(
      `/api/eventos/${slug_evento}/verificar-documento`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo_documento: tipo,
          numero_documento: numero,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Error en la verificación del documento");
    }

    return await response.json();
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

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl text-white font-bold mb-4">
                Pre-inscripción
              </h1>
            </div>

            <div className="bg-white dark:bg-zinc-800 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 p-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
                Verificar Documento
              </h2>
              <p className="text-sm text-zinc-600 mb-6">
                Ingrese su tipo y número de documento para verificar si ya está
                registrado
              </p>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="tipo_documento"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                  >
                    Tipo de Documento *
                  </label>
                  <select
                    id="tipo_documento"
                    value={tipo_documento}
                    onChange={(e) => setTipoDocumento(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={verificando}
                  >
                    {tipos_documento.map((tipo) => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="numero_documento"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                  >
                    Número de Documento *
                  </label>
                  <input
                    type="tel"
                    id="numero_documento"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={numero_documento}
                    onChange={manejar_cambio_numero_documento}
                    placeholder="Ingrese su número de documento"
                    className="w-full px-3 py-2 border-2 border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={verificando}
                  />
                </div>

                <button
                  onClick={manejar_verificacion}
                  disabled={
                    verificando ||
                    !tipo_documento ||
                    numero_documento.length < 6
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed"
                >
                  {verificando ? "Verificando..." : "Verificar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
