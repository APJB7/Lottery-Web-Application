export default function PageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10 text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] animate-float rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute right-[-8%] top-[20%] h-[380px] w-[380px] animate-float-delay rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-[-12%] left-[30%] h-[420px] w-[420px] animate-float rounded-full bg-teal-400/10 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_35%),linear-gradient(to_bottom,rgba(15,23,42,0.1),rgba(15,23,42,1))]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative z-10">{children}</div>
    </main>
  );
}