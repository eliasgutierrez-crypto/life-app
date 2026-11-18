import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life App",
  description: "Aplicación para gestionar la vida en pareja",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#3b82f6",
          colorBackground: "#111827",
          colorForeground: "#f9fafb",
          colorMutedForeground: "#9ca3af",
          colorInput: "#1f2937",
          colorInputForeground: "#f9fafb",
          colorNeutral: "#d1d5db",
        },
      }}
    >
      <html lang="es">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
