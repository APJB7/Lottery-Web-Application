export default function PageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6fbfb] px-4 py-10 text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_32%),radial-gradient(circle_at_top_right,rgba(6,182,212,0.22),transparent_30%),linear-gradient(180deg,#faffff_0%,#f1fbfb_45%,#ffffff_100%)]" />

        <div className="absolute left-[-120px] top-[80px] h-[360px] w-[360px] animate-float rounded-full bg-emerald-300/35 blur-3xl" />
        <div className="absolute right-[-120px] top-[260px] h-[360px] w-[360px] animate-float-delay rounded-full bg-cyan-300/35 blur-3xl" />
        <div className="absolute bottom-[-160px] left-[35%] h-[430px] w-[430px] animate-float rounded-full bg-teal-200/45 blur-3xl" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:54px_54px]" />

        <div className="absolute left-1/2 top-20 h-[520px] w-[520px] -translate-x-1/2 rounded-full border border-white/60 bg-white/20 blur-sm" />
      </div>

      <div className="relative z-10">{children}</div>
    </main>
  );
}