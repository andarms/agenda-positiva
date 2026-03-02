import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

export const metadata: Metadata = {
  title: "Inscripciones - Conferencias",
  description: "Formulario de inscripción para eventos de conferencias",
};

export default function InscripcionesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`min-h-screen bg-zinc-50 dark:bg-zinc-900`}>
      <main className=" mx-auto ">{children}</main>
    </div>
  );
}
