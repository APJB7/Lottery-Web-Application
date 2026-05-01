"use client";

import { useEffect, useMemo, useState } from "react";
import PageShell from "@/components/PageShell";
import {
  Crown,
  Search,
  Trash2,
  Trophy,
  RotateCcw,
  Mail,
  Phone,
  MapPin,
  FileText,
  ImageIcon,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Ticket,
  UserRound,
} from "lucide-react";

type Entry = {
  id: string;
  referenceCode: string;
  status: string;
  proofImageUrl: string | null;
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
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function statusStyle(status: string) {
  if (status === "APPROVED") return "bg-emerald-100 text-emerald-700";
  if (status === "REJECTED") return "bg-rose-100 text-rose-700";
  if (status === "PENDING_PAYMENT") return "bg-amber-100 text-amber-700";
  if (status === "PENDING_REVIEW") return "bg-cyan-100 text-cyan-700";
  if (status === "AUTO_VERIFIED") return "bg-teal-100 text-teal-700";
  return "bg-slate-100 text-slate-700";
}

export default function AdminDashboardClient() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function fetchEntries() {
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/entries?ts=${Date.now()}`, {
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

  useEffect(() => {
    fetchEntries();
  }, []);

  const grouped = useMemo(() => {
    const map: Record<string, Entry[]> = {};

    entries.forEach((entry) => {
      const id = entry.lotteryItem.id;
      if (!map[id]) map[id] = [];
      map[id].push(entry);
    });

    return Object.values(map);
  }, [entries]);

  const stats = useMemo(() => {
    return {
      total: entries.length,
      pending: entries.filter(
        (e) => e.status === "PENDING_PAYMENT" || e.status === "PENDING_REVIEW"
      ).length,
      approved: entries.filter((e) => e.status === "APPROVED").length,
      rejected: entries.filter((e) => e.status === "REJECTED").length,
    };
  }, [entries]);

  async function drawWinner(lotteryItemId: string) {
    const res = await fetch("/api/admin/draw-winner", {
      method: "POST",
      body: JSON.stringify({ lotteryItemId }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to draw winner");
      return;
    }

    alert(`Winner: ${data.winner.participantName}`);
    fetchEntries();
  }

  async function resetWinner(lotteryItemId: string) {
    if (!confirm("Reset the winner for this lottery?")) return;

    const res = await fetch("/api/admin/reset-winner", {
      method: "POST",
      body: JSON.stringify({ lotteryItemId }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to reset winner");
      return;
    }

    alert("Winner reset successfully.");
    fetchEntries();
  }

  async function deleteLottery(lotteryItemId: string) {
    if (!confirm("Delete this lottery and all related entries?")) return;

    const res = await fetch("/api/admin/lottery/delete", {
      method: "POST",
      body: JSON.stringify({ lotteryItemId }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to delete lottery item");
      return;
    }

    fetchEntries();
  }

  async function updateStatus(id: string, status: "APPROVED" | "REJECTED") {
    const res = await fetch("/api/admin/approve", {
      method: "POST",
      body: JSON.stringify({ entryId: id, status }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to update entry");
      return;
    }

    fetchEntries();
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-[36px] bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white shadow-2xl">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-white/70">
                Back Office
              </p>
              <h1 className="mt-3 text-4xl font-black">Admin Dashboard</h1>
              <p className="mt-2 text-white/85">
                Manage lotteries, review payment proofs, approve participants,
                and draw winners.
              </p>
            </div>

            <div className="rounded-3xl bg-white/15 p-4 backdrop-blur">
              <Trophy size={34} />
            </div>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-4">
            <StatCard icon={Ticket} label="Total Entries" value={stats.total} />
            <StatCard icon={Clock} label="Pending" value={stats.pending} />
            <StatCard icon={CheckCircle2} label="Approved" value={stats.approved} />
            <StatCard icon={XCircle} label="Rejected" value={stats.rejected} />
          </div>
        </section>

        <div className="mt-8 flex items-center gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <Search className="text-cyan-600" size={22} />
          <input
            value={search}
            placeholder="Search by name, email, phone, or reference..."
            className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="mt-8 rounded-3xl bg-white p-8 text-slate-500 shadow-sm">
            Loading entries...
          </div>
        ) : grouped.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-white p-8 text-center text-slate-500 shadow-sm">
            No lottery entries found.
          </div>
        ) : (
          <div className="mt-8 grid gap-10">
            {grouped.map((group) => {
              const lottery = group[0].lotteryItem;
              const q = search.toLowerCase();

              const filtered = group.filter((entry) => {
                return (
                  entry.applicantFullName.toLowerCase().includes(q) ||
                  entry.applicantEmail.toLowerCase().includes(q) ||
                  entry.applicantPhone.toLowerCase().includes(q) ||
                  entry.referenceCode.toLowerCase().includes(q)
                );
              });

              return (
                <section
                  key={lottery.id}
                  className="overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-xl"
                >
                  <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-cyan-950 p-6 text-white">
                    <div className="flex flex-wrap items-start justify-between gap-5">
                      <div>
                        <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-200">
                          Lottery Item
                        </p>
                        <h2 className="mt-2 text-3xl font-black">
                          {lottery.title}
                        </h2>
                        <p className="mt-1 text-sm text-white/75">
                          Status: {prettifyStatus(lottery.status)}
                        </p>
                        <p className="mt-1 text-sm text-white/75">
                          Winner:{" "}
                          <span className="font-bold text-white">
                            {lottery.winnerName || "Not drawn yet"}
                          </span>
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => drawWinner(lottery.id)}
                          disabled={!!lottery.winnerEntryId}
                          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Crown size={18} />
                          {lottery.winnerEntryId ? "Winner Drawn" : "Draw Winner"}
                        </button>

                        <button
                          onClick={() => resetWinner(lottery.id)}
                          className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/20"
                        >
                          <RotateCcw size={18} />
                          Reset Winner
                        </button>

                        <button
                          onClick={() => deleteLottery(lottery.id)}
                          className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-5 py-3 text-sm font-black text-white transition hover:bg-rose-600"
                        >
                          <Trash2 size={18} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5 p-6">
                    {filtered.length === 0 ? (
                      <div className="rounded-3xl bg-slate-50 p-6 text-center text-slate-500">
                        No entries match your search.
                      </div>
                    ) : (
                      filtered.map((entry) => {
                        const isPdf =
                          entry.proofImageUrl?.toLowerCase().includes(".pdf") ??
                          false;

                        return (
                          <article
                            key={entry.id}
                            className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              <div className="flex gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-lg">
                                  <UserRound size={26} />
                                </div>

                                <div>
                                  <h3 className="text-xl font-black text-slate-950">
                                    {entry.applicantFullName}
                                  </h3>
                                  <p className="mt-1 text-sm font-bold text-cyan-700">
                                    {entry.referenceCode}
                                  </p>
                                </div>
                              </div>

                              <span
                                className={`rounded-full px-4 py-2 text-sm font-black ${statusStyle(
                                  entry.status
                                )}`}
                              >
                                {prettifyStatus(entry.status)}
                              </span>
                            </div>

                            <div className="mt-5 grid gap-3 md:grid-cols-3">
                              <InfoLine icon={Mail} text={entry.applicantEmail} />
                              <InfoLine icon={Phone} text={entry.applicantPhone} />
                              <InfoLine
                                icon={MapPin}
                                text={entry.applicantNationality}
                              />
                            </div>

                            <div className="mt-5 grid gap-3 md:grid-cols-4">
                              <MiniBox
                                label="Ticket Price"
                                value={`Rs ${lottery.ticketPrice}`}
                              />
                              <MiniBox
                                label="Receiver"
                                value={lottery.receiverPhone}
                              />
                              <MiniBox
                                label="Proof Type"
                                value={
                                  entry.proofImageUrl
                                    ? isPdf
                                      ? "PDF"
                                      : "Image"
                                    : "Missing"
                                }
                              />
                              <MiniBox
                                label="Score"
                                value={`${entry.verificationScore ?? 0}`}
                              />
                            </div>

                            <div className="mt-5 flex flex-wrap gap-2">
                              {entry.proofImageUrl ? (
                                <a
                                  href={`/api/admin/proof/${entry.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white hover:bg-slate-800"
                                >
                                  {isPdf ? (
                                    <FileText size={18} />
                                  ) : (
                                    <ImageIcon size={18} />
                                  )}
                                  {isPdf ? "View PDF Proof" : "View Image Proof"}
                                </a>
                              ) : (
                                <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-black text-amber-800">
                                  <Clock size={18} />
                                  No proof uploaded
                                </span>
                              )}

                              {entry.status !== "APPROVED" &&
                                entry.status !== "REJECTED" && (
                                  <>
                                    <button
                                      onClick={() =>
                                        updateStatus(entry.id, "APPROVED")
                                      }
                                      className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-black text-white hover:bg-emerald-600"
                                    >
                                      <CheckCircle2 size={18} />
                                      Approve
                                    </button>

                                    <button
                                      onClick={() =>
                                        updateStatus(entry.id, "REJECTED")
                                      }
                                      className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-sm font-black text-white hover:bg-rose-600"
                                    >
                                      <XCircle size={18} />
                                      Reject
                                    </button>
                                  </>
                                )}
                            </div>

                            {entry.verificationNotes && (
                              <div className="mt-5 rounded-2xl border border-cyan-100 bg-cyan-50 p-4 text-sm text-cyan-900">
                                <span className="font-black">Notes:</span>{" "}
                                {entry.verificationNotes}
                              </div>
                            )}
                          </article>
                        );
                      })
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/15 p-5 backdrop-blur">
      <Icon size={26} />
      <p className="mt-3 text-sm text-white/75">{label}</p>
      <p className="mt-1 text-3xl font-black">{value}</p>
    </div>
  );
}

function InfoLine({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-700">
      <Icon size={17} className="text-cyan-600" />
      <span className="truncate">{text}</span>
    </div>
  );
}

function MiniBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 font-black text-slate-950">{value}</p>
    </div>
  );
}