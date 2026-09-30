import React from "react";
import { Metadata } from "next";
import { dataService } from "@/lib/db";
import { ToolCard } from "@/components/tools/ToolCard";
import { TopAd, BottomAd } from "@/components/ads/AdSlot";
import { Wrench, Filter, Sparkles } from "lucide-react";
import Link from "next/link";
import { BRAND } from "@/config/brand";

export const metadata: Metadata = {
  title: "Verified AI Tools Directory (50+ Real Tools)",
  description: "Browse verified AI tools with honest pricing status, platform compatibility, limitations, and editorial reviews. No fake ratings, no paid bias.",
};

export default async function ToolsDirectoryPage({
  searchParams,
}: {
  searchParams?: { category?: string; pricing?: string; search?: string };
}) {
  const [tools, categories] = await Promise.all([
    dataService.getTools(),
    dataService.getCategories(),
  ]);

  const activeCategory = searchParams?.category;
  const activePricing = searchParams?.pricing;
  const searchFilter = (searchParams?.search || "").toLowerCase().trim();

  const filteredTools = tools.filter((tool) => {
    if (activeCategory && activeCategory !== "all" && tool.category !== activeCategory) {
      return false;
    }
    if (activePricing && activePricing !== "all" && tool.pricingStatus !== activePricing) {
      return false;
    }
    if (searchFilter) {
      const corpus = `${tool.name} ${tool.description} ${tool.category} ${tool.features.join(" ")}`.toLowerCase();
      if (!corpus.includes(searchFilter)) return false;
    }
    return true;
  });

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-xs font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 mb-4">
            <Wrench className="w-3.5 h-3.5" />
            <span>50+ Verified Public AI Tools</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Verified AI Tools Directory
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Every tool fact is verified against official documentation and licensing. Filter by pricing tier, category, and platform compatibility.
          </p>
        </div>

        <TopAd />

        {/* Filter Navigation */}
        <div className="mt-10 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Filter className="w-4 h-4" />
              <span>Filter by Category:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <Link
                href="/tools"
                className={`px-3 py-1.5 rounded-xl font-medium transition ${
                  !activeCategory
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                All Categories ({tools.length})
              </Link>
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/tools?category=${cat.slug}${activePricing ? `&pricing=${activePricing}` : ""}`}
                  className={`px-3 py-1.5 rounded-xl font-medium transition ${
                    activeCategory === cat.slug
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {cat.name.split(" ")[1] || cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Pricing Status Tabs */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500 mr-2">Pricing Status:</span>
            {["all", "FREE", "FREEMIUM", "FREE_TRIAL", "PAID"].map((tier) => {
              const isActive = (tier === "all" && !activePricing) || activePricing === tier;
              const label = tier === "all" ? "All Tiers" : tier === "FREE" ? "100% Free" : tier === "FREEMIUM" ? "Freemium" : tier === "FREE_TRIAL" ? "Free Trial" : "Paid";
              return (
                <Link
                  key={tier}
                  href={`/tools?${activeCategory ? `category=${activeCategory}&` : ""}${tier !== "all" ? `pricing=${tier}` : ""}`}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    isActive
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Directory Grid */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs sm:text-sm text-slate-500">
              Showing <strong className="text-slate-900 dark:text-white">{filteredTools.length}</strong> verified tools
            </p>
            <Link href="/ai-finder" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Need help picking? Use AI Finder →</span>
            </Link>
          </div>

          {filteredTools.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                No verified tools matched your specific filter combination.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Try selecting "All Categories" or clearing the pricing filter.
              </p>
              <Link
                href="/tools"
                className="mt-4 inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
              >
                Reset Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </div>

        <BottomAd />
      </div>
    </div>
  );
}
