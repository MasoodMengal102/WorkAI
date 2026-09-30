"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Loader2, ShieldAlert, CheckCircle2, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { BRAND } from "@/config/brand";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccessMsg("Registration successful! Please sign in with your credentials.");
    } else if (searchParams.get("reset") === "true") {
      setSuccessMsg("Your password has been reset successfully. Please sign in with your new password.");
    } else if (searchParams.get("verified") === "true") {
      setSuccessMsg("Your email address has been verified. Welcome to WorkAI!");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          email: email.trim(),
          password,
          rememberMe,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const from = searchParams.get("from");
        const destination = from && !from.startsWith("/admin") ? from : "/dashboard";
        router.push(destination);
        router.refresh();
      } else {
        setError(data.error || "Invalid email or password.");
      }
    } catch {
      setError("Unable to connect to the authentication service. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-md shadow-indigo-600/25">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
          Sign In to {BRAND.name}
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Access your saved workflows, favorites, and AI generation history.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
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

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
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

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
            />
            <span>Remember me for 30 days</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In</span>}
        </button>
      </form>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
        <span>Don&apos;t have an account? </span>
        <Link href="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          Create free account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="py-20 bg-slate-50 dark:bg-slate-950 min-h-screen flex items-center justify-center px-4">
      <Suspense
        fallback={
          <div className="p-8 text-center text-xs text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
