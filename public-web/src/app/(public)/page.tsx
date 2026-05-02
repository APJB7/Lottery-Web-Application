import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  Eye,
  ShieldCheck,
  Ticket,
  Trophy,
} from "lucide-react";

const cardThemes = [
  {
    imageBg: "from-emerald-50 via-cyan-50 to-white",
    accent: "from-emerald-500 to-cyan-500",
    badge: "text-emerald-700 bg-emerald-50",
  },
  {
    imageBg: "from-blue-50 via-indigo-50 to-white",
    accent: "from-blue-500 to-violet-500",
    badge: "text-blue-700 bg-blue-50",
  },
  {
    imageBg: "from-purple-50 via-pink-50 to-white",
    accent: "from-purple-500 to-pink-500",
    badge: "text-purple-700 bg-purple-50",
  },
  {
    imageBg: "from-teal-50 via-emerald-50 to-white",
    accent: "from-teal-500 to-emerald-500",
    badge: "text-teal-700 bg-teal-50",
  },
];

export default async function HomePage() {
  const items = await prisma.lotteryItem.findMany({
    where: {
      status: {
        in: ["OPEN", "CLOSED"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl">
        <section className="mb-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] md:p-7">
          <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-emerald-700">
            <ShieldCheck size={15} />
            Secure verified entries
          </p>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
            Choose your prize
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Select a lottery item, check the details, register, pay, and upload
            proof for admin verification.
          </p>
        </section>

        {items.length === 0 ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-black text-slate-950">
              No active lottery items yet
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Please check again soon for new prizes.
            </p>
          </div>
        ) : (
          <section
            id="lotteries"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2"
          >
            {items.map((item, index) => {
              const isClosed = item.status === "CLOSED";
              const theme = cardThemes[index % cardThemes.length];

              return (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(15,23,42,0.14)]"
                >
                  <div
                    className={`relative overflow-hidden bg-gradient-to-br ${theme.imageBg} p-5`}
                  >
                    <div className="absolute right-6 top-6 h-24 w-24 rounded-full bg-white/70 blur-2xl" />
                    <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-cyan-200/40 blur-3xl" />

                    <div className="relative flex h-[245px] items-center justify-center rounded-[28px] bg-white/75 p-5 shadow-inner">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="max-h-full max-w-full object-contain drop-shadow-2xl"
                      />
                    </div>

                    <div className="absolute left-7 top-7 flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black shadow-sm ${theme.badge}`}
                      >
                        <Ticket size={14} />
                        Rs {item.ticketPrice}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black shadow-sm ${
                          isClosed
                            ? "bg-rose-50 text-rose-700"
                            : "bg-white text-cyan-700"
                        }`}
                      >
                        {isClosed ? <Trophy size={14} /> : <Clock size={14} />}
                        {isClosed ? "Closed" : "Open"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 md:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-black leading-tight text-slate-950">
                          {item.title}
                        </h2>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-[24px] border border-slate-100 bg-slate-50 p-4">
                      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
                        <CalendarDays size={14} />
                        Draw Date
                      </p>
                      <p className="mt-1 text-sm font-black text-slate-900">
                        {item.drawDate
                          ? new Date(item.drawDate).toLocaleString()
                          : "To be announced"}
                      </p>
                    </div>

                    {isClosed && item.winnerName && (
                      <div className="mt-4 rounded-[24px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                        <p className="flex items-center gap-2 font-black">
                          <Trophy size={16} />
                          Winner
                        </p>
                        <p className="mt-1 font-semibold">
                          {item.winnerName}
                        </p>
                      </div>
                    )}

                    <div className="mt-5 grid gap-3">
                      <Link
                        href={`/lottery/${item.slug}`}
                        className={`flex w-full items-center justify-center gap-2 rounded-[20px] bg-gradient-to-r ${theme.accent} px-5 py-4 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-xl`}
                      >
                        {isClosed ? "View Result" : "View & Participate"}
                        <ArrowRight size={17} />
                      </Link>

                      <Link
                        href={`/lottery/${item.slug}`}
                        className="flex w-full items-center justify-center gap-2 rounded-[20px] border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                      >
                        <Eye size={16} />
                        View Details
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        <section className="mt-8 rounded-[28px] border border-cyan-100 bg-white p-5 text-sm leading-6 text-slate-700 shadow-sm">
          <p className="font-black text-slate-950">How it works</p>
          <p className="mt-1">
            Choose a prize, register, pay with the correct reference, upload
            your proof, and wait for approval.
          </p>

          <Link
            href="/how-it-works"
            className="mt-4 inline-flex font-black text-cyan-700 hover:text-cyan-900"
          >
            Learn more →
          </Link>
        </section>
      </div>
    </PageShell>
  );
}