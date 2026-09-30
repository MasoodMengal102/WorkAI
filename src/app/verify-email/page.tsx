"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MailCheck, CheckCircle2, ShieldAlert, Loader2, ArrowRight, RefreshCw } from "lucide-react";
import { BRAND } from "@/config/brand";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resend state
  const [resendEmail, setResendEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState<string | null>(null);

  useEffect(() => {
    if (tokenFromUrl) {
      verifyToken(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  const verifyToken = async (tok: string) => {
    if (!tok) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify-email", token: tok.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setError(data.error || "Verification link is invalid or has expired.");
      }
    } catch {
      setError("Unable to communicate with verification service.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      verifyToken(token.trim());
    }
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;

    setResendLoading(true);
    setResendMsg(null);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "resend-verification",
          email: resendEmail.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResendMsg("Verification link sent! Check your inbox.");
        if (data.verificationToken) {
          setToken(data.verificationToken);
        }
      } else {
        setResendMsg(data.error || "Failed to resend verification link.");
      }
    } catch {
      setResendMsg("Network error. Could not request new link.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-md shadow-indigo-600/25">
          <MailCheck className="w-6 h-6" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
          Email Verification
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Confirm your email address to secure your account and verify your identity.
        </p>
      </div>

      {loading && (
        <div className="py-8 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Verifying your token with cryptographic validation...</p>
        </div>
      )}

      {success && !loading && (
        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-4">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <div>
            <h2 className="text-base font-bold text-emerald-900 dark:text-emerald-100">
              Email Successfully Verified!
            </h2>
            <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
              Your account is in good standing. You can now use all platform capabilities.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {error && !loading && !success && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>

          {/* Resend Verification Form */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Request a New Verification Link</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Verification tokens expire after 24 hours. Enter your email to receive a fresh token:
            </p>

            {resendMsg && (
              <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs">
                {resendMsg}
              </div>
            )}

            <form onSubmit={handleResend} className="space-y-2">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={resendLoading}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-semibold disabled:opacity-50 transition"
              >
                {resendLoading ? "Sending..." : "Send New Link"}
              </button>
            </form>
          </div>
        </div>
      )}

      {!tokenFromUrl && !success && !loading && (
        <form onSubmit={handleManualVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Verification Token
            </label>
            <input
              type="text"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste verification token here"
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-indigo-600/25 cursor-pointer"
          >
            Verify Token
          </button>
        </form>
      )}

      <div className="pt-2 text-center">
        <Link
          href="/dashboard"
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          Skip for now and continue to Dashboard →
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="py-20 bg-slate-50 dark:bg-slate-950 min-h-screen flex items-center justify-center px-4">
      <Suspense
        fallback={
          <div className="p-8 text-center text-xs text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto" />
          </div>
        }
      >
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
