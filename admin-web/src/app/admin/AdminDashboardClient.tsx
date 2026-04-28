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

  applicantFullName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantAddress: string;
  applicantNationality: string;

  approvedParticipantId: string | null;

  lotteryItem: {
    id: string;
    title: string;
    ticketPrice: number;
    receiverPhone: string;
    winnerName: string | null;
    winnerEntryId: string | null;
    status: string;
  };
};

function prettifyStatus(status: string) {
  switch (status) {
    case "PENDING_PAYMENT":
      return "Pending Payment";
    case "PENDING_REVIEW":
      return "Pending Review";
    case "AUTO_VERIFIED":
      return "Auto Verified";
    case "APPROVED":
      return "Approved";
    case "REJECTED":
      return "Rejected";
    case "CLOSED":
      return "Closed";
    case "OPEN":
      return "Open";
    default:
      return status;
  }
}

export default function AdminDashboardClient() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [drawingWinner, setDrawingWinner] = useState(false);
  const [resettingWinner, setResettingWinner] = useState(false);

  async function fetchEntries() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/entries?ts=${Date.now()}`, {
        method: "GET",
        cache: "no-store",
      });

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
      alert(`Entry updated to ${prettifyStatus(data.newStatus)}`);
    } catch (error) {
      console.error("UPDATE_STATUS_ERROR:", error);
      alert("Something went wrong");
    }
  }

  async function drawWinner() {
    try {
      if (entries.length === 0) {
        alert("No entries available.");
        return;
      }

      const lotteryItemId = entries[0].lotteryItem.id;
      setDrawingWinner(true);

      const res = await fetch("/api/admin/draw-winner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lotteryItemId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to draw winner");
        return;
      }

      await fetchEntries();

      alert(
        `Winner drawn successfully!\n\nWinner: ${data.winner.participantName}\nReference: ${data.winner.referenceCode}`
      );
    } catch (error) {
      console.error("DRAW_WINNER_CLIENT_ERROR:", error);
      alert("Something went wrong while drawing winner.");
    } finally {
      setDrawingWinner(false);
    }
  }

  async function resetWinner() {
    try {
      if (entries.length === 0) {
        alert("No entries available.");
        return;
      }

      const lotteryItemId = entries[0].lotteryItem.id;
      setResettingWinner(true);

      const res = await fetch("/api/admin/reset-winner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lotteryItemId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to reset winner");
        return;
      }

      await fetchEntries();
      alert("Winner has been reset successfully.");
    } catch (error) {
      console.error("RESET_WINNER_CLIENT_ERROR:", error);
      alert("Something went wrong while resetting winner.");
    } finally {
      setResettingWinner(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  useEffect(() => {
    fetchEntries();
  }, []);

  const filteredEntries = useMemo(() => {
    if (filter === "ALL") return entries;
    return entries.filter((entry) => entry.status === filter);
  }, [entries, filter]);

  const lotteryInfo = entries[0]?.lotteryItem;

  const stats = useMemo(() => {
    const total = entries.length;
    const pendingReview = entries.filter((e) => e.status === "PENDING_REVIEW").length;
    const autoVerified = entries.filter((e) => e.status === "AUTO_VERIFIED").length;
    const approved = entries.filter((e) => e.status === "APPROVED").length;
    const rejected = entries.filter((e) => e.status === "REJECTED").length;

    return { total, pendingReview, autoVerified, approved, rejected };
  }, [entries]);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[32px] bg-gradient-to-r from-emerald-700 to-cyan-700 px-8 py-8 text-white shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-white/80">
                Control Center
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight">
                Admin Review Dashboard
              </h1>
              <p className="mt-2 text-white/85">
                Review receipts, approve entries, and draw the winner.
              </p>
            </div>

            <button
              onClick={logout}
              className="rounded-full bg-white px-5 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100"
            >
              Logout
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-5">
            <div className="rounded-3xl bg-white/10 p-4">
              <p className="text-sm text-white/75">Total Entries</p>
              <p className="mt-2 text-2xl font-semibold">{stats.total}</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-4">
              <p className="text-sm text-white/75">Pending Review</p>
              <p className="mt-2 text-2xl font-semibold">{stats.pendingReview}</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-4">
              <p className="text-sm text-white/75">Auto Verified</p>
              <p className="mt-2 text-2xl font-semibold">{stats.autoVerified}</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-4">
              <p className="text-sm text-white/75">Approved</p>
              <p className="mt-2 text-2xl font-semibold">{stats.approved}</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-4">
              <p className="text-sm text-white/75">Rejected</p>
              <p className="mt-2 text-2xl font-semibold">{stats.rejected}</p>
            </div>
          </div>

          {lotteryInfo && (
            <div className="mt-6 rounded-3xl bg-white/10 p-5">
              <p className="text-lg font-semibold">{lotteryInfo.title}</p>
              <p className="mt-1 text-white/85">
                Lottery status:{" "}
                <span className="font-semibold">
                  {prettifyStatus(lotteryInfo.status)}
                </span>
              </p>
              <p className="mt-1 text-white/85">
                Winner:{" "}
                <span className="font-semibold">
                  {lotteryInfo.winnerName ?? "Not drawn yet"}
                </span>
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={drawWinner}
                  disabled={drawingWinner || !!lotteryInfo.winnerEntryId}
                  className="rounded-full bg-white px-6 py-3 font-medium text-slate-900 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {lotteryInfo.winnerEntryId
                    ? "Winner Already Drawn"
                    : drawingWinner
                      ? "Drawing Winner..."
                      : "Draw Winner"}
                </button>

                <button
                  onClick={resetWinner}
                  disabled={resettingWinner}
                  className="rounded-full border border-white bg-transparent px-6 py-3 font-medium text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {resettingWinner ? "Resetting Winner..." : "Reset Winner"}
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
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
                className={`rounded-full px-4 py-2 text-sm font-medium ${filter === value
                  ? "bg-white text-slate-900"
                  : "bg-white/15 text-white hover:bg-white/25"
                  }`}
              >
                {prettifyStatus(value)}
              </button>
            ))}
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
                      <h3 className="text-lg font-semibold text-slate-900">
                        Applicant
                      </h3>
                      <p>
                        <span className="font-medium text-slate-900">Name:</span>{" "}
                        {entry.applicantFullName}
                      </p>
                      <p>
                        <span className="font-medium text-slate-900">Email:</span>{" "}
                        {entry.applicantEmail}
                      </p>
                      <p>
                        <span className="font-medium text-slate-900">Phone:</span>{" "}
                        {entry.applicantPhone}
                      </p>
                      <p>
                        <span className="font-medium text-slate-900">Nationality:</span>{" "}
                        {entry.applicantNationality}
                      </p>
                    </div>

                    <div className="space-y-2 rounded-3xl bg-slate-50 p-5">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Payment Context
                      </h3>
                      <p>
                        <span className="font-medium text-slate-900">Lottery Item:</span>{" "}
                        {entry.lotteryItem.title}
                      </p>
                      <p>
                        <span className="font-medium text-slate-900">Expected Amount:</span>{" "}
                        Rs {entry.lotteryItem.ticketPrice}
                      </p>
                      <p>
                        <span className="font-medium text-slate-900">Receiver:</span>{" "}
                        {entry.lotteryItem.receiverPhone}
                      </p>
                      <p>
                        <span className="font-medium text-slate-900">Reference:</span>{" "}
                        {entry.referenceCode}
                      </p>
                      <p>
                        <span className="font-medium text-slate-900">Status:</span>{" "}
                        <span className="rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 px-3 py-1 text-sm text-white">
                          {prettifyStatus(entry.status)}
                        </span>
                      </p>
                    </div>

                    <div className="space-y-2 rounded-3xl bg-slate-50 p-5 lg:col-span-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Verification Summary
                      </h3>
                      <p>
                        <span className="font-medium text-slate-900">Extracted Amount:</span>{" "}
                        {entry.extractedAmount ?? "Not detected"}
                      </p>
                      <p>
                        <span className="font-medium text-slate-900">Extracted Receiver:</span>{" "}
                        {entry.extractedReceiver ?? "Not detected"}
                      </p>
                      <p>
                        <span className="font-medium text-slate-900">Extracted Reference:</span>{" "}
                        {entry.extractedReference ?? "Not detected"}
                      </p>
                      <p>
                        <span className="font-medium text-slate-900">Verification Score:</span>{" "}
                        {entry.verificationScore ?? 0}
                      </p>
                      <p>
                        <span className="font-medium text-slate-900">Verification Level:</span>{" "}
                        {(entry.verificationScore ?? 0) >= 90
                          ? "Auto Verified (High Confidence)"
                          : "Manual Review Required"}
                      </p>
                      <p>
                        <span className="font-medium text-slate-900">Notes:</span>{" "}
                        {entry.verificationNotes ?? "No notes"}
                      </p>
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
                      <div className="rounded-2xl bg-amber-100 px-4 py-3 text-center text-sm font-medium text-amber-800">
                        No proof uploaded yet
                      </div>
                    )}

                    {entry.status === "PENDING_REVIEW" || entry.status === "AUTO_VERIFIED" ? (
                      <>
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
                      </>
                    ) : entry.status === "PENDING_PAYMENT" ? (
                      <div className="rounded-2xl bg-amber-100 px-4 py-3 text-center text-sm font-medium text-amber-800">
                        Awaiting proof upload. This applicant has not submitted payment proof yet.
                      </div>
                    ) : (
                      <div className="rounded-2xl bg-white/10 px-4 py-3 text-center text-sm text-slate-300">
                        This entry has already been finalised.
                      </div>
                    )}
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