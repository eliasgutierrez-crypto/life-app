import Link from "next/link";
import { Suspense } from "react";
import { requireSessionPage } from "@/lib/auth";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/pantry", label: "Despensa" },
  { href: "/finance", label: "Finanzas" },
  { href: "/habits", label: "Hábitos" },
  { href: "/schedule", label: "Agenda" },
  { href: "/debts", label: "Deudas" },
  { href: "/investments", label: "Inversiones" },
  { href: "/meals", label: "Comidas" },
  { href: "/settings", label: "Ajustes" },
];

async function Sidebar() {
  await requireSessionPage();

  return (
    <aside className="w-56 shrink-0 border-r border-gray-800 bg-gray-900 p-4">
      <Link href="/" className="mb-6 block text-lg font-semibold text-gray-100">
        Life App
      </Link>
      <nav className="space-y-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="block rounded px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-800 hover:text-gray-100"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Suspense fallback={<div className="w-56 border-r border-gray-800 bg-gray-900" />}>
        <Sidebar />
      </Suspense>
      <main className="min-w-0 flex-1 bg-gray-950">{children}</main>
    </div>
  );
}