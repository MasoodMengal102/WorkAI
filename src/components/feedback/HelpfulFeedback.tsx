"use client";

import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, Check, Send, Loader2 } from "lucide-react";

interface HelpfulFeedbackProps {
  pagePath: string;
  entityType?: string;
  entityId?: string;
}

export function HelpfulFeedback({ pagePath, entityType, entityId }: HelpfulFeedbackProps) {
  const [selected, setSelected] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleVote = async (isHelpful: boolean) => {
    setSelected(isHelpful);
    // If positive vote, submit immediately or allow optional comment
    if (isHelpful && !message.trim()) {
      sendFeedback(isHelpful, "");
    }
  };

  const sendFeedback = async (isHelpful: boolean, textMessage: string) => {
    setSubmitting(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pagePath,
          entityType,
          entityId,
          isHelpful,
          message: textMessage.trim() || undefined,
        }),
      });
      setSubmitted(true);
    } catch {
      // Fallback
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="my-8 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2">
        <Check className="w-4 h-4 text-emerald-500" />
        <span>Thank you for your feedback! It directly helps our editorial desk improve.</span>
      </div>
    );
  }

  return (
    <div className="my-8 p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center max-w-lg mx-auto">
      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
        Was this page helpful?
      </p>

      {selected === null ? (
        <div className="mt-3 flex items-center justify-center gap-3">
          <button
            onClick={() => handleVote(true)}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>Yes</span>
          </button>
          <button
            onClick={() => handleVote(false)}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <ThumbsDown className="w-4 h-4" />
            <span>No</span>
          </button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendFeedback(selected, message);
          }}
          className="mt-4 space-y-3"
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={selected ? "What was most helpful? (Optional)" : "How can we improve this article or tool? (Optional)"}
            className="w-full p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none h-20"
          />
          <div className="flex items-center justify-center gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow"
            >
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Submit Feedback</span>
            </button>
            <button
              type="button"
              onClick={() => sendFeedback(selected, "")}
              className="px-3 py-2 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              Skip
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
