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
  const [esta_verificando, setEstaVerificando] = useState(false);
  const [esta_enviando, setEstaEnviando] = useState(false);
  const [datos_evento, setDatosEvento] = useState<DatosEvento | null>(null);

  // Cargar datos del evento al montar el componente
  useEffect(() => {
    cargar_datos_evento();
  }, [slug_evento]);

  const cargar_datos_evento = async () => {
    try {
      // TODO: Implementar llamada real a la API
      // const respuesta = await fetch(`/api/eventos/${slug_evento}`);
      // const evento = await respuesta.json();
      
      // Por ahora, datos de ejemplo
      setDatosEvento({
        titulo: `Conferencia ${slug_evento.charAt(0).toUpperCase() + slug_evento.slice(1)}`,
        fecha_inicio: "2026-03-15",
        fecha_fin: "2026-03-17",
        slug: slug_evento
      });
    } catch (error) {
      console.error("Error al cargar datos del evento:", error);
      // Fallback data
      setDatosEvento({
        titulo: "Conferencia",
        slug: slug_evento
      });
    }
  };

  const manejar_documento_verificado = (tipo_documento: string, numero_documento: string) => {
    setPasoActual("formulario");
    // Almacenar los datos del documento verificado
    setDatosEvento(prev => ({
      ...prev!,
      datos_documento: { tipo_documento, numero_documento }
    }));
  };

  const manejar_registro_existente = (registro: RegistroPreInscripcion) => {
    setRegistroExistente(registro);
    setPasoActual("ya-registrado");
  };

  const iniciar_nuevo_registro = () => {
    setPasoActual("verificar");
    setRegistroExistente(null);
  };

  const manejar_envio_formulario = async (datos: DatosFormulario) => {
    setEstaEnviando(true);
    
    try {
      // Preparar datos de envío
      const nueva_inscripcion: RegistroPreInscripcion = {
        cedula: datos.numero_documento,
        nombres: datos.nombres,
        apellidos: datos.apellidos,
        tipo_documento: datos.tipo_documento,
        sexo: datos.sexo,
        fecha_nacimiento: datos.fecha_nacimiento,
        celular: datos.celular,
        email: datos.email,
        departamento: datos.departamento,
        municipio: datos.municipio,
        participa_primer_evento: datos.participa_primer_evento,
        requiere_hospedaje: datos.requiere_hospedaje,
        esta_sirviendo: datos.esta_sirviendo,
        servicios: datos.servicios,
        familiares: [
          ...(datos.esposa ? [{
            nombres: datos.esposa.nombres,
            apellidos: datos.esposa.apellidos,
            cedula: datos.esposa.cedula,
            celular: datos.esposa.celular,
            parentesco: datos.esposa.parentesco,
            servicios: datos.esposa.servicios
          }] : []),
          ...datos.hijos.map(hijo => ({
            nombres: hijo.nombres,
            apellidos: hijo.apellidos,
            cedula: hijo.cedula,
            celular: hijo.celular,
            parentesco: hijo.parentesco,
            servicios: hijo.servicios
          })),
          ...datos.otros_familiares.map(familiar => ({
            nombres: familiar.nombres,
            apellidos: familiar.apellidos,
            cedula: familiar.cedula,
            celular: familiar.celular,
            parentesco: familiar.parentesco,
            servicios: familiar.servicios
          }))
        ],
        comentarios_hospedaje: datos.comentarios_hospedaje.trim(),
        fecha_registro: new Date().toISOString().split('T')[0]
      };

      // TODO: Implementar llamada real a la API
      console.log("Guardando inscripción:", nueva_inscripcion);
      // await fetch(`/api/eventos/${slug_evento}/inscripciones`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(nueva_inscripcion)
      // });
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert("¡Pre-inscripción enviada correctamente! Gracias por registrarte.");
      
      // Volver al estado inicial
      iniciar_nuevo_registro();
      
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      alert("Error al enviar la pre-inscripción. Por favor intente nuevamente.");
    } finally {
      setEstaEnviando(false);
    }
  };

  // Renderizar paso actual
  if (paso_actual === "verificar") {
    return (
      <VerificarDocumento
        onDocumentoVerificado={manejar_documento_verificado}
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
    return (
      <FormularioInscripcion
        datos_iniciales={{
          tipo_documento: datos_evento?.datos_documento?.tipo_documento || "",
          numero_documento: datos_evento?.datos_documento?.numero_documento || ""
        }}
        on_volver={iniciar_nuevo_registro}
        on_enviar={manejar_envio_formulario}
        esta_enviando={esta_enviando}
        evento_titulo={datos_evento?.titulo}
      />
    );
  }

  return null;
}