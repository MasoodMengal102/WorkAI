import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { dataService } from "@/lib/db";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { TopAd, BottomAd } from "@/components/ads/AdSlot";
import { InlineMarkdown } from "@/components/content/MarkdownRenderer";

export const metadata: Metadata = {
  title: "Practical AI Guides & Editorial Tutorials (20+ In-Depth Guides)",
  description: "Learn how to use AI tools properly with step-by-step editorial tutorials, verified prompt templates, and clear limitations. Zero generic filler.",
};

export default async function GuidesIndexPage() {
  const guides = await dataService.getGuides();

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-xs font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>20+ Editorial Tutorials</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Practical AI Implementation Guides
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Written by experienced practitioners. Step-by-step instructions, proven prompt structures, and critical trade-offs for real-world tasks.
          </p>
        </div>

        <TopAd />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {guide.difficulty}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{guide.estimatedReadTime} read</span>
                  </div>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition leading-snug">
                  {guide.title}
                </h2>

                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  <InlineMarkdown text={guide.intro} />
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Read Full Tutorial</span>
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
