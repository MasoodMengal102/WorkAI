import React from "react";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { Sparkles, Heart, Shield, CheckCircle2, Mail, MessageCircle } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                {BRAND.name}
              </span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed max-w-sm text-slate-500 dark:text-slate-400">
              {BRAND.tagline} {BRAND.description}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>100% Free Platform for Users. No Paywalls.</span>
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs">
              <a
                href={BRAND.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                Twitter/X
              </a>
              <a
                href={BRAND.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                GitHub
              </a>
              <a
                href={BRAND.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                LinkedIn
              </a>
              <a
                href={BRAND.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                YouTube
              </a>
            </div>
          </div>

          {/* Discovery */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Discovery
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <Link href="/ai-finder" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  AI Finder
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Verified Tools (50+)
                </Link>
              </li>
              <li>
                <Link href="/workflows" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  AI Workflows (20+)
                </Link>
              </li>
              <li>
                <Link href="/use-cases" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Role Use Cases (15+)
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Tool Comparisons
                </Link>
              </li>
            </ul>
          </div>

          {/* Services & Guides */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Free Utilities
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <Link href="/ai-services" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  All Free AI Services
                </Link>
              </li>
              <li>
                <Link href="/ai-services/resume-builder" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  AI Resume Builder
                </Link>
              </li>
              <li>
                <Link href="/ai-services/youtube-script-generator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  YouTube Script Generator
                </Link>
              </li>
              <li>
                <Link href="/ai-services/prompt-generator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Prompt Generator
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Practical Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Trust & Legal
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  About WorkAI
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/affiliate-disclosure" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Affiliate Disclosure
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Editorial Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/ai-policy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  AI Accuracy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Creator & Contact Information */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/70 dark:border-indigo-800/70 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs tracking-wider">
                MM
              </div>
              <div className="text-left">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Author & Creator
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {BRAND.author.name}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
              <a
                href={BRAND.author.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 font-medium transition"
                aria-label={`Contact ${BRAND.author.name} on WhatsApp`}
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>WhatsApp: {BRAND.author.whatsapp}</span>
              </a>

              <a
                href={`mailto:${BRAND.author.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium transition"
                aria-label={`Send email to ${BRAND.author.name}`}
              >
                <Mail className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>{BRAND.author.email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} {BRAND.name}. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>Editorial Truth & Provenance Guaranteed. Zero Fake Reviews.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
