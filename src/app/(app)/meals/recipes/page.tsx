import { Suspense } from "react";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { mealTypeLabel } from "@/lib/meals-utils";
import { deleteRecipe } from "../actions";
async function RecipeList() { const { coupleId } = await requireCouple(); const recipes = await prisma.recipe.findMany({ where: { coupleId }, orderBy: { name: "asc" } }); if (!recipes.length) return <EmptyState title="No hay recetas" action={<Button href="/meals/recipes/new">Añadir receta</Button>}/>; return <div className="grid gap-3 md:grid-cols-2">{recipes.map((recipe)=><div key={recipe.id} className="rounded border bg-white p-4"><p className="font-medium">{recipe.name}</p><p className="text-sm text-gray-600">{mealTypeLabel(recipe.mealType)}</p>{recipe.ingredients && <p className="mt-2 line-clamp-2 text-sm">{recipe.ingredients}</p>}<div className="mt-3 flex gap-2"><Button href={`/meals/recipes/${recipe.id}/edit`} variant="secondary">Editar</Button><form action={deleteRecipe}><input type="hidden" name="id" value={recipe.id}/><Button type="submit" variant="danger">Borrar</Button></form></div></div>)}</div>; }
export default function RecipesPage() { return <main className="mx-auto max-w-5xl p-6"><div className="mb-4 flex justify-between"><h1 className="text-2xl font-semibold">Recetas</h1><Button href="/meals/recipes/new">Añadir receta</Button></div><Suspense fallback={<p>Cargando…</p>}><RecipeList/></Suspense></main>; }