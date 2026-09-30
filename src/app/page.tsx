import React from "react";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { HowItHelps } from "@/components/home/HowItHelps";
import { FeaturedWorkflows } from "@/components/home/FeaturedWorkflows";
import { FeaturedTools } from "@/components/home/FeaturedTools";
import { PopularServices } from "@/components/home/PopularServices";
import { UseCasesGrid } from "@/components/home/UseCasesGrid";
import { LatestGuides } from "@/components/home/LatestGuides";
import { TopAd, InArticleAd } from "@/components/ads/AdSlot";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { BRAND } from "@/config/brand";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <TopAd />
      <HowItHelps />
      <FeaturedWorkflows />
      <InArticleAd />
      <FeaturedTools />
      <PopularServices />
      <UseCasesGrid />
      <LatestGuides />

      {/* Bottom Final CTA */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-800/60 border border-indigo-700/60 text-xs text-indigo-300 mb-6 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Always 100% Free For Everyone</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Tell Us What You Are Trying To Accomplish
          </h2>
          <p className="mt-4 text-sm sm:text-base text-indigo-200 max-w-xl mx-auto leading-relaxed">
            Stop wasting hours sifting through generic tool listings. Discover the exact workflow, verified free tools, and built-in utilities built for your goal.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/ai-finder"
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-xl transition flex items-center gap-2"
            >
              <span>Launch AI Finder</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/tools"
              className="px-6 py-3.5 rounded-2xl bg-indigo-800/80 hover:bg-indigo-800 text-white font-semibold text-sm border border-indigo-700 transition"
            >
              Browse 50+ Verified Tools
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
