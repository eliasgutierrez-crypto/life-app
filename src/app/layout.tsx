import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life App",
  description: "Aplicación para gestionar la vida en pareja",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
