import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";

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
      participant: true,
      lotteryItem: true,
    },
  });

  if (!entry) return notFound();

  const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=Pay%20Rs%20${entry.lotteryItem.ticketPrice}%20to%20${entry.lotteryItem.receiverPhone}%20Ref%20${entry.referenceCode}`;

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-xl">
        <div className="grid lg:grid-cols-[1.1fr,0.9fr]">
          <div className="p-8">
            <p className="text-sm uppercase tracking-wide text-cyan-600">Step 2 of 3</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">
              Complete your payment
            </h1>
            <p className="mt-3 text-slate-600">
              Use the QR code and keep your receipt for the final upload step.
            </p>

            <div className="mt-8 space-y-4 rounded-3xl bg-slate-50 p-6">
              <p>
                <span className="font-semibold text-slate-900">Participant:</span>{" "}
                {entry.participant.fullName}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Lottery Item:</span>{" "}
                {entry.lotteryItem.title}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Amount:</span> Rs{" "}
                {entry.lotteryItem.ticketPrice}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Receiver Number:</span>{" "}
                {entry.lotteryItem.receiverPhone}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Reference:</span>{" "}
                {ref || entry.referenceCode}
              </p>
            </div>

            <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
              Always include the generated reference code if your payment app supports
              notes or references.
            </div>

            <Link
              href={`/upload-proof/${entry.id}`}
              className="mt-8 inline-flex rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 px-6 py-3 font-medium text-white hover:opacity-95"
            >
              I Have Paid, Continue
            </Link>
          </div>

          <div className="flex items-center justify-center bg-gradient-to-br from-emerald-600 to-cyan-700 p-10">
            <div className="rounded-[28px] bg-white p-6 shadow-2xl">
              <img
                src={qrImage}
                alt="Payment QR"
                className="h-[280px] w-[280px] rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}