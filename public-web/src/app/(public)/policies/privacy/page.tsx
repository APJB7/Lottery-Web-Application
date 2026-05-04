import PageShell from "@/components/PageShell";
import {
  Database,
  Lock,
  ShieldCheck,
  Trash2,
  UserRound,
  UploadCloud,
} from "lucide-react";

export default function PrivacyPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-md px-4 md:max-w-3xl">
        <section className="rounded-[28px] border border-teal-100 bg-white p-5 shadow-sm">
          <p className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal-700">
            <Lock size={14} />
            Privacy
          </p>

          <h1 className="mt-4 text-2xl font-semibold text-slate-800">
            Privacy Policy
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            How your information is collected, stored, and used.
          </p>
        </section>

        <section className="mt-5 grid gap-3">
          <PrivacyCard
            icon={UserRound}
            title="Information Collected"
            text="We collect your name, email address, phone number, nationality, address, and payment proof for registration and verification."
          />

          <PrivacyCard
            icon={Database}
            title="Data Storage"
            text="Your information is stored securely to manage participation, payment review, and winner confirmation."
          />

          <PrivacyCard
            icon={UploadCloud}
            title="Payment Proof"
            text="Uploaded receipts are used only to verify whether the correct payment was made."
          />

          <PrivacyCard
            icon={ShieldCheck}
            title="Limited Use"
            text="Your data is used only for lottery registration, payment verification, participation, and communication."
          />

          <PrivacyCard
            icon={Trash2}
            title="Data Removal"
            text="You may contact the organiser if you need your personal information reviewed or removed where applicable."
          />
        </section>
      </div>
    </PageShell>
  );
}

function PrivacyCard({
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