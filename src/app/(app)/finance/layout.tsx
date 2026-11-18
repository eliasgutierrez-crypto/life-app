import Link from "next/link";

const links = [
  ["", "Resumen"], ["accounts", "Cuentas"], ["categories", "Categorías"],
  ["transactions", "Movimientos"], ["credit-cards", "Tarjetas"], ["installments", "Meses sin intereses"],
];

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="flex gap-2 overflow-x-auto border-b bg-white px-6 pt-4">
        {links.map(([path, label]) => (
          <Link key={path} href={`/finance${path ? `/${path}` : ""}`} className="border-b-2 border-transparent px-3 pb-3 text-sm text-gray-600 hover:border-black hover:text-gray-900">{label}</Link>
        ))}
      </nav>
      {children}
    </div>
  );
}