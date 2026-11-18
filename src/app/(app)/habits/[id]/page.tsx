import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
async function Detail({ id }: { id: string }) { const { coupleId } = await requireCouple(); const habit = await prisma.habit.findFirst({ where: { id, coupleId }, include: { entries: { orderBy: { date: "desc" }, take: 60 } } }); if (!habit) notFound(); return <main className="mx-auto max-w-4xl p-6"><h1 className="mb-1 text-2xl font-semibold">{habit.name}</h1><p className="mb-4 text-gray-600">{habit.description || habit.frequency}</p><div className="space-y-2">{habit.entries.map((entry) => <div key={entry.id} className="flex justify-between rounded border bg-white p-3"><span>{entry.date.toLocaleDateString("es-MX")}</span><Badge variant={entry.completed ? "success" : "default"}>{entry.completed ? "Completado" : "No completado"}</Badge></div>)}</div></main>; }
export default function HabitDetail(props: { params: Promise<{ id: string }> }) { return <Suspense fallback={<p className="p-6">Cargando…</p>}><Load params={props.params}/></Suspense>; }
async function Load({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <Detail id={id}/>; }