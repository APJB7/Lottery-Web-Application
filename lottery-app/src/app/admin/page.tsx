"use client";

import { useEffect, useState } from "react";

type Entry = {
  id: string;
  referenceCode: string;
  status: string;
  proofImageUrl: string | null;
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

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">Admin Review Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Review submitted entries and approve or reject proofs of payment.
        </p>

        {loading ? (
          <p className="mt-8">Loading entries...</p>
        ) : entries.length === 0 ? (
          <p className="mt-8">No entries yet.</p>
        ) : (
          <div className="mt-8 grid gap-6">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-2xl bg-white p-6 shadow-md"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">Participant:</span>{" "}
                      {entry.participant.fullName}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span>{" "}
                      {entry.participant.email}
                    </p>
                    <p>
                      <span className="font-semibold">Phone:</span>{" "}
                      {entry.participant.phone}
                    </p>
                    <p>
                      <span className="font-semibold">Nationality:</span>{" "}
                      {entry.participant.nationality}
                    </p>
                    <p>
                      <span className="font-semibold">Lottery Item:</span>{" "}
                      {entry.lotteryItem.title}
                    </p>
                    <p>
                      <span className="font-semibold">Amount:</span> Rs{" "}
                      {entry.lotteryItem.ticketPrice}
                    </p>
                    <p>
                      <span className="font-semibold">Receiver:</span>{" "}
                      {entry.lotteryItem.receiverPhone}
                    </p>
                    <p>
                      <span className="font-semibold">Reference Code:</span>{" "}
                      {entry.referenceCode}
                    </p>
                    <p>
                      <span className="font-semibold">Status:</span>{" "}
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                        {entry.status}
                      </span>
                    </p>
                  </div>

                  <div className="flex min-w-[240px] flex-col gap-4">
                    {entry.proofImageUrl ? (
                      <a
                        href={entry.proofImageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-slate-300 px-4 py-3 text-center font-medium hover:bg-slate-50"
                      >
                        View Proof
                      </a>
                    ) : (
                      <div className="rounded-xl bg-slate-100 px-4 py-3 text-center text-sm text-slate-500">
                        No proof uploaded yet
                      </div>
                    )}

                    <button
                      onClick={() => updateStatus(entry.id, "APPROVED")}
                      className="rounded-xl bg-green-600 px-4 py-3 font-medium text-white hover:bg-green-700"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => updateStatus(entry.id, "REJECTED")}
                      className="rounded-xl bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}