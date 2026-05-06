import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  CreditCard,
  Hand,
  ShieldCheck,
  Sparkles,
  Ticket,
  Trophy,
  UploadCloud,
  UserRound,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
      <div className="mx-auto max-w-6xl px-5">
        <section className="pt-4">

          <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-tight text-slate-800 md:text-5xl">
            Choose your prize
          </h1>

          <p className="mt-3 max-w-xl text-base leading-7 text-slate-500">
            Swipe through prizes, choose one, register, pay using your unique
            reference, then upload proof for verification.
          </p>
        </section>
      </div>

      {items.length === 0 ? (
        <div className="mx-5 mt-8 rounded-[32px] border border-teal-100 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">
            No active lottery items yet
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Please check again soon for new prizes.
          </p>
        </div>
      ) : (
        <section className="mt-8">
          <div className="mx-5 mb-3 flex items-center justify-between lg:mx-auto lg:max-w-6xl">
            <p className="text-sm font-semibold text-slate-600">
              Available prizes
            </p>

            <div className="flex animate-pulse items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 md:hidden">
              <Hand size={14} />
              Swipe cards
              <ChevronRight size={14} />
            </div>
          </div>

          <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-[calc((100vw-82%)/2)] pb-6 [-ms-overflow-style:none] [scroll-padding-inline:calc((100vw-82%)/2)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:px-5 lg:mx-auto lg:max-w-6xl">
            {items.map((item) => {
              const isClosed = item.status === "CLOSED";

              return (
                <Link
                  key={item.id}
                  href={`/lottery/${item.slug}`}
                  className="group flex min-h-[540px] min-w-[82vw] snap-center flex-col overflow-hidden rounded-[34px] border border-teal-100 bg-white shadow-[0_24px_80px_rgba(15,118,110,0.12)] transition duration-300 hover:-translate-y-1 md:min-w-0"
                >
                  <div className="px-5 pt-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1.5 text-sm font-semibold text-teal-700 ring-1 ring-teal-100">
                        <Ticket size={15} />
                        Rs {item.ticketPrice}
                      </span>

                      {isClosed && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-500">
                          <Trophy size={15} />
                          Closed
                        </span>
                      )}
                    </div>

                    <div className="relative flex h-[245px] items-center justify-center overflow-hidden rounded-[30px] bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-6">
                      <div className="absolute bottom-0 h-20 w-40 rounded-t-full bg-white/70 blur-sm" />

                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="relative z-10 max-h-full max-w-full object-contain transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="line-clamp-2 min-h-[58px] text-2xl font-semibold leading-tight text-slate-800">
                      {item.title}
                    </h2>

                    <p className="mt-2 line-clamp-2 min-h-[52px] text-base leading-7 text-slate-500">
                      {item.description}
                    </p>

                    <div className="mt-5 rounded-[24px] border border-teal-100 bg-teal-50/60 p-4">
                      <p className="flex items-center gap-2 text-sm font-semibold text-teal-700">
                        <CalendarDays size={18} />
                        Draw Date
                      </p>

                      <p className="mt-1 text-base font-medium text-slate-700">
                        {item.drawDate
                          ? new Date(item.drawDate).toLocaleString([], {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "To be announced"}
                      </p>
                    </div>

                    {isClosed && item.winnerName && (
                      <div className="mt-4 rounded-[24px] border border-teal-100 bg-teal-50 p-4 text-sm text-teal-800">
                        <p className="font-semibold">Winner</p>
                        <p>{item.winnerName}</p>
                      </div>
                    )}

                    <div className="mt-auto pt-6">
                      <div className="flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-6 py-4 text-base font-semibold text-white shadow-xl shadow-teal-500/20 transition group-hover:scale-[1.02]">
                        {isClosed ? "View Result" : "View & Participate"}
                        <ArrowRight
                          size={20}
                          className="transition group-hover:translate-x-1"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-1 flex justify-center gap-2 md:hidden">
            {items.slice(0, 6).map((item, index) => (
              <span
                key={item.id}
                className={`h-2 rounded-full ${
                  index === 0 ? "w-6 bg-teal-500" : "w-2 bg-teal-100"
                }`}
              />
            ))}
          </div>
        </section>
      )}

      <section className="mx-5 mt-7 rounded-[30px] border border-teal-100 bg-white/95 p-5 shadow-[0_18px_55px_rgba(15,118,110,0.08)] lg:mx-auto lg:max-w-6xl">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-teal-700">
          <Sparkles size={18} />
          How it works
        </p>

        <div className="mt-5 grid gap-3">
          <HowStep
            number="1"
            icon={UserRound}
            title="Register your details"
            text="Choose a prize and fill in the registration form."
          />

          <HowStep
            number="2"
            icon={CreditCard}
            title="Pay with your reference"
            text="Send the exact amount and add your generated reference in the payment description."
          />

          <HowStep
            number="3"
            icon={UploadCloud}
            title="Upload proof"
            text="Upload your receipt so the admin can verify your payment."
          />

          <HowStep
            number="4"
            icon={ShieldCheck}
            title="Get verified"
            text="Once approved, your entry is confirmed for the lottery draw."
          />
        </div>
      </section>

      <section className="mx-5 mt-5 rounded-[24px] border border-teal-100 bg-teal-50 px-5 py-4 text-sm leading-6 text-teal-800 lg:mx-auto lg:max-w-6xl">
        
        Your data is used only for registration, payment verification, and
        lottery participation.
        
      </section>
    </PageShell>
  );
}

function HowStep({
  number,
  icon: Icon,
  title,
  text,
}: {
  number: string;
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4 rounded-[22px] border border-teal-100 bg-teal-50/50 p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm ring-1 ring-teal-100">
        <Icon size={21} />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
          Step {number}
        </p>
        <h3 className="mt-1 font-semibold text-slate-800">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
      </div>
    </div>
  );
}