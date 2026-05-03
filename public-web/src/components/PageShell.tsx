export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-br from-cyan-50 via-white to-emerald-50 px-4 py-6 text-slate-900 md:px-6 md:py-8">
      {children}
    </main>
  );
}