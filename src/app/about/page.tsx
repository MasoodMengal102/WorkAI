import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { Sparkles, ShieldCheck, CheckCircle2, Heart, Mail, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: `About ${BRAND.name} — Our Mission & Editorial Standards`,
  description: `Learn about ${BRAND.name}'s mission to build an international, verified AI workflow discovery engine without paywalls, fake reviews, or affiliate manipulation.`,
};

export default function AboutPage() {
  return (
    <div className="py-16 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Mission</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            About {BRAND.name}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {BRAND.tagline}
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Why We Built {BRAND.name}
          </h2>
          <p>
            The internet is flooded with hundreds of generic AI directories that exist solely as affiliate link farms. They scrape random software tools, generate robotic summaries, invent fake 5-star ratings, and rank whichever company pays the highest commission.
          </p>
          <p>
            When someone asks: <em>"I want to make YouTube videos with AI"</em> or <em>"I want to build a resume,"</em> they do not need 500 random logos. They need an <strong>actionable, step-by-step workflow</strong>, transparent pricing facts, honest limitations, and verified free tools.
          </p>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-4">
            Our 4 Core Commitments
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong>100% Free Core Platform for Users:</strong> We never charge subscriptions, sell credits, or construct artificial paywalls for normal users. Our platform is supported through standard non-intrusive advertising (Google AdSense) and legitimate affiliate partnerships.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Zero Fake Reviews & Provenance Verification:</strong> We never invent review counts, star ratings, or benchmark scores. Every tool fact (pricing tier, free availability, commercial use, API status) is verified against official product documentation.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Affiliate Independence:</strong> A tool having an affiliate partnership never changes its ranking in our AI Finder or Goal Analyzer. Outbound affiliate links are routed safely through internal redirects and clearly disclosed.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong>No Hallucinated AI Tool Data:</strong> LLMs are used to understand your conversational intent, but all tool facts come strictly from our verified database records.
              </div>
            </li>
          </ul>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              <span className="font-semibold text-slate-900 dark:text-white block">
                Author & Creator: {BRAND.author.name}
              </span>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <a
                  href={BRAND.author.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>WhatsApp: {BRAND.author.whatsapp}</span>
                </a>
                <span>•</span>
                <a
                  href={`mailto:${BRAND.author.email}`}
                  className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Mail className="w-3 h-3" />
                  <span>{BRAND.author.email}</span>
                </a>
              </div>
            </div>
            <Link href="/contact" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Get in touch with our team →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
