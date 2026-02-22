'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import VerificarDocumento from './components/VerificarDocumento';
import RegistroExistente from './components/RegistroExistente';
import FormularioInscripcion, { DatosFormulario } from './components/FormularioInscripcion';
import { RegistroPreInscripcion, DatosEvento } from './types';

export default function PreInscripcionPage() {
  const params = useParams();
  const slug_evento = params.slug as string;

  // Estados principales
  const [paso_actual, setPasoActual] = useState<"verificar" | "formulario" | "ya-registrado">("verificar");
  const [registro_existente, setRegistroExistente] = useState<RegistroPreInscripcion | null>(null);
  const [datos_persona_existente, setDatosPersonaExistente] = useState<any | null>(null);
  const [esta_verificando, setEstaVerificando] = useState(false);
  const [esta_enviando, setEstaEnviando] = useState(false);
  const [datos_evento, setDatosEvento] = useState<DatosEvento | null>(null);

  // Cargar datos del evento al montar el componente
  useEffect(() => {
    cargar_datos_evento();
  }, [slug_evento]);

  const cargar_datos_evento = async () => {
    try {
      const respuesta = await fetch(`/api/eventos/${slug_evento}`);
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
        throw new Error('Evento no encontrado');
      }
    } catch (error) {
      console.error("Error al cargar datos del evento:", error);
      // Fallback data
      setDatosEvento({
        titulo: `Conferencia ${slug_evento.charAt(0).toUpperCase() + slug_evento.slice(1)}`,
        slug: slug_evento
      });
    }
  };

  const manejar_documento_verificado = (tipo_documento: string, numero_documento: string, datos_persona?: any) => {
    setPasoActual("formulario");
    // Almacenar los datos del documento verificado y datos de persona si existen
    setDatosEvento(prev => ({
      ...prev!,
      datos_documento: { tipo_documento, numero_documento }
    }));
    // Si hay datos de persona existente, almacenarlos para prellenar el formulario
    setDatosPersonaExistente(datos_persona || null);
  };

  const manejar_registro_existente = (respuesta_api: any) => {
    // Convertir la respuesta de la API al formato esperado por el componente
    const registro: RegistroPreInscripcion = {
      cedula: respuesta_api.datos_persona.numero_documento,
      nombres: respuesta_api.datos_persona.nombres,
      apellidos: respuesta_api.datos_persona.apellidos,
      tipo_documento: respuesta_api.datos_persona.tipo_documento,
      sexo: '',
      fecha_nacimiento: '',
      celular: respuesta_api.datos_persona.telefono || '',
      email: respuesta_api.datos_persona.email || '',
      departamento: '',
      municipio: '',
      participa_primer_evento: false,
      requiere_hospedaje: respuesta_api.inscripcion?.requiere_hospedaje || false,
      esta_sirviendo: false,
      servicios: [],
      familiares: [],
      comentarios_hospedaje: '',
      fecha_registro: respuesta_api.inscripcion?.fecha_creacion || new Date().toISOString().split('T')[0]
    };
    
    setRegistroExistente(registro);
    setPasoActual("ya-registrado");
  };

  const iniciar_nuevo_registro = () => {
    setPasoActual("verificar");
    setRegistroExistente(null);
    setDatosPersonaExistente(null);
  };

  const manejar_envio_formulario = async (datos: DatosFormulario) => {
    setEstaEnviando(true);
    
    try {
      const response = await fetch(`/api/eventos/${slug_evento}/inscripciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      if (!response.ok) {
        const error_data = await response.json();
        throw new Error(error_data.error || 'Error al procesar la inscripción');
      }

      const result = await response.json();
      
      alert("¡Pre-inscripción enviada correctamente! Gracias por registrarte.");
      
      // Volver al estado inicial
      iniciar_nuevo_registro();
      
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      const error_message = error instanceof Error ? error.message : 'Por favor intente nuevamente.';
      alert(`Error al enviar la pre-inscripción: ${error_message}`);
    } finally {
      setEstaEnviando(false);
    }
  };

  // Renderizar paso actual
  if (paso_actual === "verificar") {
    return (
      <VerificarDocumento
        onDocumentoVerificado={(tipo_documento, numero_documento, datos_persona) => 
          manejar_documento_verificado(tipo_documento, numero_documento, datos_persona)
        }
        onRegistroExistente={manejar_registro_existente}
        evento_titulo={datos_evento?.titulo}
        evento_fecha={datos_evento?.fecha_inicio}
        esta_verificando={esta_verificando}
      />
    );
  }

  if (paso_actual === "ya-registrado" && registro_existente) {
    return (
      <RegistroExistente
        registro={registro_existente}
        onIniciarNuevoRegistro={iniciar_nuevo_registro}
        evento_titulo={datos_evento?.titulo}
      />
    );
  }

  if (paso_actual === "formulario") {
    // Construir datos iniciales combinando documento verificado y datos de persona existente
    const datos_iniciales_completos = {
      tipo_documento: datos_evento?.datos_documento?.tipo_documento || "",
      numero_documento: datos_evento?.datos_documento?.numero_documento || "",
      // Si hay datos de persona existente, usarlos para prellenar
      ...(datos_persona_existente && {
        nombres: datos_persona_existente.nombres || "",
        apellidos: datos_persona_existente.apellidos || "",
        fecha_nacimiento: datos_persona_existente.fecha_nacimiento || "",
        celular: datos_persona_existente.telefono || "",
        email: datos_persona_existente.email || "",
        // Mapear el tipo de documento del backend al formato del frontend
        tipo_documento: datos_persona_existente.tipo_documento || datos_evento?.datos_documento?.tipo_documento || "",
        numero_documento: datos_persona_existente.numero_documento || datos_evento?.datos_documento?.numero_documento || "",
      })
    };

    return (
      <FormularioInscripcion
        datos_iniciales={datos_iniciales_completos}
        on_volver={iniciar_nuevo_registro}
        on_enviar={manejar_envio_formulario}
        esta_enviando={esta_enviando}
        evento_titulo={datos_evento?.titulo}
        datos_prellenados={!!datos_persona_existente}
      />
    );
  }

  return null;
}