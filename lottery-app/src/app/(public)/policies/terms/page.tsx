import PageShell from "@/components/PageShell";

export default function TermsPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl rounded-[32px] bg-white p-10 shadow-xl">
        <h1 className="text-4xl font-semibold text-slate-950">Terms & Conditions</h1>
        <div className="mt-6 space-y-4 text-slate-600">
          <p>Entries are only valid once payment proof is accepted or approved by the administrator.</p>
          <p>The organiser reserves the right to reject incomplete, duplicate, or unverifiable submissions.</p>
          <p>The draw date, eligibility criteria, and winner selection process should be clearly announced before the draw.</p>
        </div>
      </div>
    </PageShell>
  );
}