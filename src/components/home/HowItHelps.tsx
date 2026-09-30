import React from "react";
import Link from "next/link";
import { MessageSquareQuote, Layers, Wrench, Sparkles, BookOpen, ArrowRight } from "lucide-react";
import { BRAND } from "@/config/brand";

export function HowItHelps() {
  const steps = [
    {
      step: "01",
      title: "Tell Us Your Goal",
      description: "Type in plain English what you want to achieve—whether that is launching a YouTube channel, crafting a CV, or coding a web app.",
      icon: MessageSquareQuote,
      color: "from-blue-500 to-indigo-600",
    },
    {
      step: "02",
      title: "Get an Actionable Workflow",
      description: "Receive a step-by-step sequential blueprint showing which phase requires research, drafting, visual asset creation, and publishing.",
      icon: Layers,
      color: "from-indigo-600 to-purple-600",
    },
    {
      step: "03",
      title: "Discover Verified AI Tools",
      description: "Match with tools that have verified free tiers, platforms, and terms. No fake reviews, no fabricated prices, and zero affiliate ranking bias.",
      icon: Wrench,
      color: "from-purple-600 to-pink-600",
    },
    {
      step: "04",
      title: "Use Built-In Free Services",
      description: "Generate video scripts, resume bullet points, prompt matrices, and email drafts directly using our server-side free utilities.",
      icon: Sparkles,
      color: "from-pink-600 to-rose-600",
    },
    {
      step: "05",
      title: "Learn From Practical Guides",
      description: "Follow in-depth editorial tutorials written by practitioners that explain exact prompt templates, limitations, and ethical guidelines.",
      icon: BookOpen,
      color: "from-emerald-600 to-teal-600",
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400">
            How {BRAND.name} Helps You
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl">
            From Vague Intent to Tangible Execution
          </p>
          <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Most directories leave you guessing between 500 disconnected tool logos. {BRAND.name} connects your goal to the exact sequence of tools and free services you need.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition duration-200"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-300 dark:text-slate-700">
                      {item.step}
                    </span>
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="mt-5 text-base font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/ai-finder"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition"
          >
            <span>Try the AI Finder to match tools right now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
