import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/config/brand";

export const metadata: Metadata = {
  title: "Editorial & Legal Disclaimer",
  description: `Editorial Disclaimer for ${BRAND.name}. Information provided is for educational and informational purposes only.`,
};

export default function DisclaimerPage() {
  return (
    <div className="py-16 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Editorial Disclaimer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Last Updated: September 2026
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Informational & Educational Purpose Only</h2>
            <p>
              The tools, workflows, guides, and recommendations on {BRAND.name} are provided solely for general informational and educational purposes. Nothing on this website constitutes legal, medical, accounting, financial, or employment advice.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Rapidly Changing Software Terms</h2>
            <p>
              While our editorial desk regularly audits software pricing, API access, and free tier allowances, third-party software vendors frequently modify their features, pricing plans, and terms of service without prior notice. Always verify the current terms directly on the official vendor website before subscribing.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Third-Party Trademarks & Brands</h2>
            <p>
              All trademarks, product names, logos, and brands mentioned on {BRAND.name} (such as ChatGPT, Claude, Gemini, Midjourney, Canva, GitHub Copilot, and others) are the property of their respective owners. Mention of these trademarks does not imply endorsement, affiliation, or sponsorship.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
