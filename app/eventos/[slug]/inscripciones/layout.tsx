import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <div className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-zinc-50 dark:bg-zinc-900`}>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}