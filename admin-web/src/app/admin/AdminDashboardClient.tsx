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
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function statusBadgeClass(status: string) {
  if (status === "APPROVED") return "bg-emerald-100 text-emerald-700";
  if (status === "REJECTED") return "bg-rose-100 text-rose-700";
  if (status === "PENDING_PAYMENT") return "bg-amber-100 text-amber-700";
  if (status === "AUTO_VERIFIED") return "bg-cyan-100 text-cyan-700";
  return "bg-slate-100 text-slate-700";
}

export default function AdminDashboardClient() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
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
      setEntries(Array.isArray(data) ? data : []);
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
    let result = entries;

    if (filter !== "ALL") {
      result = result.filter((entry) => entry.status === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();

      result = result.filter((entry) => {
        return (
          entry.applicantFullName.toLowerCase().includes(q) ||
          entry.applicantEmail.toLowerCase().includes(q) ||
          entry.applicantPhone.toLowerCase().includes(q) ||
          entry.referenceCode.toLowerCase().includes(q) ||
          entry.lotteryItem.title.toLowerCase().includes(q)
        );
      });
    }

    return result;
  }, [entries, filter, search]);

  const lotteryInfo = entries[0]?.lotteryItem;

  const stats = useMemo(() => {
    return {
      total: entries.length,
      pendingPayment: entries.filter((e) => e.status === "PENDING_PAYMENT")
        .length,
      pendingReview: entries.filter((e) => e.status === "PENDING_REVIEW")
        .length,
      approved: entries.filter((e) => e.status === "APPROVED").length,
      rejected: entries.filter((e) => e.status === "REJECTED").length,
    };
  }, [entries]);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[36px] border border-white/70 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 px-8 py-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-white/75">
                Control Center
              </p>
              <h1 className="mt-2 text-4xl font-black tracking-tight">
                Admin Review Dashboard
              </h1>
              <p className="mt-2 max-w-2xl text-white/85">
                Search applicants, review uploaded proofs, approve entries, and
                draw the final winner.
              </p>
            </div>

            <button
              onClick={logout}
              className="rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-900 shadow-lg hover:bg-slate-100"
            >
              Logout
            </button>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-5">
            {[
              ["Total Entries", stats.total],
              ["Pending Payment", stats.pendingPayment],
              ["Pending Review", stats.pendingReview],
              ["Approved", stats.approved],
              ["Rejected", stats.rejected],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-3xl border border-white/15 bg-white/15 p-4 backdrop-blur"
              >
                <p className="text-sm text-white/75">{label}</p>
                <p className="mt-2 text-3xl font-black">{value}</p>
              </div>
            ))}
          </div>

          {lotteryInfo && (
            <div className="mt-6 rounded-3xl border border-white/15 bg-white/15 p-5 backdrop-blur">
              <p className="text-lg font-bold">{lotteryInfo.title}</p>
              <p className="mt-1 text-white/85">
                Status:{" "}
                <span className="font-bold">
                  {prettifyStatus(lotteryInfo.status)}
                </span>
              </p>
              <p className="mt-1 text-white/85">
                Winner:{" "}
                <span className="font-bold">
                  {lotteryInfo.winnerName ?? "Not drawn yet"}
                </span>
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={drawWinner}
                  disabled={drawingWinner || !!lotteryInfo.winnerEntryId}
                  className="rounded-full bg-white px-6 py-3 font-bold text-slate-900 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
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
                  className="rounded-full border border-white bg-transparent px-6 py-3 font-bold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
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
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${filter === value
                    ? "bg-white text-slate-900"
                    : "bg-white/15 text-white hover:bg-white/25"
                  }`}
              >
                {prettifyStatus(value)}
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-white/20 bg-white/15 p-3 backdrop-blur">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, reference, or lottery item..."
              className="w-full rounded-2xl border border-white/40 bg-white px-5 py-4 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 focus:border-cyan-300"
            />
          </div>
        </div>

        {loading ? (
          <p className="mt-8 text-slate-600">Loading entries...</p>
        ) : filteredEntries.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            No entries found.
          </div>
        ) : (
          <div className="mt-8 grid gap-7">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="overflow-hidden rounded-[34px] border border-slate-200/80 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.09)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-cyan-50 px-6 py-5">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
                      {entry.referenceCode}
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-slate-950">
                      {entry.applicantFullName}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {entry.applicantEmail}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-bold ${statusBadgeClass(
                      entry.status
                    )}`}
                  >
                    {prettifyStatus(entry.status)}
                  </span>
                </div>

                <div className="grid gap-6 p-6 xl:grid-cols-[1fr,300px]">
                  <div className="grid gap-5 lg:grid-cols-2">
                    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                      <h3 className="text-lg font-black text-slate-900">
                        Applicant
                      </h3>
                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <p>
                          <span className="font-bold">Phone:</span>{" "}
                          {entry.applicantPhone}
                        </p>
                        <p>
                          <span className="font-bold">Nationality:</span>{" "}
                          {entry.applicantNationality}
                        </p>
                        <p>
                          <span className="font-bold">Address:</span>{" "}
                          {entry.applicantAddress}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                      <h3 className="text-lg font-black text-slate-900">
                        Payment Context
                      </h3>
                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <p>
                          <span className="font-bold">Lottery:</span>{" "}
                          {entry.lotteryItem.title}
                        </p>
                        <p>
                          <span className="font-bold">Expected Amount:</span> Rs{" "}
                          {entry.lotteryItem.ticketPrice}
                        </p>
                        <p>
                          <span className="font-bold">Receiver:</span>{" "}
                          {entry.lotteryItem.receiverPhone}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5 lg:col-span-2">
                      <h3 className="text-lg font-black text-slate-900">
                        Verification Summary
                      </h3>
                      <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                        <p>
                          <span className="font-bold">Extracted Amount:</span>{" "}
                          {entry.extractedAmount ?? "Not detected"}
                        </p>
                        <p>
                          <span className="font-bold">Extracted Receiver:</span>{" "}
                          {entry.extractedReceiver ?? "Not detected"}
                        </p>
                        <p>
                          <span className="font-bold">Extracted Reference:</span>{" "}
                          {entry.extractedReference ?? "Not detected"}
                        </p>
                        <p>
                          <span className="font-bold">Score:</span>{" "}
                          {entry.verificationScore ?? 0}
                        </p>
                        <p className="md:col-span-2">
                          <span className="font-bold">Notes:</span>{" "}
                          {entry.verificationNotes ?? "No notes"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 rounded-3xl bg-slate-950 p-5 text-white">
                    {entry.proofImageUrl ? (
                      <a
                        href={entry.proofImageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-2xl bg-white px-4 py-3 text-center font-bold text-slate-950 hover:bg-slate-100"
                      >
                        View Proof
                      </a>
                    ) : (
                      <div className="rounded-2xl bg-amber-100 px-4 py-3 text-center text-sm font-bold text-amber-800">
                        No proof uploaded yet
                      </div>
                    )}

                    {entry.status === "PENDING_REVIEW" || entry.status === "AUTO_VERIFIED" ? (
                      <>
                        <button
                          onClick={() => updateStatus(entry.id, "APPROVED")}
                          className="rounded-2xl bg-emerald-500 px-4 py-3 font-bold text-white hover:bg-emerald-600"
                        >
                          Approve Entry
                        </button>

                        <button
                          onClick={() => updateStatus(entry.id, "REJECTED")}
                          className="rounded-2xl bg-rose-500 px-4 py-3 font-bold text-white hover:bg-rose-600"
                        >
                          Reject Entry
                        </button>
                      </>
                    ) : entry.status === "PENDING_PAYMENT" ? (
                      <>
                        <div className="rounded-2xl bg-amber-100 px-4 py-3 text-center text-sm font-bold text-amber-800">
                          Awaiting proof upload.
                        </div>

                        <button
                          onClick={() => updateStatus(entry.id, "REJECTED")}
                          className="rounded-2xl bg-rose-500 px-4 py-3 font-bold text-white hover:bg-rose-600"
                        >
                          Reject Entry
                        </button>
                      </>
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