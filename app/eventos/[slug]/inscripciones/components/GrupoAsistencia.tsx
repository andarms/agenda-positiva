'use client';

import { DatosFormulario, MiembroFamiliar } from './FormularioInscripcion';
import FormularioFamiliar from './FormularioFamiliar';

interface SeccionFamiliaresProps {
  datos_formulario: DatosFormulario;
  set_datos_formulario: React.Dispatch<React.SetStateAction<DatosFormulario>>;
  handle_input_change: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function GrupoAsistencia({
  datos_formulario,
  set_datos_formulario,
  handle_input_change
}: SeccionFamiliaresProps) {

  // Buscar persona por cédula
  async function buscar_persona_por_cedula(cedula: string): Promise<any | null> {
    try {
      const response = await fetch('/api/personas/buscar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cedula })
      });
      
      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }
      
      const data = await response.json();
      return data.encontrada ? data.persona : null;
    } catch (error) {
      console.error('Error al buscar persona:', error);
      return null;
    }
  }

  // Crear nuevo miembro familiar
  const crear_nuevo_miembro_familiar = (parentesco: string): MiembroFamiliar => ({
    id: Date.now().toString(),
    cedula: "",
    nombres: "",
    apellidos: "",
    tipo_documento: "",
    sexo: "",
    fecha_nacimiento: "",
    celular: "",
    departamento: "cundinamarca",
    municipio: "bogota",
    participa_primer_evento: false,
    esta_sirviendo: false,
    servicios: [],
    parentesco,
    person_id: null,
    esta_buscando: false,
    fue_encontrado: false,
  });

  const agregar_esposa = () => {
    set_datos_formulario(prev => ({
      ...prev,
      esposa: crear_nuevo_miembro_familiar("esposa")
    }));
  };

  const agregar_hijo = () => {
    const nuevo_hijo = crear_nuevo_miembro_familiar("hijo");
    set_datos_formulario(prev => ({
      ...prev,
      hijos: [...prev.hijos, nuevo_hijo]
    }));
  };

  const agregar_otro_familiar = () => {
    const nuevo_familiar = crear_nuevo_miembro_familiar("");
    set_datos_formulario(prev => ({
      ...prev,
      otros_familiares: [...prev.otros_familiares, nuevo_familiar]
    }));
  };

  const remover_hijo = (id: string) => {
    set_datos_formulario(prev => ({
      ...prev,
      hijos: prev.hijos.filter(hijo => hijo.id !== id)
    }));
  };

  const remover_otro_familiar = (id: string) => {
    set_datos_formulario(prev => ({
      ...prev,
      otros_familiares: prev.otros_familiares.filter(familiar => familiar.id !== id)
    }));
  };

  const actualizar_esposa = (updates: Partial<MiembroFamiliar>) => {
    if (datos_formulario.esposa) {
      set_datos_formulario(prev => ({
        ...prev,
        esposa: { ...prev.esposa!, ...updates }
      }));
    }
  };

  const actualizar_hijo = (id: string, updates: Partial<MiembroFamiliar>) => {
    set_datos_formulario(prev => ({
      ...prev,
      hijos: prev.hijos.map(hijo =>
        hijo.id === id ? { ...hijo, ...updates } : hijo
      )
    }));
  };

  const actualizar_otro_familiar = (id: string, updates: Partial<MiembroFamiliar>) => {
    set_datos_formulario(prev => ({
      ...prev,
      otros_familiares: prev.otros_familiares.map(familiar =>
        familiar.id === id ? { ...familiar, ...updates } : familiar
      )
    }));
  };

  const manejar_busqueda_cedula_familiar = async (
    miembro: MiembroFamiliar,
    cedula: string,
    funcion_actualizar: (updates: Partial<MiembroFamiliar>) => void
  ) => {
    // Actualizar cédula inmediatamente
    funcion_actualizar({ 
      cedula, 
      esta_buscando: cedula.length >= 6,
      fue_encontrado: false,
      nombres: "",
      person_id: null
    });

    // Solo buscar si la cédula tiene longitud razonable
    if (cedula.length >= 6) {
      try {
        const persona = await buscar_persona_por_cedula(cedula);
        
        if (persona) {
          funcion_actualizar({
            nombres: persona.nombres,
            apellidos: persona.apellidos,
            tipo_documento: persona.tipo_documento,
            sexo: persona.sexo,
            fecha_nacimiento: persona.fecha_nacimiento,
            celular: persona.celular,
            departamento: persona.departamento,
            municipio: persona.municipio,
            participa_primer_evento: persona.participa_primer_evento,
            esta_sirviendo: persona.esta_sirviendo,
            servicios: persona.servicios,
            person_id: persona.id,
            esta_buscando: false,
            fue_encontrado: true
          });
        } else {
          funcion_actualizar({
            esta_buscando: false,
            fue_encontrado: false,
            person_id: null,
            nombres: "",
            apellidos: "",
            tipo_documento: "",
            sexo: "",
            fecha_nacimiento: "",
            celular: "",
            departamento: "cundinamarca",
            municipio: "bogota",
            participa_primer_evento: false,
            esta_sirviendo: false,
            servicios: []
          });
        }
      } catch (error) {
        funcion_actualizar({
          esta_buscando: false,
          fue_encontrado: false
        });
      }
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
        Información de Acompañantes
      </h3>
      
      {/* Pregunta y Formulario de Esposa */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="viaja_con_esposa"
            name="viaja_con_esposa"
            checked={datos_formulario.viaja_con_esposa}
            onChange={handle_input_change}
            className="h-4 w-4 text-blue-600 bg-zinc-100 border-zinc-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-zinc-800 focus:ring-2 dark:bg-zinc-700 dark:border-zinc-600"
          />
          <label htmlFor="viaja_con_esposa" className="ml-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            ¿Viaja con su esposa?
          </label>
        </div>

        {datos_formulario.viaja_con_esposa && (
          <div className="ml-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-zinc-900 dark:text-zinc-100">
                Información de Esposa
              </h4>
              {!datos_formulario.esposa && (
                <button
                  type="button"
                  onClick={agregar_esposa}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Agregar Esposa
                </button>
              )}
            </div>
            
            {datos_formulario.esposa && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-medium text-zinc-900 dark:text-zinc-100">Esposa</h5>
                  <button
                    type="button"
                    onClick={() => set_datos_formulario(prev => ({ ...prev, esposa: undefined }))}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Eliminar
                  </button>
                </div>

                <FormularioFamiliar
                  miembro={datos_formulario.esposa}
                  onUpdate={actualizar_esposa}
                  onBuscarCedula={(cedula) => manejar_busqueda_cedula_familiar(datos_formulario.esposa!, cedula, actualizar_esposa)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pregunta y Formulario de Hijos */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="viaja_con_hijos"
            name="viaja_con_hijos"
            checked={datos_formulario.viaja_con_hijos}
            onChange={handle_input_change}
            className="h-4 w-4 text-blue-600 bg-zinc-100 border-zinc-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-zinc-800 focus:ring-2 dark:bg-zinc-700 dark:border-zinc-600"
          />
          <label htmlFor="viaja_con_hijos" className="ml-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            ¿Viaja con sus hijos?
          </label>
        </div>

        {datos_formulario.viaja_con_hijos && (
          <div className="ml-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-zinc-900 dark:text-zinc-100">
                Información de Hijos
              </h4>
              <button
                type="button"
                onClick={agregar_hijo}
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
              >
                + Agregar Hijo
              </button>
            </div>
            
            {datos_formulario.hijos.length === 0 ? (
              <div className="text-center py-6 text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
                <p>Ningún hijo agregado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {datos_formulario.hijos.map((hijo, index) => (
                  <div key={hijo.id} className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border-2 border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-medium text-zinc-900 dark:text-zinc-100">Hijo {index + 1}</h5>
                      <button
                        type="button"
                        onClick={() => remover_hijo(hijo.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                    
                    <FormularioFamiliar
                      miembro={hijo}
                      onUpdate={(updates) => actualizar_hijo(hijo.id, updates)}
                      onBuscarCedula={(cedula) => manejar_busqueda_cedula_familiar(hijo, cedula, (updates) => actualizar_hijo(hijo.id, updates))}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pregunta y Formulario de Otros Familiares */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="viaja_con_otro_familiar"
            name="viaja_con_otro_familiar"
            checked={datos_formulario.viaja_con_otro_familiar}
            onChange={handle_input_change}
            className="h-4 w-4 text-blue-600 bg-zinc-100 border-zinc-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-zinc-800 focus:ring-2 dark:bg-zinc-700 dark:border-zinc-600"
          />
          <label htmlFor="viaja_con_otro_familiar" className="ml-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            ¿Viaja con algún otro familiar?
          </label>
        </div>

        {datos_formulario.viaja_con_otro_familiar && (
          <div className="ml-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-zinc-900 dark:text-zinc-100">
                Otros Familiares
              </h4>
              <button
                type="button"
                onClick={agregar_otro_familiar}
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
              >
                + Agregar Familiar
              </button>
            </div>
            
            {datos_formulario.otros_familiares.length === 0 ? (
              <div className="text-center py-6 text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
                <p>Ningún familiar agregado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {datos_formulario.otros_familiares.map((familiar, index) => (
                  <div key={familiar.id} className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-medium text-zinc-900 dark:text-zinc-100">Familiar {index + 1}</h5>
                      <button
                        type="button"
                        onClick={() => remover_otro_familiar(familiar.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                    
                    <FormularioFamiliar
                      miembro={familiar}
                      onUpdate={(updates) => actualizar_otro_familiar(familiar.id, updates)}
                      onBuscarCedula={(cedula) => manejar_busqueda_cedula_familiar(familiar, cedula, (updates) => actualizar_otro_familiar(familiar.id, updates))}
                      mostrarParentesco={true}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comentarios de Hospedaje */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
        <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Necesidades Especiales de Hospedaje
        </h4>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          Si usted o sus acompañantes utilizan silla de ruedas, tienen movilidad reducida, se encuentran en recuperación médica, presentan alguna condición cognitiva, requieren habitación en planta baja o algún apoyo adicional, por favor indíquelo aquí. Esta información nos ayudará a gestionar el hospedaje de la mejor manera posible y, cuando sea necesario, procurar que las personas que requieran apoyo puedan alojarse juntas. Las solicitudes se atenderán según disponibilidad.
        </p>
        <textarea
          name="comentarios_hospedaje"
          id="comentarios_hospedaje"
          value={datos_formulario.comentarios_hospedaje}
          onChange={handle_input_change}
          rows={4}
          className="w-full px-3 py-2 border-2 border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
        />
      </div>
    </div>
  );
}