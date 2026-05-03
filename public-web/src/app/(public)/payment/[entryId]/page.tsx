import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import CopyButton from "@/components/CopyButton";
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  CreditCard,
  Hash,
  ShieldCheck,
  Smartphone,
  UserRound,
} from "lucide-react";

const BANK_ACCOUNT_NUMBER = "000441860540";
const JUICE_PHONE_NUMBER = "59494264";

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
    include: { lotteryItem: true },
  });

  if (!entry) return notFound();

  const referenceCode = ref || entry.referenceCode;

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl pb-24">
        <section className="overflow-hidden rounded-[34px] border border-cyan-100 bg-white shadow-xl">
          <div className="bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500 p-6 text-white md:p-8">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-white/75">
              Step 2 of 3
            </p>
            <h1 className="mt-3 text-3xl font-black md:text-5xl">
              Complete your payment
            </h1>
            <p className="mt-3 max-w-2xl text-white/85">
              Use Juice or bank transfer. Please add your reference code in the
              payment description so your entry can be verified.
            </p>
          </div>

          <div className="grid gap-6 p-5 md:p-8 lg:grid-cols-[1fr,0.9fr]">
            <div className="space-y-5">
              <div className="rounded-[28px] border-2 border-cyan-200 bg-cyan-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-600 text-white">
                    <AlertTriangle size={25} />
                  </div>

                  <div>
                    <p className="text-sm font-black uppercase tracking-wide text-cyan-700">
                      Very important
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-slate-950">
                      Add this reference in your payment description
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Without this reference, your payment may be difficult to
                      match with your entry.
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-3xl bg-white p-4 shadow-sm">
                  <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
                    <Hash size={16} />
                    Payment Reference
                  </p>

                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="break-all text-2xl font-black tracking-wide text-cyan-700 md:text-3xl">
                      {referenceCode}
                    </p>
                    <CopyButton value={referenceCode} />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <PaymentCard
                  icon={Smartphone}
                  title="Pay by Juice"
                  label="Juice Phone Number"
                  value={JUICE_PHONE_NUMBER}
                />

                <PaymentCard
                  icon={Banknote}
                  title="Pay by Bank Transfer"
                  label="Bank Account Number"
                  value={BANK_ACCOUNT_NUMBER}
                />
              </div>

              <div className="rounded-[26px] border border-cyan-100 bg-cyan-50/50 p-5">
                <p className="text-sm font-black uppercase tracking-wide text-cyan-700">
                  Entry Summary
                </p>

                <div className="mt-4 grid gap-3 text-sm text-slate-700">
                  <SummaryLine
                    icon={UserRound}
                    label="Applicant"
                    value={entry.applicantFullName}
                  />
                  <SummaryLine
                    icon={CreditCard}
                    label="Lottery Item"
                    value={entry.lotteryItem.title}
                  />
                  <SummaryLine
                    icon={Banknote}
                    label="Amount"
                    value={`Rs ${entry.lotteryItem.ticketPrice}`}
                  />
                  <SummaryLine
                    icon={Hash}
                    label="Reference"
                    value={referenceCode}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-cyan-100 bg-cyan-50 p-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-600 text-white">
                <ShieldCheck size={30} />
              </div>

              <h2 className="mt-5 text-2xl font-black text-slate-950">
                Payment checklist
              </h2>

              <div className="mt-5 space-y-4">
                <CheckItem
                  text={`Transfer exactly Rs ${entry.lotteryItem.ticketPrice}.`}
                />
                <CheckItem text="Use either Juice or bank transfer." />
                <CheckItem text="Paste the reference code in the payment description/note." />
                <CheckItem text="Take a screenshot or save the payment receipt." />
                <CheckItem text="Upload the proof on the next page." />
              </div>

              <div className="mt-6 rounded-2xl border border-cyan-200 bg-white p-4 text-sm leading-6 text-cyan-900">
                Payments are final and non-refundable once submitted.
              </div>

              <Link
                href={`/upload-proof/${entry.id}`}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-6 py-4 text-base font-black text-white shadow-lg shadow-cyan-500/30 transition hover:-translate-y-1 hover:scale-[1.02]"
              >
                I Have Paid, Continue
                <ArrowRight size={19} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

function PaymentCard({
  icon: Icon,
  title,
  label,
  value,
}: {
  icon: React.ElementType;
  title: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[26px] border border-cyan-100 bg-white p-5 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white">
        <Icon size={25} />
      </div>

      <h3 className="mt-4 text-lg font-black text-slate-950">{title}</h3>
      <p className="mt-3 text-xs font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <div className="mt-2 flex flex-col gap-3">
        <p className="break-all text-2xl font-black text-slate-950">{value}</p>
        <CopyButton value={value} />
      </div>
    </div>
  );
}

function SummaryLine({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
      <Icon size={18} className="shrink-0 text-cyan-600" />
      <p>
        <span className="font-black text-slate-950">{label}:</span>{" "}
        <span>{value}</span>
      </p>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-slate-700">
      <ShieldCheck size={18} className="mt-0.5 shrink-0 text-cyan-600" />
      <p className="font-semibold">{text}</p>
    </div>
  );
}