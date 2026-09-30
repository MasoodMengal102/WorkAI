"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Compass, Sparkles, Filter, CheckCircle2, ExternalLink, ArrowRight, Loader2, Globe, Monitor, Smartphone, Terminal } from "lucide-react";
import { RecommendationMatch } from "@/ai/finder";
import { VerificationBadge } from "@/components/tools/VerificationBadge";
import { TopAd, BottomAd } from "@/components/ads/AdSlot";

export default function AIFinderPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [pricingStatus, setPricingStatus] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [commercialUseOnly, setCommercialUseOnly] = useState(false);
  const [apiRequired, setApiRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<RecommendationMatch[]>([]);
  const [searched, setSearched] = useState(false);

  const executeSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch("/api/ai-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          category: category !== "all" ? category : undefined,
          pricingStatus: pricingStatus !== "all" ? pricingStatus : undefined,
          platform: platform !== "all" ? platform : undefined,
          commercialUseOnly,
          apiRequired,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMatches(data.matches || []);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSearch();
  }, [category, pricingStatus, platform, commercialUseOnly, apiRequired]);

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-xs font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>Explainable AI Finder</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Find the Exact AI Tool for Your Task
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Describe what you need in natural language or filter by exact verified requirements. Recommendations explain exactly why they match.
          </p>
        </div>

        <TopAd />

        {/* Interactive Query Box */}
        <div className="mt-10 max-w-4xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeSearch();
            }}
            className="p-3 sm:p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What do you need? (e.g. Free tool for YouTube thumbnails, coding assistant for React...)"
                className="w-full h-14 pl-5 pr-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <button
                type="submit"
                disabled={loading}
                className="h-14 px-7 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition whitespace-nowrap"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Find Matches</span>
              </button>
            </div>

            {/* Granular Filters Grid */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-500 block mb-1">Pricing Tier</label>
                <select
                  value={pricingStatus}
                  onChange={(e) => setPricingStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="all">Any Pricing</option>
                  <option value="FREE">100% Free Only</option>
                  <option value="FREEMIUM">Free & Freemium</option>
                  <option value="PAID">Paid Only</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-500 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="all">All Categories</option>
                  <option value="chatbots">Chatbots & Assistants</option>
                  <option value="coding">Coding & Development</option>
                  <option value="writing">Writing & Editing</option>
                  <option value="video">Video & Animation</option>
                  <option value="image-generation">Image Generation</option>
                  <option value="voice">Voice & Speech</option>
                  <option value="research">Research & Science</option>
                  <option value="automation">Automation & Workflows</option>
                  <option value="open-source">Local & Open Source</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-500 block mb-1">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="all">Any Platform</option>
                  <option value="Browser">Web Browser</option>
                  <option value="Desktop">Desktop App</option>
                  <option value="Mobile">Mobile App</option>
                  <option value="API">Developer API</option>
                </select>
              </div>

              <div className="flex flex-col justify-end space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={commercialUseOnly}
                    onChange={(e) => setCommercialUseOnly(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <span className="text-slate-700 dark:text-slate-300">Commercial Use OK</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={apiRequired}
                    onChange={(e) => setApiRequired(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <span className="text-slate-700 dark:text-slate-300">API Access Required</span>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Explainable Results Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {searched ? `Found ${matches.length} Verified Matching Tools` : "Recommended Matches"}
            </h2>
            <span className="text-xs text-slate-500">
              Ranked by task fit & verified terms • No affiliate influence
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-sm text-slate-500">Evaluating verified capabilities...</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                We couldn't find a verified match for this specific combination yet.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Try widening your search terms or unchecking constraints.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map(({ tool, explanation, matchReasons }) => (
                <div
                  key={tool.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-lg transition flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/tools/${tool.slug}`} className="text-lg font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition">
                        {tool.name}
                      </Link>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {tool.pricingStatus}
                      </span>
                      <VerificationBadge status={tool.verificationStatus} compact />
                    </div>

                    {/* Factual Transparent Explanation (Requirement 16) */}
                    <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-700 dark:text-slate-300">
                      <strong className="text-indigo-700 dark:text-indigo-300">Why this matches: </strong>
                      <span>{explanation}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      {tool.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                      <span><strong>Free Allowance:</strong> {tool.freeAvailability}</span>
                      <span>•</span>
                      <span><strong>Platforms:</strong> {tool.platforms.join(", ")}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-2 flex-shrink-0">
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold text-center transition"
                    >
                      Read Editorial Review
                    </Link>
                    <a
                      href={`/go/${tool.id}`}
                      target="_blank"
                      rel={tool.affiliateStatus === "ACTIVE" ? "noopener noreferrer sponsored" : "noopener noreferrer"}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium text-center flex items-center justify-center gap-1 transition"
                    >
                      <span>Official Site</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <BottomAd />
      </div>
    </div>
  );
}
