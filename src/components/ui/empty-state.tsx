import type { ReactNode } from "react";

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <div className="rounded-lg border border-gray-800 bg-gray-900 p-8 text-center"><p className="font-medium text-gray-100">{title}</p>{description && <p className="mt-1 text-sm text-gray-400">{description}</p>}{action && <div className="mt-4">{action}</div>}</div>;
}