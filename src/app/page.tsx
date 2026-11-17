import { Suspense } from "react";
import { requireSessionPage } from "@/lib/auth";

async function HomeContent() {
  const { coupleId } = await requireSessionPage();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Life App</h1>
<p className="text-gray-700">
  Pareja: <code className="rounded bg-gray-100 px-2 py-1 text-gray-900">{coupleId}</code>
</p>
      {process.env.NODE_ENV === "development" && (
        <a href="/dev/database" className="text-blue-600 underline">
          Ir al panel de base de datos (dev)
        </a>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <Suspense fallback={<p className="text-gray-500">Cargando…</p>}>
        <HomeContent />
      </Suspense>
    </main>
  );
}