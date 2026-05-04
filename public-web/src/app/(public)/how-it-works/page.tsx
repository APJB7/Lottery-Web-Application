import PageShell from "@/components/PageShell";
import {
  CreditCard,
  Hash,
  MailCheck,
  ShieldCheck,
  Trophy,
  UploadCloud,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export default function HowItWorksPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-md px-4 md:max-w-3xl">
        <section className="rounded-[28px] border border-teal-100 bg-white p-5 shadow-sm">
          <p className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal-700">
            <ShieldCheck size={14} />
            How it works
          </p>

          <h1 className="mt-4 text-2xl font-semibold text-slate-800">
            Simple, secure, and verified
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Follow these steps to participate and receive confirmation.
          </p>
        </section>

        <section className="mt-5 grid gap-3">
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
        </section>

        <section className="mt-5 rounded-[24px] border border-teal-100 bg-teal-50 p-4 text-sm leading-6 text-teal-800">
          Your information is used only for registration, payment verification,
          and lottery participation.
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
    <div className="flex gap-4 rounded-[24px] border border-teal-100 bg-white p-4 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
        <Icon size={21} />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
          Step {number}
        </p>
        <h2 className="mt-1 text-base font-semibold text-slate-800">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
      </div>
    </div>
  );
}