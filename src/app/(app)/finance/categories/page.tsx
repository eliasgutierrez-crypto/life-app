import { Suspense } from "react";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { deleteCategory } from "../actions";

async function CategoryList() {
  const { coupleId } = await requireCouple();
  const categories = await prisma.category.findMany({ where: { coupleId }, orderBy: { name: "asc" } });
  if (!categories.length) return <EmptyState title="No hay categorías" action={<Button href="/finance/categories/new">Añadir categoría</Button>} />;
  return <div className="space-y-2">{categories.map((category) => <div key={category.id} className="flex items-center justify-between rounded border bg-white p-4"><div><p className="font-medium">{category.icon ? `${category.icon} ` : ""}{category.name}</p><p className="text-sm text-gray-600">{category.type}</p></div><div className="flex gap-2"><Button href={`/finance/categories/${category.id}/edit`} variant="secondary">Editar</Button><form action={deleteCategory}><input type="hidden" name="id" value={category.id}/><Button type="submit" variant="danger">Borrar</Button></form></div></div>)}</div>;
}
export default function CategoriesPage() {
  return <main className="mx-auto max-w-4xl p-6"><div className="mb-4 flex justify-between"><h1 className="text-2xl font-semibold">Categorías</h1><Button href="/finance/categories/new">Añadir categoría</Button></div><Suspense fallback={<p>Cargando…</p>}><CategoryList /></Suspense></main>;
}