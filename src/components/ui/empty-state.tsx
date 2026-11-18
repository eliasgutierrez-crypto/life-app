import type { ReactNode } from "react";

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <div className="rounded border bg-white p-8 text-center"><p className="font-medium text-gray-900">{title}</p>{description && <p className="mt-1 text-sm text-gray-600">{description}</p>}{action && <div className="mt-4">{action}</div>}</div>;
}