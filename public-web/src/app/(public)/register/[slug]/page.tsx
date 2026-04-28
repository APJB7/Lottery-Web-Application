"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import PageShell from "@/components/PageShell";

export default function RegisterPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    nationality: "",
    consentAccepted: false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.consentAccepted) {
      alert("You must accept the data storage consent before continuing.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, ...form }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Registration failed");
        return;
      }

      router.push(`/payment/${data.entryId}?ref=${data.referenceCode}`);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[32px] bg-white shadow-xl">
        <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 px-8 py-8 text-white">
          <p className="text-sm uppercase tracking-wide text-white/80">
            Step 1 of 3
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Registration Details</h1>
          <p className="mt-2 text-white/85">
            Enter your details to generate your lottery payment reference.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 px-8 py-8 md:grid-cols-2"
        >
          <input
            className="rounded-2xl border border-slate-200 p-4 outline-none transition focus:border-emerald-500"
            placeholder="Full name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
          />

          <input
            className="rounded-2xl border border-slate-200 p-4 outline-none transition focus:border-cyan-500"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            className="rounded-2xl border border-slate-200 p-4 outline-none transition focus:border-emerald-500"
            placeholder="Phone number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />

          <input
            className="rounded-2xl border border-slate-200 p-4 outline-none transition focus:border-cyan-500"
            placeholder="Nationality"
            value={form.nationality}
            onChange={(e) =>
              setForm({ ...form, nationality: e.target.value })
            }
            required
          />

          <textarea
            className="min-h-[120px] rounded-2xl border border-slate-200 p-4 outline-none transition focus:border-emerald-500 md:col-span-2"
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
          />

          <label className="md:col-span-2 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            <input
              type="checkbox"
              checked={form.consentAccepted}
              onChange={(e) =>
                setForm({ ...form, consentAccepted: e.target.checked })
              }
              required
              className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-600"
            />
            <span>
              I consent to The Jackpot storing my name, email address, and phone
              number for registration, payment verification, and lottery
              participation purposes.
            </span>
          </label>

          <div className="flex justify-end md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 px-7 py-3 font-medium text-white shadow-md hover:opacity-95 disabled:opacity-60"
            >
              {loading ? "Creating entry..." : "Continue to Payment"}
            </button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}