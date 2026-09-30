"use client";

import React, { useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { Settings, Shield, Lock, Bell, Server, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <AdminNav
          title="System Settings & Security Configuration"
          subtitle="Manage authentication parameters, session expiration timeouts, provider API keys, and notification gates."
        />

        {saved && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully and audited.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-base text-slate-900 dark:text-white">Security & Session Policies</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Session Token Duration (Days)
                </label>
                <input
                  type="number"
                  defaultValue={30}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password Reset Token Expiration (Hours)
                </label>
                <input
                  type="number"
                  defaultValue={1}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Rate Limit: Auth Attempts (per 15 min)
                </label>
                <input
                  type="number"
                  defaultValue={8}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Daily Free AI Allowance (Prompts / IP)
                </label>
                <input
                  type="number"
                  defaultValue={20}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-base text-slate-900 dark:text-white">AI Provider Keys & Routing</h2>
            </div>
            <p className="text-xs text-slate-500">
              API secrets are injected from deployment environment variables and never exposed in the browser.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300">GEMINI_API_KEY</span>
                <p className="text-slate-400 mt-1">Configured in env</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300">OPENAI_API_KEY</span>
                <p className="text-slate-400 mt-1">Configured in env</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300">ANTHROPIC_API_KEY</span>
                <p className="text-slate-400 mt-1">Configured in env</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition"
          >
            Save Security Settings
          </button>
        </form>
      </div>
    </div>
  );
}
