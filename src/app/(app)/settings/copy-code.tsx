"use client";

export function CopyCode({ code }: { code: string }) {
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard.writeText(code)}
      className="rounded border px-3 py-2 text-sm"
    >
      Copiar
    </button>
  );
}
