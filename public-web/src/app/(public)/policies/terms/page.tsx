import PageShell from "@/components/PageShell";
import { FileText, ShieldCheck, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl">
        <section className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-xl">
          <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 p-8 text-white">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
              <FileText size={30} />
            </div>
            <h1 className="mt-5 text-4xl font-black">Terms & Conditions</h1>
            <p className="mt-2 text-white/85">
              Please read these terms before participating in The Jackpot.
            </p>
          </div>

          <div className="grid gap-5 p-8">
            <PolicyCard
              icon={ShieldCheck}
              title="Participation"
              text="By registering, you agree to provide accurate details and follow the payment and proof upload process."
            />

            <PolicyCard
              icon={FileText}
              title="Payment Reference"
              text="You must include your generated reference number when making payment so your entry can be verified."
            />

            <PolicyCard
              icon={AlertTriangle}
              title="No Refund Policy"
              text="All payments are final and non-refundable once submitted."
            />

            <PolicyCard
              icon={ShieldCheck}
              title="Admin Verification"
              text="Entries are only confirmed after proof of payment is reviewed and approved by the administrator."
            />
          </div>
        </section>
      </div>
    </PageShell>
  );
}

function PolicyCard({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
        <Icon size={24} />
      </div>
      <div>
        <h2 className="font-black text-slate-950">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
      </div>
    </div>
  );
}