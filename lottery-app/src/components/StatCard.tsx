export default function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
      <p className="text-sm text-white/75">{label}</p>
      <h3 className="mt-2 text-2xl font-semibold text-white">{value}</h3>
    </div>
  );
}