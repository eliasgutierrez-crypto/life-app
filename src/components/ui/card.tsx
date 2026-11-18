import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
};

export function Card({ children, className = "", title, action }: Props) {
  return (
    <div className={`rounded border bg-white p-4 ${className}`}>
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between">
          {title && <h2 className="font-semibold text-gray-900">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}