"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import PageShell from "@/components/PageShell";
import { UploadCloud, FileCheck2, ArrowRight } from "lucide-react";

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
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[36px] border border-cyan-100 bg-white/90 shadow-[0_24px_90px_rgba(6,182,212,0.10)] backdrop-blur-xl">
        <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-8 py-8 text-white">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
            <UploadCloud size={30} />
          </div>

          <p className="mt-5 text-sm font-black uppercase tracking-[0.25em] text-white/80">
            Step 3 of 3
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Upload your payment proof
          </h1>

          <p className="mt-2 text-white/85">
            Upload a JPG, PNG, or PDF receipt for admin verification.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-7 md:px-8">
          <label className="block cursor-pointer rounded-[30px] border-2 border-dashed border-cyan-200 bg-cyan-50/60 p-8 text-center transition hover:border-cyan-400 hover:bg-cyan-50">
            <input
              type="file"
              accept="image/png,image/jpeg,application/pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-cyan-700 shadow-sm">
              <FileCheck2 size={32} />
            </div>

            <p className="mt-4 text-lg font-black text-slate-950">
              {file ? file.name : "Choose receipt file"}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Accepted formats: JPG, PNG, PDF
            </p>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-7 py-4 font-black text-white shadow-lg shadow-cyan-500/25 transition hover:-translate-y-1 hover:scale-[1.01] disabled:opacity-60"
          >
            {loading ? "Uploading..." : "Submit Proof"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </PageShell>
  );
}