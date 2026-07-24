import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KodeCraft PH — Onboarding",
  description:
    "Configuración inicial de tu conjunto en la plataforma de administración de propiedad horizontal",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
