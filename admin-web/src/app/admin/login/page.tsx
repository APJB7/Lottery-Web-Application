"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageShell from "@/components/PageShell";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Login failed");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-xl overflow-hidden rounded-[32px] bg-white shadow-xl">
        <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 px-8 py-8 text-white">
          <p className="text-sm uppercase tracking-wide text-white/80">Admin Access</p>
          <h1 className="mt-2 text-3xl font-semibold">Sign in</h1>
          <p className="mt-2 text-white/85">Only administrators can access the review dashboard.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-8 py-8">
          <input className="w-full rounded-2xl border border-slate-200 p-4 outline-none transition focus:border-emerald-500" type="email" placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="w-full rounded-2xl border border-slate-200 p-4 outline-none transition focus:border-cyan-500" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 px-7 py-3 font-medium text-white shadow-md hover:opacity-95 disabled:opacity-60">
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}