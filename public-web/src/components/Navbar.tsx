import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100/80 bg-white/85 backdrop-blur-2xl shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-400 to-cyan-500 text-xl font-black text-white shadow-lg shadow-cyan-500/25">
            <div className="absolute inset-0 bg-white/20" />
            <span className="relative">J</span>
          </div>

          <div>
            <p className="text-xl font-black tracking-tight text-slate-950">
              The<span className="text-cyan-600">Jackpot</span>
            </p>
            <p className="text-xs font-medium text-slate-500">
              Secure lottery verification
            </p>
          </div>
        </Link>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <nav className="flex flex-wrap items-center gap-2 rounded-3xl border border-slate-200 bg-white/70 p-1 shadow-sm md:rounded-full">
            <Link
              href="/lottery/ps4-bundle"
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
            >
              Lottery
            </Link>

            <Link
              href="/policies/terms"
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-700"
            >
              Terms
            </Link>

            <Link
              href="/policies/privacy"
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-700"
            >
              Privacy
            </Link>
          </nav>

          <Link
            href="/register/ps4-bundle"
            className="inline-flex justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Participate Now
          </Link>
        </div>
      </div>
    </header>
  );
}