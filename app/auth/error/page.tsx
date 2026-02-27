"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthErrorContent() {
  const search_params = useSearchParams();
  const error = search_params.get("error");

  const obtener_mensaje_de_error = () => {
    switch (error) {
      case "Configuration":
        return "Error de configuración del servidor de autenticación.";
      case "AccessDenied":
        return "Acceso denegado. No tienes permisos para acceder a esta aplicación.";
      case "Verification":
        return "Error de verificación. El enlace puede haber expirado.";
      case "Default":
      default:
        return "Ha ocurrido un error durante el proceso de autenticación.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Error de Autenticación
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {obtener_mensaje_de_error()}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex flex-col space-y-4">
            <Link
              href="/auth/signin"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Intentar de nuevo
            </Link>

            <Link
              href="/"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Ir al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
