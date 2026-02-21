"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { crear_evento_action } from "./actions";

export default function NuevoEvento() {
  const router = useRouter();
  const [esta_guardando, set_esta_guardando] = useState(false);
  const [errores, set_errores] = useState<Record<string, string>>({});

  const manejar_envio = async (form_data: FormData) => {
    set_esta_guardando(true);
    set_errores({});
    
    try {
      const resultado = await crear_evento_action(form_data);
      
      if (resultado.success) {
        router.push('/admin/eventos');
        router.refresh();
      } else {
        set_errores(resultado.errors || {});
      }
    } catch (error) {
      console.error('Error al crear evento:', error);
      set_errores({ general: 'Hubo un error inesperado al crear el evento' });
    } finally {
      set_esta_guardando(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link 
            href="/admin/eventos"
            className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          >
            <span>←</span>
            Volver a Eventos
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Crear Nuevo Evento
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          Completa la información del evento de conferencia
        </p>
      </div>

      {errores.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {errores.general}
        </div>
      )}

      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm">
        <form action={manejar_envio} className="p-6 space-y-6">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Nombre del Evento *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-100 ${
                errores.nombre ? 'border-red-300' : 'border-zinc-300'
              }`}
              placeholder="Ej: Conferencia Anual 2026"
            />
            {errores.nombre && (
              <p className="mt-1 text-sm text-red-600">{errores.nombre}</p>
            )}
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-100 resize-vertical ${
                errores.descripcion ? 'border-red-300' : 'border-zinc-300'
              }`}
              placeholder="Describe el evento, agenda, temas principales, etc."
            />
            {errores.descripcion && (
              <p className="mt-1 text-sm text-red-600">{errores.descripcion}</p>
            )}
          </div>

          <div>
            <label htmlFor="ubicacion" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Ubicación *
            </label>
            <input
              type="text"
              id="ubicacion"
              name="ubicacion"
              required
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-100 ${
                errores.ubicacion ? 'border-red-300' : 'border-zinc-300'
              }`}
              placeholder="Ej: Centro de Convenciones, Ciudad"
            />
            {errores.ubicacion && (
              <p className="mt-1 text-sm text-red-600">{errores.ubicacion}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fecha_inicio" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Fecha de Inicio *
              </label>
              <input
                type="date"
                id="fecha_inicio"
                name="fecha_inicio"
                required
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-100 ${
                  errores.fecha_inicio ? 'border-red-300' : 'border-zinc-300'
                }`}
              />
              {errores.fecha_inicio && (
                <p className="mt-1 text-sm text-red-600">{errores.fecha_inicio}</p>
              )}
            </div>

            <div>
              <label htmlFor="fecha_fin" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Fecha de Fin *
              </label>
              <input
                type="date"
                id="fecha_fin"
                name="fecha_fin"
                required
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-100 ${
                  errores.fecha_fin ? 'border-red-300' : 'border-zinc-300'
                }`}
              />
              {errores.fecha_fin && (
                <p className="mt-1 text-sm text-red-600">{errores.fecha_fin}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-700">
            <Link
              href="/admin/eventos"
              className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-600 font-medium transition-colors"
            >
              Cancelar
            </Link>
            
            <button
              type="submit"
              disabled={esta_guardando}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {esta_guardando ? (
                <>Guardando...</>
              ) : (
                <>
                  <span>💾</span>
                  Crear Evento
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}