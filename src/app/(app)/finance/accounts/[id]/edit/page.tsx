import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireCouple } from "@/lib/auth";
import { prisma } from "@/lib/db";
import EditAccountForm from "./form";

async function Load({ id }: { id: string }) {
  const { coupleId } = await requireCouple();
  const item = await prisma.account.findFirst({ where: { id, coupleId } });
  if (!item) notFound();
  return <EditAccountForm item={{ id: item.id, name: item.name, type: item.type, balance: item.balance.toString() }}/>;
}
export default function EditAccountPage(props: { params: Promise<{ id: string }> }) {
  return <Suspense fallback={<p className="p-6">Cargando…</p>}><LoadParams params={props.params}/></Suspense>;
}
async function LoadParams({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Load id={id}/>;
}