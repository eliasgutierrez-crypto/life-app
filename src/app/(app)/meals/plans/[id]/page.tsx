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
  const mealStyles: Record<(typeof mealTypes)[number], string> = {
    BREAKFAST: "bg-blue-900/40 text-blue-300",
    LUNCH: "bg-green-900/40 text-green-300",
    DINNER: "bg-purple-900/40 text-purple-300",
  };

  return (
    <main className="min-h-screen bg-gray-950 p-6">
      <h1 className="mb-4 text-2xl font-semibold text-gray-100">
        Plan del {plan.weekStart.toLocaleDateString("es-MX")}
      </h1>
      <div className="overflow-x-auto rounded-lg border border-gray-800 bg-gray-900">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="p-3 text-left text-xs font-medium text-gray-500">Comida</th>
              {weekDays.map((day) => (
                <th key={day} className="p-3 text-left font-medium text-gray-400">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mealTypes.map((mealType) => (
              <tr key={mealType} className="border-t border-gray-800">
                <td className="p-3 align-top">
                  <span className={`inline-flex rounded px-2 py-1 text-xs font-medium ${mealStyles[mealType]}`}>
                    {mealTypeLabel(mealType)}
                  </span>
                </td>
                {weekDays.map((_, dayIndex) => {
                  const entry = plan.entries.find(
                    (item) => item.dayOfWeek === dayIndex && item.mealType === mealType,
                  );
                  return (
                    <td
                      key={dayIndex}
                      className={`border-l border-gray-800 p-3 align-top ${
                        entry ? "bg-gray-800 text-gray-100" : "bg-gray-900"
                      }`}
                    >
                      {entry ? (
                        <>
                          <p className="mb-2 text-sm font-medium text-gray-100">
                            {entry.recipe.name}
                          </p>
                          <form
                            action={async (formData) => {
                              "use server";
                              const recipeId = String(formData.get("recipeId") || "");
                              if (recipeId) {
                                await addMealPlanEntry(plan.id, dayIndex, mealType, recipeId);
                              }
                            }}
                          >
                            <select
                              name="recipeId"
                              defaultValue={entry.recipeId}
                              className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-gray-100"
                            >
                              {recipes
                                .filter((recipe) => recipe.mealType === mealType)
                                .map((recipe) => (
                                  <option key={recipe.id} value={recipe.id}>
                                    {recipe.name}
                                  </option>
                                ))}
                            </select>
                            <button type="submit" className="mt-2 text-xs text-blue-300">
                              Guardar
                            </button>
                          </form>
                          <form action={removeMealPlanEntry} className="mt-1">
                            <input type="hidden" name="planId" value={plan.id} />
                            <input type="hidden" name="id" value={entry.id} />
                            <button type="submit" className="text-xs text-red-300">
                              Eliminar
                            </button>
                          </form>
                        </>
                      ) : (
                        <form
                          action={async (formData) => {
                            "use server";
                            const recipeId = String(formData.get("recipeId") || "");
                            if (recipeId) {
                              await addMealPlanEntry(plan.id, dayIndex, mealType, recipeId);
                            }
                          }}
                        >
                          <select
                            name="recipeId"
                            defaultValue=""
                            className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-gray-100"
                          >
                            <option value="">—</option>
                            {recipes
                              .filter((recipe) => recipe.mealType === mealType)
                              .map((recipe) => (
                                <option key={recipe.id} value={recipe.id}>
                                  {recipe.name}
                                </option>
                              ))}
                          </select>
                          <button type="submit" className="mt-2 text-xs text-blue-300">
                            Guardar
                          </button>
                        </form>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
export default function PlanDetail(props: { params: Promise<{ id: string }> }) { return <Suspense fallback={<p className="p-6">Cargando…</p>}><Load params={props.params}/></Suspense>; }
async function Load({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <Grid id={id}/>; }