import PageShell from "@/components/PageShell";
import { LockKeyhole, UserCheck, Database, ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl">
        <section className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-xl">
          <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 p-8 text-white">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
              <LockKeyhole size={30} />
            </div>
            <h1 className="mt-5 text-4xl font-black">Privacy Policy</h1>
            <p className="mt-2 text-white/85">
              How your information is collected, stored, and used.
            </p>
          </div>

          <div className="grid gap-5 p-8">
            <PolicyCard
              icon={UserCheck}
              title="Information Collected"
              text="We collect your name, email address, phone number, nationality, address, and uploaded proof of payment for lottery registration and verification."
            />

            <PolicyCard
              icon={Database}
              title="Data Storage"
              text="Your information is stored securely to manage participation, payment review, and winner confirmation."
            />

            <PolicyCard
              icon={ShieldCheck}
              title="Verification Use"
              text="Uploaded payment proof is used only to verify your entry and is reviewed by the administrator."
            />

            <PolicyCard
              icon={LockKeyhole}
              title="Data Protection"
              text="Your information is not sold or publicly shared. It is only used for the purpose of operating The Jackpot platform."
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
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
        <Icon size={24} />
      </div>
      <div>
        <h2 className="font-black text-slate-950">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
      </div>
    </div>
  );
}