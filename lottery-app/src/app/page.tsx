import Link from "next/link";
import PageShell from "@/components/PageShell";
import StatCard from "@/components/StatCard";

export default function HomePage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white shadow-2xl">
        <div className="grid gap-10 px-8 py-14 md:grid-cols-2 md:px-14">
          <div className="flex flex-col justify-center">
            <span className="w-fit rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90">
              Lottery Registration Platform
            </span>

            <h1 className="mt-6 text-5xl font-semibold leading-tight tracking-tight">
              Register participants, guide payments, and review entries with confidence.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-white/85">
              A premium lottery workflow for registration, QR payment guidance,
              proof upload, and admin verification.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/lottery/iphone-15-pro-max"
                className="rounded-full bg-white px-6 py-3 font-medium text-slate-900 shadow-lg hover:bg-slate-100"
              >
                View Live Lottery
              </Link>

              <Link
                href="/admin"
                className="rounded-full border border-white/30 px-6 py-3 font-medium text-white hover:bg-white/10"
              >
                Open Admin Dashboard
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <StatCard label="Step 1" value="Register" />
            <StatCard label="Step 2" value="Pay" />
            <StatCard label="Step 3" value="Upload Proof" />
            <StatCard label="Step 4" value="Review" />
          </div>
        </div>
      </section>
    </PageShell>
  );
}