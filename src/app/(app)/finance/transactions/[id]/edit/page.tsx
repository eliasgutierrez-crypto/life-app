import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import EditTransactionForm from "./form";
async function Load({ id }: { id: string }) { const { coupleId } = await requireCouple(); const item = await prisma.transaction.findFirst({ where: { id, coupleId } }); if (!item) notFound(); return <EditTransactionForm item={{ id: item.id, type: item.type, amount: item.amount.toString(), date: item.date.toISOString().slice(0,10), description: item.description ?? "", accountId: item.accountId ?? "", categoryId: item.categoryId ?? "", creditCardId: item.creditCardId ?? "" }}/>; }
export default function EditTransactionPage(props: { params: Promise<{ id: string }> }) { return <Suspense fallback={<p className="p-6">Cargando…</p>}><LoadParams params={props.params}/></Suspense>; }
async function LoadParams({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <Load id={id}/>; }