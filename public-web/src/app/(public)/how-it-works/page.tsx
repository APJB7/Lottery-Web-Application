import PageShell from "@/components/PageShell";
import {
  UserRound,
  CreditCard,
  Hash,
  UploadCloud,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export default function HowItWorksPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-6xl">
        <section className="rounded-[40px] bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 px-8 py-12 text-white shadow-2xl">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-white/75">
            How It Works
          </p>
          <h1 className="mt-4 text-4xl font-black md:text-5xl">
            Simple, secure, and verified.
          </h1>
          <p className="mt-4 max-w-2xl text-white/85">
            Follow these steps to participate safely and receive confirmation
            once your payment proof has been reviewed.
          </p>
        </section>

        <section className="mt-8 rounded-[36px] border border-slate-200 bg-white p-8 shadow-xl">
          <div className="grid gap-5 md:grid-cols-5">
            <StepCard
              number="1"
              icon={UserRound}
              title="Register"
              text="Fill in your details."
            />

            <StepCard
              number="2"
              icon={CreditCard}
              title="Pay"
              text="Use Juice or bank transfer."
            />

            <StepCard
              number="3"
              icon={Hash}
              title="Add Reference"
              text="Include your unique reference."
            />

            <StepCard
              number="4"
              icon={UploadCloud}
              title="Upload Proof"
              text="Upload your payment receipt."
            />

            <StepCard
              number="5"
              icon={ShieldCheck}
              title="Confirmation"
              text="Admin verifies your entry."
            />
          </div>

          <div className="mt-8 rounded-[24px] border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
            Your information is used only for registration, payment
            verification, and lottery participation. Payments are final and
            non-refundable once submitted.
          </div>
        </section>
      </div>
    </PageShell>
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
    <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 text-center transition hover:-translate-y-1 hover:bg-white hover:shadow-xl">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-black text-emerald-700">
        {number}
      </div>

      <div className="mx-auto mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/20">
        <Icon size={28} strokeWidth={2.5} />
      </div>

      <h3 className="mt-4 font-black text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}