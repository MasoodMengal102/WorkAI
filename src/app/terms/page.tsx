import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/config/brand";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service governing the use of ${BRAND.name} free discovery, workflow, and AI productivity platform.`,
};

export default function TermsPage() {
  return (
    <div className="py-16 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Last Updated: September 2026
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing or using {BRAND.name} ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Free Access & Fair Use</h2>
            <p>
              {BRAND.name} provides AI discovery, directory information, and built-in AI productivity utilities free of charge to individual users. To protect infrastructure stability and prevent automated scraping or denial-of-service abuse, rate limits apply to anonymous and registered sessions.
            </p>
            <p>
              You agree not to bypass, reverse-engineer, or deploy automated bots to exhaust server quotas or compromise platform security.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. User Content & Intellectual Property</h2>
            <p>
              You retain 100% intellectual property ownership of any prompts, career history, or text you submit to our AI utilities, as well as the resulting generated deliverables.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. External Tool Information & Disclaimer</h2>
            <p>
              While {BRAND.name} rigorously verifies software pricing, terms, and capabilities from official sources, third-party software companies frequently alter their features, pricing tiers, and terms. You are advised to review the official terms of each tool before making financial or legal commitments.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Contact Information</h2>
            <p>
              Questions regarding these Terms should be directed to <strong>{BRAND.supportEmail}</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
