import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { dataService } from "@/lib/db";
import { WorkflowStepView } from "@/components/workflows/WorkflowStepView";
import { HelpfulFeedback } from "@/components/feedback/HelpfulFeedback";
import { InArticleAd, BottomAd } from "@/components/ads/AdSlot";
import { Clock, Layers, UserCheck, CheckCircle2, ArrowRight } from "lucide-react";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const workflow = await dataService.getWorkflowBySlug(params.slug);
  if (!workflow) return { title: "Workflow Not Found" };

  return {
    title: `${workflow.title} — Step-by-Step AI Action Plan`,
    description: `${workflow.description} Estimated time: ${workflow.estimatedTime}. Difficulty: ${workflow.difficulty}.`,
  };
}

export default async function WorkflowDetailPage({ params }: Props) {
  const [workflow, allGuides] = await Promise.all([
    dataService.getWorkflowBySlug(params.slug),
    dataService.getGuides(),
  ]);

  if (!workflow) {
    notFound();
  }

  const relatedGuides = allGuides.filter((g) => g.content.toLowerCase().includes(workflow.category.toLowerCase()) || g.slug.includes(workflow.category.toLowerCase())).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": workflow.title,
    "description": workflow.description,
    "totalTime": workflow.estimatedTime,
    "step": workflow.steps.map((s) => ({
      "@type": "HowToStep",
      "position": s.stepNumber,
      "name": s.title,
      "text": s.action,
    })),
  };

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-900 dark:text-slate-400">Home</Link>
          <span>/</span>
          <Link href="/workflows" className="hover:text-slate-900 dark:text-slate-400">Workflows</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-medium">{workflow.title}</span>
        </nav>

        {/* Workflow Overview Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {workflow.category}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              {workflow.difficulty} Level
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Est. {workflow.estimatedTime}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {workflow.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            {workflow.description}
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex items-start gap-3">
            <UserCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-slate-200">Target Audience: </strong>
              {workflow.targetAudience}
            </div>
          </div>

          {/* Goals Checklist */}
          {workflow.goals.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                What You Will Achieve:
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                {workflow.goals.map((goal) => (
                  <li key={goal} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <InArticleAd />

        {/* Step-by-Step Sequenced Steps */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <Layers className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span>Step-by-Step Execution Sequence</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {workflow.steps.length} Total Steps
            </span>
          </div>

          <div className="space-y-4">
            {workflow.steps.map((step) => (
              <WorkflowStepView key={step.stepNumber} step={step} />
            ))}
          </div>
        </div>

        {/* Related Guides */}
        {relatedGuides.length > 0 && (
          <div className="mt-16 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Recommended Accompanying Guides
            </h3>
            <div className="space-y-3">
              {relatedGuides.map((g) => (
                <Link
                  key={g.slug}
                  href={`/guides/${g.slug}`}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between text-xs font-medium"
                >
                  <span className="text-slate-900 dark:text-white">{g.title}</span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <span>{g.estimatedReadTime}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <HelpfulFeedback pagePath={`/workflows/${workflow.slug}`} entityType="WORKFLOW" entityId={workflow.id} />

        <BottomAd />
      </div>
    </div>
  );
}
