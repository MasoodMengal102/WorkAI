import React from "react";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { Sparkles, Heart, Shield, CheckCircle2 } from "lucide-react";

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

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
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
