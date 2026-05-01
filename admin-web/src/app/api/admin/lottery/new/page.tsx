"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageShell from "@/components/PageShell";

export default function NewLotteryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
      <div className="mx-auto max-w-3xl rounded-[34px] border border-slate-200 bg-white p-8 shadow-[0_20px_70px_rgba(15,23,42,0.09)]">
        <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
          Admin
        </p>

        <h1 className="mt-2 text-3xl font-black text-slate-950">
          Add New Lottery Item
        </h1>

        <p className="mt-2 text-slate-600">
          Create a new item such as an iPhone, headset, PlayStation, or other
          prize.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          <input
            name="title"
            placeholder="Title e.g. PlayStation 4 Pro + 2 Controllers"
            required
            className="rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:border-cyan-500"
          />

          <textarea
            name="description"
            placeholder="Description"
            required
            className="min-h-[130px] rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:border-cyan-500"
          />

          <input
            name="ticketPrice"
            type="number"
            placeholder="Ticket price"
            required
            className="rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:border-cyan-500"
          />

          <input
            name="receiverPhone"
            placeholder="Receiver phone / payment number"
            required
            className="rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:border-cyan-500"
          />

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Draw date
              <input
                name="drawDate"
                type="datetime-local"
                className="rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:border-cyan-500"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Closing date
              <input
                name="closingDate"
                type="datetime-local"
                className="rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:border-cyan-500"
              />
            </label>
          </div>

          <label className="grid cursor-pointer gap-3 rounded-3xl border-2 border-dashed border-cyan-200 bg-cyan-50 p-6 text-center text-sm text-cyan-800">
            <span className="font-bold">Drag and drop or click to upload image</span>
            <span>PNG, JPG, or WEBP</span>
            <input
              name="image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              required
              className="mx-auto"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-7 py-4 font-black text-white shadow-lg shadow-cyan-500/25 hover:scale-[1.01] disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Lottery Item"}
          </button>
        </form>
      </div>
    </PageShell>
  );
}