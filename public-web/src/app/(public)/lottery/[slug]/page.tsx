import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import {
  ArrowRight,
  CalendarDays,
  CreditCard,
  Gift,
  Hash,
  MailCheck,
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
    ? new Date(item.drawDate).toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "To be announced";

  return (
    <PageShell>
      <div className="mx-auto max-w-md px-4 pb-24 md:max-w-4xl md:px-6 md:pb-0">
        <section className="overflow-hidden rounded-[34px] border border-teal-100 bg-white shadow-[0_24px_80px_rgba(15,118,110,0.10)]">
          <div className="relative p-4">
            <div className="relative flex h-[330px] items-center justify-center overflow-hidden rounded-[30px] bg-gradient-to-br from-teal-50 via-white to-cyan-50 md:h-[430px]">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-full w-full object-contain"
              />

              <div className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-teal-700 shadow-md">
                {isClosed ? "Winner drawn" : "Live now"}
              </div>

              <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-teal-700 shadow-md">
                <Ticket size={16} />
                Rs {item.ticketPrice}
              </div>
            </div>
          </div>

          <div className="px-5 pb-5 md:px-7 md:pb-7">
            <h1 className="text-3xl font-semibold leading-tight text-teal-950 md:text-4xl">
              {item.title}
            </h1>

            <p className="mt-2 text-base leading-7 text-slate-500">
              {item.description}
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2 rounded-[26px] border border-teal-100 bg-white p-3 shadow-sm">
              <InfoMini icon={Ticket} label="Ticket Price" value={`Rs ${item.ticketPrice}`} />
              <InfoMini icon={UserRound} label="Receiver" value={item.receiverPhone} />
              <InfoMini icon={CalendarDays} label="Draw Date" value={drawDate} />
            </div>

            {isClosed && item.winnerName && (
              <div className="mt-5 rounded-[26px] border border-teal-100 bg-teal-50 p-4 text-teal-800">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Trophy size={18} />
                  Winner Announcement
                </p>
                <p className="mt-1 text-xl font-semibold">{item.winnerName}</p>
              </div>
            )}

            {!isClosed && (
              <div className="mt-5 rounded-[28px] border border-teal-100 bg-gradient-to-br from-teal-50 to-cyan-50 p-5">
                <p className="flex items-center gap-2 text-sm font-semibold text-teal-700">
                  <Gift size={18} />
                  Ready to join?
                </p>

                <h2 className="mt-2 text-xl font-semibold leading-tight text-teal-950">
                  Review the steps and reserve your entry
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  A unique payment reference will be generated after
                  registration.
                </p>

                <Link
                  href={`/register/${item.slug}`}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-6 py-4 text-base font-semibold text-white shadow-xl shadow-teal-500/20 transition hover:scale-[1.02]"
                >
                  Participate Now
                  <ArrowRight size={20} />
                </Link>
              </div>
            )}
          </div>
        </section>

        <section className="mt-5 rounded-[30px] border border-teal-100 bg-white p-5 shadow-[0_18px_55px_rgba(15,118,110,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">
            Process
          </p>

          <h2 className="mt-1 text-xl font-semibold text-teal-950">
            How It Works
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Proof upload is required before your entry can be approved.
          </p>

          <div className="mt-5 flex items-start justify-between gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <MiniStep icon={UserRound} number="1" title="Register" text="Fill details." />
            <Dash />
            <MiniStep icon={CreditCard} number="2" title="Pay" text="Use bank transfer." />
            <Dash />
            <MiniStep icon={Hash} number="3" title="Reference" text="Include ref." />
            <Dash />
            <MiniStep icon={UploadCloud} number="4" title="Upload" text="Upload receipt." />
            <Dash />
            <MiniStep icon={MailCheck} number="5" title="Email" text="Get confirmation." />
            <Dash />
            <MiniStep icon={Trophy} number="6" title="Draw" text="Winner announced." />
          </div>
        </section>
                  <div className="mt-4 flex justify-center gap-2 md:hidden">
            {[1, 2, 3].map((dot) => (
              <span
                key={dot}
                className={`h-2 rounded-full ${
                  dot === 1 ? "w-6 bg-teal-500" : "w-2 bg-teal-100"
                }`}
              />
            ))}
          </div>

        <section className="mt-5 flex items-center gap-3 rounded-[26px] border border-teal-100 bg-teal-50 p-4 text-sm leading-6 text-teal-800">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-teal-700">
            <ShieldCheck size={22} />
          </div>
          <p>
            Your information is used only for registration, payment
            verification, and lottery participation.
          </p>
        </section>
      </div>
    </PageShell>
  );
}

function InfoMini({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-teal-50 text-teal-700">
        <Icon size={20} />
      </div>
      <p className="mt-2 text-xs font-medium text-teal-700">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold leading-5 text-teal-950">
        {value}
      </p>
    </div>
  );
}

function MiniStep({
  icon: Icon,
  number,
  title,
  text,
}: {
  icon: LucideIcon;
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="min-w-[58px] flex-1 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-teal-50 text-teal-700 ring-1 ring-teal-100">
        <Icon size={20} />
      </div>

      <p className="mt-2 text-xs font-semibold text-teal-700">{number}</p>
      <p className="mt-1 text-xs font-semibold leading-4 text-teal-950">
        {title}
      </p>
      <p className="mt-1 text-[11px] leading-4 text-slate-500">{text}</p>
    </div>
  );
}

function Dash() {
  return <div className="mt-5 h-px w-4 shrink-0 border-t border-dashed border-teal-200" />;
}