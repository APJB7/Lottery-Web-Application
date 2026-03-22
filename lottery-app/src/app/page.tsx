import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-xl rounded-2xl bg-white p-10 text-center shadow-md">
        <h1 className="text-4xl font-bold">Lottery Registration App</h1>
        <p className="mt-4 text-slate-600">
          Open the sample lottery and test the full registration flow.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/lottery/iphone-15-pro-max"
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            View Lottery
          </Link>

          <Link
            href="/admin"
            className="rounded-xl border border-slate-300 px-6 py-3 font-medium hover:bg-slate-100"
          >
            Admin Review
          </Link>
        </div>
      </div>
    </main>
  );
}