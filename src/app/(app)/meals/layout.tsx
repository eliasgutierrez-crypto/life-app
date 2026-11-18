import Link from "next/link";

export default function MealsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full bg-gray-950">
      <nav className="flex gap-2 border-b border-gray-800 bg-gray-950 px-6 pt-4">
        <Link
          href="/meals/recipes"
          className="border-b-2 border-transparent px-3 pb-3 text-sm text-gray-300 hover:border-gray-100 hover:text-gray-100"
        >
          Recetas
        </Link>
        <Link
          href="/meals/plans"
          className="border-b-2 border-transparent px-3 pb-3 text-sm text-gray-300 hover:border-gray-100 hover:text-gray-100"
        >
          Planes
        </Link>
      </nav>
      {children}
    </div>
  );
}