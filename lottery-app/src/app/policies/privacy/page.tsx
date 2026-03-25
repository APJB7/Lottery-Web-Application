import PageShell from "@/components/PageShell";

export default function PrivacyPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl rounded-[32px] bg-white p-10 shadow-xl">
        <h1 className="text-4xl font-semibold text-slate-950">Privacy Policy</h1>
        <div className="mt-6 space-y-4 text-slate-600">
          <p>We collect participant details such as name, email, phone number, address, nationality, and payment proof to process lottery entries and administrative review.</p>
          <p>We use this information only for running the lottery, payment verification, support, and compliance purposes.</p>
          <p>Uploaded proofs of payment are stored for verification and audit purposes.</p>
        </div>
      </div>
    </PageShell>
  );
}