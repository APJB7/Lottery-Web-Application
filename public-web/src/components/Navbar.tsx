import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100/80 bg-white/95 backdrop-blur-2xl shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-400 to-cyan-500 text-lg font-black text-white shadow-lg shadow-cyan-500/25">
            J
          </div>

          <div>
            <p className="text-lg font-black tracking-tight text-slate-950">
              The<span className="text-cyan-600">Jackpot</span>
            </p>
            <p className="text-xs font-medium text-slate-500">
              Secure lottery verification
            </p>
          </div>
        </Link>

        <nav className="flex w-full gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white/80 p-1 shadow-sm md:w-auto md:rounded-full">
          <Link href="/" className="shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-emerald-50">
            Lottery
          </Link>

          <Link href="/how-it-works" className="shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-cyan-50">
            How It Works
          </Link>

          <Link href="/policies/terms" className="shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-cyan-50">
            Terms
          </Link>

          <Link href="/policies/privacy" className="shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-cyan-50">
            Privacy
          </Link>
        </nav>
      </div>
    </header>
  );
}