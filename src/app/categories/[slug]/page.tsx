import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { dataService } from "@/lib/db";
import { ToolCard } from "@/components/tools/ToolCard";
import { WorkflowCard } from "@/components/workflows/WorkflowCard";
import { TopAd, BottomAd } from "@/components/ads/AdSlot";
import { InlineMarkdown } from "@/components/content/MarkdownRenderer";
import { Layers, ArrowRight, BookOpen, Briefcase } from "lucide-react";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categories = await dataService.getCategories();
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} — Verified AI Tools & Workflows`,
    description: `Browse verified ${category.name}. ${category.description} Compare pricing, capabilities, and workflows.`,
  };
}

export default async function CategoryDetailPage({ params }: Props) {
  const [categories, allTools, allWorkflows, allGuides, allUseCases] = await Promise.all([
    dataService.getCategories(),
    dataService.getTools(),
    dataService.getWorkflows(),
    dataService.getGuides(),
    dataService.getUseCases(),
  ]);

  const category = categories.find((c) => c.slug === params.slug);
  if (!category) {
    notFound();
  }

  const categoryTools = allTools.filter((t) => t.category === category.slug);
  const categoryWorkflows = allWorkflows.filter((w) => w.category.toLowerCase().includes(category.slug) || w.description.toLowerCase().includes(category.slug));
  const categoryGuides = allGuides.filter((g) => g.slug.includes(category.slug) || g.content.toLowerCase().includes(category.name.toLowerCase())).slice(0, 3);
  const categoryUseCases = allUseCases.filter((uc) => uc.slug.includes(category.slug) || uc.summary.toLowerCase().includes(category.slug)).slice(0, 3);

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-900 dark:text-slate-400">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-slate-900 dark:text-slate-400">Tools</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-medium">{category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Category Overview
          </span>
          <h1 className="mt-2 text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {category.name}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            <InlineMarkdown text={category.description} />
          </p>
        </div>

        <TopAd />

        {/* Verified Tools Grid */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Verified Tools in {category.name} ({categoryTools.length})
            </h2>
            <Link href="/ai-finder" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
              Match tools with AI Finder →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>

        {/* Recommended Workflows */}
        {categoryWorkflows.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Recommended Workflows for {category.name}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryWorkflows.map((wf) => (
                <WorkflowCard key={wf.id} workflow={wf} />
              ))}
            </div>
          </div>
        )}

        {/* Related Guides & Use Cases */}
        <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8">
          {categoryGuides.length > 0 && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Related Practical Guides</span>
              </h3>
              <div className="space-y-3">
                {categoryGuides.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/guides/${g.slug}`}
                    className="block p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs"
                  >
                    <span className="font-semibold text-slate-900 dark:text-white">{g.title}</span>
                    <p className="text-slate-500 mt-1">{g.estimatedReadTime} read</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {categoryUseCases.length > 0 && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Target Professional Use Cases</span>
              </h3>
              <div className="space-y-3">
                {categoryUseCases.map((uc) => (
                  <Link
                    key={uc.slug}
                    href={`/use-cases/${uc.slug}`}
                    className="block p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs"
                  >
                    <span className="font-semibold text-slate-900 dark:text-white">{uc.title}</span>
                    <p className="text-slate-500 mt-1">{uc.targetRole}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <BottomAd />
      </div>
    </div>
  );
}
