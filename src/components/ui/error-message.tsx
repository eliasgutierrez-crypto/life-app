export function ErrorMessage({ message }: { message?: string | null }) {
  if (!message) return null;
  return <p className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">{message}</p>;
}