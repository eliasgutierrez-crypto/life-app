import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import EditHabitForm from "./form";
async function Load({ id }: { id: string }) { const { coupleId } = await requireCouple(); const habit = await prisma.habit.findFirst({ where: { id, coupleId } }); if (!habit) notFound(); return <EditHabitForm habit={{ id: habit.id, name: habit.name, description: habit.description ?? "", frequency: habit.frequency, timesPerWeek: habit.timesPerWeek ?? 1, daysOfWeek: habit.daysOfWeek }}/>; }
export default function EditHabitPage(props: { params: Promise<{ id: string }> }) { return <Suspense fallback={<p className="p-6">Cargando…</p>}><LoadParams params={props.params}/></Suspense>; }
async function LoadParams({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <Load id={id}/>; }