import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { Cookie } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `Cookie Policy for ${BRAND.name}. Details on essential cookies, analytics cookies, advertising cookies, and how to manage your consent preferences.`,
};

export default function CookiePolicyPage() {
  return (
    <div className="py-16 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <Cookie className="w-3.5 h-3.5" />
            <span>Transparency & Consent</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Cookie Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Last Updated: September 2026
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files placed on your computer or mobile device when you access websites. They allow websites to remember user actions, dark mode preferences, and authenticate secure sessions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. The Types of Cookies We Use</h2>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-white block">Strictly Essential Cookies:</strong>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Required for basic security, theme preferences, and user session authentication. These cookies do not store personally identifiable data and cannot be turned off.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-white block">Anonymous Analytics Cookies:</strong>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  When enabled with your consent, anonymous metrics help us evaluate which workflows and tools are most useful so we can allocate editorial research accordingly.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-white block">Personalized Advertising Cookies (AdSense):</strong>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Subject to your explicit consent, Google AdSense uses cookies to serve relevant ads. You can manage or revoke advertising consent at any time.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. How to Update Your Consent Preferences</h2>
            <p>
              You can reopen our privacy preference manager at any time by clicking the "Privacy Preferences" button in the lower corner of any page. You can also block or clear cookies directly through your web browser settings.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
