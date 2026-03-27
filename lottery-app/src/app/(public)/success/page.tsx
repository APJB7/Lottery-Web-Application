import Link from "next/link";
import PageShell from "@/components/PageShell";

function prettifyStatus(status?: string) {
  switch (status) {
    case "PENDING_PAYMENT":
      return "Pending Payment";
    case "PENDING_REVIEW":
      return "Pending Review";
    case "AUTO_VERIFIED":
      return "Auto Verified";
    case "APPROVED":
      return "Approved";
    case "REJECTED":
      return "Rejected";
    default:
      return status || "Pending Review";
  }
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  return (
    <PageShell>
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="max-w-2xl rounded-[32px] bg-white p-10 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
            ✓
          </div>

          <h1 className="mt-6 text-3xl font-semibold text-slate-950">
            Payment proof submitted
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            Your payment proof has been uploaded successfully.
          </p>

          <p className="mt-2 text-slate-600">
            Current status:{" "}
            <span className="font-semibold text-slate-900">
              {prettifyStatus(status)}
            </span>
          </p>

          <p className="mt-4 text-slate-600">
            Your registration becomes an official participant entry only after
            admin approval. You will receive an email once approved.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/lottery/iphone-15-pro-max"
              className="rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 px-6 py-3 font-medium text-white hover:opacity-95"
            >
              Back to Lottery
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}