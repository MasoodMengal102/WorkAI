"use client";

import React, { useState } from "react";
import Link from "next/link";
import { KeyRound, Mail, ArrowLeft, Loader2, CheckCircle2, ShieldAlert } from "lucide-react";
import { BRAND } from "@/config/brand";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "forgot-password",
          email: email.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        if (data.resetToken) {
          setResetToken(data.resetToken);
        }
      } else {
        setError(data.error || "Unable to process request.");
      }
    } catch {
      setError("Unable to connect to authentication service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 bg-slate-50 dark:bg-slate-950 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-md shadow-indigo-600/25">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
            Reset Password
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Enter your registered email address and we&apos;ll send you a secure link to reset your password.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">Instructions Sent</span>
                <p className="text-emerald-700 dark:text-emerald-300 leading-relaxed">
                  If an account associated with <strong className="font-semibold">{email}</strong> exists in our system, you will receive an email with instructions to securely reset your password.
                </p>
              </div>
            </div>

            {resetToken && (
              <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-left space-y-2">
                <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block">
                  Direct Reset Link (Dev Testing)
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  In local testing without an external mail server, navigate directly:
                </p>
                <Link
                  href={`/reset-password/${resetToken}`}
                  className="inline-block px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
                >
                  Set New Password Now →
                </Link>
              </div>
            )}

            <div className="pt-2 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Send Reset Instructions</span>}
            </button>

            <div className="pt-2 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
