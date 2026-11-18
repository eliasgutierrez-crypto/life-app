import type { InputHTMLAttributes } from "react";

export function DatePicker(props: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  return <input type="date" {...props} className={`w-full rounded border border-gray-300 px-3 py-2 ${props.className ?? ""}`} />;
}