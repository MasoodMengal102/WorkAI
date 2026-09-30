"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle2, ShieldAlert, Loader2, ArrowRight } from "lucide-react";
import { BRAND } from "@/config/brand";

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = typeof params.token === "string" ? params.token : "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset-password",
          token,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login?reset=true");
        }, 2000);
      } else {
        setError(data.error || "Password reset failed. The link may have expired or been used already.");
      }
    } catch {
      setError("Unable to communicate with the authentication service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 bg-slate-50 dark:bg-slate-950 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-md shadow-indigo-600/25">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
            Choose New Password
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Set a strong, new password for your {BRAND.name} account.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h2 className="font-bold text-emerald-900 dark:text-emerald-100 text-sm">
              Password Reset Successfully!
            </h2>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Redirecting you to sign in with your new credentials...
            </p>
            <Link
              href="/login?reset=true"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pt-2"
            >
              <span>Go to Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Update Password</span>}
            </button>

            <div className="pt-2 text-center">
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
              >
                Cancel and return to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
