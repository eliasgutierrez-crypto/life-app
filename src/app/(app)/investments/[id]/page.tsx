import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/finance-utils";
import { deleteContribution } from "../actions";
import { AddContribution } from "./add-contribution";
async function Detail({ id }: { id: string }) { const { coupleId } = await requireCouple(); const investment = await prisma.investment.findFirst({ where: { id, coupleId }, include: { contributions: { orderBy: { date: "desc" } } } }); if (!investment) notFound(); return <main className="mx-auto max-w-4xl p-6"><h1 className="mb-1 text-2xl font-semibold">{investment.name}</h1><p className="mb-4 text-gray-600">Valor actual {formatMoney(investment.currentValue)}</p><AddContribution investmentId={investment.id}/><div className="mt-4 space-y-2">{investment.contributions.map((item)=><div key={item.id} className="flex justify-between rounded border bg-white p-3"><div><p className="font-medium">{formatMoney(item.amount)}</p><p className="text-sm text-gray-600">{item.date.toLocaleDateString("es-MX")} · {item.note || "Sin nota"}</p></div><form action={deleteContribution}><input type="hidden" name="id" value={item.id}/><input type="hidden" name="investmentId" value={investment.id}/><Button type="submit" variant="danger">Borrar</Button></form></div>)}</div></main>; }
export default function InvestmentDetail(props: { params: Promise<{ id: string }> }) { return <Suspense fallback={<p className="p-6">Cargando…</p>}><Load params={props.params}/></Suspense>; }
async function Load({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <Detail id={id}/>; }