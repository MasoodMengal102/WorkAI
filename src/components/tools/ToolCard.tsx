import React from "react";
import Link from "next/link";
import { ToolItem } from "@/types";
import { VerificationBadge } from "./VerificationBadge";
import { ExternalLink, ArrowRight, Monitor, Globe, Smartphone, Terminal } from "lucide-react";
import { InlineMarkdown } from "@/components/content/MarkdownRenderer";

interface ToolCardProps {
  tool: ToolItem;
}

export function ToolCard({ tool }: ToolCardProps) {
  const getPricingBadge = (status: ToolItem["pricingStatus"]) => {
    switch (status) {
      case "FREE":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">100% Free</span>;
      case "FREEMIUM":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">Freemium</span>;
      case "FREE_TRIAL":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">Free Trial</span>;
      case "PAID":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300">Paid Plan</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500">Check Pricing</span>;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "browser":
        return <span key={platform} title="Browser" className="inline-flex items-center"><Globe className="w-3 h-3" /></span>;
      case "desktop":
        return <span key={platform} title="Desktop" className="inline-flex items-center"><Monitor className="w-3 h-3" /></span>;
      case "mobile":
        return <span key={platform} title="Mobile" className="inline-flex items-center"><Smartphone className="w-3 h-3" /></span>;
      case "api":
        return <span key={platform} title="API" className="inline-flex items-center"><Terminal className="w-3 h-3" /></span>;
      default:
        return null;
    }
  };

  // Safe internal redirect link for click tracking and affiliate disclosure compliance
  const outboundUrl = `/go/${tool.id}`;

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/50 hover:shadow-xl transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Header: Category & Status */}
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/categories/${tool.category}`}
            className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {tool.category}
          </Link>
          <div className="flex items-center gap-1.5">
            {getPricingBadge(tool.pricingStatus)}
          </div>
        </div>

        {/* Title & Description */}
        <Link href={`/tools/${tool.slug}`} className="block mt-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {tool.name}
          </h3>
        </Link>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
          <InlineMarkdown text={tool.description} />
        </p>

        {/* Free Availability Detail */}
        <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-600 dark:text-slate-400">
          <span className="font-semibold text-slate-900 dark:text-slate-200">Free Tier: </span>
          <InlineMarkdown text={tool.freeAvailability} />
        </div>

        {/* Platforms & Badges */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-slate-500 text-xs">
          <div className="flex items-center gap-1 text-slate-400">
            {tool.platforms.map((p) => getPlatformIcon(p))}
          </div>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <VerificationBadge status={tool.verificationStatus} compact />
        </div>
      </div>

      {/* Card Footer: Detail Link & Outbound CTA */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <Link
          href={`/tools/${tool.slug}`}
          className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
        >
          <span>Full Editorial Review</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <a
          href={outboundUrl}
          target="_blank"
          rel={tool.affiliateStatus === "ACTIVE" ? "noopener noreferrer sponsored" : "noopener noreferrer"}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1 transition"
          title={`Visit ${tool.name} official site`}
        >
          <span>Official Site</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
