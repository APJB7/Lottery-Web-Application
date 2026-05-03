import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-cyan-100 bg-white/90 backdrop-blur-2xl shadow-[0_10px_35px_rgba(15,23,42,0.05)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500 text-lg font-black text-white shadow-lg shadow-cyan-500/25">
            J
          </div>

          <div>
            <p className="text-lg font-black tracking-tight text-slate-950">
              The<span className="text-teal-500">Jackpot</span>
            </p>
            <p className="text-xs font-medium text-slate-500">
              Secure lottery verification
            </p>
          </div>
        </Link>

        <nav className="flex w-full gap-2 overflow-x-auto rounded-2xl border border-cyan-100 bg-white/80 p-1 shadow-sm md:w-auto md:rounded-full">
          {[
            ["Lottery", "/"],
            ["How It Works", "/how-it-works"],
            ["Terms", "/policies/terms"],
            ["Privacy", "/policies/privacy"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="shrink-0 rounded-full px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-700"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}