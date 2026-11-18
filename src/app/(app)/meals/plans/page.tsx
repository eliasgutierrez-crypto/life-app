import { Suspense } from "react";
import Link from "next/link";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
async function PlanList() { const { coupleId } = await requireCouple(); const plans = await prisma.mealPlan.findMany({ where: { coupleId }, include: { entries: true }, orderBy: { weekStart: "desc" } }); if (!plans.length) return <EmptyState title="No hay planes semanales" action={<Button href="/meals/plans/new">Crear plan</Button>}/>; return <div className="space-y-2">{plans.map((plan)=><Link key={plan.id} href={`/meals/plans/${plan.id}`} className="flex justify-between rounded border bg-white p-4 hover:bg-gray-50"><span className="font-medium">Semana del {plan.weekStart.toLocaleDateString("es-MX")}</span><span className="text-sm text-gray-600">{plan.entries.length} comidas</span></Link>)}</div>; }
export default function PlansPage() { return <main className="mx-auto max-w-5xl p-6"><div className="mb-4 flex justify-between"><h1 className="text-2xl font-semibold">Planes semanales</h1><Button href="/meals/plans/new">Crear plan</Button></div><Suspense fallback={<p>Cargando…</p>}><PlanList/></Suspense></main>; }