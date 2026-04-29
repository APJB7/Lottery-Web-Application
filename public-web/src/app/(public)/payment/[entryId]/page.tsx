import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";

const BANK_ACCOUNT_NUMBER = "000441860540";
const JUICE_PHONE_NUMBER = "59494264";

export default async function PaymentPage({
  params,
  searchParams,
}: {
  params: Promise<{ entryId: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { entryId } = await params;
  const { ref } = await searchParams;

  const entry = await prisma.entry.findUnique({
    where: { id: entryId },
    include: {
      lotteryItem: true,
    },
  });

  if (!entry) return notFound();

  const referenceCode = ref || entry.referenceCode;

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-xl">
        <div className="grid lg:grid-cols-[1.1fr,0.9fr]">
          <div className="p-8">
            <p className="text-sm uppercase tracking-wide text-cyan-600">
              Step 2 of 3
            </p>

            <h1 className="mt-2 text-3xl font-semibold text-slate-950">
              Complete your payment
            </h1>

            <p className="mt-3 text-slate-600">
              Please pay using either Juice or bank transfer. Include your
              reference number in the payment description.
            </p>

            <div className="mt-6 rounded-3xl border border-cyan-200 bg-cyan-50 p-6">
              <p className="text-sm font-medium uppercase tracking-wide text-cyan-700">
                Important payment instruction
              </p>

              <p className="mt-3 text-lg text-slate-800">
                Your reference number is:
              </p>

              <p className="mt-2 rounded-2xl bg-white px-4 py-3 text-2xl font-bold tracking-wide text-cyan-700 shadow-sm">
                {referenceCode}
              </p>

              <p className="mt-4 text-sm text-slate-700">
                Please copy this reference number and include it in the{" "}
                <span className="font-semibold">payment description / note</span>{" "}
                when making the payment.
              </p>
            </div>

            <div className="mt-8 space-y-4 rounded-3xl bg-slate-50 p-6">
              <p>
                <span className="font-semibold text-slate-900">Applicant:</span>{" "}
                {entry.applicantFullName}
              </p>

              <p>
                <span className="font-semibold text-slate-900">
                  Lottery Item:
                </span>{" "}
                {entry.lotteryItem.title}
              </p>

              <p>
                <span className="font-semibold text-slate-900">Amount:</span> Rs{" "}
                {entry.lotteryItem.ticketPrice}
              </p>

              <p>
                <span className="font-semibold text-slate-900">
                  Bank Account Number:
                </span>{" "}
                {BANK_ACCOUNT_NUMBER}
              </p>

              <p>
                <span className="font-semibold text-slate-900">
                  Juice Phone Number:
                </span>{" "}
                {JUICE_PHONE_NUMBER}
              </p>

              <p>
                <span className="font-semibold text-slate-900">
                  Payment Reference:
                </span>{" "}
                {referenceCode}
              </p>
            </div>

            <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
              After completing the payment, upload your proof of payment so the
              admin can verify it.
            </div>

            <Link
              href={`/upload-proof/${entry.id}`}
              className="mt-8 inline-flex rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 px-6 py-3 font-medium text-white hover:opacity-95"
            >
              I Have Paid, Continue
            </Link>
          </div>

          <div className="flex items-center justify-center bg-gradient-to-br from-emerald-600 to-cyan-700 p-10">
            <div className="w-full rounded-[28px] bg-white p-8 shadow-2xl">
              <p className="text-sm uppercase tracking-wide text-cyan-600">
                Payment Options
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                Choose your payment method
              </h2>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-medium text-slate-500">
                  Bank Account Number
                </p>
                <p className="mt-2 break-all text-3xl font-black tracking-wide text-slate-950">
                  {BANK_ACCOUNT_NUMBER}
                </p>
              </div>

              <div className="mt-5 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
                <p className="text-sm font-medium text-emerald-700">
                  Juice Phone Number
                </p>
                <p className="mt-2 break-all text-3xl font-black tracking-wide text-emerald-700">
                  {JUICE_PHONE_NUMBER}
                </p>
              </div>

              <div className="mt-5 rounded-3xl border border-cyan-200 bg-cyan-50 p-6">
                <p className="text-sm font-medium text-cyan-700">
                  Reference to include
                </p>
                <p className="mt-2 break-all text-2xl font-bold tracking-wide text-cyan-700">
                  {referenceCode}
                </p>
              </div>

              <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
                Transfer exactly{" "}
                <span className="font-bold">
                  Rs {entry.lotteryItem.ticketPrice}
                </span>{" "}
                using either Juice or bank transfer, then upload your receipt.
                <br />
                <span className="mt-2 inline-block font-semibold">
                  Please note that all payments are final and non-refundable once submitted.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}