import type { ReactNode } from "react";

export function Table({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50"><tr>{headers.map((header) => <th key={header} className="px-4 py-3 text-left font-medium text-gray-700">{header}</th>)}</tr></thead>
        <tbody className="divide-y">{children}</tbody>
      </table>
    </div>
  );
}