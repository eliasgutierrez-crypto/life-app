"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="flex min-h-screen items-center justify-center p-6"><div className="text-center"><h1 className="text-2xl font-semibold">Algo salió mal</h1><p className="mt-2 text-gray-600">No fue posible cargar esta sección.</p><button type="button" onClick={reset} className="mt-4 rounded bg-black px-4 py-2 text-white">Reintentar</button></div></main>;
}