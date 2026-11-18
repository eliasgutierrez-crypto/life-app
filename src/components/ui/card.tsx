import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
};

export function Card({ children, className = "", title, action }: Props) {
  return (
    <div className={`rounded-lg border border-gray-800 bg-gray-900 p-4 text-gray-100 shadow-sm ${className}`}>
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between">
          {title && <h2 className="font-semibold text-gray-100">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}