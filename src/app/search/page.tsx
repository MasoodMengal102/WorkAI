"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Sparkles, Wrench, Layers, BookOpen, Briefcase, ArrowRight, Loader2 } from "lucide-react";
import { ToolCard } from "@/components/tools/ToolCard";
import { WorkflowCard } from "@/components/workflows/WorkflowCard";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQ);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    tools: any[];
    workflows: any[];
    guides: any[];
    services: any[];
    useCases: any[];
  }>({
    tools: [],
    workflows: [],
    guides: [],
    services: [],
    useCases: [],
  });

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults({ tools: [], workflows: [], guides: [], services: [], useCases: [] });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      if (data.success && data.results) {
        setResults(data.results);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQ) {
      performSearch(initialQ);
    }
  }, [initialQ]);

  const totalMatches =
    results.tools.length +
    results.workflows.length +
    results.guides.length +
    results.services.length +
    results.useCases.length;

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header & Input */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Platform Global Search
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Search verified tools, practical workflows, role use cases, and free built-in AI utilities.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              performSearch(query);
            }}
            className="mt-6 flex items-center gap-2 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-lg"
          >
            <Search className="w-5 h-5 text-slate-400 ml-3 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools, workflows, guides, or tasks (e.g. video, python, resume)..."
              className="w-full h-12 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none px-2"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition flex-shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Search</span>}
            </button>
          </form>
        </div>

        {/* Results Container */}
        <div className="mt-12">
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-sm text-slate-500">Searching verified database records...</p>
            </div>
          ) : query && totalMatches === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-xl mx-auto">
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                No verified records matched "{query}".
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching broad terms like "YouTube", "Resume", "Coding", or "Design".
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Matched Tools */}
              {results.tools.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                    <Wrench className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span>Matching Verified AI Tools ({results.tools.length})</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.tools.map((tool) => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Workflows */}
              {results.workflows.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                    <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span>Matching Step-by-Step Workflows ({results.workflows.length})</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.workflows.map((wf) => (
                      <WorkflowCard key={wf.id} workflow={wf} />
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Built-in Services */}
              {results.services.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span>Free Built-In Services ({results.services.length})</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.services.map((srv) => (
                      <Link
                        key={srv.slug}
                        href={`/ai-services/${srv.slug}`}
                        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/50 transition flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-sm text-slate-900 dark:text-white">{srv.name}</span>
                          <p className="text-slate-500 mt-1 line-clamp-1">{srv.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 ml-3 flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Guides */}
              {results.guides.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span>Matching Practical Guides ({results.guides.length})</span>
                  </h2>
                  <div className="space-y-3">
                    {results.guides.map((g) => (
                      <Link
                        key={g.slug}
                        href={`/guides/${g.slug}`}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/80 dark:border-slate-800 transition flex items-center justify-between text-xs sm:text-sm font-medium"
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen py-24 flex flex-col items-center justify-center text-slate-500">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
          <p className="text-sm font-medium">Loading search results...</p>
        </div>
      }
    >
      <SearchContent />
    </React.Suspense>
  );
}
