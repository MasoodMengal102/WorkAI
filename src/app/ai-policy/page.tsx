import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { Sparkles, AlertTriangle, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Accuracy & Ethics Policy",
  description: `AI Policy for ${BRAND.name}. Learn how we use AI responsibly, separate intent analysis from verified facts, and safeguard against hallucinations.`,
};

export default function AiPolicyPage() {
  return (
    <div className="py-16 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Responsible AI Framework</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Accuracy & Verification Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Last Updated: September 2026 • Strict Grounding Standard
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. AI Output Can Contain Inaccuracies</h2>
            <p>
              Generative artificial intelligence models are probabilistic systems. While extraordinarily helpful for brainstorming, synthesizing outlines, and drafting text, AI outputs may occasionally contain factual omissions, hallucinations, or unverified claims.
            </p>
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>User Responsibility Notice:</strong> You should always independently review, verify, and edit any AI-generated resume, script, prompt, or email before sending it to a client, recruiter, or publisher.
              </span>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Separation of LLM Reasoning & Verified Database Truth</h2>
            <p>
              On {BRAND.name}, we enforce a strict architectural boundary:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong>What the AI does:</strong> Analyzes your conversational objective, extracts tasks, suggests workflow sequences, and formats drafts.</li>
              <li><strong>What the AI NEVER does:</strong> Invent tool pricing, manufacture review scores, fabricate partnerships, or guess whether an API exists.</li>
            </ul>
            <p>
              All factual recommendations presented to visitors originate from verified records audited by our human editorial desk.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Zero-Training Data Commitment</h2>
            <p>
              Prompts submitted to our built-in free services are never sold, never made public, and never used to train public machine learning foundational models. We exclusively integrate with enterprise developer API tiers that provide legal zero-training guarantees.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
