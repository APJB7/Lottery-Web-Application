"use client";

import { useEffect, useMemo, useState } from "react";
import PageShell from "@/components/PageShell";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Crown,
  FileText,
  ImageIcon,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Search,
  ShieldCheck,
  Ticket,
  Trash2,
  Trophy,
  UserRound,
  Users,
  XCircle,
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

function isPending(status: string) {
  return status !== "APPROVED" && status !== "REJECTED";
}

export default function AdminDashboardClient() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLotteryId, setSelectedLotteryId] = useState<string | null>(
    null
  );
  const [activeSection, setActiveSection] = useState<
    "PENDING" | "APPROVED" | "REJECTED"
  >("PENDING");

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

  const groupedLotteries = useMemo(() => {
    const map: Record<string, Entry[]> = {};

    entries.forEach((entry) => {
      const id = entry.lotteryItem.id;
      if (!map[id]) map[id] = [];
      map[id].push(entry);
    });

    return Object.values(map);
  }, [entries]);

  const selectedGroup = useMemo(() => {
    if (!selectedLotteryId) return null;
    return groupedLotteries.find(
      (group) => group[0].lotteryItem.id === selectedLotteryId
    );
  }, [groupedLotteries, selectedLotteryId]);

  const dashboardStats = useMemo(() => {
    return {
      lotteries: groupedLotteries.length,
      total: entries.length,
      pending: entries.filter((e) => isPending(e.status)).length,
      approved: entries.filter((e) => e.status === "APPROVED").length,
      rejected: entries.filter((e) => e.status === "REJECTED").length,
    };
  }, [entries, groupedLotteries]);

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

    setSelectedLotteryId(null);
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

  if (selectedGroup) {
    const lottery = selectedGroup[0].lotteryItem;
    const q = search.toLowerCase();

    const filtered = selectedGroup.filter((entry) => {
      const matchesSearch =
        entry.applicantFullName.toLowerCase().includes(q) ||
        entry.applicantEmail.toLowerCase().includes(q) ||
        entry.applicantPhone.toLowerCase().includes(q) ||
        entry.referenceCode.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (activeSection === "PENDING") return isPending(entry.status);
      if (activeSection === "APPROVED") return entry.status === "APPROVED";
      return entry.status === "REJECTED";
    });

    const pendingCount = selectedGroup.filter((e) => isPending(e.status)).length;
    const approvedCount = selectedGroup.filter(
      (e) => e.status === "APPROVED"
    ).length;
    const rejectedCount = selectedGroup.filter(
      (e) => e.status === "REJECTED"
    ).length;

    return (
      <PageShell>
        <div className="mx-auto max-w-7xl px-4 py-6">
          <button
            onClick={() => {
              setSelectedLotteryId(null);
              setSearch("");
            }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-white px-4 py-2 text-sm font-bold text-cyan-700 shadow-sm hover:bg-cyan-50"
          >
            <ArrowLeft size={17} />
            Back to lottery cards
          </button>

          <section className="rounded-[34px] border border-cyan-100 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
                  Lottery Details
                </p>

                <h1 className="mt-2 text-3xl font-black text-slate-900">
                  {lottery.title}
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Ticket price: Rs {lottery.ticketPrice} · Receiver:{" "}
                  {lottery.receiverPhone}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Winner:{" "}
                  <span className="font-bold text-slate-800">
                    {lottery.winnerName || "Not drawn yet"}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => drawWinner(lottery.id)}
                  disabled={!!lottery.winnerEntryId}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-3 text-sm font-black text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Crown size={17} />
                  {lottery.winnerEntryId ? "Winner Drawn" : "Draw Winner"}
                </button>

                <button
                  onClick={() => resetWinner(lottery.id)}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-5 py-3 text-sm font-black text-cyan-700"
                >
                  <RotateCcw size={17} />
                  Reset Winner
                </button>

                <button
                  onClick={() => deleteLottery(lottery.id)}
                  className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-5 py-3 text-sm font-black text-white shadow-lg"
                >
                  <Trash2 size={17} />
                  Delete
                </button>
              </div>
            </div>
          </section>

          <div className="mt-6 flex items-center gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <Search className="text-cyan-600" size={21} />
            <input
              value={search}
              placeholder="Search participant by name, email, phone, or reference..."
              className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <section className="mt-6 grid grid-cols-3 gap-3">
            <TabCard
              active={activeSection === "PENDING"}
              icon={Clock}
              label="Pending"
              count={pendingCount}
              onClick={() => setActiveSection("PENDING")}
              color="cyan"
            />

            <TabCard
              active={activeSection === "APPROVED"}
              icon={CheckCircle2}
              label="Approved"
              count={approvedCount}
              onClick={() => setActiveSection("APPROVED")}
              color="emerald"
            />

            <TabCard
              active={activeSection === "REJECTED"}
              icon={XCircle}
              label="Rejected"
              count={rejectedCount}
              onClick={() => setActiveSection("REJECTED")}
              color="rose"
            />
          </section>

          <section className="mt-6 grid gap-4">
            {filtered.length === 0 ? (
              <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                No entries found in this section.
              </div>
            ) : (
              filtered.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  onApprove={() => updateStatus(entry.id, "APPROVED")}
                  onReject={() => updateStatus(entry.id, "REJECTED")}
                />
              ))
            )}
          </section>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-6">
        <section className="rounded-[34px] border border-cyan-100 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
            Back Office
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-900">
            Lottery Management
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Select a lottery item to review pending, approved, and rejected
            entries.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <OverviewStat icon={Ticket} label="Lotteries" value={dashboardStats.lotteries} />
            <OverviewStat icon={Users} label="Entries" value={dashboardStats.total} />
            <OverviewStat icon={Clock} label="Pending" value={dashboardStats.pending} />
            <OverviewStat icon={CheckCircle2} label="Approved" value={dashboardStats.approved} />
          </div>
        </section>

        {loading ? (
          <div className="mt-8 rounded-3xl bg-white p-8 text-slate-500 shadow-sm">
            Loading lottery items...
          </div>
        ) : groupedLotteries.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-white p-8 text-center text-slate-500 shadow-sm">
            No lottery entries found.
          </div>
        ) : (
          <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {groupedLotteries.map((group) => {
              const lottery = group[0].lotteryItem;

              const pending = group.filter((e) => isPending(e.status)).length;
              const approved = group.filter(
                (e) => e.status === "APPROVED"
              ).length;
              const rejected = group.filter(
                (e) => e.status === "REJECTED"
              ).length;

              return (
                <button
                  key={lottery.id}
                  onClick={() => {
                    setSelectedLotteryId(lottery.id);
                    setActiveSection("PENDING");
                    setSearch("");
                  }}
                  className="group rounded-[34px] border border-cyan-100 bg-white p-6 text-left shadow-[0_18px_55px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(6,182,212,0.14)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
                        <Ticket size={14} />
                        Rs {lottery.ticketPrice}
                      </p>

                      <h2 className="mt-4 text-2xl font-black text-slate-900">
                        {lottery.title}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Receiver: {lottery.receiverPhone}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700">
                      <Trophy size={22} />
                    </div>
                  </div>

                  {lottery.winnerName ? (
                    <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-amber-900">
                      <p className="flex items-center gap-2 text-sm font-black">
                        <Trophy size={17} />
                        Winner Drawn
                      </p>
                      <p className="mt-1 text-sm">{lottery.winnerName}</p>
                    </div>
                  ) : (
                    <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-500">
                      Winner not drawn yet.
                    </div>
                  )}

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <MiniStat label="Pending" value={pending} color="cyan" />
                    <MiniStat label="Approved" value={approved} color="emerald" />
                    <MiniStat label="Rejected" value={rejected} color="rose" />
                  </div>

                  <div className="mt-5 rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-5 py-3 text-center text-sm font-black text-white transition group-hover:scale-[1.02]">
                    Open Lottery Details
                  </div>
                </button>
              );
            })}
          </section>
        )}
      </div>
    </PageShell>
  );
}

function OverviewStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[22px] border border-cyan-100 bg-cyan-50/50 p-4">
      <Icon size={21} className="text-cyan-700" />
      <p className="mt-2 text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function MiniStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "cyan" | "emerald" | "rose";
}) {
  const styles = {
    cyan: "bg-cyan-50 text-cyan-700",
    emerald: "bg-emerald-50 text-emerald-700",
    rose: "bg-rose-50 text-rose-700",
  };

  return (
    <div className={`rounded-2xl p-3 text-center ${styles[color]}`}>
      <p className="text-xs font-bold">{label}</p>
      <p className="text-xl font-black">{value}</p>
    </div>
  );
}

function TabCard({
  active,
  icon: Icon,
  label,
  count,
  onClick,
  color,
}: {
  active: boolean;
  icon: React.ElementType;
  label: string;
  count: number;
  onClick: () => void;
  color: "cyan" | "emerald" | "rose";
}) {
  const activeStyles = {
    cyan: "border-cyan-200 bg-cyan-50 text-cyan-800",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
    rose: "border-rose-200 bg-rose-50 text-rose-800",
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-[22px] border p-3 text-left shadow-sm transition ${active
        ? activeStyles[color]
        : "border-slate-200 bg-white text-slate-600"
        }`}
    >
      <Icon size={20} />
      <p className="mt-2 text-xs font-bold">{label}</p>
      <p className="mt-1 text-2xl font-black">{count}</p>
    </button>
  );
}

function EntryCard({
  entry,
  onApprove,
  onReject,
}: {
  entry: Entry;
  onApprove: () => void;
  onReject: () => void;
}) {
  const isPdf = entry.proofImageUrl?.toLowerCase().includes(".pdf") ?? false;

  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-lg">
            <UserRound size={26} />
          </div>

          <div>
            <p className="text-lg font-black text-slate-900">
              {entry.applicantFullName}
            </p>

            <p className="mt-1 text-sm font-bold text-cyan-700">
              {entry.referenceCode}
            </p>

            <div className="mt-3 grid gap-2 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <Mail size={16} className="text-cyan-600" />
                {entry.applicantEmail}
              </p>

              <p className="flex items-center gap-2">
                <Phone size={16} className="text-cyan-600" />
                {entry.applicantPhone}
              </p>

              <p className="flex items-center gap-2">
                <MapPin size={16} className="text-cyan-600" />
                {entry.applicantNationality}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 text-sm">
          <p className="font-bold text-slate-500">Status</p>
          <p className="mt-1 font-black text-slate-800">
            {prettifyStatus(entry.status)}
          </p>

          <p className="mt-3 font-bold text-slate-500">Score</p>
          <p className="mt-1 font-black text-cyan-700">
            {entry.verificationScore ?? 0}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {entry.proofImageUrl ? (
          <a
            href={`/api/admin/proof/${entry.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white"
          >
            {isPdf ? <FileText size={16} /> : <ImageIcon size={16} />}
            {isPdf ? "View PDF Proof" : "View Image Proof"}
          </a>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-800">
            <Clock size={16} />
            No proof uploaded
          </span>
        )}

        {entry.status !== "APPROVED" && entry.status !== "REJECTED" && (
          <>
            <button
              onClick={onApprove}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-white"
            >
              <ShieldCheck size={16} />
              Approve
            </button>

            <button
              onClick={onReject}
              className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-sm font-bold text-white"
            >
              <XCircle size={16} />
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
}