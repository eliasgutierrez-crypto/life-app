import { Suspense } from "react";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { CopyCode } from "./copy-code";

async function SettingsContent() {
  const { coupleId, userId } = await requireCouple();
  const couple = await prisma.couple.findUnique({ where: { id: coupleId } });
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Ajustes</h1>
      <Card title="Código de invitación">
        <div className="flex items-center gap-3">
          <code className="rounded bg-gray-100 px-3 py-2 text-lg">{couple?.inviteCode ?? "—"}</code>
          <CopyCode code={couple?.inviteCode ?? ""} />
        </div>
      </Card>
      <Card title="Miembros" className="mt-4">
        <p className="text-sm text-gray-700">Miembro principal: {couple?.memberAId === userId ? "Tú" : couple?.memberAId}</p>
        <p className="mt-1 text-sm text-gray-700">{couple?.memberBId ? `Pareja: ${couple.memberBId}` : "La pareja aún no ha sido añadida"}</p>
      </Card>
    </main>
  );
}

export default function SettingsPage() {
  return <Suspense fallback={<p className="p-6 text-gray-500">Cargando…</p>}><SettingsContent /></Suspense>;
}