"use client";

import { useEffect, useMemo, useState } from "react";
import PageShell from "@/components/PageShell";

type Entry = {
  id: string;
  referenceCode: string;
  status: string;
  proofImageUrl: string | null;
  paymentAmount: number | null;
  extractedAmount: number | null;
  extractedReceiver: string | null;
  extractedReference: string | null;
  verificationScore: number | null;
  verificationNotes: string | null;
  createdAt: string;
  participant: {
    fullName: string;
    email: string;
    phone: string;
    nationality: string;
  };
  lotteryItem: {
    title: string;
    ticketPrice: number;
    receiverPhone: string;
  };
};

export default function AdminPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  async function fetchEntries() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/entries");
      const data = await res.json();
      setEntries(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load entries");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(entryId: string, status: "APPROVED" | "REJECTED") {
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entryId, status }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to update status");
        return;
      }

      await fetchEntries();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  }

  useEffect(() => {
    fetchEntries();
  }, []);

  const filteredEntries = useMemo(() => {
    if (filter === "ALL") return entries;
    return entries.filter((entry) => entry.status === filter);
  }, [entries, filter]);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[32px] bg-gradient-to-r from-emerald-700 to-cyan-700 px-8 py-8 text-white shadow-2xl">
          <p className="text-sm uppercase tracking-wide text-white/80">Control Center</p>
          <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight">
                Admin Review Dashboard
              </h1>
              <p className="mt-2 text-white/85">
                Review receipts, verify details, and approve or reject entries.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                "ALL",
                "PENDING_PAYMENT",
                "PENDING_REVIEW",
                "AUTO_VERIFIED",
                "APPROVED",
                "REJECTED",
              ].map((value) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    filter === value
                      ? "bg-white text-slate-900"
                      : "bg-white/15 text-white hover:bg-white/25"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <p className="mt-8">Loading entries...</p>
        ) : filteredEntries.length === 0 ? (
          <p className="mt-8">No entries found.</p>
        ) : (
          <div className="mt-8 grid gap-6">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="rounded-[28px] bg-white p-6 shadow-xl">
                <div className="grid gap-6 xl:grid-cols-[1fr,280px]">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-2 rounded-3xl bg-slate-50 p-5">
                      <h3 className="text-lg font-semibold text-slate-900">Participant</h3>
                      <p><span className="font-medium text-slate-900">Name:</span> {entry.participant.fullName}</p>
                      <p><span className="font-medium text-slate-900">Email:</span> {entry.participant.email}</p>
                      <p><span className="font-medium text-slate-900">Phone:</span> {entry.participant.phone}</p>
                      <p><span className="font-medium text-slate-900">Nationality:</span> {entry.participant.nationality}</p>
                    </div>

                    <div className="space-y-2 rounded-3xl bg-slate-50 p-5">
                      <h3 className="text-lg font-semibold text-slate-900">Payment Context</h3>
                      <p><span className="font-medium text-slate-900">Lottery Item:</span> {entry.lotteryItem.title}</p>
                      <p><span className="font-medium text-slate-900">Expected Amount:</span> Rs {entry.lotteryItem.ticketPrice}</p>
                      <p><span className="font-medium text-slate-900">Receiver:</span> {entry.lotteryItem.receiverPhone}</p>
                      <p><span className="font-medium text-slate-900">Reference:</span> {entry.referenceCode}</p>
                      <p>
                        <span className="font-medium text-slate-900">Status:</span>{" "}
                        <span className="rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 px-3 py-1 text-sm text-white">
                          {entry.status}
                        </span>
                      </p>
                    </div>

                    <div className="space-y-2 rounded-3xl bg-slate-50 p-5 lg:col-span-2">
                      <h3 className="text-lg font-semibold text-slate-900">Verification Summary</h3>
                      <p><span className="font-medium text-slate-900">Extracted Amount:</span> {entry.extractedAmount ?? "Not detected"}</p>
                      <p><span className="font-medium text-slate-900">Extracted Receiver:</span> {entry.extractedReceiver ?? "Not detected"}</p>
                      <p><span className="font-medium text-slate-900">Extracted Reference:</span> {entry.extractedReference ?? "Not detected"}</p>
                      <p><span className="font-medium text-slate-900">Verification Score:</span> {entry.verificationScore ?? 0}</p>
                      <p><span className="font-medium text-slate-900">Notes:</span> {entry.verificationNotes ?? "No notes"}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 rounded-3xl bg-slate-950 p-5 text-white">
                    {entry.proofImageUrl ? (
                      <a
                        href={entry.proofImageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-2xl bg-white px-4 py-3 text-center font-medium text-slate-950 hover:bg-slate-100"
                      >
                        View Proof
                      </a>
                    ) : (
                      <div className="rounded-2xl bg-white/10 px-4 py-3 text-center text-sm text-slate-300">
                        No proof uploaded
                      </div>
                    )}

                    <button
                      onClick={() => updateStatus(entry.id, "APPROVED")}
                      className="rounded-2xl bg-emerald-500 px-4 py-3 font-medium text-white hover:bg-emerald-600"
                    >
                      Approve Entry
                    </button>

                    <button
                      onClick={() => updateStatus(entry.id, "REJECTED")}
                      className="rounded-2xl bg-rose-500 px-4 py-3 font-medium text-white hover:bg-rose-600"
                    >
                      Reject Entry
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}