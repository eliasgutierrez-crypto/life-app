import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import EditPantryItemForm from "./form";

async function LoadAndEdit({ id }: { id: string }) {
  const { coupleId } = await requireCouple();
  const item = await prisma.pantryItem.findFirst({
    where: { id, coupleId },
  });

  if (!item) notFound();

  return (
    <EditPantryItemForm
      item={{
        id: item.id,
        name: item.name,
        currentQty: item.currentQty.toString(),
        unit: item.unit,
        minStock: item.minStock.toString(),
        expiresAt: item.expiresAt ? item.expiresAt.toISOString().slice(0, 10) : null,
      }}
    />
  );
}

async function LoadEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LoadAndEdit id={id} />;
}

export default function EditPage(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="p-6 text-gray-500">Cargando…</p>}>
      <LoadEditPage params={props.params} />
    </Suspense>
  );
}