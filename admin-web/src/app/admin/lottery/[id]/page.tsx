"use client";

import { useEffect, useState } from "react";
import PageShell from "@/components/PageShell";

type Entry = {
  id: string;
  applicantFullName: string;
  status: string;
  referenceCode: string;
};

export default function LotteryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    fetch(`/api/admin/entries?lotteryId=${params.id}`)
      .then((res) => res.json())
      .then(setEntries);
  }, [params.id]);

  const approved = entries.filter((e) => e.status === "APPROVED");
  const pending = entries.filter((e) => e.status === "PENDING");
  const rejected = entries.filter((e) => e.status === "REJECTED");

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-5">
        <h1 className="mb-6 text-2xl font-semibold text-slate-800">
          Lottery Entries
        </h1>

        <Section title="Pending" color="amber">
          {pending.map(renderEntry)}
        </Section>

        <Section title="Approved" color="emerald">
          {approved.map(renderEntry)}
        </Section>

        <Section title="Rejected" color="rose">
          {rejected.map(renderEntry)}
        </Section>
      </div>
    </PageShell>
  );
}

function renderEntry(entry: any) {
  return (
    <div
      key={entry.id}
      className="flex justify-between rounded-xl border bg-white p-4"
    >
      <div>
        <p className="font-semibold">{entry.applicantFullName}</p>
        <p className="text-sm text-slate-500">{entry.referenceCode}</p>
      </div>

      <span className="text-sm font-medium">{entry.status}</span>
    </div>
  );
}

function Section({
  title,
  children,
  color,
}: {
  title: string;
  children: React.ReactNode;
  color: "emerald" | "amber" | "rose";
}) {
  return (
    <div className="mb-8">
      <h2 className={`mb-3 text-lg font-semibold text-${color}-600`}>
        {title}
      </h2>

      <div className="grid gap-3">{children}</div>
    </div>
  );
}