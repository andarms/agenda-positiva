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
  familyMembers: any[];
  comentariosHospedaje: string;
  fechaRegistro: string;
}

interface Payment {
  id: string;
  amount: number;
  timestamp: string;
  notes: string;
}

interface PaymentStatus {
  cedula: string;
  payments: Payment[];
  totalPaid: number;
  notes: string;
}

interface HospedajeAssignment {
  cedula: string;
  tipo: 'hotel' | 'casa';
  ubicacion: string;
  fechaAsignacion: string;
  notas: string;
}

// Mock data from inscripciones con familias más realistas
const mockPreInscritos: PreRegistration[] = [
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
    familyMembers: [
      { nombres: "Ana María", apellidos: "García Sánchez", edad: 32, parentesco: "Esposa" },
      { nombres: "Sofía", apellidos: "García García", edad: 8, parentesco: "Hija" }
    ],
    comentariosHospedaje: "Necesito habitación cerca del auditorio",
    fechaRegistro: "2026-02-20"
  },
  {
    cedula: "11223344",
    nombres: "Ana María",
    apellidos: "García Sánchez",
    tipoDocumento: "cedula",
    sexo: "femenino",
    fechaNacimiento: "1992-08-12",
    celular: "3001234568",
    email: "ana.garcia@email.com",
    departamento: "antioquia",
    municipio: "medellin",
    participaPrimerEvento: true,
    requiereHospedaje: true,
    estaSirviendo: true,
    servicios: ["ninos"],
    familyMembers: [],
    comentariosHospedaje: "Misma habitación que Juan Carlos",
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
    familyMembers: [],
    comentariosHospedaje: "Preferimos habitación familiar con dos camas",
    fechaRegistro: "2026-02-18"
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
      { nombres: "Lucia", apellidos: "Hernández Mora", edad: 28, parentesco: "Esposa" },
      { nombres: "Daniela", apellidos: "Hernández Mora", edad: 15, parentesco: "Hija" }
    ],
    comentariosHospedaje: "",
    fechaRegistro: "2026-02-17"
  },
  {
    cedula: "55443322",
    nombres: "Daniela",
    apellidos: "Hernández Mora",
    tipoDocumento: "cedula",
    sexo: "femenino",
    fechaNacimiento: "2008-06-10",
    celular: "3009988777",
    email: "daniela.hernandez@email.com",
    departamento: "valle",
    municipio: "cali",
    participaPrimerEvento: true,
    requiereHospedaje: true,
    estaSirviendo: true,
    servicios: ["jovenes"],
    familyMembers: [],
    comentariosHospedaje: "Con mi papá Carlos Alberto",
    fechaRegistro: "2026-02-17"
  }
];

// Mock payments para simular personas con abonos
const mockPaymentStatuses: PaymentStatus[] = [
  {
    cedula: "12345678",
    payments: [{ id: "1", amount: 135000, timestamp: "2026-02-20T10:00:00", notes: "Transferencia bancaria" }],
    totalPaid: 135000,
    notes: ""
  },
  {
    cedula: "11223344",
    payments: [{ id: "2", amount: 135000, timestamp: "2026-02-20T10:05:00", notes: "Transferencia bancaria" }],
    totalPaid: 135000,
    notes: ""
  },
  {
    cedula: "87654321", 
    payments: [
      { id: "3", amount: 100000, timestamp: "2026-02-18T14:30:00", notes: "Efectivo" },
      { id: "4", amount: 170000, timestamp: "2026-02-19T09:15:00", notes: "Pse" }
    ],
    totalPaid: 270000,
    notes: ""
  },
  {
    cedula: "99887766",
    payments: [{ id: "5", amount: 50000, timestamp: "2026-02-17T16:45:00", notes: "Efectivo" }],
    totalPaid: 50000,
    notes: ""
  },
  {
    cedula: "55443322",
    payments: [{ id: "6", amount: 270000, timestamp: "2026-02-17T17:00:00", notes: "Transferencia" }],
    totalPaid: 270000,
    notes: ""
  }
];

export default function HospedajePage() {
  const [activeTab, setActiveTab] = useState<'por-asignar' | 'asignados'>('por-asignar');
  const [assignments, setAssignments] = useState<HospedajeAssignment[]>([]);
  const [editingAssignment, setEditingAssignment] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar solo personas que requieren hospedaje y tienen al menos un abono
  const inscritosConHospedaje = mockPreInscritos
    .filter(person => person.requiereHospedaje)
    .filter(person => {
      const payment = mockPaymentStatuses.find(p => p.cedula === person.cedula);
      return payment && payment.totalPaid > 0;
    });

  // Función para generar ID de familia basado en apellidos y ubicación
  const getFamilyId = (person: PreRegistration): string => {
    // Si tiene familiares, usar apellidos + departamento como ID de familia
    if (person.familyMembers.length > 0) {
      return `${person.apellidos.split(' ')[0]}-${person.departamento}`;
    }
    return `individual-${person.cedula}`;
  };

  // Agrupar personas por familia
  const getFamilyGroups = () => {
    const groups = new Map<string, PreRegistration[]>();
    
    inscritosConHospedaje.forEach(person => {
      const familyId = getFamilyId(person);
      if (!groups.has(familyId)) {
        groups.set(familyId, []);
      }
      groups.get(familyId)!.push(person);
    });

    return groups;
  };

  const familyGroups = getFamilyGroups();

  // Función para obtener progreso de asignación familiar
  const getFamilyProgress = (familyMembers: PreRegistration[]) => {
    const assigned = familyMembers.filter(member => 
      assignments.some(assignment => assignment.cedula === member.cedula)
    ).length;
    return {
      assigned,
      total: familyMembers.length,
      percentage: familyMembers.length > 0 ? (assigned / familyMembers.length) * 100 : 0
    };
  };

  // Función para obtener color de la familia
  const getFamilyColor = (familyId: string): string => {
    const colors = [
      'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
      'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800', 
      'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800',
      'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800',
      'bg-pink-50 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800'
    ];
    const index = familyId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  // Filtrar grupos de familia según término de búsqueda
  const filteredFamilyGroups = new Map<string, PreRegistration[]>();
  
  familyGroups.forEach((members, familyId) => {
    const hasMatch = members.some(person =>
      person.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.cedula.includes(searchTerm)
    );
    
    if (hasMatch || searchTerm === "") {
      filteredFamilyGroups.set(familyId, members);
    }
  });

  // Separar grupos entre asignados y por asignar
  const gruposAsignados = new Map<string, PreRegistration[]>();
  const gruposPorAsignar = new Map<string, PreRegistration[]>();
  
  filteredFamilyGroups.forEach((members, familyId) => {
    const progress = getFamilyProgress(members);
    if (progress.assigned === progress.total && progress.total > 0) {
      gruposAsignados.set(familyId, members);
    } else {
      gruposPorAsignar.set(familyId, members);
    }
  });

  const getAssignment = (cedula: string): HospedajeAssignment | null => {
    return assignments.find(assignment => assignment.cedula === cedula) || null;
  };

  const saveAssignment = (cedula: string, tipo: 'hotel' | 'casa', ubicacion: string, notas: string) => {
    const newAssignment: HospedajeAssignment = {
      cedula,
      tipo,
      ubicacion,
      notas,
      fechaAsignacion: new Date().toISOString()
    };

    setAssignments(prev => {
      const existingIndex = prev.findIndex(a => a.cedula === cedula);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newAssignment;
        return updated;
      }
      return [...prev, newAssignment];
    });

    setEditingAssignment(null);
  };

  const assignToEntireFamily = (mainPersonCedula: string, tipo: 'hotel' | 'casa', ubicacion: string, notas: string) => {
    const mainPerson = inscritosConHospedaje.find(p => p.cedula === mainPersonCedula);
    if (!mainPerson) return;

    // Crear las asignaciones para todos los miembros de la familia
    const familyAssignments: HospedajeAssignment[] = [];
    
    // Asignación para la persona principal
    familyAssignments.push({
      cedula: mainPersonCedula,
      tipo,
      ubicacion,
      notas: `${notas} (Titular del grupo familiar)`,
      fechaAsignacion: new Date().toISOString()
    });

    // Asignaciones para los familiares (si están en la lista de inscritos)
    mainPerson.familyMembers.forEach(member => {
      // Buscar si el familiar también está inscrito
      const familiarInscrito = inscritosConHospedaje.find(p => 
        p.nombres === member.nombres && p.apellidos === member.apellidos
      );
      
      if (familiarInscrito) {
        familyAssignments.push({
          cedula: familiarInscrito.cedula,
          tipo,
          ubicacion,
          notas: `${notas} (Familiar de ${mainPerson.nombres} ${mainPerson.apellidos})`,
          fechaAsignacion: new Date().toISOString()
        });
      }
    });

    setAssignments(prev => {
      let updated = [...prev];
      
      // Actualizar o agregar cada asignación familiar
      familyAssignments.forEach(newAssignment => {
        const existingIndex = updated.findIndex(a => a.cedula === newAssignment.cedula);
        if (existingIndex >= 0) {
          updated[existingIndex] = newAssignment;
        } else {
          updated.push(newAssignment);
        }
      });
      
      return updated;
    });

    setEditingAssignment(null);
  };

  const removeAssignment = (cedula: string) => {
    setAssignments(prev => prev.filter(a => a.cedula !== cedula));
  };

  const getPaymentInfo = (cedula: string) => {
    return mockPaymentStatuses.find(p => p.cedula === cedula);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const FamilyGroupCard = ({ familyId, members }: { familyId: string, members: PreRegistration[] }) => {
    const progress = getFamilyProgress(members);
    const familyColor = getFamilyColor(familyId);
    const isIndividual = familyId.startsWith('individual-');
    const mainPerson = members[0]; // En grupos familiares, el primero suele ser el titular
    
    return (
      <div className={`border-2 rounded-lg p-6 ${familyColor}`}>
        {/* Header del grupo familiar */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {isIndividual ? (
                  `${mainPerson.nombres} ${mainPerson.apellidos}`
                ) : (
                  `Familia ${mainPerson.apellidos.split(' ')[0]}`
                )}
              </h3>
              {!isIndividual && (
                <span className="text-xs bg-white dark:bg-zinc-800 px-2 py-1 rounded-full text-zinc-600 dark:text-zinc-400">
                  {members.length} personas
                </span>
              )}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              {mainPerson.departamento} - {mainPerson.municipio}
            </div>
          </div>
          
          {/* Progress del grupo */}
          <div className="text-right">
            <div className={`text-sm font-medium ${
              progress.percentage === 100 ? 'text-green-600' :
              progress.percentage === 0 ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {progress.assigned}/{progress.total} asignados
            </div>
            <div className="w-20 bg-zinc-200 dark:bg-zinc-600 rounded-full h-2 mt-1">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  progress.percentage === 100 ? 'bg-green-500' :
                  progress.percentage === 0 ? 'bg-red-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Lista de miembros de la familia */}
        <div className="space-y-3">
          {members.map(person => {
            const assignment = getAssignment(person.cedula);
            const paymentInfo = getPaymentInfo(person.cedula);
            const isEditing = editingAssignment === person.cedula || editingAssignment === `family-${person.cedula}`;
            const [tipo, setTipo] = useState<'hotel' | 'casa'>(assignment?.tipo || 'hotel');
            const [ubicacion, setUbicacion] = useState(assignment?.ubicacion || '');
            const [notas, setNotas] = useState(assignment?.notas || '');

            return (
              <div key={person.cedula} className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-sm">
                {/* Información de la persona */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
                        {person.nombres} {person.apellidos}
                      </h4>
                      {assignment && (
                        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                          ✓ Asignado
                        </span>
                      )}
                      {!assignment && (
                        <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 px-2 py-1 rounded">
                          Pendiente
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-zinc-500 space-y-1">
                      <div>Cédula: {person.cedula} • {person.celular}</div>
                      <div>{person.email}</div>
                      {paymentInfo && (
                        <div className="text-green-600 font-medium">
                          Abonado: {formatCurrency(paymentInfo.totalPaid)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Botones de acción */}
                  <div className="flex gap-2">
                    {assignment ? (
                      <>
                        <button
                          onClick={() => setEditingAssignment(isEditing ? null : person.cedula)}
                          className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          {isEditing ? 'Cancelar' : 'Editar'}
                        </button>
                        <button
                          onClick={() => removeAssignment(person.cedula)}
                          className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          Remover
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingAssignment(person.cedula)}
                          className="text-green-600 hover:text-green-800 text-sm px-2 py-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20"
                        >
                          Asignar
                        </button>
                        {!isIndividual && members.length > 1 && (
                          <button
                            onClick={() => {
                              setEditingAssignment(`family-${person.cedula}`);
                              setTipo('hotel');
                              setUbicacion('');
                              setNotas('');
                            }}
                            className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          >
                            Asignar familia
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Asignación actual */}
                {assignment && !isEditing && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">
                        {assignment.tipo === 'hotel' ? '🏨' : '🏠'}
                      </span>
                      <div>
                        <div className="font-medium text-green-900 dark:text-green-100 capitalize">
                          {assignment.tipo}: {assignment.ubicacion}
                        </div>
                        {assignment.notas && (
                          <div className="text-sm text-green-700 dark:text-green-300">
                            {assignment.notas}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-green-600">
                      Asignado: {new Date(assignment.fechaAsignacion).toLocaleString('es-CO')}
                    </div>
                  </div>
                )}

                {/* Comentarios de hospedaje */}
                {person.comentariosHospedaje && (
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm text-blue-800 dark:text-blue-200 mb-3">
                    💬 {person.comentariosHospedaje}
                  </div>
                )}

                {/* Formulario de asignación */}
                {isEditing && (
                  <div className="border border-zinc-200 dark:border-zinc-600 rounded-lg p-4 space-y-3 mt-3">
                    {editingAssignment.startsWith('family-') && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                          Asignación Familiar
                        </h5>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          Aplicará a todos los miembros familiares inscritos.
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Tipo de Hospedaje
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="hotel"
                            checked={tipo === 'hotel'}
                            onChange={(e) => setTipo(e.target.value as 'hotel' | 'casa')}
                            className="mr-2"
                          />
                          🏨 Hotel
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="casa"
                            checked={tipo === 'casa'}
                            onChange={(e) => setTipo(e.target.value as 'hotel' | 'casa')}
                            className="mr-2"
                          />
                          🏠 Casa
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Ubicación / Nombre del {tipo}
                      </label>
                      <input
                        type="text"
                        value={ubicacion}
                        onChange={(e) => setUbicacion(e.target.value)}
                        placeholder={tipo === 'hotel' ? 'Ej: Hotel Las Américas' : 'Ej: Casa de la Familia Rodríguez'}
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md
                                 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Notas adicionales (opcional)
                      </label>
                      <textarea
                        value={notas}
                        onChange={(e) => setNotas(e.target.value)}
                        placeholder="Habitación específica, instrucciones especiales, etc."
                        rows={2}
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md
                                 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>

                    <div className="flex gap-3">
                      {editingAssignment.startsWith('family-') ? (
                        <button
                          onClick={() => assignToEntireFamily(person.cedula, tipo, ubicacion, notas)}
                          disabled={!ubicacion.trim()}
                          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 
                                   hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed
                                   rounded-md transition-colors"
                        >
                          Asignar a Toda la Familia
                        </button>
                      ) : (
                        <button
                          onClick={() => saveAssignment(person.cedula, tipo, ubicacion, notas)}
                          disabled={!ubicacion.trim()}
                          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 
                                   hover:bg-green-700 disabled:bg-zinc-400 disabled:cursor-not-allowed
                                   rounded-md transition-colors"
                        >
                          Guardar Individual
                        </button>
                      )}
                      <button
                        onClick={() => setEditingAssignment(null)}
                        className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 
                                 bg-zinc-100 dark:bg-zinc-700 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-600"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Gestión de Hospedaje
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Asignación de alojamiento para participantes inscritos
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {inscritosConHospedaje.length}
              </div>
              <div className="text-sm text-zinc-500">Total Personas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {familyGroups.size}
              </div>
              <div className="text-sm text-zinc-500">Grupos Familiares</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {gruposAsignados.size}
              </div>
              <div className="text-sm text-zinc-500">Familias Completas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {gruposPorAsignar.size}
              </div>
              <div className="text-sm text-zinc-500">Familias Pendientes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {assignments.filter(a => a.tipo === 'hotel').length}
              </div>
              <div className="text-sm text-zinc-500">En Hoteles</div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre o cédula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:max-w-md px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg
                     bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-zinc-200 dark:border-zinc-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('por-asignar')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'por-asignar'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'
                }`}
              >
                Familias Pendientes ({gruposPorAsignar.size})
              </button>
              <button
                onClick={() => setActiveTab('asignados')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'asignados'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'
                }`}
              >
                Familias Completas ({gruposAsignados.size})
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'por-asignar' ? (
            gruposPorAsignar.size === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-zinc-800 rounded-lg">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                  ¡Todas las Familias Asignadas!
                </h3>
                <p className="text-zinc-500">
                  No hay familias pendientes por asignar hospedaje
                </p>
              </div>
            ) : (
              Array.from(gruposPorAsignar.entries()).map(([familyId, members]) => (
                <FamilyGroupCard key={familyId} familyId={familyId} members={members} />
              ))
            )
          ) : (
            gruposAsignados.size === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-zinc-800 rounded-lg">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                  Aún sin familias completas
                </h3>
                <p className="text-zinc-500">
                  Comienza asignando hospedaje desde "Familias Pendientes"
                </p>
              </div>
            ) : (
              Array.from(gruposAsignados.entries()).map(([familyId, members]) => (
                <FamilyGroupCard key={familyId} familyId={familyId} members={members} />
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
}