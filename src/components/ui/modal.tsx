"use client";
import type { ReactNode } from "react";

export function Modal({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose: () => void }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><div className="w-full max-w-lg rounded bg-white p-4"><div className="mb-4 flex justify-between"><h2 className="font-semibold">{title}</h2><button type="button" onClick={onClose}>×</button></div>{children}</div></div>;
}