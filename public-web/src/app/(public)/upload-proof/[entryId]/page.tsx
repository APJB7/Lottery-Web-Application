"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import PageShell from "@/components/PageShell";
import ProgressSteps from "@/components/ProgressSteps";
import { ArrowRight, FileCheck2, UploadCloud } from "lucide-react";

export default function UploadProofPage() {
  const router = useRouter();
  const params = useParams<{ entryId: string }>();
  const entryId = params.entryId;

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      alert("Please select a receipt image or PDF.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("entryId", entryId);
      formData.append("file", file);

      const res = await fetch("/api/upload-proof", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Upload failed");
        return;
      }

      alert("Proof uploaded successfully. Your payment is now under review.");
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-md px-4 md:px-6">
        <ProgressSteps currentStep={3} />

        <div className="rounded-[28px] border border-cyan-100 bg-white p-5 shadow-[0_18px_55px_rgba(6,182,212,0.10)]">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
              <UploadCloud size={24} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                Step 3 of 3
              </p>

              <h1 className="mt-1 text-2xl font-semibold leading-tight text-slate-950">
                Upload proof
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Upload your payment receipt so your entry can be reviewed.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <label className="block cursor-pointer rounded-[24px] border-2 border-dashed border-cyan-200 bg-cyan-50/50 p-6 text-center transition hover:border-cyan-400 hover:bg-cyan-50">
              <input
                type="file"
                accept="image/png,image/jpeg,application/pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-cyan-700 shadow-sm">
                <FileCheck2 size={28} />
              </div>

              <p className="mt-4 text-base font-semibold text-slate-900">
                {file ? file.name : "Choose receipt file"}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Accepted formats: JPG, PNG, PDF
              </p>
            </label>

            <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4 text-sm leading-6 text-cyan-900">
              Make sure the uploaded proof clearly shows the amount paid and the
              payment reference used.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:-translate-y-1 hover:scale-[1.01] disabled:opacity-60"
            >
              {loading ? "Uploading..." : "Submit Proof"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>
      </div>
    </PageShell>
  );
}