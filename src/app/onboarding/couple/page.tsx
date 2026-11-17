import Link from "next/link";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ensureCouple, joinCouple } from "@/lib/couple";

async function createMyCouple() {
  "use server";
  await ensureCouple();
  redirect("/");
}

async function joinExistingCouple(formData: FormData) {
  "use server";
  const code = String(formData.get("code") ?? "");
  await joinCouple(code);
  redirect("/");
}

async function OnboardingContent() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const couple = await prisma.couple.findFirst({
    where: { OR: [{ memberAId: userId }, { memberBId: userId }] },
  });

  if (couple) {
    const isMemberA = couple.memberAId === userId;
    const partnerJoined = Boolean(couple.memberBId);

    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Tu espacio de pareja</h1>
        {partnerJoined ? (
          <p className="text-green-700">Pareja completa. Ya pueden usar la app.</p>
        ) : (
          <>
            <p>Comparte este código con tu pareja para que se una:</p>
            <pre className="rounded bg-gray-100 p-4 text-lg tracking-widest">
              {couple.inviteCode}
            </pre>
            {!isMemberA && (
              <p className="text-sm text-gray-600">
                Estás como segundo miembro. Esperando a que se complete.
              </p>
            )}
          </>
        )}
        <Link href="/" className="inline-block rounded bg-black px-4 py-2 text-white">
          Ir al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Configura tu pareja</h1>

      <form action={createMyCouple} className="space-y-2">
        <button type="submit" className="rounded bg-black px-4 py-2 text-white">
          Crear mi espacio
        </button>
        <p className="text-sm text-gray-600">
          Genera un código para invitar a tu pareja.
        </p>
      </form>

      <div className="border-t pt-6 space-y-2">
        <h2 className="font-medium">O únete con un código</h2>
        <form action={joinExistingCouple} className="flex gap-2">
          <input
            name="code"
            placeholder="XK7P2M9Q"
            maxLength={8}
            className="flex-1 rounded border px-3 py-2 uppercase"
            required
          />
          <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white">
            Unirme
          </button>
        </form>
      </div>
    </div>
  );
}

export default function OnboardingCouplePage() {
  return (
    <main className="mx-auto max-w-xl p-8">
      <Suspense fallback={<p className="text-gray-500">Cargando…</p>}>
        <OnboardingContent />
      </Suspense>
    </main>
  );
}