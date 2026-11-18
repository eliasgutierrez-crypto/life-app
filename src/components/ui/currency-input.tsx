import type { InputHTMLAttributes } from "react";

export function CurrencyInput(props: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  return <input type="number" step="0.01" min="0" {...props} className={`w-full rounded border border-gray-300 px-3 py-2 ${props.className ?? ""}`} />;
}