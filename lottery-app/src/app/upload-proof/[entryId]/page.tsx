"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import PageShell from "@/components/PageShell";

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

      router.push(`/success?status=${data.status}`);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[32px] bg-white shadow-xl">
        <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 px-8 py-8 text-white">
          <p className="text-sm uppercase tracking-wide text-white/80">Step 3 of 3</p>
          <h1 className="mt-2 text-3xl font-semibold">Upload your payment proof</h1>
          <p className="mt-2 text-white/85">Upload a JPG, PNG, or PDF receipt for verification.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-8 py-8">
          <label className="block rounded-3xl border-2 border-dashed border-slate-300 p-8 text-center transition hover:border-cyan-400">
            <input type="file" accept="image/png,image/jpeg,application/pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <div>
              <p className="text-lg font-medium text-slate-900">{file ? file.name : "Choose receipt file"}</p>
              <p className="mt-2 text-sm text-slate-500">Accepted formats: JPG, PNG, PDF</p>
            </div>
          </label>

          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 px-7 py-3 font-medium text-white shadow-md hover:opacity-95 disabled:opacity-60">
              {loading ? "Uploading..." : "Submit Proof"}
            </button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}