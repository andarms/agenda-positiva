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

const TOTAL_AMOUNT = 270000;

// Mock pre-inscription data
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
    familyMembers: [],
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
    familyMembers: [],
    comentariosHospedaje: "",
    fechaRegistro: "2026-02-17"
  }
];

export default function InscripcionPage() {
  const [preInscritos] = useState<PreRegistration[]>(mockPreInscritos);
  const [paymentStatuses, setPaymentStatuses] = useState<PaymentStatus[]>(
    mockPreInscritos.map(person => ({
      cedula: person.cedula,
      payments: [],
      totalPaid: 0,
      notes: ""
    }))
  );
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<PreRegistration[]>(mockPreInscritos);
  const [searchTerm, setSearchTerm] = useState("");
  const [newPaymentAmount, setNewPaymentAmount] = useState<string>("");
  const [newPaymentNotes, setNewPaymentNotes] = useState<string>("");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term === "") {
      setFilteredData(preInscritos);
    } else {
      const filtered = preInscritos.filter(person =>
        person.nombres.toLowerCase().includes(term.toLowerCase()) ||
        person.apellidos.toLowerCase().includes(term.toLowerCase()) ||
        person.cedula.includes(term) ||
        person.email.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const addPayment = (cedula: string, amount: number, notes: string = "") => {
    const payment: Payment = {
      id: Date.now().toString(),
      amount,
      timestamp: new Date().toISOString(),
      notes
    };

    setPaymentStatuses(prev => 
      prev.map(status => {
        if (status.cedula === cedula) {
          const newPayments = [...status.payments, payment];
          const newTotalPaid = newPayments.reduce((sum, p) => sum + p.amount, 0);
          return { 
            ...status, 
            payments: newPayments,
            totalPaid: newTotalPaid
          };
        }
        return status;
      })
    );
  };

  const removePayment = (cedula: string, paymentId: string) => {
    setPaymentStatuses(prev => 
      prev.map(status => {
        if (status.cedula === cedula) {
          const newPayments = status.payments.filter(p => p.id !== paymentId);
          const newTotalPaid = newPayments.reduce((sum, p) => sum + p.amount, 0);
          return { 
            ...status, 
            payments: newPayments,
            totalPaid: newTotalPaid
          };
        }
        return status;
      })
    );
  };

  const getPaymentStatus = (cedula: string): PaymentStatus => {
    return paymentStatuses.find(status => status.cedula === cedula) || {
      cedula,
      payments: [],
      totalPaid: 0,
      notes: ""
    };
  };

  const getPaymentBadgeColor = (totalPaid: number): string => {
    const percentage = (totalPaid / TOTAL_AMOUNT) * 100;
    if (percentage === 0) return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    if (percentage < 50) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    if (percentage < 100) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
  };

  const getPaymentText = (totalPaid: number): string => {
    if (totalPaid === 0) return "Sin abonos";
    if (totalPaid >= TOTAL_AMOUNT) return "Completo";
    return `$${totalPaid.toLocaleString()}`;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Gestión de Inscripciones
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Administrar pagos y confirmaciones de pre-inscritos
          </p>
        </div>

        {/* Search and Stats */}
        <div className="mb-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
            <div className="flex-1 w-full md:max-w-md">
              <input
                type="text"
                placeholder="Buscar por nombre, cédula o email..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg 
                         bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {filteredData.length}
                </div>
                <div className="text-zinc-500">Total</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-600">
                  {paymentStatuses.filter(p => p.totalPaid >= TOTAL_AMOUNT).length}
                </div>
                <div className="text-zinc-500">Completos</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-yellow-600">
                  {paymentStatuses.filter(p => p.totalPaid > 0 && p.totalPaid < TOTAL_AMOUNT).length}
                </div>
                <div className="text-zinc-500">Parciales</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-600">
                  {formatCurrency(paymentStatuses.reduce((sum, p) => sum + p.totalPaid, 0))}
                </div>
                <div className="text-zinc-500">Recaudado</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pre-inscritos Table */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 dark:bg-zinc-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Participante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Cédula
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Estado de Abonos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-zinc-800 divide-y divide-zinc-200 dark:divide-zinc-700">
                {filteredData.map((person) => {
                  const paymentStatus = getPaymentStatus(person.cedula);
                  return (
                    <tr key={person.cedula} className="hover:bg-zinc-50 dark:hover:bg-zinc-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {person.nombres} {person.apellidos}
                          </div>
                          <div className="text-sm text-zinc-500 dark:text-zinc-400">
                            {person.departamento} - {person.municipio}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-zinc-100">
                        {person.cedula}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-zinc-900 dark:text-zinc-100">{person.email}</div>
                        <div className="text-sm text-zinc-500 dark:text-zinc-400">{person.celular}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentBadgeColor(paymentStatus.totalPaid)}`}>
                            {getPaymentText(paymentStatus.totalPaid)}
                          </span>
                          <div className="text-xs text-zinc-500">
                            {paymentStatus.totalPaid > 0 && (
                              <span>
                                {((paymentStatus.totalPaid / TOTAL_AMOUNT) * 100).toFixed(1)}% de {formatCurrency(TOTAL_AMOUNT)}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedPerson(person.cedula)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Gestionar Abonos
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Modal */}
        {selectedPerson && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {(() => {
                  const person = preInscritos.find(p => p.cedula === selectedPerson);
                  const paymentStatus = getPaymentStatus(selectedPerson);
                  
                  if (!person) return null;
                  
                  const remainingAmount = TOTAL_AMOUNT - paymentStatus.totalPaid;
                  
                  return (
                    <>
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          Gestionar Abonos - {person.nombres} {person.apellidos}
                        </h3>
                        <button
                          onClick={() => setSelectedPerson(null)}
                          className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Payment Summary */}
                      <div className="bg-zinc-50 dark:bg-zinc-700 rounded-lg p-4 mb-6">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-semibold text-green-600">
                              {formatCurrency(paymentStatus.totalPaid)}
                            </div>
                            <div className="text-sm text-zinc-500">Pagado</div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-red-600">
                              {formatCurrency(remainingAmount)}
                            </div>
                            <div className="text-sm text-zinc-500">Pendiente</div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                              {formatCurrency(TOTAL_AMOUNT)}
                            </div>
                            <div className="text-sm text-zinc-500">Total</div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="w-full bg-zinc-200 dark:bg-zinc-600 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min((paymentStatus.totalPaid / TOTAL_AMOUNT) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-center text-sm text-zinc-500 mt-1">
                            {((paymentStatus.totalPaid / TOTAL_AMOUNT) * 100).toFixed(1)}% completado
                          </div>
                        </div>
                      </div>

                      {/* Add New Payment */}
                      <div className="border border-zinc-200 dark:border-zinc-600 rounded-lg p-4 mb-6">
                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                          Agregar Nuevo Abono
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                              Monto
                            </label>
                            <input
                              type="number"
                              placeholder="Ingrese el monto"
                              value={newPaymentAmount}
                              onChange={(e) => setNewPaymentAmount(e.target.value)}
                              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md
                                       bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                              Notas (opcional)
                            </label>
                            <input
                              type="text"
                              placeholder="Método de pago, referencia, etc."
                              value={newPaymentNotes}
                              onChange={(e) => setNewPaymentNotes(e.target.value)}
                              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md
                                       bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                            />
                          </div>
                          <button
                            onClick={() => {
                              const amount = parseFloat(newPaymentAmount);
                              if (amount > 0) {
                                addPayment(selectedPerson, amount, newPaymentNotes);
                                setNewPaymentAmount("");
                                setNewPaymentNotes("");
                              }
                            }}
                            disabled={!newPaymentAmount || parseFloat(newPaymentAmount) <= 0}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 
                                     hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed
                                     rounded-md transition-colors"
                          >
                            Agregar Abono
                          </button>
                        </div>
                      </div>

                      {/* Payment History */}
                      <div>
                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                          Historial de Abonos ({paymentStatus.payments.length})
                        </h4>
                        {paymentStatus.payments.length === 0 ? (
                          <div className="text-center py-8 text-zinc-500">
                            No hay abonos registrados
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {paymentStatus.payments
                              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                              .map((payment) => (
                              <div key={payment.id} 
                                   className="flex justify-between items-center p-3 border border-zinc-200 dark:border-zinc-600 rounded-md bg-zinc-50 dark:bg-zinc-700">
                                <div>
                                  <div className="font-medium text-zinc-900 dark:text-zinc-100">
                                    {formatCurrency(payment.amount)}
                                  </div>
                                  <div className="text-sm text-zinc-500">
                                    {new Date(payment.timestamp).toLocaleString('es-CO')}
                                  </div>
                                  {payment.notes && (
                                    <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                                      {payment.notes}
                                    </div>
                                  )}
                                </div>
                                <button
                                  onClick={() => removePayment(selectedPerson, payment.id)}
                                  className="text-red-500 hover:text-red-700 text-sm"
                                  title="Eliminar abono"
                                >
                                  🗑️
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end space-x-3 mt-6">
                        <button
                          onClick={() => setSelectedPerson(null)}
                          className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 
                                   bg-zinc-100 dark:bg-zinc-700 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-600"
                        >
                          Cerrar
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}