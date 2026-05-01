import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  ShieldCheck,
  Ticket,
  Trophy,
} from "lucide-react";

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
        <section className="mb-7 rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-sm md:p-7">
          <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-emerald-700">
            <ShieldCheck size={15} />
            Secure verified entries
          </p>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
            Choose your prize
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Select a lottery item, view the details, register, pay, and upload
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
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((item) => {
              const isClosed = item.status === "CLOSED";

              return (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_14px_45px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_22px_65px_rgba(15,23,42,0.10)]"
                >
                  <div className="relative bg-slate-50 p-4">
                    <div className="flex h-[230px] items-center justify-center rounded-[24px] bg-white">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="absolute left-6 top-6 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-black text-emerald-700 shadow-sm">
                        <Ticket size={14} />
                        Rs {item.ticketPrice}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black shadow-sm ${
                          isClosed
                            ? "bg-rose-50 text-rose-700"
                            : "bg-cyan-50 text-cyan-700"
                        }`}
                      >
                        {isClosed ? <Trophy size={14} /> : <Clock size={14} />}
                        {isClosed ? "Closed" : "Open"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h2 className="text-xl font-black leading-tight text-slate-950">
                      {item.title}
                    </h2>

                    <p className="mt-2 line-clamp-2 min-h-[48px] text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>

                    <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
                        <CalendarDays size={14} />
                        Draw Date
                      </p>
                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {item.drawDate
                          ? new Date(item.drawDate).toLocaleString()
                          : "To be announced"}
                      </p>
                    </div>

                    {isClosed && item.winnerName && (
                      <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
                        <p className="flex items-center gap-2 font-black">
                          <Trophy size={16} />
                          Winner
                        </p>
                        <p className="mt-1 font-semibold">
                          {item.winnerName}
                        </p>
                      </div>
                    )}

                    <Link
                      href={`/lottery/${item.slug}`}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                    >
                      {isClosed ? "View Result" : "View & Participate"}
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        <section className="mt-8 rounded-[26px] border border-cyan-100 bg-white p-5 text-sm leading-6 text-slate-700 shadow-sm">
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