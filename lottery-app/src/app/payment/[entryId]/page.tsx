import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

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
      participant: true,
    },
  });

  if (!entry) return notFound();

  const qrImage =
    "https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=Pay%20Rs%20500%20to%201234";

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Complete Payment</h1>
        <p className="mt-2 text-slate-600">
          Scan the QR code and make the payment before uploading your proof.
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p>
                <span className="font-semibold">Participant:</span>{" "}
                {entry.participant.fullName}
              </p>
              <p>
                <span className="font-semibold">Lottery Item:</span>{" "}
                {entry.lotteryItem.title}
              </p>
              <p>
                <span className="font-semibold">Amount:</span> Rs{" "}
                {entry.lotteryItem.ticketPrice}
              </p>
              <p>
                <span className="font-semibold">Receiver Number:</span>{" "}
                {entry.lotteryItem.receiverPhone}
              </p>
              <p>
                <span className="font-semibold">Reference Code:</span>{" "}
                {ref || entry.referenceCode}
              </p>
            </div>

            <div className="rounded-2xl bg-yellow-50 p-4 text-sm text-yellow-800">
              Important: if your payment app allows a reference or note, use the
              reference code shown above.
            </div>
          </div>

          <div className="flex items-center justify-center">
            <img
              src={qrImage}
              alt="Payment QR"
              className="rounded-2xl border border-slate-200 p-4"
            />
          </div>
        </div>

        <div className="mt-8">
          <Link
            href={`/upload-proof/${entry.id}`}
            className="inline-flex rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            I Have Paid, Upload Proof
          </Link>
        </div>
      </div>
    </main>
  );
}