"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationItem {
  name: string;
  href: string;
  icon: string;
}

const navigation: NavigationItem[] = [
  { name: "Portal", href: "/", icon: "🏠" },
  { name: "Eventos", href: "/admin/eventos", icon: "📅" },
  { name: "Misiva", href: "/admin/misiva", icon: "📧" },
  { name: "Pre-inscripción", href: "/admin/pre-inscripcion", icon: "📝" },
  { name: "Inscripción", href: "/admin/inscripcion", icon: "✅" },
  { name: "Hospedaje", href: "/admin/hospedaje", icon: "🏨" },
  { name: "Servicio", href: "/admin/servicio", icon: "🔧" },
];

export function TopNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            href="/" 
            className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100"
          >
            <span className="text-xl">📋</span>
            Portal Conferencias
          </Link>
          
          <div className="hidden md:flex items-center gap-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${ 
                    isActive
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-700"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              <span className="sr-only">Abrir menú</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700 md:hidden z-50">
      <div className="grid grid-cols-6 h-16">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center text-xs font-medium transition-colors ${
                isActive
                  ? "text-blue-700 dark:text-blue-300"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              <span className="text-lg mb-1">{item.icon}</span>
              <span className="truncate px-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}