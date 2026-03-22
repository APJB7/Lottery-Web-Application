"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function UploadProofPage() {
  const router = useRouter();
  const params = useParams<{ entryId: string }>();
  const entryId = params.entryId;

  const [proofUrl, setProofUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/upload-proof", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entryId,
          proofImageUrl: proofUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Submission failed");
        return;
      }

      router.push("/success");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-md">
        <h1 className="text-3xl font-bold">Upload Payment Proof</h1>
        <p className="mt-2 text-slate-600">
          For this MVP, paste the image URL of the payment receipt.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            placeholder="https://example.com/receipt.jpg"
            value={proofUrl}
            onChange={(e) => setProofUrl(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Proof"}
          </button>
        </form>
      </div>
    </main>
  );
}