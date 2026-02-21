import Link from "next/link";

interface ModuleCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
}

function ModuleCard({ title, description, href, icon }: ModuleCardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-2xl dark:bg-blue-900">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        </div>
        <div className="text-zinc-400 transition-transform group-hover:translate-x-1">
          →
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const modules = [
    {
      title: "Misiva",
      description: "Gestión de comunicaciones y correspondencia",
      href: "/misiva",
      icon: "📧"
    },
    {
      title: "Pre-inscripción",
      description: "Registro previo de participantes",
      href: "/pre-inscripcion",
      icon: "📝"
    },
    {
      title: "Inscripción",
      description: "Registro oficial de asistentes",
      href: "/inscripcion",
      icon: "✅"
    },
    {
      title: "Hospedaje",
      description: "Gestión de alojamiento y reservas",
      href: "/hospedaje",
      icon: "🏨"
    },
    {
      title: "Servicio",
      description: "Servicios generales del evento",
      href: "/servicio",
      icon: "🔧"
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Portal Intranet
          </h1>
          <h2 className="text-2xl text-zinc-600 dark:text-zinc-400 mb-2">
            Conferencias
          </h2>
          <p className="text-lg text-zinc-500 dark:text-zinc-500">
            Sistema de gestión interna para eventos
          </p>
        </div>

        {/* Modules Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <ModuleCard
                key={index}
                title={module.title}
                description={module.description}
                href={module.href}
                icon={module.icon}
              />
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-sm text-zinc-400 dark:text-zinc-600">
            Sistema desarrollado para la gestión integral de conferencias
          </p>
        </div>
      </div>
    </div>
  );
}
