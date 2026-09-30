"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { User, Mail, Shield, CheckCircle2, AlertTriangle, Loader2, ArrowRight } from "lucide-react";
import { UserSession } from "@/types";

export default function UserProfilePage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.session) {
          setSession(data.session);
          setName(data.session.name || "");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update-profile", name: name.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMsg({ type: "success", text: "Your profile information has been updated." });
        setSession((prev) => (prev ? { ...prev, name: data.user.name } : null));
      } else {
        setMsg({ type: "error", text: data.error || "Failed to update profile." });
      }
    } catch {
      setMsg({ type: "error", text: "Network error updating profile." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 bg-slate-50 dark:bg-slate-950 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <DashboardNav session={session} />

        {msg && (
          <div
            className={`p-4 rounded-2xl text-xs flex items-start gap-2.5 ${
              msg.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
                : "bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200"
            }`}
          >
            {msg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
            )}
            <span>{msg.text}</span>
          </div>
        )}

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Profile Information</h2>
            <p className="text-xs text-slate-500 mt-1">
              Manage your personal display name and review account verification status.
            </p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Display Name
              </label>
              <div className="relative max-w-md">
                <User className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative max-w-md">
                <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="email"
                  disabled
                  value={session?.email || ""}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Email address is permanently bound for cryptographic verification security.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Account Role & Clearance
              </label>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
                  {session?.role || "USER"}
                </span>
                <span className="text-xs text-slate-500">
                  {session?.role === "SUPER_ADMIN"
                    ? "Full administrative system access."
                    : session?.role === "ADMIN"
                    ? "Staff administrator privileges."
                    : session?.role === "EDITOR"
                    ? "Editorial publication clearance."
                    : session?.role === "REVIEWER"
                    ? "Verification queue reviewer."
                    : "Standard platform member."}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
              >
                {saving ? "Saving..." : "Save Profile Changes"}
              </button>
            </div>
          </form>

          {/* Quick link to Security settings */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-xs">Security & Password</h3>
              <p className="text-[11px] text-slate-500">Need to update your password or delete your account?</p>
            </div>
            <Link
              href="/dashboard/security"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-800 dark:text-slate-200 transition"
            >
              <span>Security Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
