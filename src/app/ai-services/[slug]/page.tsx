"use client";

import React, { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AI_SERVICES } from "@/data/ai-services";
import { HelpfulFeedback } from "@/components/feedback/HelpfulFeedback";
import { InArticleAd, BottomAd } from "@/components/ads/AdSlot";
import { MarkdownRenderer, InlineMarkdown } from "@/components/content/MarkdownRenderer";
import {
  Sparkles,
  Loader2,
  Check,
  Copy,
  Download,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  Info,
} from "lucide-react";

export default function ServiceRunnerPage({ params }: { params: { slug: string } }) {
  const service = AI_SERVICES.find((s) => s.slug === params.slug);

  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!service) {
    notFound();
  }

  const handleInputChange = (fieldName: string, value: string) => {
    setInputs((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOutput(null);

    try {
      const res = await fetch(`/api/ai-services/${service.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOutput(data.result);
      } else {
        setError(data.error || "Generation could not be completed.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to reach AI service.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${service.slug}-generation.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-900 dark:text-slate-400">Home</Link>
          <span>/</span>
          <Link href="/ai-services" className="hover:text-slate-900 dark:text-slate-400">AI Services</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-medium">{service.name}</span>
        </nav>

        {/* Service Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {service.category}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              100% Free Core Service
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {service.name}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            <InlineMarkdown text={service.description} />
          </p>
        </div>

        <InArticleAd />

        {/* Interactive Generation Form */}
        <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <form onSubmit={handleGenerate} className="space-y-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Configure Generation Parameters
            </h2>

            {service.inputFields.map((field) => (
              <div key={field.name}>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {field.label} {field.required && <span className="text-rose-500">*</span>}
                </label>

                {field.type === "textarea" ? (
                  <textarea
                    rows={4}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={inputs[field.name] || ""}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-y"
                  />
                ) : field.type === "select" ? (
                  <select
                    required={field.required}
                    value={inputs[field.name] || ""}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  >
                    <option value="">{field.placeholder || "Select an option..."}</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required={field.required}
                    placeholder={field.placeholder}
                    value={inputs[field.name] || ""}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                )}
              </div>
            ))}

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <span className="text-[11px] text-slate-400">
                Anti-abuse ceiling: {service.tokenCeiling} tokens • Infrastructure protection active
              </span>

              <button
                type="submit"
                disabled={loading}
                className="px-7 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Content...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Free Output</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Graceful Unconfigured or Execution Error State (Requirement 1 & 145) */}
          {error && (
            <div className="mt-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 text-xs sm:text-sm flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">AI Service Notice</p>
                <p className="text-xs leading-relaxed">{error}</p>
                <p className="text-[11px] text-amber-700/80 dark:text-amber-300/80">
                  Note: WorkAI strictly enforces honest provider status. When an AI provider key (Gemini, OpenAI, Anthropic) is not configured in environment variables, the system fails gracefully rather than faking AI generation.
                </p>
              </div>
            </div>
          )}

          {/* Success Generation Output */}
          {output && (
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Generated Deliverable</span>
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy Text"}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed border border-slate-200 dark:border-slate-800 max-h-[600px] overflow-y-auto shadow-inner">
                <MarkdownRenderer content={output} />
              </div>
            </div>
          )}
        </div>

        {/* Educational Content & Limitations (Requirement 118) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>How This Service Works</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              This utility structures your inputs into a standardized prompt template engineered specifically for {service.name.toLowerCase()} tasks. It executes through server-side AI provider abstraction, stripping potential prompt injections and enforcing strict token ceilings.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Important Limitations & Verification</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              AI-generated content should always be reviewed by a human before official submission or publishing. Always verify specific facts, names, figures, and dates against primary ground truth.
            </p>
          </div>
        </div>

        <HelpfulFeedback pagePath={`/ai-services/${service.slug}`} entityType="AI_SERVICE" entityId={service.id} />

        <BottomAd />
      </div>
    </div>
  );
}
