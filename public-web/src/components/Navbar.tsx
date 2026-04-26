import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur-2xl shadow-lg shadow-black/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 font-black text-slate-950 shadow-lg shadow-cyan-500/20">
            Jack
          </div>

          <div>
            <p className="text-lg font-bold tracking-tight text-white">
              The<span className="text-cyan-300">Jackpot</span>
            </p>
            <p className="text-xs text-slate-400">Secure lottery platform</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <Link
            href="/lottery/iphone-15-pro-max"
            className="rounded-full px-5 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            Lottery
          </Link>

          <Link
            href="/policies/terms"
            className="rounded-full px-5 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            Terms
          </Link>

          <Link
            href="/policies/privacy"
            className="rounded-full px-5 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            Privacy
          </Link>
        </nav>

        <Link
          href="/lottery/iphone-15-pro-max"
          className="rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:scale-105"
        >
          Join Now
        </Link>
      </div>
    </header>
  );
}