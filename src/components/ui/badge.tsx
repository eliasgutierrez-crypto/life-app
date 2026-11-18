import type { ReactNode } from "react";

type Variant = "default" | "success" | "warning" | "danger" | "info";

const styles: Record<Variant, string> = {
  default: "bg-gray-100 text-gray-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
};

export function Badge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: Variant;
}) {
  return (
    <span className={`rounded px-2 py-0.5 text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
}