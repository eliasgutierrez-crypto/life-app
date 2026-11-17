import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DatabaseModelCounts } from "@/components/database-model-counts";

function LoadingCounts() {
  return (
    <p className="rounded-xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600">
      Consultando las tablas...
    </p>
  );
}

export default function DatabaseTestPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link className="text-sm text-blue-700 hover:underline" href="/">
            Volver al inicio
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Diagnóstico de base de datos
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Panel local de solo lectura para confirmar que Prisma puede consultar
            todos los modelos.
          </p>
        </div>
        <a
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          href="http://localhost:5555"
          rel="noreferrer"
          target="_blank"
        >
          Abrir Prisma Studio
        </a>
      </header>

      <Suspense fallback={<LoadingCounts />}>
        <DatabaseModelCounts />
      </Suspense>
    </main>
  );
}
