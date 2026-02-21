import type { Metadata } from "next";
import "./globals.css";
import { TopNavigation, MobileNavigation } from "./components/Navigation";

export const metadata: Metadata = {
  title: "Portal Intranet - Conferencias",
  description: "Portal de gestión interna para eventos de conferencias",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <TopNavigation />
        <main className="mb-16 md:mb-0">
          {children}
        </main>
        <MobileNavigation />
      </body>
    </html>
  );
}
