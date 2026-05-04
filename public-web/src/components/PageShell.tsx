export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-br from-teal-50 via-white to-cyan-50 px-0 py-6 text-slate-700">
      {children}
    </main>
  );
}