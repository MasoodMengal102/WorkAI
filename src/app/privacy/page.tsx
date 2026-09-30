import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${BRAND.name}. Learn how we handle your data, our zero-retention AI safeguards, and your GDPR/CCPA rights.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-16 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <Shield className="w-3.5 h-3.5" />
            <span>Data Protection</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Last Updated: September 2026 • Effective Globally
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Introduction</h2>
            <p>
              This Privacy Policy describes how <strong>{BRAND.legalEntity}</strong> (operating as "{BRAND.name}") collects, uses, and safeguards information when you visit <strong>{BRAND.domain}</strong> and utilize our AI discovery, workflow, and free productivity services.
            </p>
            <p>
              We are committed to data minimization: you can explore our entire tool directory, workflows, comparisons, and guides without creating an account.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Optional Account Data:</strong> If you voluntarily register, we store your email address, hashed password (using bcrypt), and optional display name.</li>
              <li><strong>AI Service Inputs:</strong> Prompts submitted to our free AI utilities are processed server-side. Under our automated data retention policy, generations are held for temporary session retrieval and purged after 30 days. Users can purge their generation history immediately in the user dashboard.</li>
              <li><strong>Anonymous Technical Logs:</strong> To prevent denial-of-service attacks and API abuse, we record anonymized IP hashes, request timestamps, and latency metrics. We do not sell user personal data.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Third-Party AI Providers & Zero-Training Safeguards</h2>
            <p>
              When you use our free AI services, prompts are sent securely to upstream AI infrastructure providers (Google Gemini, OpenAI, Anthropic). We utilize standard enterprise developer API endpoints which legally commit to <strong>zero model training on customer inputs</strong>. We never use your private drafts to train public AI models.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Advertising & Google AdSense</h2>
            <p>
              When Google AdSense is active on our website, Google and third-party advertising vendors use cookies to serve personalized ads based on prior visits. You can manage or revoke your advertising and analytics consent at any time via our persistent <Link href="/cookie-policy" className="text-indigo-600 dark:text-indigo-400 underline">Cookie Consent Banner</Link>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Your Legal Rights (GDPR & CCPA)</h2>
            <p>
              Under applicable privacy laws, you have the right to access, rectify, export, or permanently erase your personal data. Registered users can initiate immediate and permanent account deletion directly inside their <Link href="/dashboard" className="text-indigo-600 dark:text-indigo-400 underline">User Dashboard</Link>, or by emailing our data protection desk at <strong>{BRAND.supportEmail}</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
