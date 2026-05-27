export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}
