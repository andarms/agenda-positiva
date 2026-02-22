'use client';

import { useState } from 'react';

interface VerificarDocumentoProps {
  onDocumentoVerificado: (tipo_documento: string, numero_documento: string) => void;
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
  esta_verificando
}: VerificarDocumentoProps) {
  const [tipo_documento, setTipoDocumento] = useState("");
  const [numero_documento, setNumeroDocumento] = useState("");

  const manejar_verificacion = async () => {
    if (!tipo_documento || numero_documento.length < 6) {
      alert("Por favor seleccione el tipo de documento e ingrese un número válido");
      return;
    }

    try {
      // TODO: Reemplazar con llamada real a la API
      const registro_existente = await verificar_documento_en_base_datos(tipo_documento, numero_documento);
      
      if (registro_existente) {
        onRegistroExistente(registro_existente);
      } else {
        onDocumentoVerificado(tipo_documento, numero_documento);
      }
    } catch (error) {
      alert("Error al verificar el documento. Intente nuevamente.");
    }
  };

  // Función placeholder para verificación de documento
  const verificar_documento_en_base_datos = async (tipo: string, numero: string): Promise<any | null> => {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // TODO: Implementar llamada real a la API
    // return await fetch(`/api/inscripciones/verificar`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ tipo_documento: tipo, numero_documento: numero })
    // }).then(res => res.json());
    
    return null; // Por ahora no hay registros existentes
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Pre-inscripción
            </h1>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
              <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Evento: {evento_titulo}
              </h2>
              {evento_fecha && (
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Fecha: {evento_fecha}
                </p>
              )}
            </div>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Registro para el evento de Conferencias
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 p-8">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
              Verificar Documento
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
              Ingrese su tipo y número de documento para verificar si ya está registrado
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="tipo_documento" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Tipo de Documento *
                </label>
                <select
                  id="tipo_documento"
                  value={tipo_documento}
                  onChange={(e) => setTipoDocumento(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={esta_verificando}
                >
                  {tipos_documento.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="numero_documento" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Número de Documento *
                </label>
                <input
                  type="text"
                  id="numero_documento"
                  value={numero_documento}
                  onChange={(e) => setNumeroDocumento(e.target.value)}
                  placeholder="Ingrese su número de documento"
                  className="w-full px-3 py-2 border-2 border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={esta_verificando}
                />
              </div>
              
              <button
                onClick={manejar_verificacion}
                disabled={esta_verificando || !tipo_documento || numero_documento.length < 6}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed"
              >
                {esta_verificando ? "Verificando..." : "Verificar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}