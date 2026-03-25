import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import SectionCard from "@/components/SectionCard";

export default async function LotteryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const item = await prisma.lotteryItem.findUnique({
    where: { slug },
  });

  if (!item) return notFound();

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1.25fr,0.95fr]">
          <div className="overflow-hidden rounded-[32px] bg-white shadow-xl">
            <img src={item.imageUrl} alt={item.title} className="h-[460px] w-full object-cover" />
            <div className="p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">{item.status}</span>
                <span className="rounded-full bg-cyan-100 px-3 py-1 text-sm font-medium text-cyan-700">{item.totalParticipants} participants</span>
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">{item.title}</h1>
              <p className="mt-4 text-lg leading-8 text-slate-600">{item.description}</p>
            </div>
          </div>

          <div className="space-y-6">
            <SectionCard title="Lottery Details">
              <div className="space-y-3">
                <p><span className="font-semibold text-slate-900">Ticket Price:</span> Rs {item.ticketPrice}</p>
                <p><span className="font-semibold text-slate-900">Receiver Number:</span> {item.receiverPhone}</p>
                <p><span className="font-semibold text-slate-900">Draw Date:</span> {item.drawDate ? new Date(item.drawDate).toLocaleString() : "To be announced"}</p>
              </div>
            </SectionCard>

            <SectionCard title="How It Works">
              <ol className="list-decimal space-y-3 pl-5">
                <li>Complete the registration form.</li>
                <li>Use the payment QR and reference code.</li>
                <li>Upload your payment proof.</li>
                <li>Await admin approval and email confirmation.</li>
              </ol>
            </SectionCard>

            <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-cyan-600 p-6 text-white shadow-xl">
              <p className="text-sm uppercase tracking-wide text-white/80">Ready to join?</p>
              <h2 className="mt-2 text-2xl font-semibold">Reserve your entry now</h2>
              <p className="mt-3 text-white/85">A unique payment reference will be generated for your registration.</p>
              <Link href={`/register/${item.slug}`} className="mt-6 inline-flex rounded-full bg-white px-6 py-3 font-medium text-slate-900 hover:bg-slate-100">
                Participate Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}