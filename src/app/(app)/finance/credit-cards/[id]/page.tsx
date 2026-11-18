import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/finance-utils";
async function Detail({ id }: { id: string }) { const { coupleId } = await requireCouple(); const card = await prisma.creditCard.findFirst({ where: { id, coupleId }, include: { transactions: { orderBy: { date: "desc" } }, installmentPlans: true } }); if (!card) notFound(); return <main className="mx-auto max-w-4xl p-6"><h1 className="mb-4 text-2xl font-semibold">{card.name}</h1><div className="grid gap-4 md:grid-cols-3"><Card title="Límite"><p>{formatMoney(card.limitAmount)}</p></Card><Card title="Adeudo"><p>{formatMoney(card.currentBalance)}</p></Card><Card title="Corte / pago"><p>Día {card.cutoffDay} / Día {card.paymentDay}</p></Card></div><Card title="Movimientos" className="mt-4">{card.transactions.length ? card.transactions.map((item) => <p key={item.id} className="py-2 text-sm">{item.description ?? item.type} · {formatMoney(item.amount)}</p>) : <p className="text-sm text-gray-500">Sin movimientos</p>}</Card></main>; }
export default function CreditCardDetail(props: { params: Promise<{ id: string }> }) { return <Suspense fallback={<p className="p-6">Cargando…</p>}><Load params={props.params}/></Suspense>; }
async function Load({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <Detail id={id}/>; }