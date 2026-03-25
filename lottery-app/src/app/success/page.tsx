import Link from "next/link";
import PageShell from "@/components/PageShell";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;

  return (
    <PageShell>
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="max-w-2xl rounded-[32px] bg-white p-10 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">✓</div>
          <h1 className="mt-6 text-3xl font-semibold text-slate-950">Submission received</h1>
          <p className="mt-4 text-lg text-slate-600">
            Your proof was uploaded successfully. Current review status: <span className="font-semibold text-slate-900">{status || "PENDING_REVIEW"}</span>
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/" className="rounded-full border border-slate-300 px-6 py-3 font-medium hover:bg-slate-50">Back Home</Link>
            <Link href="/admin" className="rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 px-6 py-3 font-medium text-white hover:opacity-95">Open Admin</Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}