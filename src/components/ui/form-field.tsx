import type { InputHTMLAttributes, ReactNode } from "react";
import { Input } from "./input";

export function FormField({
  label,
  name,
  children,
  ...props
}: { label: string; name: string; children?: ReactNode } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      {children ?? <Input name={name} {...props} />}
    </label>
  );
}
