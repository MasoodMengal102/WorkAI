import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { AI_SERVICES } from "@/data/ai-services";
import { TopAd, BottomAd } from "@/components/ads/AdSlot";
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "15 Free Built-In AI Services & Productivity Utilities",
  description: "Free functional AI utilities for everyone: Resume Builder, YouTube Script Generator, Prompt Generator, Quiz Maker, Cover Letter Writer, and more. No paid credits required.",
};

export default function AiServicesIndexPage() {
  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-xs font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Free AI Productivity Utilities</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Free Built-In AI Services
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Execute real productivity workflows directly on our platform. No paywalls, no subscriptions, and no fake demo text.
          </p>
        </div>

        <TopAd />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AI_SERVICES.map((service) => (
            <Link
              key={service.slug}
              href={`/ai-services/${service.slug}`}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/50 hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {service.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Free</span>
                  </span>
                </div>

                <h2 className="mt-3 text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                  {service.name}
                </h2>

                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Launch Generator</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        <BottomAd />
      </div>
    </div>
  );
}
