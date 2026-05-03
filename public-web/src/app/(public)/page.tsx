import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import {
  ArrowRight,
  CalendarDays,
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
        <section className="mb-6 rounded-[30px] border border-cyan-100 bg-white/90 p-5 shadow-[0_18px_60px_rgba(6,182,212,0.08)] md:p-7">
          <p className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-cyan-700">
            <ShieldCheck size={15} />
            Secure verified entries
          </p>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
            Choose your prize
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Select a lottery item, register, pay with the correct reference, and
            upload proof for verification.
          </p>
        </section>

        {items.length === 0 ? (
          <div className="rounded-[30px] border border-cyan-100 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-black text-slate-950">
              No active lottery items yet
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Please check again soon for new prizes.
            </p>
          </div>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2">
            {items.map((item) => {
              const isClosed = item.status === "CLOSED";

              return (
                <Link
                  key={item.id}
                  href={`/lottery/${item.slug}`}
                  className="group block overflow-hidden rounded-[36px] border border-cyan-100 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_85px_rgba(6,182,212,0.18)]"
                >
                  <div className="relative bg-white p-5">
                    <div className="flex h-[245px] items-center justify-center p-4">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="absolute left-7 top-7 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-cyan-700 shadow-sm ring-1 ring-cyan-100">
                        <Ticket size={14} />
                        Rs {item.ticketPrice}
                      </span>

                      {isClosed && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 shadow-sm ring-1 ring-cyan-100">
                          <Trophy size={14} />
                          Closed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-cyan-50 p-5 md:p-6">
                    <h2 className="text-2xl font-black leading-tight text-slate-950">
                      {item.title}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>

                    <div className="mt-5 rounded-[24px] border border-cyan-50 bg-cyan-50/60 p-4">
                      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-cyan-700/70">
                        <CalendarDays size={14} />
                        Draw Date
                      </p>
                      <p className="mt-1 text-sm font-black text-slate-900">
                        {item.drawDate
                          ? new Date(item.drawDate).toLocaleString()
                          : "To be announced"}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-center gap-2 rounded-[22px] bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-5 py-4 text-sm font-black text-white shadow-lg shadow-cyan-500/20 transition group-hover:scale-[1.02] group-hover:shadow-xl">
                      {isClosed ? "View Result" : "View & Participate"}
                      <ArrowRight
                        size={17}
                        className="transition group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </section>
        )}
      </div>
    </PageShell>
  );
}