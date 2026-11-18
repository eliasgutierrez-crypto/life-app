import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import EditDebtForm from "./form";
async function Load({ id }: { id: string }) { const { coupleId } = await requireCouple(); const debt = await prisma.debt.findFirst({ where: { id, coupleId } }); if (!debt) notFound(); return <EditDebtForm debt={{ id: debt.id, name: debt.name, principal: debt.principal.toString(), annualRate: debt.annualRate.toString(), startDate: debt.startDate.toISOString().slice(0,10), termMonths: debt.termMonths }}/>; }
export default function EditDebtPage(props: { params: Promise<{ id: string }> }) { return <Suspense fallback={<p className="p-6">Cargando…</p>}><LoadParams params={props.params}/></Suspense>; }
async function LoadParams({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <Load id={id}/>; }