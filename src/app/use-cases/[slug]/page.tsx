import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { dataService } from "@/lib/db";
import { ToolCard } from "@/components/tools/ToolCard";
import { HelpfulFeedback } from "@/components/feedback/HelpfulFeedback";
import { InArticleAd, BottomAd } from "@/components/ads/AdSlot";
import { Briefcase, AlertCircle, Sparkles, CheckCircle2, Layers, ArrowRight } from "lucide-react";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const useCase = await dataService.getUseCaseBySlug(params.slug);
  if (!useCase) return { title: "Use Case Not Found" };

  return {
    title: `${useCase.title} — Verified Workflows & Toolstacks`,
    description: useCase.summary,
  };
}

export default async function UseCaseDetailPage({ params }: Props) {
  const [useCase, allTools, allWorkflows, allServices] = await Promise.all([
    dataService.getUseCaseBySlug(params.slug),
    dataService.getTools(),
    dataService.getWorkflows(),
    dataService.getAiServices(),
  ]);

  if (!useCase) {
    notFound();
  }

  // Find related tools
  const relatedTools = allTools.filter((t) => useCase.relatedTools.includes(t.slug));

  // Find related workflows
  const relatedWorkflows = allWorkflows.filter((w) => useCase.relatedWorkflows.includes(w.slug));

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-900 dark:text-slate-400">Home</Link>
          <span>/</span>
          <Link href="/use-cases" className="hover:text-slate-900 dark:text-slate-400">Use Cases</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-medium">{useCase.targetRole}</span>
        </nav>

        {/* Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Target Role: {useCase.targetRole}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {useCase.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            {useCase.summary}
          </p>
        </div>

        <InArticleAd />

        {/* Problems & Opportunities Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Real Bottlenecks */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              <span>Common Roadblocks & Inefficiencies</span>
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {useCase.problems.map((prob, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{prob}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Leverage Opportunities */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>AI Leverage Opportunities</span>
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {useCase.opportunities.map((opp, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{opp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Practical Solutions */}
        <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Practical Implementation Solutions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {useCase.practicalSolutions.map((sol, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{sol}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Toolstack */}
        {relatedTools.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Recommended Verified Toolstack for {useCase.targetRole}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        )}

        {/* Related Workflows */}
        {relatedWorkflows.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Step-by-Step Action Blueprints</span>
            </h2>
            <div className="space-y-3">
              {relatedWorkflows.map((wf) => (
                <Link
                  key={wf.slug}
                  href={`/workflows/${wf.slug}`}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/80 dark:border-slate-800 transition flex items-center justify-between text-xs sm:text-sm font-medium"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{wf.title}</span>
                    <p className="text-xs text-slate-500 mt-0.5">{wf.estimatedTime} • {wf.difficulty}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 ml-4 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

        <HelpfulFeedback pagePath={`/use-cases/${useCase.slug}`} entityType="USE_CASE" entityId={useCase.id} />

        <BottomAd />
      </div>
    </div>
  );
}
