import type { Metadata } from "next";
import { TopNavigation, MobileNavigation } from "./components/Navigation";

export const metadata: Metadata = {
  title: "Portal Intranet - Conferencias",
  description: "Portal de gestión interna para eventos de conferencias",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TopNavigation />
      <main className="mb-16 md:mb-0">{children}</main>
      <MobileNavigation />
    </>
  );
}
