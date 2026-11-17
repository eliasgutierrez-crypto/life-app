import Link from "next/link";
import { Suspense } from "react";
import { requireSessionPage } from "@/lib/auth";

async function Nav() {
  await requireSessionPage();

  return (
    <nav className="border-b bg-white px-4 py-3">
      <div className="mx-auto flex max-w-4xl items-center gap-4">
        <Link href="/" className="font-semibold text-gray-900">
          Life App
        </Link>
        <Link href="/pantry" className="text-sm text-gray-700 hover:text-gray-900">
          Despensa
        </Link>
      </div>
    </nav>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="h-12 border-b bg-white" />}>
        <Nav />
      </Suspense>
      {children}
    </div>
  );
}