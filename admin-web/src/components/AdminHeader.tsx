import Link from "next/link";

export default function AdminHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            LuckyFlow Admin
          </h1>
          <p className="text-sm text-slate-500">
            Administrative review dashboard
          </p>
        </div>

        <nav className="flex items-center gap-2">
          <Link
            href="/admin"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}