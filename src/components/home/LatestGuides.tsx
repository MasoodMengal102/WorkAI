import React from "react";
import Link from "next/link";
import { GUIDES } from "@/data/guides";
import { BookOpen, ArrowRight, Clock } from "lucide-react";
import { InlineMarkdown } from "@/components/content/MarkdownRenderer";

export function LatestGuides() {
  const latest = GUIDES.slice(0, 6);

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Editorial Tutorials</span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl">
              Practical Implementation Guides
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              No generic fluff. Deep tutorials written with verified step-by-step instructions, prompt templates, and real tool references.
            </p>
          </div>
          <Link
            href="/guides"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            <span>View All 20 Guides</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latest.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/50 hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {guide.difficulty}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{guide.estimatedReadTime} read</span>
                  </div>
                </div>

                <h3 className="mt-4 text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition leading-snug">
                  {guide.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  <InlineMarkdown text={guide.intro} />
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">By {guide.authorName}</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
