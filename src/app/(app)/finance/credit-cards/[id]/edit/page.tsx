import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import EditCreditCardForm from "./form";
async function Load({ id }: { id: string }) { const { coupleId } = await requireCouple(); const card = await prisma.creditCard.findFirst({ where: { id, coupleId } }); if (!card) notFound(); return <EditCreditCardForm card={{ id: card.id, name: card.name, limitAmount: card.limitAmount.toString(), cutoffDay: card.cutoffDay, paymentDay: card.paymentDay, interestRate: card.interestRate?.toString() ?? "" }}/>; }
export default function EditCreditCardPage(props: { params: Promise<{ id: string }> }) { return <Suspense fallback={<p className="p-6">Cargando…</p>}><LoadParams params={props.params}/></Suspense>; }
async function LoadParams({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <Load id={id}/>; }