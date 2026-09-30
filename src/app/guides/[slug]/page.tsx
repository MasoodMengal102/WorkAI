import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { dataService } from "@/lib/db";
import { HelpfulFeedback } from "@/components/feedback/HelpfulFeedback";
import { InArticleAd, BottomAd } from "@/components/ads/AdSlot";
import { BookOpen, Clock, User, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { BRAND } from "@/config/brand";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = await dataService.getGuideBySlug(params.slug);
  if (!guide) return { title: "Guide Not Found" };

  return {
    title: guide.title,
    description: guide.intro,
  };
}

export default async function GuideDetailPage({ params }: Props) {
  const [guide, allGuides, allWorkflows] = await Promise.all([
    dataService.getGuideBySlug(params.slug),
    dataService.getGuides(),
    dataService.getWorkflows(),
  ]);

  if (!guide) {
    notFound();
  }

  const otherGuides = allGuides.filter((g) => g.slug !== guide.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": guide.title,
    "description": guide.intro,
    "author": {
      "@type": "Organization",
      "name": guide.authorName,
    },
    "publisher": {
      "@type": "Organization",
      "name": BRAND.name,
      "logo": `${BRAND.domain}/logo.png`,
    },
    "dateModified": guide.lastReviewedAt,
    "datePublished": guide.lastReviewedAt,
  };

  return (
    <article className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-900 dark:text-slate-400">Home</Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-slate-900 dark:text-slate-400">Guides</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-medium line-clamp-1">{guide.title}</span>
        </nav>

        {/* Article Header Card */}
        <header className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="px-2.5 py-0.5 rounded-full font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              {guide.difficulty} Level
            </span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{guide.estimatedReadTime} read</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <User className="w-3.5 h-3.5" />
              <span>By {guide.authorName}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Reviewed: {guide.lastReviewedAt}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {guide.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4 font-normal">
            {guide.intro}
          </p>
        </header>

        {/* Table of Contents */}
        {guide.tableOfContents.length > 0 && (
          <nav className="mt-8 p-6 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 mb-3">
              Table of Contents
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm">
              {guide.tableOfContents.map((item) => (
                <li key={item.anchor}>
                  <a
                    href={`#${item.anchor}`}
                    className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <InArticleAd />

        {/* Main Editorial Content */}
        <div className="mt-8 p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed text-sm sm:text-base">
          <div className="space-y-6 whitespace-pre-line">
            {guide.content}
          </div>
        </div>

        {/* Actionable Practical Steps Checklist */}
        {guide.practicalSteps.length > 0 && (
          <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-slate-100/70 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Key Action Checklist</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {guide.practicalSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Related Guides */}
        <div className="mt-12">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Continue Reading
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {otherGuides.map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/50 transition flex flex-col justify-between"
              >
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                  {g.title}
                </h4>
                <div className="mt-3 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                  <span>Read tutorial</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <HelpfulFeedback pagePath={`/guides/${guide.slug}`} entityType="GUIDE" entityId={guide.id} />

        <BottomAd />
      </div>
    </article>
  );
}
