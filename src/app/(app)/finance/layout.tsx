import Link from "next/link";

const links = [
  ["", "Resumen"], ["accounts", "Cuentas"], ["categories", "Categorías"],
  ["transactions", "Movimientos"], ["credit-cards", "Tarjetas"], ["installments", "Meses sin intereses"],
];

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="flex gap-2 overflow-x-auto border-b border-gray-800 bg-gray-900 px-6 pt-4">
        {links.map(([path, label]) => (
          <Link key={path} href={`/finance${path ? `/${path}` : ""}`} className="border-b-2 border-transparent px-3 pb-3 text-sm text-gray-400 transition-colors hover:border-blue-400 hover:text-gray-100">{label}</Link>
        ))}
      </nav>
      {children}
    </div>
  );
}