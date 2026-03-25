import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">
          Lucky<span className="text-cyan-600">Flow</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50"
          >
            Home
          </Link>
          <Link
            href="/lottery/iphone-15-pro-max"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-cyan-50"
          >
            Lottery
          </Link>
          <Link
            href="/admin"
            className="rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-sm font-medium text-white shadow-md hover:opacity-95"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}