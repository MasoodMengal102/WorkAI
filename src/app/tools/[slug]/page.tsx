import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { dataService } from "@/lib/db";
import { VerificationBadge } from "@/components/tools/VerificationBadge";
import { HelpfulFeedback } from "@/components/feedback/HelpfulFeedback";
import { InArticleAd, BottomAd } from "@/components/ads/AdSlot";
import { InlineMarkdown } from "@/components/content/MarkdownRenderer";
import {
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Monitor,
  Terminal,
  Smartphone,
  ShieldCheck,
  Layers,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { BRAND } from "@/config/brand";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = await dataService.getToolBySlug(params.slug);
  if (!tool) return { title: "Tool Not Found" };

  return {
    title: `${tool.name} Review, Pricing & Free Tier Limits`,
    description: `Verified editorial overview for ${tool.name}. ${tool.description} Free availability: ${tool.freeAvailability}.`,
    openGraph: {
      title: `${tool.name} — Verified Features & Pricing Analysis`,
      description: tool.description,
    },
  };
}

export default async function ToolDetailPage({ params }: Props) {
  const [tool, allWorkflows, allGuides, allTools] = await Promise.all([
    dataService.getToolBySlug(params.slug),
    dataService.getWorkflows(),
    dataService.getGuides(),
    dataService.getTools(),
  ]);

  if (!tool) {
    notFound();
  }

  // Find related workflows
  const relatedWorkflows = allWorkflows.filter(
    (w) => w.steps.some((s) => s.recommendedToolSlug === tool.slug || s.recommendedToolName.toLowerCase() === tool.name.toLowerCase()) || w.category.toLowerCase().includes(tool.category)
  ).slice(0, 3);

  // Find alternative tools in same category
  const alternatives = allTools
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 4);

  // Related guides
  const relatedGuides = allGuides
    .filter((g) => g.content.toLowerCase().includes(tool.name.toLowerCase()) || g.slug.includes(tool.category))
    .slice(0, 3);

  const outboundUrl = `/go/${tool.id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "operatingSystem": tool.platforms.join(", "),
    "applicationCategory": tool.category,
    "offers": {
      "@type": "Offer",
      "price": tool.pricingStatus === "FREE" ? "0" : undefined,
      "priceCurrency": "USD",
      "category": tool.pricingStatus,
    },
    "description": tool.description,
    "url": tool.officialUrl,
  };

  return (
    <article className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-slate-900 dark:hover:text-white">AI Tools</Link>
          <span>/</span>
          <Link href={`/categories/${tool.category}`} className="hover:text-slate-900 dark:hover:text-white uppercase">{tool.category}</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-medium">{tool.name}</span>
        </nav>

        {/* Hero Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {tool.category}
                </span>
                {tool.subcategory && (
                  <span className="text-xs text-slate-400">• {tool.subcategory}</span>
                )}
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {tool.pricingStatus}
                </span>
              </div>
              <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {tool.name} Review & Verified Details
              </h1>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2 flex-shrink-0">
              <a
                href={outboundUrl}
                target="_blank"
                rel={tool.affiliateStatus === "ACTIVE" ? "noopener noreferrer sponsored" : "noopener noreferrer"}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition"
              >
                <span>Visit Official Site</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <div className="text-[11px] text-slate-400">
                <VerificationBadge status={tool.verificationStatus} lastVerifiedAt={tool.lastVerifiedAt} sourceType={tool.verificationSourceType} />
              </div>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
            <InlineMarkdown text={tool.description} />
          </p>

          {/* Key Facts Summary Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Free Availability</span>
              <span className="font-semibold text-slate-900 dark:text-white mt-0.5 block">{tool.freeAvailability}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Commercial Use</span>
              <span className="font-semibold text-slate-900 dark:text-white mt-0.5 block">{tool.commercialUse}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Platforms</span>
              <span className="font-semibold text-slate-900 dark:text-white mt-0.5 block">{tool.platforms.join(", ")}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">API Availability</span>
              <span className="font-semibold text-slate-900 dark:text-white mt-0.5 block">{tool.apiAvailability ? "Yes (Developer API)" : "No Public API"}</span>
            </div>
          </div>
        </div>

        {/* Affiliate Disclosure Notice (Requirement 6 & 61) */}
        {tool.affiliateStatus === "ACTIVE" && (
          <div className="mt-4 p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Affiliate Disclosure:</strong> When you purchase or sign up for {tool.name} through our link, we may earn an affiliate commission at no extra cost to you. This relationship does not influence our editorial analysis or ranking algorithms. All evaluations remain honest and independent. Read our{" "}
              <Link href="/affiliate-disclosure" className="underline text-indigo-600 dark:text-indigo-400">Affiliate Disclosure</Link>.
            </p>
          </div>
        )}

        <InArticleAd />

        {/* Detailed Sections */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main 2-column Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Features */}
            <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Verified Capabilities & Key Features
              </h2>
              <ul className="space-y-2.5">
                {tool.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                    <span><InlineMarkdown text={feature} /></span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Primary Use Cases */}
            <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Primary Use Cases
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tool.useCases.map((uc) => (
                  <div key={uc} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 font-medium">
                    <InlineMarkdown text={uc} />
                  </div>
                ))}
              </div>
            </section>

            {/* Limitations & Drawbacks (Crucial Honesty Rule) */}
            <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Known Limitations & Trade-offs</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                <InlineMarkdown text={tool.limitations} />
              </p>
            </section>

            {/* Editorial Take */}
            <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                WorkAI Editorial Assessment
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                <InlineMarkdown text={tool.editorialNotes} />
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                <span>Verified Source: </span>
                <a href={tool.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  {tool.sourceUrl}
                </a>
              </div>
            </section>

            {/* Related Workflows */}
            {relatedWorkflows.length > 0 && (
              <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Workflows Featuring {tool.name}</span>
                </h2>
                <div className="space-y-3">
                  {relatedWorkflows.map((wf) => (
                    <Link
                      key={wf.slug}
                      href={`/workflows/${wf.slug}`}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/60 dark:border-slate-800 transition flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white">{wf.title}</span>
                        <p className="text-slate-500 mt-0.5">{wf.estimatedTime} • {wf.difficulty}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 ml-2" />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar: Alternatives & Comparisons */}
          <div className="space-y-6">
            {/* Top Alternatives */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                Verified Alternatives
              </h3>
              <div className="space-y-3">
                {alternatives.map((alt) => (
                  <Link
                    key={alt.slug}
                    href={`/tools/${alt.slug}`}
                    className="block p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-white">{alt.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {alt.pricingStatus}
                      </span>
                    </div>
                    <p className="text-slate-500 mt-1 line-clamp-1">{alt.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Related Guides */}
            {relatedGuides.length > 0 && (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Related Guides</span>
                </h3>
                <div className="space-y-2 text-xs">
                  {relatedGuides.map((g) => (
                    <Link
                      key={g.slug}
                      href={`/guides/${g.slug}`}
                      className="block p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {g.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Helpful Feedback Widget */}
        <HelpfulFeedback pagePath={`/tools/${tool.slug}`} entityType="TOOL" entityId={tool.id} />

        <BottomAd />
      </div>
    </article>
  );
}
