import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SuperMercat Inclusiu",
  description: "Sistema de navegación asistida por voz para supermercados",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

