import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { dataService } from "@/lib/db";
import { Briefcase, ArrowRight } from "lucide-react";
import { TopAd, BottomAd } from "@/components/ads/AdSlot";

export const metadata: Metadata = {
  title: "AI Solutions by Role & Profession (15+ Curated Use Cases)",
  description: "Explore tailored AI toolstacks, workflows, and solutions for YouTubers, Students, Freelancers, Developers, Small Businesses, Marketers, Teachers, and more.",
};

export default async function UseCasesIndexPage() {
  const useCases = await dataService.getUseCases();

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-xs font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 mb-4">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Role-Specific Solutions</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Use Cases for Professionals
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Discover how creators, developers, educators, and businesses overcome real-world bottlenecks using verified AI workflows.
          </p>
        </div>

        <TopAd />

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((uc) => (
            <Link
              key={uc.slug}
              href={`/use-cases/${uc.slug}`}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  {uc.targetRole}
                </span>

                <h2 className="mt-2 text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                  {uc.title}
                </h2>

                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {uc.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>View Full Solution & Tools</span>
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
