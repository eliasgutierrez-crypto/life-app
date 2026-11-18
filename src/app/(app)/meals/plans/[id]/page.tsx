import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { weekDays, mealTypeLabel } from "@/lib/meals-utils";
import { addMealPlanEntry, removeMealPlanEntry } from "../../actions";

async function Grid({ id }: { id: string }) {
  const { coupleId } = await requireCouple();
  const plan = await prisma.mealPlan.findFirst({ where: { id, coupleId }, include: { entries: { include: { recipe: true } } } });
  if (!plan) notFound();
  const recipes = await prisma.recipe.findMany({ where: { coupleId }, orderBy: { name: "asc" } });
  const mealTypes = ["BREAKFAST","LUNCH","DINNER"] as const;
  return <main className="p-6"><h1 className="mb-4 text-2xl font-semibold">Plan del {plan.weekStart.toLocaleDateString("es-MX")}</h1><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-sm"><thead><tr><th className="p-2 text-left">Comida</th>{weekDays.map((day)=><th key={day} className="p-2">{day}</th>)}</tr></thead><tbody>{mealTypes.map((mealType)=><tr key={mealType} className="border-t">{[mealTypeLabel(mealType), ...weekDays].map((_, index)=>{ if(index===0) return <td key={mealType} className="p-2 font-medium">{mealTypeLabel(mealType)}</td>; const day=index-1; const entry=plan.entries.find((item)=>item.dayOfWeek===day && item.mealType===mealType); return <td key={day} className="p-2 align-top"><form action={async(formData)=>{"use server"; const recipeId=String(formData.get("recipeId")||""); if(recipeId) await addMealPlanEntry(plan.id,day,mealType,recipeId);}}><select name="recipeId" defaultValue={entry?.recipeId ?? ""} className="w-full rounded border px-2 py-1"><option value="">Sin asignar</option>{recipes.filter((recipe)=>recipe.mealType===mealType).map((recipe)=><option key={recipe.id} value={recipe.id}>{recipe.name}</option>)}</select><button type="submit" className="mt-1 text-xs text-blue-700">Guardar</button></form>{entry && <form action={removeMealPlanEntry} className="mt-1"><input type="hidden" name="planId" value={plan.id}/><input type="hidden" name="id" value={entry.id}/><button type="submit" className="text-xs text-red-700">Eliminar</button></form>}</td>; })}</tr>)}</tbody></table></div></main>;
}
export default function PlanDetail(props: { params: Promise<{ id: string }> }) { return <Suspense fallback={<p className="p-6">Cargando…</p>}><Load params={props.params}/></Suspense>; }
async function Load({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <Grid id={id}/>; }