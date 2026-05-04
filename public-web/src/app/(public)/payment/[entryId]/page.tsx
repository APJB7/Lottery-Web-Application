import { prisma } from "@/lib/prisma";

import Link from "next/link";

import { notFound } from "next/navigation";

import PageShell from "@/components/PageShell";

import CopyButton from "@/components/CopyButton";
import ProgressSteps from "@/components/ProgressSteps";

import {

  ArrowRight,

  Banknote,

  CheckCircle2,

  Hash,

  Smartphone,

} from "lucide-react";

import type { ElementType } from "react";

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
      <div className="mx-auto max-w-md px-4 pb-24 md:px-6">
        <ProgressSteps currentStep={2} />
        <section className="rounded-[28px] border border-cyan-100 bg-white p-5 shadow-[0_18px_55px_rgba(6,182,212,0.10)]">
          <div className="rounded-[28px] border border-cyan-100 bg-white p-5 shadow-[0_18px_55px_rgba(6,182,212,0.10)]">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-slate-950">
                Complete payment
              </h1>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Send exactly{" "}
              <span className="font-medium text-slate-900">
                Rs {entry.lotteryItem.ticketPrice}
              </span>{" "}
              and include your reference in the payment description.
            </p>
          </div>
        </section>

        <section className="mt-4 rounded-[28px] border border-cyan-200 bg-cyan-50 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-600 text-white">
              <Hash size={22} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                Required reference
              </p>
              <p className="text-sm text-cyan-900">
                Add this in the payment description/note.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-white p-4">
            <p className="break-all text-2xl font-semibold tracking-wide text-cyan-700">
              {referenceCode}
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Without this reference, your payment may not be matched to your
              entry.
            </p>

            <div className="mt-3">
              <CopyButton value={referenceCode} />
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-3">
          <PaymentOption
            icon={Smartphone}
            title="Juice number"
            value={JUICE_PHONE_NUMBER}
          />

          <PaymentOption
            icon={Banknote}
            title="Bank account"
            value={BANK_ACCOUNT_NUMBER}
          />
        </section>

        <section className="mt-4 rounded-[24px] border border-cyan-100 bg-white p-4">
          <p className="text-sm font-semibold text-slate-950">
            Quick checklist
          </p>

          <div className="mt-3 space-y-2">
            <ChecklistItem text={`Send exactly Rs ${entry.lotteryItem.ticketPrice}.`} />
            <ChecklistItem text="Paste the reference in the payment description." />
            <ChecklistItem text="Save or screenshot your receipt." />
          </div>
        </section>

        <Link
          href={`/upload-proof/${entry.id}`}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:-translate-y-1 hover:scale-[1.01]"
        >
          I have paid, upload proof
          <ArrowRight size={18} />
        </Link>

        <p className="mt-3 text-center text-xs leading-5 text-slate-500">
          Payments are final and non-refundable once submitted.
        </p>
      </div>
    </PageShell>
  );
}

function PaymentOption({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
          <Icon size={21} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs text-slate-500">{title}</p>
          <p className="break-all text-lg font-semibold text-slate-950">
            {value}
          </p>

          <div className="mt-2">
            <CopyButton value={value} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChecklistItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 text-sm leading-6 text-slate-600">
      <CheckCircle2 size={17} className="mt-1 shrink-0 text-cyan-600" />
      <p>{text}</p>
    </div>
  );
}