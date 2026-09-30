import React from "react";
import { VerificationStatus } from "@/types";
import { CheckCircle2, AlertTriangle, HelpCircle, Archive } from "lucide-react";

interface VerificationBadgeProps {
  status: VerificationStatus;
  lastVerifiedAt?: string;
  sourceType?: string;
  compact?: boolean;
}

export function VerificationBadge({ status, lastVerifiedAt, sourceType, compact = false }: VerificationBadgeProps) {
  switch (status) {
    case "VERIFIED":
      return (
        <span
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900"
          title={`Verified on ${lastVerifiedAt || "recently"} via ${sourceType || "Official Website"}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Verified Facts</span>
          {!compact && lastVerifiedAt && <span className="opacity-75 font-normal">({lastVerifiedAt})</span>}
        </span>
      );

    case "NEEDS_REVIEW":
      return (
        <span
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900"
          title="Information is pending regular scheduled editorial re-verification"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Needs Review</span>
        </span>
      );

    case "ARCHIVED":
      return (
        <span
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
        >
          <Archive className="w-3.5 h-3.5" />
          <span>Archived</span>
        </span>
      );

    default:
      return (
        <span
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Unverified</span>
        </span>
      );
  }
}
