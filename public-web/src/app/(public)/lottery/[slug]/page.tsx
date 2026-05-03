import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CreditCard,
  Hash,
  ShieldCheck,
  Ticket,
  Trophy,
  UploadCloud,
  UserRound,
  type LucideIcon,
} from "lucide-react";

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

  const isClosed = item.status === "CLOSED";
  const drawDate = item.drawDate
    ? new Date(item.drawDate).toLocaleString()
    : "To be announced";

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl pb-24 md:pb-0">
        <section className="overflow-hidden rounded-[36px] border border-cyan-100 bg-white/90 p-5 shadow-[0_24px_90px_rgba(6,182,212,0.10)] backdrop-blur-xl md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr,0.9fr]">
            <div>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide ${isClosed
                    ? "bg-slate-100 text-slate-600"
                    : "bg-cyan-50 text-cyan-700"
                    }`}
                >
                  {isClosed ? <Trophy size={15} /> : <ShieldCheck size={15} />}
                  {isClosed ? "Winner Drawn" : "Live Now"}
                </span>

                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-cyan-700">
                  <Ticket size={15} />
                  Rs {item.ticketPrice}
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-black leading-tight text-slate-950 md:text-5xl">
                {item.title}
              </h1>

              <p className="mt-3 text-base leading-7 text-slate-600 md:text-lg">
                {item.description}
              </p>

              {isClosed && item.winnerName && (
                <div className="mt-6 rounded-[26px] border border-cyan-100 bg-cyan-50 p-5 text-cyan-900">
                  <p className="flex items-center gap-2 text-sm font-black uppercase tracking-wide">
                    <Trophy size={18} />
                    Winner Announcement
                  </p>
                  <h2 className="mt-2 text-2xl font-black">
                    {item.winnerName}
                  </h2>
                  <p className="mt-1 text-sm">
                    This lottery has already been drawn.
                  </p>
                </div>
              )}

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <InfoCard
                  icon={Ticket}
                  label="Ticket Price"
                  value={`Rs ${item.ticketPrice}`}
                />
                <InfoCard
                  icon={CreditCard}
                  label="Receiver"
                  value={item.receiverPhone}
                />
                <InfoCard
                  icon={CalendarDays}
                  label="Draw Date"
                  value={drawDate}
                />
              </div>

              {!isClosed && (
                <div className="mt-6 rounded-[28px] border border-cyan-100 bg-cyan-50/70 p-5">
                  <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
                    Ready to join?
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-slate-950">
                    Review the steps and reserve your entry
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    A unique payment reference will be generated after
                    registration.
                  </p>

                  <Link
                    href={`/register/${item.slug}`}
                    className="mt-5 hidden w-fit items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-8 py-4 text-base font-black text-white shadow-xl shadow-cyan-500/25 transition hover:-translate-y-1 hover:scale-105 md:inline-flex"
                  >
                    Participate Now
                    <ArrowRight size={19} />
                  </Link>
                </div>
              )}
            </div>

            <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden rounded-[32px] bg-gradient-to-br from-cyan-50 via-white to-emerald-50 p-6 md:min-h-[420px]">
              <div className="absolute h-72 w-72 animate-soft-pulse rounded-full bg-cyan-300/25 blur-3xl" />
              <div className="absolute -bottom-20 -right-20 h-72 w-72 animate-float rounded-full bg-emerald-300/25 blur-3xl" />

              <img
                src={item.imageUrl}
                alt={item.title}
                className="relative z-10 max-h-[360px] max-w-full object-contain drop-shadow-2xl transition duration-500 hover:scale-105"
              />
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[36px] border border-cyan-100 bg-white/90 p-5 shadow-[0_18px_70px_rgba(6,182,212,0.08)] backdrop-blur-xl md:p-8">
          <div className="mb-5">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-700">
              Process
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950 md:text-3xl">
              How It Works
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Proof upload is required before your entry can be approved.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <StepCard number="1" icon={UserRound} title="Register" text="Fill in your details." />
            <StepCard number="2" icon={CreditCard} title="Pay" text="Use Juice or bank transfer." />
            <StepCard number="3" icon={Hash} title="Add Reference" text="Include your unique reference." />
            <StepCard number="4" icon={UploadCloud} title="Upload Proof" text="Upload your payment receipt." />
            <StepCard number="5" icon={ShieldCheck} title="Confirmation Email" text="After admin approval, you receive a confirmation email." />
            <StepCard number="6" icon={Trophy} title="Lottery Draw" text="The draw is completed and the winner is announced." />
          </div>

          <div className="mt-5 rounded-[22px] border border-cyan-100 bg-cyan-50 p-4 text-sm leading-6 text-cyan-900">
            Your information is used only for registration, payment
            verification, and lottery participation. Payments are final and
            non-refundable once submitted.
          </div>
        </section>

        <section className="mt-6 rounded-[30px] border border-cyan-100 bg-white/90 p-5 text-cyan-900 shadow-sm">
          <p className="flex items-center gap-2 font-black">
            <AlertTriangle size={20} />
            Important Notice
          </p>
          <p className="mt-2 text-sm leading-6">
            Your entry is not confirmed immediately after registration. It will
            remain pending until you upload payment proof and the admin approves
            it.
          </p>
        </section>

        {!isClosed && (
          <div className="fixed inset-x-0 bottom-0 z-50 border-t border-cyan-100 bg-white/95 p-4 shadow-[0_-10px_35px_rgba(15,23,42,0.12)] backdrop-blur md:hidden">
            <Link
              href={`/register/${item.slug}`}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-6 py-4 text-base font-black text-white shadow-lg shadow-cyan-500/30"
            >
              Participate Now
              <ArrowRight size={19} />
            </Link>
          </div>
        )}
      </div>
    </PageShell>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[22px] border border-cyan-100 bg-cyan-50/50 p-4">
      <div className="flex items-center gap-2 text-cyan-700">
        <Icon size={17} />
        <p className="text-xs font-bold uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-2 text-base font-black text-slate-950">{value}</p>
    </div>
  );
}

function StepCard({
  number,
  icon: Icon,
  title,
  text,
}: {
  number: string;
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[24px] border border-cyan-100 bg-cyan-50/40 p-4 text-center transition hover:-translate-y-1 hover:bg-white hover:shadow-lg">
      <p className="text-sm font-black text-cyan-700">{number}</p>

      <div className="mx-auto mt-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/20">
        <Icon size={24} strokeWidth={2.5} />
      </div>

      <h3 className="mt-3 font-black text-slate-950">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}