import type { ReactNode } from "react";

export function Table({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 text-gray-100">
      <table className="w-full text-sm">
        <thead className="bg-gray-800"><tr>{headers.map((header) => <th key={header} className="px-4 py-3 text-left font-medium text-gray-300">{header}</th>)}</tr></thead>
        <tbody className="divide-y">{children}</tbody>
      </table>
    </div>
  );
}