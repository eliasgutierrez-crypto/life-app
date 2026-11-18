export function Toast({ message }: { message: string }) {
  return <div className="fixed bottom-4 right-4 rounded bg-gray-900 px-4 py-3 text-sm text-white">{message}</div>;
}