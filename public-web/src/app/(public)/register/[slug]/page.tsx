"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import PageShell from "@/components/PageShell";
import ProgressSteps from "@/components/ProgressSteps";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Mail,
  MapPin,
  Phone,
  UserRound,
  Globe2,
} from "lucide-react";

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
      <div className="mx-auto max-w-md px-4 md:px-6">
        <ProgressSteps currentStep={1} />

        <div className="overflow-hidden rounded-[34px] border border-cyan-100 bg-white shadow-[0_22px_80px_rgba(6,182,212,0.12)]">
          <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500 px-6 py-7 text-white md:px-8">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20 blur-3xl" />

            <div className="relative flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                <ClipboardList size={26} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/75">
                  Step 1 of 3
                </p>

                <h1 className="mt-2 text-3xl font-semibold leading-tight">
                  Registration details
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-white/90">
                  Enter your details to generate your unique payment reference.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4 px-5 py-6 md:grid-cols-2 md:px-8 md:py-8"
          >
            <FieldIcon icon={UserRound}>
              <input
                className="w-full bg-transparent outline-none"
                placeholder="Full name"
                value={form.fullName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, fullName: e.target.value }))
                }
                required
              />
            </FieldIcon>

            <FieldIcon icon={Mail}>
              <input
                className="w-full bg-transparent outline-none"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </FieldIcon>

            <FieldIcon icon={Phone}>
              <input
                className="w-full bg-transparent outline-none"
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                required
              />
            </FieldIcon>

            <FieldIcon icon={Globe2}>
              <input
                className="w-full bg-transparent outline-none"
                placeholder="Nationality"
                value={form.nationality}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, nationality: e.target.value }))
                }
                required
              />
            </FieldIcon>

            <div className="flex min-h-[120px] gap-3 rounded-[22px] border border-cyan-100 bg-cyan-50/40 px-4 py-4 text-sm text-slate-700 transition focus-within:border-cyan-400 focus-within:bg-white md:col-span-2">
              <MapPin size={20} className="mt-1 shrink-0 text-cyan-600" />
              <textarea
                className="w-full resize-none bg-transparent outline-none"
                placeholder="Address"
                value={form.address}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, address: e.target.value }))
                }
                required
              />
            </div>

            <label className="flex items-start gap-3 rounded-[22px] border border-cyan-100 bg-slate-50 p-4 text-sm leading-6 text-slate-600 md:col-span-2">
              <input
                type="checkbox"
                checked={form.consentAccepted}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    consentAccepted: e.target.checked,
                  }))
                }
                required
                className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-600"
              />

              <span>
                I consent to The Jackpot storing my name, email address, and
                phone number for registration, payment verification, and lottery
                participation purposes.
              </span>
            </label>

            <div className="rounded-[22px] border border-cyan-100 bg-cyan-50 p-4 text-sm leading-6 text-cyan-900 md:col-span-2">
              <p className="flex items-center gap-2 font-semibold">
                <CheckCircle2 size={18} />
                Next step
              </p>
              <p className="mt-1">
                After registration, your unique payment reference will be
                generated. You must include it in your payment description.
              </p>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:-translate-y-1 hover:scale-[1.01] disabled:opacity-60 md:ml-auto md:w-fit"
              >
                {loading ? "Creating entry..." : "Continue to Payment"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageShell>
  );
}

function FieldIcon({
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