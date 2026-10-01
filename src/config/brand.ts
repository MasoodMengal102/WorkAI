/**
 * Centralized Brand Configuration for WorkAI.
 * 
 * "WorkAI" is the development/working name. All brand strings,
 * domains, contact emails, and social profiles must be referenced from here.
 * To rebrand or configure domain/company specifics, modify this file or
 * override via environment variables.
 */

export interface BrandConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  domain: string;
  supportEmail: string;
  contactEmail: string;
  legalEntity: string;
  author: {
    name: string;
    whatsapp: string;
    whatsappUrl: string;
    email: string;
  };
  social: {
    twitter: string;
    github: string;
    linkedin: string;
    youtube: string;
  };
  navigation: {
    label: string;
    href: string;
  }[];
}

export const BRAND: BrandConfig = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME || "WorkAI",
  shortName: process.env.NEXT_PUBLIC_BRAND_SHORT_NAME || "WorkAI",
  tagline: "Tell us what you want to accomplish, and we will show you how AI can help.",
  description:
    "An international, free AI discovery and workflow engine. Find verified AI tools, follow step-by-step action plans, and access built-in free AI productivity utilities.",
  domain:
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.BASE_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    "https://workai.onrender.com",
  supportEmail: process.env.SUPPORT_EMAIL || "support@workai.example.com",
  contactEmail: process.env.CONTACT_EMAIL || "contact@workai.example.com",
  legalEntity: "WorkAI Platform (Global Initiative)",
  author: {
    name: "Masood Mengal",
    whatsapp: "03461810286",
    whatsappUrl: "https://wa.me/923461810286",
    email: "waernamengal643@gmail.com",
  },
  social: {
    twitter: "https://twitter.com/workai_hub",
    github: "https://github.com/workai-platform",
    linkedin: "https://linkedin.com/company/workai-hub",
    youtube: "https://youtube.com/@workai_hub",
  },
  navigation: [
    { label: "AI Finder", href: "/ai-finder" },
    { label: "AI Tools", href: "/tools" },
    { label: "Workflows", href: "/workflows" },
    { label: "Use Cases", href: "/use-cases" },
    { label: "AI Services", href: "/ai-services" },
    { label: "Comparisons", href: "/compare" },
    { label: "Guides", href: "/guides" },
  ],
};

export const SITE_CONFIG = {
  verificationThresholdDays: 90,
  maxDailyAnonymousGenerations: 15,
  maxDailyAuthGenerations: 50,
  adsense: {
    enabled: process.env.ADSENSE_ENABLED === "true",
    publisherId: process.env.ADSENSE_PUBLISHER_ID || "",
  },
  analytics: {
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || "",
  },
};
