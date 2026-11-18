import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import EditScheduleForm from "./form";
async function Load({ id }: { id: string }) { const { coupleId } = await requireCouple(); const block = await prisma.scheduleBlock.findFirst({ where: { id, coupleId } }); if (!block) notFound(); return <EditScheduleForm block={{ id: block.id, title: block.title, description: block.description ?? "", color: block.color ?? "#dbeafe", startTime: block.startTime, endTime: block.endTime, daysOfWeek: block.daysOfWeek }}/>; }
export default function EditSchedulePage(props: { params: Promise<{ id: string }> }) { return <Suspense fallback={<p className="p-6">Cargando…</p>}><LoadParams params={props.params}/></Suspense>; }
async function LoadParams({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <Load id={id}/>; }