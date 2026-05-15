"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageShell from "@/components/PageShell";
import {
  ArrowLeft,
  CalendarDays,
  ImagePlus,
  Phone,
  PlusCircle,
  Ticket,
  Type,
} from "lucide-react";
import Link from "next/link";

export default function NewLotteryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const res = await fetch("/api/admin/lottery/create", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to create lottery item");
        return;
      }

      alert("Lottery item created successfully.");
      router.push("/admin");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-6">
        <Link
          href="/admin"
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-white px-4 py-2 text-sm font-bold text-cyan-700 shadow-sm hover:bg-cyan-50"
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>

        <div className="overflow-hidden rounded-[34px] border border-cyan-100 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
          <div className="bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500 px-6 py-7 text-white md:px-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20">
                <PlusCircle size={27} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/75">
                  Admin
                </p>

                <h1 className="mt-2 text-3xl font-black leading-tight">
                  Add New Lottery Item
                </h1>

                <p className="mt-2 text-sm leading-6 text-white/90">
                  Create a prize item that will appear on the public lottery
                  page.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5 px-5 py-6 md:px-8">
            <Field icon={Type}>
              <input
                name="title"
                placeholder="Title e.g. PlayStation 4 Pro + 2 Controllers"
                required
                className="w-full bg-transparent outline-none"
              />
            </Field>

            <textarea
              name="description"
              placeholder="Description"
              required
              className="min-h-[130px] rounded-[22px] border border-cyan-100 bg-cyan-50/40 px-5 py-4 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white"
            />

            <div className="grid gap-5 md:grid-cols-2">
              <Field icon={Ticket}>
                <input
                  name="ticketPrice"
                  type="number"
                  placeholder="Ticket price"
                  required
                  className="w-full bg-transparent outline-none"
                />
              </Field>

              <Field icon={Phone}>
                <input
                  name="receiverPhone"
                  placeholder="Receiver phone / payment number"
                  required
                  className="w-full bg-transparent outline-none"
                />
              </Field>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Draw date
                <div className="flex items-center gap-3 rounded-[22px] border border-cyan-100 bg-cyan-50/40 px-4 py-4 text-sm text-slate-700 transition focus-within:border-cyan-400 focus-within:bg-white">
                  <CalendarDays size={20} className="shrink-0 text-cyan-600" />
                  <input
                    name="drawDate"
                    type="datetime-local"
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </label>

              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Closing date
                <div className="flex items-center gap-3 rounded-[22px] border border-cyan-100 bg-cyan-50/40 px-4 py-4 text-sm text-slate-700 transition focus-within:border-cyan-400 focus-within:bg-white">
                  <CalendarDays size={20} className="shrink-0 text-cyan-600" />
                  <input
                    name="closingDate"
                    type="datetime-local"
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </label>
            </div>

            <label className="grid cursor-pointer gap-3 rounded-[28px] border-2 border-dashed border-cyan-200 bg-cyan-50/70 p-6 text-center text-sm text-cyan-800 transition hover:border-cyan-400 hover:bg-cyan-50">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-cyan-700 shadow-sm">
                <ImagePlus size={30} />
              </div>

              <span className="font-black">
                {fileName || "Click to upload lottery image"}
              </span>

              <span className="text-cyan-700/80">PNG, JPG, or WEBP</span>

              <input
                name="image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                required
                className="hidden"
                onChange={(e) =>
                  setFileName(e.target.files?.[0]?.name || "")
                }
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-7 py-4 text-sm font-black text-white shadow-lg shadow-cyan-500/25 transition hover:-translate-y-1 hover:scale-[1.01] disabled:opacity-60"
            >
              <PlusCircle size={18} />
              {loading ? "Creating..." : "Create Lottery Item"}
            </button>
          </form>
        </div>
      </div>
    </PageShell>
  );
}

function Field({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[22px] border border-cyan-100 bg-cyan-50/40 px-4 py-4 text-sm text-slate-700 transition focus-within:border-cyan-400 focus-within:bg-white">
      <Icon size={20} className="shrink-0 text-cyan-600" />
      {children}
    </div>
  );
}