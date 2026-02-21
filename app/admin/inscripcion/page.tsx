"use client";

import { useState } from "react";

interface PreRegistration {
  cedula: string;
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  sexo: string;
  fechaNacimiento: string;
  celular: string;
  email: string;
  departamento: string;
  municipio: string;
  participaPrimerEvento: boolean;
  requiereHospedaje: boolean;
  estaSirviendo: boolean;
  servicios: string[];
  familyMembers: FamilyMember[];
  comentariosHospedaje: string;
  fechaRegistro: string;
}

interface FormData {
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  sexo: string;
  fechaNacimiento: string;
  celular: string;
  email: string;
  departamento: string;
  municipio: string;
  participaPrimerEvento: boolean;
  requiereHospedaje: boolean;
  estaSirviendo: boolean;
  servicios: string[];
  // Family travel questions
  viajaConEsposa: boolean;
  viajaConHijos: boolean;
  viajaConOtroFamiliar: boolean;
  // Family members
  esposa?: FamilyMember;
  hijos: FamilyMember[];
  otrosFamiliares: FamilyMember[];
  comentariosHospedaje: string;
}

interface FamilyMember {
  id: string;
  cedula: string;
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  sexo: string;
  fechaNacimiento: string;
  celular: string;
  departamento: string;
  municipio: string;
  participaPrimerEvento: boolean;
  estaSirviendo: boolean;
  servicios: string[];
  parentesco: string;
  personId?: number | null;
  isSearching: boolean;
  isFound: boolean;
}

interface PersonSearchResult {
  id: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  sexo: string;
  fechaNacimiento: string;
  celular: string;
  departamento: string;
  municipio: string;
  participaPrimerEvento: boolean;
  estaSirviendo: boolean;
  servicios: string[];
}

// Mock JSON Database
const mockDatabase: PreRegistration[] = [
  {
    cedula: "12345678",
    nombres: "Juan Carlos",
    apellidos: "García López",
    tipoDocumento: "cedula",
    sexo: "masculino",
    fechaNacimiento: "1990-05-15",
    celular: "3001234567",
    email: "juan.garcia@email.com",
    departamento: "antioquia",
    municipio: "medellin",
    participaPrimerEvento: true,
    requiereHospedaje: true,
    estaSirviendo: true,
    servicios: ["musica", "jovenes"],
    familyMembers: [],
    comentariosHospedaje: "Necesito habitación cerca del auditorio",
    fechaRegistro: "2026-02-20"
  },
  {
    cedula: "87654321",
    nombres: "María Elena",
    apellidos: "Rodríguez Silva",
    tipoDocumento: "cedula",
    sexo: "femenino",
    fechaNacimiento: "1985-03-22",
    celular: "3007654321",
    email: "maria.rodriguez@email.com",
    departamento: "cundinamarca",
    municipio: "bogota",
    participaPrimerEvento: false,
    requiereHospedaje: true,
    estaSirviendo: true,
    servicios: ["ninos", "enfermeria"],
    familyMembers: [
      {
        id: "fam1",
        cedula: "11223344",
        nombres: "Pedro Antonio",
        apellidos: "Martínez Pérez",
        tipoDocumento: "cedula",
        sexo: "masculino",
        fechaNacimiento: "2010-12-10",
        celular: "3001122334",
        departamento: "cundinamarca",
        municipio: "bogota",
        participaPrimerEvento: true,
        estaSirviendo: false,
        servicios: [],
        parentesco: "hijo",
        personId: 3,
        isSearching: false,
        isFound: true
      }
    ],
    comentariosHospedaje: "Preferimos habitación familiar con dos camas",
    fechaRegistro: "2026-02-18"
  },
  {
    cedula: "55667788",
    nombres: "Ana Sofía",
    apellidos: "López González",
    tipoDocumento: "cedula",
    sexo: "femenino",
    fechaNacimiento: "1992-08-18",
    celular: "3005566778",
    email: "ana.lopez@email.com",
    departamento: "atlantico",
    municipio: "barranquilla",
    participaPrimerEvento: false,
    requiereHospedaje: false,
    estaSirviendo: true,
    servicios: ["jovenes", "musica"],
    familyMembers: [],
    comentariosHospedaje: "",
    fechaRegistro: "2026-02-19"
  },
  {
    cedula: "99887766",
    nombres: "Carlos Alberto",
    apellidos: "Hernández Castro",
    tipoDocumento: "cedula",
    sexo: "masculino",
    fechaNacimiento: "1988-11-05",
    celular: "3009988776",
    email: "carlos.hernandez@email.com",
    departamento: "valle",
    municipio: "cali",
    participaPrimerEvento: true,
    requiereHospedaje: true,
    estaSirviendo: true,
    servicios: ["seguridad", "logistica"],
    familyMembers: [
      {
        id: "fam2",
        cedula: "44556677",
        nombres: "Patricia",
        apellidos: "Morales Vega",
        tipoDocumento: "cedula",
        sexo: "femenino",
        fechaNacimiento: "1990-07-15",
        celular: "3004455667",
        departamento: "valle",
        municipio: "cali",
        participaPrimerEvento: false,
        estaSirviendo: true,
        servicios: ["ninos"],
        parentesco: "esposa",
        personId: 5,
        isSearching: false,
        isFound: true
      },
      {
        id: "fam3",
        cedula: "33445566",
        nombres: "Sebastián",
        apellidos: "Hernández Morales",
        tipoDocumento: "registro_civil",
        sexo: "masculino",
        fechaNacimiento: "2015-04-20",
        celular: "3003344556",
        departamento: "valle",
        municipio: "cali",
        participaPrimerEvento: true,
        estaSirviendo: false,
        servicios: [],
        parentesco: "hijo",
        personId: null,
        isSearching: false,
        isFound: false
      }
    ],
    comentariosHospedaje: "Viajamos en familia, necesitamos habitación amplia",
    fechaRegistro: "2026-02-17"
  },
  {
    cedula: "22334455",
    nombres: "Luis Fernando",
    apellidos: "Gómez Ruiz",
    tipoDocumento: "cedula",
    sexo: "masculino",
    fechaNacimiento: "1995-01-30",
    celular: "3002233445",
    email: "luis.gomez@email.com",
    departamento: "bogota",
    municipio: "bogota",
    participaPrimerEvento: true,
    requiereHospedaje: false,
    estaSirviendo: true,
    servicios: ["audiovisuales", "protocolo"],
    familyMembers: [],
    comentariosHospedaje: "",
    fechaRegistro: "2026-02-21"
  },
  {
    cedula: "66778899",
    nombres: "Gloria Patricia",
    apellidos: "Vargas Medina",
    tipoDocumento: "cedula",
    sexo: "femenino",
    fechaNacimiento: "1982-09-12",
    celular: "3006677889",
    email: "gloria.vargas@email.com",
    departamento: "cundinamarca",
    municipio: "bogota",
    participaPrimerEvento: false,
    requiereHospedaje: true,
    estaSirviendo: false,
    servicios: [],
    familyMembers: [
      {
        id: "fam4",
        cedula: "77889900",
        nombres: "Roberto",
        apellidos: "Vargas Medina",
        tipoDocumento: "cedula",
        sexo: "masculino",
        fechaNacimiento: "1945-06-08",
        celular: "3007788990",
        departamento: "cundinamarca",
        municipio: "bogota",
        participaPrimerEvento: false,
        estaSirviendo: false,
        servicios: [],
        parentesco: "padre",
        personId: null,
        isSearching: false,
        isFound: false
      }
    ],
    comentariosHospedaje: "Viajo con mi padre mayor, necesitamos habitación en planta baja",
    fechaRegistro: "2026-02-16"
  }
];

const tiposDocumento = [
  { value: "", label: "Seleccionar tipo de documento" },
  { value: "cedula", label: "Cédula de Ciudadanía" },
  { value: "registro_civil", label: "Registro Civil" },
  { value: "pasaporte", label: "Pasaporte" },
  { value: "cedula_extranjeria", label: "Cédula de Extranjería" },
  { value: "ppt_tarjeta_identidad", label: "PPT Tarjeta de Identidad" },
];

const sexoOptions = [
  { value: "", label: "Seleccionar sexo" },
  { value: "masculino", label: "Masculino" },
  { value: "femenino", label: "Femenino" },
];

// Placeholder lists - user will provide complete lists later
const departamentos = [
  { value: "", label: "Seleccionar departamento" },
  { value: "bogota", label: "Bogotá D.C." },
  { value: "antioquia", label: "Antioquia" },
  { value: "valle", label: "Valle del Cauca" },
  { value: "cundinamarca", label: "Cundinamarca" },
  { value: "atlantico", label: "Atlántico" },
  // More departments will be added when provided
];

const municipios = [
  { value: "", label: "Seleccionar municipio" },
  { value: "bogota", label: "Bogotá" },
  { value: "medellin", label: "Medellín" },
  { value: "cali", label: "Cali" },
  { value: "barranquilla", label: "Barranquilla" },
  { value: "cartagena", label: "Cartagena" },
  // More municipalities will be added when provided
];

const serviciosDisponibles = [
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

const parentescoOptions = [
  { value: "", label: "Seleccionar parentesco" },
  { value: "esposo", label: "Esposo" },
  { value: "esposa", label: "Esposa" },
  { value: "hijo", label: "Hijo" },
  { value: "hija", label: "Hija" },
  { value: "padre", label: "Padre" },
  { value: "madre", label: "Madre" },
  { value: "hermano", label: "Hermano" },
  { value: "hermana", label: "Hermana" },
  { value: "abuelo", label: "Abuelo" },
  { value: "abuela", label: "Abuela" },
  { value: "tio", label: "Tío" },
  { value: "tia", label: "Tía" },
  { value: "primo", label: "Primo" },
  { value: "prima", label: "Prima" },
  { value: "sobrino", label: "Sobrino" },
  { value: "sobrina", label: "Sobrina" },
  { value: "otro", label: "Otro" },
];

export default function PreInscripcionPage() {
  const [currentStep, setCurrentStep] = useState<"check" | "form" | "already-registered">("check");
  const [checkCedula, setCheckCedula] = useState("");
  const [existingRegistration, setExistingRegistration] = useState<PreRegistration | null>(null);
  const [isCheckingCedula, setIsCheckingCedula] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    nombres: "",
    apellidos: "",
    tipoDocumento: "",
    numeroDocumento: "",
    sexo: "",
    fechaNacimiento: "",
    celular: "",
    email: "",
    departamento: "cundinamarca", // Default value
    municipio: "bogota", // Default value
    participaPrimerEvento: false,
    requiereHospedaje: false,
    estaSirviendo: false,
    servicios: [],
    viajaConEsposa: false,
    viajaConHijos: false,
    viajaConOtroFamiliar: false,
    hijos: [],
    otrosFamiliares: [],
    comentariosHospedaje: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock person database for search functionality
  const mockPersonsDatabase: PersonSearchResult[] = [
    { 
      id: 1, 
      cedula: "12345678", 
      nombres: "Juan Carlos", 
      apellidos: "García López",
      tipoDocumento: "cedula",
      sexo: "masculino",
      fechaNacimiento: "1990-05-15",
      celular: "3001234567",
      departamento: "antioquia",
      municipio: "medellin",
      participaPrimerEvento: true,
      estaSirviendo: true,
      servicios: ["musica"]
    },
    { 
      id: 2, 
      cedula: "87654321", 
      nombres: "María Elena", 
      apellidos: "Rodríguez Silva",
      tipoDocumento: "cedula",
      sexo: "femenino",
      fechaNacimiento: "1985-03-22",
      celular: "3007654321",
      departamento: "cundinamarca",
      municipio: "bogota",
      participaPrimerEvento: false,
      estaSirviendo: false,
      servicios: ["ninos"]
    },
    { 
      id: 3, 
      cedula: "11223344", 
      nombres: "Pedro Antonio", 
      apellidos: "Martínez Pérez",
      tipoDocumento: "cedula",
      sexo: "masculino",
      fechaNacimiento: "2010-12-10",
      celular: "3001122334",
      departamento: "valle",
      municipio: "cali",
      participaPrimerEvento: true,
      estaSirviendo: false,
      servicios: []
    },
    { 
      id: 4, 
      cedula: "55667788", 
      nombres: "Ana Sofía", 
      apellidos: "López González",
      tipoDocumento: "cedula",
      sexo: "femenino",
      fechaNacimiento: "1992-08-18",
      celular: "3005566778",
      departamento: "atlantico",
      municipio: "barranquilla",
      participaPrimerEvento: false,
      estaSirviendo: true,
      servicios: ["jovenes", "musica"]
    },
    { 
      id: 5, 
      cedula: "44556677", 
      nombres: "Patricia", 
      apellidos: "Morales Vega",
      tipoDocumento: "cedula",
      sexo: "femenino",
      fechaNacimiento: "1990-07-15",
      celular: "3004455667",
      departamento: "valle",
      municipio: "cali",
      participaPrimerEvento: false,
      estaSirviendo: true,
      servicios: ["ninos"]
    },
    { 
      id: 6, 
      cedula: "99887766", 
      nombres: "Carlos Alberto", 
      apellidos: "Hernández Castro",
      tipoDocumento: "cedula",
      sexo: "masculino",
      fechaNacimiento: "1988-11-05",
      celular: "3009988776",
      departamento: "valle",
      municipio: "cali",
      participaPrimerEvento: true,
      estaSirviendo: true,
      servicios: ["seguridad", "logistica"]
    },
    { 
      id: 7, 
      cedula: "22334455", 
      nombres: "Luis Fernando", 
      apellidos: "Gómez Ruiz",
      tipoDocumento: "cedula",
      sexo: "masculino",
      fechaNacimiento: "1995-01-30",
      celular: "3002233445",
      departamento: "bogota",
      municipio: "bogota",
      participaPrimerEvento: true,
      estaSirviendo: true,
      servicios: ["audiovisuales", "protocolo"]
    },
    { 
      id: 8, 
      cedula: "66778899", 
      nombres: "Gloria Patricia", 
      apellidos: "Vargas Medina",
      tipoDocumento: "cedula",
      sexo: "femenino",
      fechaNacimiento: "1982-09-12",
      celular: "3006677889",
      departamento: "cundinamarca",
      municipio: "bogota",
      participaPrimerEvento: false,
      estaSirviendo: false,
      servicios: []
    },
    { 
      id: 9, 
      cedula: "13579246", 
      nombres: "Miguel Angel", 
      apellidos: "Torres Ramírez",
      tipoDocumento: "cedula",
      sexo: "masculino",
      fechaNacimiento: "1987-04-25",
      celular: "3001357924",
      departamento: "antioquia",
      municipio: "medellin",
      participaPrimerEvento: true,
      estaSirviendo: true,
      servicios: ["musica", "jovenes"]
    },
    { 
      id: 10, 
      cedula: "97531864", 
      nombres: "Carmen Rosa", 
      apellidos: "Jiménez Sánchez",
      tipoDocumento: "cedula",
      sexo: "femenino",
      fechaNacimiento: "1975-12-03",
      celular: "3009753186",
      departamento: "atlantico",
      municipio: "barranquilla",
      participaPrimerEvento: false,
      estaSirviendo: true,
      servicios: ["enfermeria", "limpieza"]
    },
    { 
      id: 11, 
      cedula: "24681357", 
      nombres: "Andrés Felipe", 
      apellidos: "Muñoz Díaz",
      tipoDocumento: "cedula",
      sexo: "masculino",
      fechaNacimiento: "2005-08-14",
      celular: "3002468135",
      departamento: "cundinamarca",
      municipio: "bogota",
      participaPrimerEvento: true,
      estaSirviendo: false,
      servicios: []
    },
    { 
      id: 12, 
      cedula: "86420975", 
      nombres: "Isabella", 
      apellidos: "Cruz Peña",
      tipoDocumento: "cedula",
      sexo: "femenino",
      fechaNacimiento: "1993-10-07",
      celular: "3008642097",
      departamento: "valle",
      municipio: "cali",
      participaPrimerEvento: false,
      estaSirviendo: true,
      servicios: ["cocina", "protocolo"]
    }
  ];

  // Check if cedula already exists in database
  const checkCedulaInDatabase = async (cedula: string): Promise<PreRegistration | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockDatabase.find(registration => registration.cedula === cedula) || null;
  };

  // Mock function to search for person by cedula
  const searchPersonByCedula = async (cedula: string): Promise<PersonSearchResult | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockPersonsDatabase.find(person => person.cedula === cedula) || null;
  };

  const handleCedulaCheck = async () => {
    if (checkCedula.length < 6) {
      alert("Por favor ingrese un número de cédula válido");
      return;
    }

    setIsCheckingCedula(true);
    try {
      const existing = await checkCedulaInDatabase(checkCedula);
      if (existing) {
        setExistingRegistration(existing);
        setCurrentStep("already-registered");
      } else {
        setFormData(prev => ({ ...prev, numeroDocumento: checkCedula }));
        setCurrentStep("form");
      }
    } catch (error) {
      alert("Error al verificar la cédula. Intente nuevamente.");
    } finally {
      setIsCheckingCedula(false);
    }
  };

  const startNewRegistration = () => {
    setCurrentStep("check");
    setCheckCedula("");
    setExistingRegistration(null);
    setFormData({
      nombres: "",
      apellidos: "",
      tipoDocumento: "",
      numeroDocumento: "",
      sexo: "",
      fechaNacimiento: "",
      celular: "",
      email: "",
      departamento: "cundinamarca",
      municipio: "bogota",
      participaPrimerEvento: false,
      requiereHospedaje: false,
      estaSirviendo: false,
      servicios: [],
      viajaConEsposa: false,
      viajaConHijos: false,
      viajaConOtroFamiliar: false,
      hijos: [],
      otrosFamiliares: [],
      comentariosHospedaje: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        // Clear family members and accommodation comments if hospedaje is unchecked
        ...(name === "requiereHospedaje" && !checked ? { 
          viajaConEsposa: false, 
          viajaConHijos: false, 
          viajaConOtroFamiliar: false,
          esposa: undefined,
          hijos: [], 
          otrosFamiliares: [],
          comentariosHospedaje: "" 
        } : {}),
        // Clear specific family members when unchecked
        ...(name === "viajaConEsposa" && !checked ? { esposa: undefined } : {}),
        ...(name === "viajaConHijos" && !checked ? { hijos: [] } : {}),
        ...(name === "viajaConOtroFamiliar" && !checked ? { otrosFamiliares: [] } : {})
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleServiciosChange = (servicio: string) => {
    setFormData(prev => ({
      ...prev,
      servicios: prev.servicios.includes(servicio)
        ? prev.servicios.filter(s => s !== servicio)
        : [...prev.servicios, servicio]
    }));
  };

  // Family member helper functions
  const createNewFamilyMember = (parentesco: string): FamilyMember => ({
    id: Date.now().toString(),
    cedula: "",
    nombres: "",
    apellidos: "",
    tipoDocumento: "",
    sexo: "",
    fechaNacimiento: "",
    celular: "",
    departamento: "cundinamarca",
    municipio: "bogota",
    participaPrimerEvento: false,
    estaSirviendo: false,
    servicios: [],
    parentesco,
    personId: null,
    isSearching: false,
    isFound: false,
  });

  const addEsposa = () => {
    setFormData(prev => ({
      ...prev,
      esposa: createNewFamilyMember("esposa")
    }));
  };

  const addHijo = () => {
    const newHijo = createNewFamilyMember("hijo");
    setFormData(prev => ({
      ...prev,
      hijos: [...prev.hijos, newHijo]
    }));
  };

  const addOtroFamiliar = () => {
    const newFamiliar = createNewFamilyMember("");
    setFormData(prev => ({
      ...prev,
      otrosFamiliares: [...prev.otrosFamiliares, newFamiliar]
    }));
  };

  const removeHijo = (id: string) => {
    setFormData(prev => ({
      ...prev,
      hijos: prev.hijos.filter(hijo => hijo.id !== id)
    }));
  };

  const removeOtroFamiliar = (id: string) => {
    setFormData(prev => ({
      ...prev,
      otrosFamiliares: prev.otrosFamiliares.filter(familiar => familiar.id !== id)
    }));
  };

  const updateEsposa = (updates: Partial<FamilyMember>) => {
    if (formData.esposa) {
      setFormData(prev => ({
        ...prev,
        esposa: { ...prev.esposa!, ...updates }
      }));
    }
  };

  const updateHijo = (id: string, updates: Partial<FamilyMember>) => {
    setFormData(prev => ({
      ...prev,
      hijos: prev.hijos.map(hijo =>
        hijo.id === id ? { ...hijo, ...updates } : hijo
      )
    }));
  };

  const updateOtroFamiliar = (id: string, updates: Partial<FamilyMember>) => {
    setFormData(prev => ({
      ...prev,
      otrosFamiliares: prev.otrosFamiliares.map(familiar =>
        familiar.id === id ? { ...familiar, ...updates } : familiar
      )
    }));
  };

  const handleFamilyMemberCedulaSearch = async (member: FamilyMember, cedula: string, updateFunction: (updates: Partial<FamilyMember>) => void) => {
    // Update cedula immediately
    updateFunction({ 
      cedula, 
      isSearching: cedula.length >= 6,
      isFound: false,
      nombres: "",
      personId: null
    });

    // Only search if cedula has reasonable length
    if (cedula.length >= 6) {
      try {
        const person = await searchPersonByCedula(cedula);
        
        if (person) {
          updateFunction({
            nombres: person.nombres,
            apellidos: person.apellidos,
            tipoDocumento: person.tipoDocumento,
            sexo: person.sexo,
            fechaNacimiento: person.fechaNacimiento,
            celular: person.celular,
            departamento: person.departamento,
            municipio: person.municipio,
            participaPrimerEvento: person.participaPrimerEvento,
            estaSirviendo: person.estaSirviendo,
            servicios: person.servicios,
            personId: person.id,
            isSearching: false,
            isFound: true
          });
        } else {
          updateFunction({
            isSearching: false,
            isFound: false,
            personId: null,
            nombres: "",
            apellidos: "",
            tipoDocumento: "",
            sexo: "",
            fechaNacimiento: "",
            celular: "",
            departamento: "cundinamarca",
            municipio: "bogota",
            participaPrimerEvento: false,
            estaSirviendo: false,
            servicios: []
          });
        }
      } catch (error) {
        updateFunction({
          isSearching: false,
          isFound: false
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare submission data
      const newRegistration: PreRegistration = {
        cedula: formData.numeroDocumento,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        tipoDocumento: formData.tipoDocumento,
        sexo: formData.sexo,
        fechaNacimiento: formData.fechaNacimiento,
        celular: formData.celular,
        email: formData.email,
        departamento: formData.departamento,
        municipio: formData.municipio,
        participaPrimerEvento: formData.participaPrimerEvento,
        requiereHospedaje: formData.requiereHospedaje,
        estaSirviendo: formData.estaSirviendo,
        servicios: formData.servicios,
        familyMembers: [
          ...(formData.esposa ? [formData.esposa] : []),
          ...formData.hijos,
          ...formData.otrosFamiliares
        ],
        comentariosHospedaje: formData.comentariosHospedaje.trim(),
        fechaRegistro: new Date().toISOString().split('T')[0]
      };

      // Simulate API call to save
      console.log("Saving registration:", newRegistration);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add to mock database
      mockDatabase.push(newRegistration);
      
      alert("¡Pre-inscripción enviada correctamente! Gracias por registrarte.");
      
      // Reset to initial state
      startNewRegistration();
      
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error al enviar la pre-inscripción. Por favor intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render cedula check step
  if (currentStep === "check") {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                Pre-inscripción
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                Registro para el evento de Conferencias
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
                Verificar Documento
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Ingrese su número de cédula para verificar si ya está registrado
              </p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="checkCedula" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Número de Cédula
                  </label>
                  <input
                    type="text"
                    id="checkCedula"
                    value={checkCedula}
                    onChange={(e) => setCheckCedula(e.target.value)}
                    placeholder="Ingrese su número de cédula"
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isCheckingCedula}
                  />
                </div>
                
                <button
                  onClick={handleCedulaCheck}
                  disabled={isCheckingCedula || checkCedula.length < 6}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed"
                >
                  {isCheckingCedula ? "Verificando..." : "Verificar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render already registered message
  if (currentStep === "already-registered" && existingRegistration) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  Ya tienes una pre-inscripción registrada
                </h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                  Hola {existingRegistration.nombres} {existingRegistration.apellidos}
                </p>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-700/50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  Información de tu registro:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">Fecha de registro:</span>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">{existingRegistration.fechaRegistro}</p>
                  </div>
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">Celular:</span>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">{existingRegistration.celular}</p>
                  </div>
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">Email:</span>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">{existingRegistration.email}</p>
                  </div>
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">Requiere hospedaje:</span>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      {existingRegistration.requiereHospedaje ? "Sí" : "No"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-zinc-600 dark:text-zinc-400">Servicios:</span>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      {existingRegistration.servicios.length > 0 
                        ? existingRegistration.servicios.map(s => 
                            serviciosDisponibles.find(sd => sd.value === s)?.label
                          ).join(", ")
                        : "Ninguno"
                      }
                    </p>
                  </div>
                </div>

                {/* Family Members Section */}
                {existingRegistration.familyMembers && existingRegistration.familyMembers.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-zinc-300 dark:border-zinc-600">
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                      Familiares Registrados:
                    </h4>
                    <div className="space-y-3">
                      {existingRegistration.familyMembers.map((member, index) => (
                        <div key={index} className="bg-white dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-600">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-zinc-900 dark:text-zinc-100">
                              {member.nombres} {member.apellidos}
                            </h5>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-700 px-2 py-1 rounded">
                              {parentescoOptions.find(p => p.value === member.parentesco)?.label || member.parentesco}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                            <div>
                              <span className="text-zinc-500 dark:text-zinc-500">Cédula:</span> {member.cedula}
                            </div>
                            <div>
                              <span className="text-zinc-500 dark:text-zinc-500">Celular:</span> {member.celular}
                            </div>
                          </div>
                          {member.servicios && member.servicios.length > 0 && (
                            <div className="mt-2">
                              <span className="text-xs text-zinc-500 dark:text-zinc-500">Servicios: </span>
                              <span className="text-xs text-zinc-600 dark:text-zinc-400">
                                {member.servicios.map(s => 
                                  serviciosDisponibles.find(sd => sd.value === s)?.label
                                ).join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Accommodation Comments */}
                {existingRegistration.requiereHospedaje && existingRegistration.comentariosHospedaje && (
                  <div className="mt-6 pt-6 border-t border-zinc-300 dark:border-zinc-600">
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                      Comentarios de Hospedaje:
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-800">
                      {existingRegistration.comentariosHospedaje}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={startNewRegistration}
                  className="flex-1 bg-zinc-600 hover:bg-zinc-700 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
                >
                  Registrar otra persona
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render registration form
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={startNewRegistration}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
          >
            ← Verificar otra cédula
          </button>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Pre-inscripción
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Completa este formulario para registrarte previamente al evento
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2">
            Cédula: {formData.numeroDocumento}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
                Información Personal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nombres" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Nombres *
                  </label>
                  <input
                    type="text"
                    id="nombres"
                    name="nombres"
                    required
                    value={formData.nombres}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="apellidos" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    required
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Document Information */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="tipoDocumento" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Tipo de Documento *
                  </label>
                  <select
                    id="tipoDocumento"
                    name="tipoDocumento"
                    required
                    value={formData.tipoDocumento}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {tiposDocumento.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="numeroDocumento" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Número de Documento *
                  </label>
                  <input
                    type="text"
                    id="numeroDocumento"
                    name="numeroDocumento"
                    required
                    value={formData.numeroDocumento}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="sexo" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Genero
                  </label>
                  <select
                    id="sexo"
                    name="sexo"
                    required
                    value={formData.sexo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {sexoOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Location and Contact */}
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
                Ubicación y Contacto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label htmlFor="departamento" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Departamento *
                  </label>
                  <select
                    id="departamento"
                    name="departamento"
                    required
                    value={formData.departamento}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {departamentos.map(dept => (
                      <option key={dept.value} value={dept.value}>{dept.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="municipio" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Municipio *
                  </label>
                  <select
                    id="municipio"
                    name="municipio"
                    required
                    value={formData.municipio}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {municipios.map(mun => (
                      <option key={mun.value} value={mun.value}>{mun.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="date"
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    required
                    value={formData.fechaNacimiento}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="celular" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Celular *
                  </label>
                  <input
                    type="tel"
                    id="celular"
                    name="celular"
                    required
                    value={formData.celular}
                    onChange={handleInputChange}
                    placeholder="3001234567"
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Correo Electronico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@domain.com"
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>


            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Información de Hospedaje</h3>
            <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requiereHospedaje"
                    name="requiereHospedaje"
                    checked={formData.requiereHospedaje}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 bg-zinc-100 border-zinc-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-zinc-800 focus:ring-2 dark:bg-zinc-700 dark:border-zinc-600"
                  />
                  <label htmlFor="requiereHospedaje" className="ml-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Requiere hospedaje
                  </label>
                </div>
            {/* Family Travel Questions - Only shown if accommodation is required */}
            {formData.requiereHospedaje && (
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
                  Información de Acompañantes
                </h3>
                
                {/* Three Simple Questions */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="viajaConEsposa"
                      name="viajaConEsposa"
                      checked={formData.viajaConEsposa}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 bg-zinc-100 border-zinc-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-zinc-800 focus:ring-2 dark:bg-zinc-700 dark:border-zinc-600"
                    />
                    <label htmlFor="viajaConEsposa" className="ml-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      ¿Viaja con su esposa?
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="viajaConHijos"
                      name="viajaConHijos"
                      checked={formData.viajaConHijos}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 bg-zinc-100 border-zinc-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-zinc-800 focus:ring-2 dark:bg-zinc-700 dark:border-zinc-600"
                    />
                    <label htmlFor="viajaConHijos" className="ml-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      ¿Viaja con sus hijos?
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="viajaConOtroFamiliar"
                      name="viajaConOtroFamiliar"
                      checked={formData.viajaConOtroFamiliar}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 bg-zinc-100 border-zinc-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-zinc-800 focus:ring-2 dark:bg-zinc-700 dark:border-zinc-600"
                    />
                    <label htmlFor="viajaConOtroFamiliar" className="ml-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      ¿Viaja con algún otro familiar?
                    </label>
                  </div>
                </div>

                {/* Esposa Section */}
                {formData.viajaConEsposa && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-semibold text-zinc-900 dark:text-zinc-100">
                        Información de Esposa
                      </h4>
                      {!formData.esposa && (
                        <button
                          type="button"
                          onClick={addEsposa}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                          Agregar Esposa
                        </button>
                      )}
                    </div>
                    
                    {formData.esposa && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="font-medium text-zinc-900 dark:text-zinc-100">Esposa</h5>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, esposa: undefined }))}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Eliminar
                          </button>
                        </div>

                        {/* Cedula Search */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Cédula de Esposa *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={formData.esposa!.cedula}
                              onChange={(e) => handleFamilyMemberCedulaSearch(formData.esposa!, e.target.value, updateEsposa)}
                              placeholder="Ingrese número de cédula"
                              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {formData.esposa!.isSearching && (
                              <div className="absolute right-3 top-2.5">
                                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                              </div>
                            )}
                          </div>
                          {formData.esposa!.isFound && (
                            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                              ✓ Persona encontrada en el sistema
                            </p>
                          )}
                          {!formData.esposa!.isFound && formData.esposa!.cedula.length >= 6 && !formData.esposa!.isSearching && (
                            <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                              ⚠ Persona no encontrada - complete la información
                            </p>
                          )}
                        </div>

                        {formData.esposa!.isFound ? (
                          /* Show found person data */
                          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                            <h6 className="font-medium text-green-800 dark:text-green-200 mb-2">Información Registrada</h6>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-zinc-600 dark:text-zinc-400">Nombre:</span>
                                <p className="font-medium">{formData.esposa!.nombres} {formData.esposa!.apellidos}</p>
                              </div>
                              <div>
                                <span className="text-zinc-600 dark:text-zinc-400">Celular:</span>
                                <p className="font-medium">{formData.esposa!.celular}</p>
                              </div>
                            </div>
                          </div>
                        ) : formData.esposa!.cedula.length >= 6 && !formData.esposa!.isSearching ? (
                          /* Show registration form for new person */
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={formData.esposa!.nombres}
                              onChange={(e) => updateEsposa({ nombres: e.target.value })}
                              placeholder="Nombres *"
                              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                              type="text"
                              value={formData.esposa!.apellidos}
                              onChange={(e) => updateEsposa({ apellidos: e.target.value })}
                              placeholder="Apellidos *"
                              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                              type="tel"
                              value={formData.esposa!.celular}
                              onChange={(e) => updateEsposa({ celular: e.target.value })}
                              placeholder="Celular *"
                              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                              type="date"
                              value={formData.esposa!.fechaNacimiento}
                              onChange={(e) => updateEsposa({ fechaNacimiento: e.target.value })}
                              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                )}

                {/* Hijos Section */}
                {formData.viajaConHijos && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-semibold text-zinc-900 dark:text-zinc-100">
                        Información de Hijos
                      </h4>
                      <button
                        type="button"
                        onClick={addHijo}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        + Agregar Hijo
                      </button>
                    </div>
                    
                    {formData.hijos.length === 0 ? (
                      <div className="text-center py-6 text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
                        <p>Ningún hijo agregado</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {formData.hijos.map((hijo, index) => (
                          <div key={hijo.id} className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                            <div className="flex items-center justify-between mb-4">
                              <h5 className="font-medium text-zinc-900 dark:text-zinc-100">Hijo {index + 1}</h5>
                              <button
                                type="button"
                                onClick={() => removeHijo(hijo.id)}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                Eliminar
                              </button>
                            </div>
                            
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                Cédula *
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={hijo.cedula}
                                  onChange={(e) => handleFamilyMemberCedulaSearch(hijo, e.target.value, (updates) => updateHijo(hijo.id, updates))}
                                  placeholder="Ingrese número de cédula"
                                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {hijo.isSearching && (
                                  <div className="absolute right-3 top-2.5">
                                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                                  </div>
                                )}
                              </div>
                              {hijo.isFound && (
                                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                  ✓ Persona encontrada
                                </p>
                              )}
                              {!hijo.isFound && hijo.cedula.length >= 6 && !hijo.isSearching && (
                                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                                  ⚠ Complete la información
                                </p>
                              )}
                            </div>

                            {hijo.isFound ? (
                              <div className="bg-white dark:bg-zinc-800 p-3 rounded border">
                                <p className="font-medium">{hijo.nombres} {hijo.apellidos}</p>
                                <p className="text-sm text-zinc-600">{hijo.celular}</p>
                              </div>
                            ) : hijo.cedula.length >= 6 && !hijo.isSearching ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                  type="text"
                                  value={hijo.nombres}
                                  onChange={(e) => updateHijo(hijo.id, { nombres: e.target.value })}
                                  placeholder="Nombres *"
                                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                                />
                                <input
                                  type="text"
                                  value={hijo.apellidos}
                                  onChange={(e) => updateHijo(hijo.id, { apellidos: e.target.value })}
                                  placeholder="Apellidos *"
                                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                                />
                                <input
                                  type="tel"
                                  value={hijo.celular}
                                  onChange={(e) => updateHijo(hijo.id, { celular: e.target.value })}
                                  placeholder="Celular *"
                                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                                />
                                <input
                                  type="date"
                                  value={hijo.fechaNacimiento}
                                  onChange={(e) => updateHijo(hijo.id, { fechaNacimiento: e.target.value })}
                                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                                />
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Otros Familiares Section */}
                {formData.viajaConOtroFamiliar && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-semibold text-zinc-900 dark:text-zinc-100">
                        Otros Familiares
                      </h4>
                      <button
                        type="button"
                        onClick={addOtroFamiliar}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        + Agregar Familiar
                      </button>
                    </div>
                    
                    {formData.otrosFamiliares.length === 0 ? (
                      <div className="text-center py-6 text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
                        <p>Ningún familiar agregado</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {formData.otrosFamiliares.map((familiar, index) => (
                          <div key={familiar.id} className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                            <div className="flex items-center justify-between mb-4">
                              <h5 className="font-medium text-zinc-900 dark:text-zinc-100">Familiar {index + 1}</h5>
                              <button
                                type="button"
                                onClick={() => removeOtroFamiliar(familiar.id)}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                Eliminar
                              </button>
                            </div>
                            
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                Cédula *
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={familiar.cedula}
                                  onChange={(e) => handleFamilyMemberCedulaSearch(familiar, e.target.value, (updates) => updateOtroFamiliar(familiar.id, updates))}
                                  placeholder="Ingrese número de cédula"
                                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {familiar.isSearching && (
                                  <div className="absolute right-3 top-2.5">
                                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                                  </div>
                                )}
                              </div>
                              {familiar.isFound && (
                                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                  ✓ Persona encontrada
                                </p>
                              )}
                              {!familiar.isFound && familiar.cedula.length >= 6 && !familiar.isSearching && (
                                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                                  ⚠ Complete la información
                                </p>
                              )}
                            </div>

                            {familiar.isFound ? (
                              <div className="bg-white dark:bg-zinc-800 p-3 rounded border">
                                <p className="font-medium">{familiar.nombres} {familiar.apellidos}</p>
                                <p className="text-sm text-zinc-600">{familiar.celular}</p>
                              </div>
                            ) : familiar.cedula.length >= 6 && !familiar.isSearching ? (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <input
                                    type="text"
                                    value={familiar.nombres}
                                    onChange={(e) => updateOtroFamiliar(familiar.id, { nombres: e.target.value })}
                                    placeholder="Nombres *"
                                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                                  />
                                  <input
                                    type="text"
                                    value={familiar.apellidos}
                                    onChange={(e) => updateOtroFamiliar(familiar.id, { apellidos: e.target.value })}
                                    placeholder="Apellidos *"
                                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                                  />
                                  <input
                                    type="tel"
                                    value={familiar.celular}
                                    onChange={(e) => updateOtroFamiliar(familiar.id, { celular: e.target.value })}
                                    placeholder="Celular *"
                                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                                  />
                                  <input
                                    type="date"
                                    value={familiar.fechaNacimiento}
                                    onChange={(e) => updateOtroFamiliar(familiar.id, { fechaNacimiento: e.target.value })}
                                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                    Parentesco *
                                  </label>
                                  <select
                                    value={familiar.parentesco}
                                    onChange={(e) => updateOtroFamiliar(familiar.id, { parentesco: e.target.value })}
                                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                                  >
                                    {parentescoOptions.map(option => (
                                      <option key={option.value} value={option.value}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Accommodation Comments */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                    Comentarios sobre Hospedaje
                  </h4>
                  <textarea
                    name="comentariosHospedaje"
                    id="comentariosHospedaje"
                    value={formData.comentariosHospedaje}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Escriba aquí cualquier solicitud especial sobre el hospedaje..."
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                  />
                </div>
              </div>
            )}

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
                Actualmente en la iglesia está participando de alguno de estos servicios?
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {serviciosDisponibles.map(servicio => (
                  <div key={servicio.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`servicio-${servicio.value}`}
                      checked={formData.servicios.includes(servicio.value)}
                      onChange={() => handleServiciosChange(servicio.value)}
                      className="h-4 w-4 text-blue-600 bg-zinc-100 border-zinc-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-zinc-800 focus:ring-2 dark:bg-zinc-700 dark:border-zinc-600"
                    />
                    <label htmlFor={`servicio-${servicio.value}`} className="ml-2 text-sm text-zinc-700 dark:text-zinc-300">
                      {servicio.label}
                    </label>
                  </div>
                ))}
              </div>

              
            </div>


            {/* Event Preferences */}
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
                Preferencias del Evento
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="participaPrimerEvento"
                    name="participaPrimerEvento"
                    checked={formData.participaPrimerEvento}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 bg-zinc-100 border-zinc-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-zinc-800 focus:ring-2 dark:bg-zinc-700 dark:border-zinc-600"
                  />
                  <label htmlFor="participaPrimerEvento" className="ml-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Participa en primer evento (opcional)
                  </label>
                </div>
                
              </div>
            </div>

            {/* Submit Button */}
            <div className="p-6 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Enviando..." : "Enviar Pre-inscripción"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}