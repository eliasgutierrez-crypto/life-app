import Link from "next/link";

export default function NotFound() {
  return <main className="flex min-h-screen items-center justify-center p-6"><div className="text-center"><h1 className="text-6xl font-semibold">404</h1><p className="mt-3 text-gray-600">Página no encontrada</p><Link href="/" className="mt-4 inline-block rounded bg-black px-4 py-2 text-white">Ir al inicio</Link></div></main>;
}