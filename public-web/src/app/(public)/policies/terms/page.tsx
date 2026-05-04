import PageShell from "@/components/PageShell";
import {
  FileText,
  Hash,
  ShieldCheck,
  UploadCloud,
  CreditCard,
  Trophy,
} from "lucide-react";

export default function TermsPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-md px-4 md:max-w-3xl">
        <section className="rounded-[28px] border border-teal-100 bg-white p-5 shadow-sm">
          <p className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal-700">
            <FileText size={14} />
            Terms
          </p>

          <h1 className="mt-4 text-2xl font-semibold text-slate-800">
            Terms & Conditions
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Please read these terms before participating in The Jackpot.
          </p>
        </section>

        <section className="mt-5 grid gap-3">
          <TermCard
            icon={ShieldCheck}
            title="Participation"
            text="By registering, you agree to provide accurate details and follow the payment and proof upload process."
          />

          <TermCard
            icon={Hash}
            title="Payment Reference"
            text="You must include your generated reference number when making payment so your entry can be verified."
          />

          <TermCard
            icon={UploadCloud}
            title="Proof Upload"
            text="Your entry will remain pending until payment proof is uploaded and checked by the admin."
          />

          <TermCard
            icon={CreditCard}
            title="Payments"
            text="Payments are final and non-refundable once submitted."
          />

          <TermCard
            icon={Trophy}
            title="Lottery Draw"
            text="Approved entries are included in the draw. The winner will be selected and announced after the draw."
          />
        </section>
      </div>
    </PageShell>
  );
}

function TermCard({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4 rounded-[24px] border border-teal-100 bg-white p-4 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
        <Icon size={21} />
      </div>

      <div>
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
      </div>
    </div>
  );
}