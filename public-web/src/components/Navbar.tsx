"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    ["Lottery", "/"],
    ["How It Works", "/how-it-works"],
    ["Terms", "/policies/terms"],
    ["Privacy", "/policies/privacy"],
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-teal-100 bg-white/90 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 via-cyan-500 to-emerald-500 text-xl font-bold text-white shadow-lg shadow-teal-500/20">
            J
          </div>

          <div>
            <p className="text-xl font-semibold text-slate-800">
              The<span className="text-teal-500">Jackpot</span>
            </p>
            <p className="text-xs text-slate-500">Secure lottery verification</p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-teal-100 bg-teal-50 text-teal-700 shadow-sm md:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className="hidden rounded-full border border-teal-100 bg-white px-2 py-1 shadow-sm md:flex">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-5 py-2 text-sm font-medium text-slate-600 transition hover:bg-teal-50 hover:text-teal-700"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {open && (
        <nav className="mx-5 mb-4 grid gap-2 rounded-3xl border border-teal-100 bg-white p-3 shadow-lg md:hidden">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-teal-50 hover:text-teal-700"
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}