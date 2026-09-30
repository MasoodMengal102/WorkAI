import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Affiliate Disclosure & Monetization Transparency",
  description: `Affiliate Disclosure for ${BRAND.name}. We maintain strict editorial independence. Affiliate partnerships never influence our tool rankings or recommendations.`,
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="py-16 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Monetization Transparency</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Affiliate Disclosure
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Last Updated: September 2026 • Full Transparency Commitment
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Our Editorial Truth Standard</h2>
            <p>
              At <strong>{BRAND.name}</strong>, we believe commercial monetization must never compromise editorial honesty. Normal users can access all our workflows, directories, comparisons, and built-in AI utilities completely free of charge.
            </p>
            <p>
              To maintain our infrastructure, research staff, and server costs without charging subscription fees to visitors, we participate in legitimate software affiliate programs.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">How Affiliate Links Work on {BRAND.name}</h2>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>No Additional Cost to You:</strong> When you click on an approved outbound link and sign up or purchase a software plan, we may receive a referral commission from the software provider. You pay the exact same price (or lower if a legitimate public discount exists).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Zero Influence on Rankings:</strong> Affiliate status has exactly <strong>0% weight</strong> in our recommendation algorithms, search engines, and AI Goal Analyzer. Tools without affiliate programs are evaluated with equal prominence.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Open-Redirect Prevention:</strong> All outbound referral links are routed through our secure internal redirect engine (<code>/go/[approved-id]</code>). We never allow arbitrary redirect destinations.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>No Fabricated Partnerships:</strong> We never claim "official partner" or invent fake discounts. If a tool has no approved affiliate relationship, our link points directly to their official homepage without tracking.
                </span>
              </li>
            </ul>
          </section>

          <section className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Questions or Verification Concerns?</h2>
            <p>
              If you have any questions regarding our affiliate relationships or wish to report an inaccurate factual claim, please reach out directly to <strong>{BRAND.contactEmail}</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
