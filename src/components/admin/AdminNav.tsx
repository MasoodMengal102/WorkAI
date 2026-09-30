"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShieldCheck,
  Users,
  Wrench,
  Layers,
  Sparkles,
  Activity,
  History,
  DollarSign,
  Settings,
  BookOpen,
  Briefcase,
  MessageSquare,
  BarChart3,
  CheckCircle2,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { BRAND } from "@/config/brand";
import { UserSession } from "@/types";

export function AdminNav({ title, subtitle }: { title?: string; subtitle?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.session) setSession(data.session);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/admin/login");
    router.refresh();
  };

  const navLinks = [
    { label: "Overview", href: "/admin", icon: ShieldCheck },
    { label: "Users & RBAC", href: "/admin/users", icon: Users },
    { label: "Tools", href: "/admin/tools", icon: Wrench },
    { label: "Verification", href: "/admin/verification", icon: CheckCircle2 },
    { label: "Workflows", href: "/admin/workflows", icon: Layers },
    { label: "Use Cases", href: "/admin/use-cases", icon: Briefcase },
    { label: "Guides", href: "/admin/guides", icon: BookOpen },
    { label: "AI Services", href: "/admin/ai-services", icon: Sparkles },
    { label: "Affiliate Links", href: "/admin/affiliate-links", icon: DollarSign },
    { label: "Feedback", href: "/admin/feedback", icon: MessageSquare },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "System Health", href: "/admin/system-health", icon: Activity },
    { label: "Audit Logs", href: "/admin/audit-logs", icon: History },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-md text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-[10px] uppercase tracking-wider border border-indigo-500/30">
              Admin Gateway
            </span>
            {session?.role === "SUPER_ADMIN" && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase tracking-wider border border-amber-500/30">
                Super Admin
              </span>
            )}
            {session?.role && session.role !== "SUPER_ADMIN" && (
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold text-[10px] uppercase tracking-wider">
                Role: {session.role}
              </span>
            )}
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white">
            {title || `${BRAND.name} Content & Operations Desk`}
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            {subtitle || "Provenance verification queue, AI infrastructure monitoring, and audit controls."}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <span>Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Staff Sign Out</span>
          </button>
        </div>
      </div>

      {/* Admin Horizontal Subnav Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs font-semibold">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
