"use client";

import React, { useEffect } from "react";
import { SITE_CONFIG } from "@/config/brand";

interface AdSlotProps {
  slotId?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
  responsive?: boolean;
}

/**
 * AdSense-Ready AdSlot Component.
 * 
 * Strict AdSense Compliance Rules (Requirement 7 & 93):
 * - When ADSENSE_ENABLED is false (default): renders NULL.
 *   Does NOT reserve blank containers, does NOT render large empty spaces,
 *   does NOT display fake or simulated ads.
 * - When enabled: safely injects official Google AdSense <ins> tag with
 *   configured client ID and slot ID.
 */
export function AdSlot({ slotId = "default-slot", format = "auto", className = "", responsive = true }: AdSlotProps) {
  const isEnabled = SITE_CONFIG.adsense.enabled && Boolean(SITE_CONFIG.adsense.publisherId);

  useEffect(() => {
    if (isEnabled && typeof window !== "undefined") {
      try {
        // @ts-expect-error Google AdSense global
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // Silently capture any ad blocker suppression
      }
    }
  }, [isEnabled]);

  if (!isEnabled) {
    return null;
  }

  return (
    <div className={`my-6 flex justify-center overflow-hidden ${className}`} aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={SITE_CONFIG.adsense.publisherId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}

export function TopAd() {
  return <AdSlot slotId="workai-top-banner" format="horizontal" className="max-w-4xl mx-auto" />;
}

export function InArticleAd() {
  return <AdSlot slotId="workai-in-article" format="rectangle" className="my-8" />;
}

export function SidebarAd() {
  return <AdSlot slotId="workai-sidebar" format="vertical" className="w-full" />;
}

export function BottomAd() {
  return <AdSlot slotId="workai-bottom" format="horizontal" className="max-w-4xl mx-auto" />;
}

export function ResponsiveAd() {
  return <AdSlot slotId="workai-responsive" format="auto" className="w-full" />;
}
