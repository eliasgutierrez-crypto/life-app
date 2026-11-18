import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import EditInvestmentForm from "./form";
async function Load({ id }: { id: string }) { const { coupleId } = await requireCouple(); const item = await prisma.investment.findFirst({ where: { id, coupleId } }); if (!item) notFound(); return <EditInvestmentForm item={{ id: item.id, name: item.name, type: item.type ?? "", currentValue: item.currentValue.toString() }}/>; }
export default function EditInvestmentPage(props: { params: Promise<{ id: string }> }) { return <Suspense fallback={<p className="p-6">Cargando…</p>}><LoadParams params={props.params}/></Suspense>; }
async function LoadParams({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <Load id={id}/>; }