import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import EditRecipeForm from "./form";
async function Load({ id }: { id: string }) { const { coupleId } = await requireCouple(); const recipe = await prisma.recipe.findFirst({ where: { id, coupleId } }); if (!recipe) notFound(); return <EditRecipeForm recipe={{ id: recipe.id, name: recipe.name, mealType: recipe.mealType, ingredients: recipe.ingredients ?? "", notes: recipe.notes ?? "" }}/>; }
export default function EditRecipePage(props: { params: Promise<{ id: string }> }) { return <Suspense fallback={<p className="p-6">Cargando…</p>}><LoadParams params={props.params}/></Suspense>; }
async function LoadParams({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <Load id={id}/>; }