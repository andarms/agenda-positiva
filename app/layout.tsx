import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Conferencias - Portal de Eventos",
  description: "Plataforma para la gestión y participación en conferencias",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}