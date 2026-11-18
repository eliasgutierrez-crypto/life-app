import type { ReactNode } from "react";

type Variant = "default" | "success" | "warning" | "danger" | "info";

const styles: Record<Variant, string> = {
  default: "bg-gray-800 text-gray-200",
  success: "bg-green-900/50 text-green-300",
  warning: "bg-yellow-900/50 text-yellow-200",
  danger: "bg-red-900/50 text-red-200",
  info: "bg-blue-900/50 text-blue-200",
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