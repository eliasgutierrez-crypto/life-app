import type { InputHTMLAttributes } from "react";

export function CurrencyInput(props: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  return <input type="number" step="0.01" min="0" {...props} className={`w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${props.className ?? ""}`} />;
}