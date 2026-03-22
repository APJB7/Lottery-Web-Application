"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

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
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          ...form,
        }),
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
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-md">
        <h1 className="text-3xl font-bold">Register for the Lottery</h1>
        <p className="mt-2 text-slate-600">
          Enter your details to continue to the payment step.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            placeholder="Full name"
            value={form.fullName}
            onChange={(e) =>
              setForm({ ...form, fullName: e.target.value })
            }
            required
          />

          <input
            className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <input
            className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            placeholder="Phone number"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
            required
          />

          <input
            className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            placeholder="Address"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
            required
          />

          <input
            className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            placeholder="Nationality"
            value={form.nationality}
            onChange={(e) =>
              setForm({ ...form, nationality: e.target.value })
            }
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Processing..." : "Continue to Payment"}
          </button>
        </form>
      </div>
    </main>
  );
}