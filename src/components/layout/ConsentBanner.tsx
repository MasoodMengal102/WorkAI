"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, Settings, Check, X } from "lucide-react";

export interface ConsentPreferences {
  essential: boolean; // Always true
  analytics: boolean;
  advertising: boolean;
  updatedAt: string;
}

const CONSENT_STORAGE_KEY = "workai_privacy_consent";

export function ConsentBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!stored) {
        setIsOpen(true);
      } else {
        const parsed: ConsentPreferences = JSON.parse(stored);
        setAnalytics(parsed.analytics);
        setAdvertising(parsed.advertising);
      }
    } catch {
      // LocalStorage access exception fallback
    }
  }, []);

  const saveConsent = (analyticsChoice: boolean, adsChoice: boolean) => {
    const preferences: ConsentPreferences = {
      essential: true,
      analytics: analyticsChoice,
      advertising: adsChoice,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(preferences));
      // Dispatch custom event for analytics listeners
      window.dispatchEvent(new CustomEvent("workai-consent-updated", { detail: preferences }));
    } catch {}
    setIsOpen(false);
  };

  const handleAcceptAll = () => {
    saveConsent(true, true);
  };

  const handleRejectNonEssential = () => {
    saveConsent(false, false);
  };

  const handleSaveCustom = () => {
    saveConsent(analytics, advertising);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          setShowPreferences(true);
        }}
        className="fixed bottom-4 left-4 z-40 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700 shadow-lg text-xs flex items-center gap-1.5 transition-all"
        title="Privacy & Cookie Preferences"
        aria-label="Privacy & Cookie Preferences"
      >
        <Cookie className="w-4 h-4" />
        <span className="hidden sm:inline">Privacy Preferences</span>
      </button>
    );
  }

  return (
    <div
      role="region"
      aria-label="Cookie & Privacy Consent"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Privacy & Cookie Preferences
          </h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            We respect your privacy. We use essential cookies to maintain site stability. You can choose whether to allow anonymous analytics and personalized advertising. Read our{" "}
            <Link href="/cookie-policy" className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2">
              Cookie Policy
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2">
              Privacy Policy
            </Link>.
          </p>

          {showPreferences && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-medium text-slate-900 dark:text-white">Strictly Essential</span>
                  <p className="text-slate-500 text-[11px]">Necessary for core navigation & safety.</p>
                </div>
                <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  Always Active
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-medium text-slate-900 dark:text-white">Anonymous Analytics</span>
                  <p className="text-slate-500 text-[11px]">Helps us understand popular tools.</p>
                </div>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-medium text-slate-900 dark:text-white">Personalized Advertising</span>
                  <p className="text-slate-500 text-[11px]">Enables relevant advertising via Google.</p>
                </div>
                <input
                  type="checkbox"
                  checked={advertising}
                  onChange={(e) => setAdvertising(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {!showPreferences ? (
              <>
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition"
                >
                  Accept All
                </button>
                <button
                  onClick={handleRejectNonEssential}
                  className="py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs transition"
                >
                  Reject Non-Essential
                </button>
                <button
                  onClick={() => setShowPreferences(true)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  title="Customize Preferences"
                  aria-label="Customize Preferences"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSaveCustom}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition flex items-center justify-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Save Choices
                </button>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="py-1.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
                >
                  Back
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
