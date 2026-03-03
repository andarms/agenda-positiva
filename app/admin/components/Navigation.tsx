"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  HomeIcon,
  DocumentPlusIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import * as solid from "@heroicons/react/20/solid";
import Image from "next/image";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavigationItem[] = [
  { name: "Portal", href: "/", icon: HomeIcon },
  {
    name: "Eventos",
    href: "/admin/eventos",
    icon: CalendarIcon,
  },
  {
    name: "Pre-inscripción",
    href: "/admin/pre-inscripcion",
    icon: DocumentPlusIcon,
  },
];

export function TopNavigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const cerrar_session = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };

  if (status === "loading") {
    return (
      <nav className="bg-white  border-b border-zinc-200  sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-16">
            <span className="text-sm text-zinc-500">Cargando...</span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white  border-b border-zinc-200  sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-zinc-900 "
          >
            <Image
              src="/logos/logoCrown.svg"
              alt="Logo"
              width={32}
              height={32}
              className="rounded"
            />
            Agenda positiva
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700 "
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 "
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* User Profile and Logout */}
          {session?.user && (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-zinc-600 ">
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "Usuario"}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span>{session.user.name}</span>
              </div>

              <button
                onClick={cerrar_session}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600  hover:bg-red-50  rounded-lg transition-colors"
              >
                <solid.ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span className="hidden md:inline">Cerrar Sesión</span>
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-zinc-600 hover:text-zinc-900  dark:hover:text-zinc-100"
            >
              <span className="sr-only">Abrir menú</span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
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
  const { data: session } = useSession();

  const cerrar_session = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white  border-t border-zinc-200  md:hidden z-50">
      <div className="grid grid-cols-6 h-16">
        {navigation.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center text-xs font-medium transition-colors ${
                isActive
                  ? "text-blue-700 dark:text-blue-300"
                  : "text-zinc-600 hover:text-zinc-900  dark:hover:text-zinc-100"
              }`}
            >
              <IconComponent className="w-6 h-6 mb-1" />
              <span className="truncate px-1">{item.name}</span>
            </Link>
          );
        })}

        {/* Mobile logout button */}
        {session?.user && (
          <button
            onClick={cerrar_session}
            className="flex flex-col items-center justify-center text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors"
          >
            <solid.ArrowRightOnRectangleIcon className="w-6 h-6 mb-1" />
            <span className="truncate px-1">Salir</span>
          </button>
        )}
      </div>
    </nav>
  );
}
