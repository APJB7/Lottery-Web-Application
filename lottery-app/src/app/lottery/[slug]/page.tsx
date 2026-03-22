import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function LotteryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const item = await prisma.lotteryItem.findUnique({
    where: { slug },
  });

  if (!item) return notFound();

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-2">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-[450px] w-full rounded-2xl object-cover shadow-md"
          />

          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Live Lottery
            </p>

            <h1 className="mt-2 text-4xl font-bold">{item.title}</h1>

            <p className="mt-4 text-slate-600">{item.description}</p>

            <div className="mt-6 rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="space-y-3">
                <p>
                  <span className="font-semibold">Ticket Price:</span> Rs{" "}
                  {item.ticketPrice}
                </p>
                <p>
                  <span className="font-semibold">Participants:</span>{" "}
                  {item.totalParticipants}
                </p>
                <p>
                  <span className="font-semibold">How it works:</span> Fill the
                  registration form, pay using the QR code, then upload your
                  proof of payment.
                </p>
              </div>
            </div>

            <Link
              href={`/register/${item.slug}`}
              className="mt-6 inline-flex w-fit rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Participate Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}