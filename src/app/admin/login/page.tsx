"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, ShieldAlert, Loader2, Lock, Mail, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { BRAND } from "@/config/brand";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("error") === "unauthorized") {
      setError("Administrative access required. Your account does not have sufficient permissions to view that page.");
    }
  }, [searchParams]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "admin-login",
          email: email.trim(),
          password,
          rememberMe,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const from = searchParams.get("from");
        const destination = from && from.startsWith("/admin") ? from : "/admin";
        router.push(destination);
        router.refresh();
      } else {
        setError(data.error || "Administrative authentication failed.");
      }
    } catch {
      setError("Unable to connect to administrative security gateway.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl space-y-6 text-white">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/10">
          <ShieldCheck className="w-8 h-8 text-indigo-400" />
        </div>
        <div className="mt-4">
          <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 px-2.5 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-800/80">
            Restricted Area
          </span>
        </div>
        <h1 className="mt-3 text-2xl font-black text-white tracking-tight">
          {BRAND.name} Staff Portal
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Administrative and editorial staff authentication gateway.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
          <div className="space-y-1">
            <span className="font-semibold block">Authorization Notice</span>
            <p className="text-rose-300/90 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleAdminLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Staff Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-500" />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staff@workai.org"
              className="w-full pl-9 pr-3 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Administrative Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-500" />
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-10 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 p-0.5"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
            />
              <span>Maintain secure session</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Authenticate & Enter</span>}
        </button>
      </form>

      <div className="pt-4 border-t border-slate-800/80 flex flex-col items-center gap-2 text-center text-xs text-slate-500">
        <p className="text-[11px] text-slate-500">
          Unauthorized access attempts are logged with IP and cryptographically recorded in the system audit trail.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition mt-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Website</span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="py-20 bg-slate-900 min-h-screen flex items-center justify-center px-4">
      <Suspense
        fallback={
          <div className="p-8 text-center text-xs text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mx-auto" />
          </div>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
