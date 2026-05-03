import PageShell from "@/components/PageShell";
import {
  UserRound,
  CreditCard,
  Hash,
  UploadCloud,
  ShieldCheck,
  MailCheck,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export default function HowItWorksPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-5xl">
        <section className="rounded-[32px] border border-cyan-100 bg-white/90 p-6 shadow-[0_18px_60px_rgba(6,182,212,0.08)] backdrop-blur-xl md:p-8">
          <p className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-cyan-700">
            <ShieldCheck size={15} />
            How it works
          </p>

          <h1 className="mt-4 text-3xl font-black text-slate-950 md:text-4xl">
            Simple, secure, and verified.
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Follow these steps to participate, receive confirmation, and wait
            for the lottery draw.
          </p>
        </section>

        <section className="mt-6 rounded-[32px] border border-cyan-100 bg-white/90 p-5 shadow-[0_18px_60px_rgba(6,182,212,0.08)] md:p-7">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StepCard
              number="1"
              icon={UserRound}
              title="Register"
              text="Fill in your details and accept the data consent notice."
            />

            <StepCard
              number="2"
              icon={CreditCard}
              title="Pay"
              text="Use Juice or bank transfer to send the exact amount."
            />

            <StepCard
              number="3"
              icon={Hash}
              title="Add Reference"
              text="Include your generated reference in the payment description."
            />

            <StepCard
              number="4"
              icon={UploadCloud}
              title="Upload Proof"
              text="Upload your payment receipt as JPG, PNG, or PDF."
            />

            <StepCard
              number="5"
              icon={MailCheck}
              title="Confirmation Email"
              text="After admin approval, you receive a confirmation email."
            />

            <StepCard
              number="6"
              icon={Trophy}
              title="Lottery Draw"
              text="The winner is selected during the draw and announced clearly."
            />
          </div>

          <div className="mt-6 rounded-[24px] border border-cyan-100 bg-cyan-50 p-5 text-sm leading-6 text-cyan-900">
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
    <div className="rounded-[26px] border border-cyan-100 bg-cyan-50/40 p-5 text-center transition hover:-translate-y-1 hover:bg-white hover:shadow-lg">
      <p className="text-sm font-black uppercase tracking-wide text-cyan-700">
        {number}
      </p>

      <div className="mx-auto mt-4 flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-3 text-white shadow-lg shadow-cyan-500/20">
        <Icon size={25} strokeWidth={2.5} />
      </div>

      <h3 className="mt-4 font-black text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}