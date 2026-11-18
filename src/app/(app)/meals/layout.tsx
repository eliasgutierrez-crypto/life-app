import Link from "next/link";

export default function MealsLayout({ children }: { children: React.ReactNode }) {
  return <div><nav className="flex gap-2 border-b bg-white px-6 pt-4"><Link href="/meals/recipes" className="border-b-2 border-transparent px-3 pb-3 text-sm hover:border-black">Recetas</Link><Link href="/meals/plans" className="border-b-2 border-transparent px-3 pb-3 text-sm hover:border-black">Planes</Link></nav>{children}</div>;
}