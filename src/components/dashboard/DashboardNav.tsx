"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, User, Shield, LogOut, CheckCircle2, XCircle } from "lucide-react";
import { UserSession } from "@/types";

export function DashboardNav({ session }: { session: UserSession | null }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/");
    router.refresh();
  };

  const navItems = [
    { label: "Overview & Content", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Profile", href: "/dashboard/profile", icon: User },
    { label: "Security & Account", href: "/dashboard/security", icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* User Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-indigo-600/20">
            {session?.name ? session.name.charAt(0).toUpperCase() : session?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {session?.name || "Member Dashboard"}
              </h1>
              {session?.emailVerified ? (
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              ) : (
                <Link
                  href="/verify-email"
                  className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:underline"
                >
                  <XCircle className="w-3 h-3" />
                  <span>Verify Email</span>
                </Link>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{session?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {session?.role && session.role !== "USER" && (
            <Link
              href="/admin"
              className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-bold text-xs border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition"
            >
              Admin Portal →
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 w-fit text-xs font-semibold">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
