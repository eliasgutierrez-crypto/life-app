import { Suspense } from "react";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { toggleHabitEntry, deleteHabit } from "./actions";

async function HabitList() {
  const { coupleId } = await requireCouple();
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const habits = await prisma.habit.findMany({ where: { coupleId }, include: { entries: { orderBy: { date: "desc" }, take: 30 } }, orderBy: { name: "asc" } });
  if (!habits.length) return <EmptyState title="No hay hábitos" action={<Button href="/habits/new">Crear hábito</Button>}/>;
  return <div className="space-y-2">{habits.map((habit) => { const entry = habit.entries.find((item) => item.date.toISOString().slice(0,10) === today.toISOString().slice(0,10)); return <div key={habit.id} className="flex items-center justify-between rounded border bg-white p-4"><div><p className="font-medium">{habit.name}</p><p className="text-sm text-gray-600">{habit.description || habit.frequency}</p></div><div className="flex items-center gap-2"><Badge variant={entry?.completed ? "success" : "default"}>{entry?.completed ? "Completado" : "Pendiente"}</Badge><form action={async () => { "use server"; await toggleHabitEntry(habit.id, today); }}><Button type="submit" variant="secondary">Cambiar hoy</Button></form><Button href={`/habits/${habit.id}`} variant="secondary">Ver</Button><Button href={`/habits/${habit.id}/edit`} variant="secondary">Editar</Button><form action={deleteHabit}><input type="hidden" name="id" value={habit.id}/><Button type="submit" variant="danger">Borrar</Button></form></div></div>; })}</div>;
}
export default function HabitsPage() { return <main className="mx-auto max-w-5xl p-6"><div className="mb-4 flex justify-between"><h1 className="text-2xl font-semibold">Hábitos</h1><Button href="/habits/new">Crear hábito</Button></div><Suspense fallback={<p>Cargando…</p>}><HabitList/></Suspense></main>; }