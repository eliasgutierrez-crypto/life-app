import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { mealTypeLabel, weekDays } from "@/lib/meals-utils";
import {
  removeMealPlanEntryById,
  saveAllMealPlanEntries,
  saveMealPlanEntry,
} from "../../actions";

const mealTypes = ["BREAKFAST", "LUNCH", "DINNER"] as const;

const mealStyles: Record<(typeof mealTypes)[number], string> = {
  BREAKFAST: "bg-blue-900/40 text-blue-300",
  LUNCH: "bg-green-900/40 text-green-300",
  DINNER: "bg-purple-900/40 text-purple-300",
};

async function Grid({ id }: { id: string }) {
  const { coupleId } = await requireCouple();
  const plan = await prisma.mealPlan.findFirst({
    where: { id, coupleId },
    include: { entries: { include: { recipe: true } } },
  });
  if (!plan) notFound();

  const recipes = await prisma.recipe.findMany({
    where: { coupleId },
    orderBy: { name: "asc" },
  });

  return (
    <main className="min-h-screen bg-gray-950 p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-100">
          Plan del {plan.weekStart.toLocaleDateString("es-MX")}
        </h1>
        <Button type="submit" form="meal-plan-form">
          Guardar todos los menús
        </Button>
      </div>

      <form id="meal-plan-form" action={saveAllMealPlanEntries.bind(null, plan.id)}>
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
                    <span
                      className={`inline-flex rounded px-2 py-1 text-xs font-medium ${mealStyles[mealType]}`}
                    >
                      {mealTypeLabel(mealType)}
                    </span>
                  </td>
                  {weekDays.map((_, dayIndex) => {
                    const entry = plan.entries.find(
                      (item) => item.dayOfWeek === dayIndex && item.mealType === mealType,
                    );
                    const fieldName = `menu-${dayIndex}-${mealType}`;
                    const dayLabel = weekDays[dayIndex];

                    return (
                      <td
                        key={dayIndex}
                        className={`border-l border-gray-800 p-3 align-top ${
                          entry ? "bg-gray-800 text-gray-100" : "bg-gray-900"
                        }`}
                      >
                        {entry ? (
                          <p className="mb-2 text-sm font-medium text-gray-100">
                            {entry.recipe.name}
                          </p>
                        ) : (
                          <p className="mb-2 text-sm text-gray-600">—</p>
                        )}
                        <select
                          name={fieldName}
                          defaultValue={entry?.recipeId ?? ""}
                          aria-label={`${mealTypeLabel(mealType)} del ${dayLabel}`}
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
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Button
                            type="submit"
                            variant="ghost"
                            className="px-2 py-1 text-xs text-blue-300"
                            formAction={async (formData) => {
                              "use server";
                              await saveMealPlanEntry(
                                plan.id,
                                dayIndex,
                                mealType,
                                String(formData.get(fieldName) ?? ""),
                              );
                            }}
                          >
                            Guardar
                          </Button>
                          {entry && (
                            <Button
                              type="submit"
                              variant="ghost"
                              className="px-2 py-1 text-xs text-red-300"
                              formAction={async () => {
                                "use server";
                                await removeMealPlanEntryById(plan.id, entry.id);
                              }}
                            >
                              Eliminar
                            </Button>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </form>
    </main>
  );
}

export default function PlanDetail(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="p-6 text-gray-400">Cargando…</p>}>
      <Load params={props.params} />
    </Suspense>
  );
}

async function Load({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Grid id={id} />;
}
