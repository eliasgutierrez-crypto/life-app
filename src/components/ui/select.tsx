import type { SelectHTMLAttributes } from "react";
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`w-full rounded border border-gray-300 px-3 py-2 text-gray-900 ${props.className ?? ""}`} />;
}