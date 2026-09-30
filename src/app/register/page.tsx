"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Loader2, ShieldAlert, CheckCircle2, Eye, EyeOff, Lock, Mail, User, Check, X } from "lucide-react";
import { BRAND } from "@/config/brand";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [verificationToken, setVerificationToken] = useState<string | null>(null);

  // Password criteria check
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasSpecialOrDigit = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!hasLength || !hasUpper || !hasLower || !hasSpecialOrDigit) {
      setError("Please ensure your password meets all complexity requirements below.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!termsAgreed) {
      setError("Please agree to the Terms of Service and Privacy Policy to continue.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          name: name.trim(),
          email: email.trim(),
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRegistered(true);
        setRegisteredEmail(email.trim());
        if (data.verificationToken) {
          setVerificationToken(data.verificationToken);
        }
      } else {
        setError(data.error || "Registration failed. Please check your information.");
      }
    } catch {
      setError("Unable to connect to the authentication service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="py-20 bg-slate-50 dark:bg-slate-950 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Verify Your Email
            </h1>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We&apos;ve sent a verification link to <strong className="text-slate-900 dark:text-white">{registeredEmail}</strong>. Please check your inbox and verify your email to unlock all features.
            </p>
          </div>

          {verificationToken && (
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-left space-y-2">
              <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block">
                Direct Verification Link (Dev Environment)
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                In local testing without an active SMTP gateway, click below to verify immediately:
              </p>
              <Link
                href={`/verify-email?token=${verificationToken}`}
                className="inline-block px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
              >
                Verify Email Now →
              </Link>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <Link
              href="/dashboard"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm text-center shadow-lg shadow-indigo-600/25 transition"
            >
              Continue to Dashboard
            </Link>
            <Link
              href="/login"
              className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
            >
              Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-slate-50 dark:bg-slate-950 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-md shadow-indigo-600/25">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
            Create Free Account
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Save workflows, bookmark favorite tools, and track AI history.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full pl-9 pr-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

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
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
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
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Password complexity indicator */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 text-[11px] space-y-1">
            <span className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Password Requirements:</span>
            <div className="grid grid-cols-2 gap-1 text-slate-500">
              <span className={`flex items-center gap-1 ${hasLength ? "text-emerald-600 dark:text-emerald-400" : ""}`}>
                {hasLength ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-slate-400" />}
                8+ Characters
              </span>
              <span className={`flex items-center gap-1 ${hasUpper ? "text-emerald-600 dark:text-emerald-400" : ""}`}>
                {hasUpper ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-slate-400" />}
                Uppercase Letter
              </span>
              <span className={`flex items-center gap-1 ${hasLower ? "text-emerald-600 dark:text-emerald-400" : ""}`}>
                {hasLower ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-slate-400" />}
                Lowercase Letter
              </span>
              <span className={`flex items-center gap-1 ${hasSpecialOrDigit ? "text-emerald-600 dark:text-emerald-400" : ""}`}>
                {hasSpecialOrDigit ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-slate-400" />}
                Number or Symbol
              </span>
            </div>
            {confirmPassword.length > 0 && (
              <div className={`pt-1 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-1 ${passwordsMatch ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {passwordsMatch ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                <span>{passwordsMatch ? "Passwords match" : "Passwords do not match"}</span>
              </div>
            )}
          </div>

          <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400 pt-1">
            <input
              type="checkbox"
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Create Account</span>}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
          <span>Already have an account? </span>
          <Link href="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
