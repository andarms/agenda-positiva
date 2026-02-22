export interface RegistroPreInscripcion {
  cedula: string;
  nombres: string;
  apellidos: string;
  tipo_documento: string;
  sexo: string;
  fecha_nacimiento: string;
  celular: string;
  email: string;
  departamento: string;
  municipio: string;
  participa_primer_evento: boolean;
  requiere_hospedaje: boolean;
  esta_sirviendo: boolean;
  servicios: string[];
  familiares?: FamiliarRegistrado[];
  comentarios_hospedaje?: string;
  fecha_registro: string;
}

export interface FamiliarRegistrado {
  nombres: string;
  apellidos: string;
  cedula: string;
  celular: string;
  parentesco: string;
  servicios?: string[];
}

export interface DatosEvento {
  titulo: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  descripcion?: string;
  slug: string;
  datos_documento?: {
    tipo_documento: string;
    numero_documento: string;
  };
}