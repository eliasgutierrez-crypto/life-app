import { Suspense } from "react";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { minutesToTime } from "@/lib/schedule-utils";
import { deleteScheduleBlock } from "./actions";

async function Week() {
  const { coupleId } = await requireCouple();
  const blocks = await prisma.scheduleBlock.findMany({ where: { coupleId }, orderBy: { startTime: "asc" } });
  const days = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  return <div className="grid grid-cols-7 gap-2">{days.map((day, dayIndex) => <div key={day} className="min-h-96 rounded-lg border border-gray-800 bg-gray-900"><div className="border-b border-gray-800 p-2 text-center text-sm font-medium text-gray-300">{day}</div><div className="space-y-2 p-2">{blocks.filter((block) => block.daysOfWeek.includes(dayIndex)).map((block) => <div key={block.id} className="rounded border-l-4 bg-gray-800 p-2 text-xs text-gray-100" style={{ borderLeftColor: block.color || "#3b82f6" }}><p className="font-medium">{block.title}</p><p className="text-gray-300">{minutesToTime(block.startTime)}–{minutesToTime(block.endTime)}</p><div className="mt-2 flex gap-1"><Button href={`/schedule/${block.id}/edit`} variant="ghost" className="px-1 py-0">Editar</Button><form action={deleteScheduleBlock}><input type="hidden" name="id" value={block.id}/><button className="text-red-300" type="submit">Borrar</button></form></div></div>)}</div></div>)}</div>;
}
export default function SchedulePage() { return <main className="p-6"><div className="mb-4 flex justify-between"><h1 className="text-2xl font-semibold">Agenda semanal</h1><Button href="/schedule/new">Añadir bloque</Button></div><Suspense fallback={<p>Cargando…</p>}><Week/></Suspense></main>; }