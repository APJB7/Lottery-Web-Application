"use client";

import Link from "next/link";
import { useState } from "react";
import { LayoutDashboard, Menu, PlusCircle, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-100 bg-white/90 backdrop-blur-2xl shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg shadow-cyan-500/20">
            <img
              src="/image.png"
              alt="The Jackpot Logo"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <p className="text-xl font-black tracking-tight text-slate-900">
              The
              <span className="bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                Jackpot
              </span>
            </p>
            <p className="text-xs font-medium text-slate-500">
              Admin back office
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-100 bg-cyan-50 text-cyan-700 shadow-sm transition hover:bg-cyan-100 md:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className="hidden items-center gap-2 rounded-full border border-cyan-100 bg-white p-1 shadow-sm md:flex">
          <NavLink href="/admin" icon={LayoutDashboard} label="Dashboard" />
          <NavLink href="/admin/lottery/new" icon={PlusCircle} label="Add Lottery" />
        </nav>
      </div>

      {open && (
        <div className="mx-5 mb-4 rounded-[28px] border border-cyan-100 bg-white p-3 shadow-xl md:hidden">
          <div className="grid gap-2">
            <MobileNavLink
              href="/admin"
              icon={LayoutDashboard}
              label="Dashboard"
              onClick={() => setOpen(false)}
            />

            <MobileNavLink
              href="/admin/lottery/new"
              icon={PlusCircle}
              label="Add Lottery"
              onClick={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-cyan-50 hover:text-cyan-700"
    >
      <Icon size={17} />
      {label}
    </Link>
  );
}

function MobileNavLink({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl bg-cyan-50 px-4 py-4 text-sm font-bold text-cyan-800 transition hover:bg-cyan-100"
    >
      <Icon size={20} />
      {label}
    </Link>
  );
}