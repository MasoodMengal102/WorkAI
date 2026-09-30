"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import {
  Shield,
  Key,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  Laptop,
} from "lucide-react";
import { UserSession } from "@/types";

export default function UserSecurityPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Change password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [passMsg, setPassMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Delete account fields
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.session) setSession(data.session);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);

    if (newPassword.length < 8) {
      setPassMsg({ type: "error", text: "New password must be at least 8 characters long." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassMsg({ type: "error", text: "New passwords do not match." });
      return;
    }

    setChangingPass(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change-password",
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPassMsg({ type: "success", text: data.message || "Password successfully updated!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPassMsg({ type: "error", text: data.error || "Failed to update password." });
      }
    } catch {
      setPassMsg({ type: "error", text: "Communication error updating password." });
    } finally {
      setChangingPass(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError("Password is required to confirm account deletion.");
      return;
    }

    setDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete-account",
          password: deletePassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/?deleted=true");
        router.refresh();
      } else {
        setDeleteError(data.error || "Failed to delete account. Please verify your password.");
      }
    } catch {
      setDeleteError("Error communicating with security service.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 bg-slate-50 dark:bg-slate-950 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <DashboardNav session={session} />

        {/* Change Password Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Change Password</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Choose a secure password with at least 8 characters, an uppercase letter, lowercase letter, and a number or symbol.
            </p>
          </div>

          {passMsg && (
            <div
              className={`p-4 rounded-2xl text-xs flex items-start gap-2.5 ${
                passMsg.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
                  : "bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200"
              }`}
            >
              {passMsg.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
              )}
              <span>{passMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type={showPasswords ? "text" : "password"}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type={showPasswords ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type={showPasswords ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5"
              >
                {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPasswords ? "Hide Passwords" : "Show Passwords"}</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={changingPass}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
            >
              {changingPass ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Active Session & Security Checklist */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Laptop className="w-4 h-4 text-indigo-600" />
              <span>Current Session & Device</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Secure HTTP-only session encrypted with HMAC-SHA256 signature verification.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Current Active Session</span>
                <span className="text-[11px] text-slate-500">SameSite: Lax | Secure HTTP-Only Cookie</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Active Now
            </span>
          </div>
        </div>

        {/* Danger Zone: Account Deletion */}
        <div className="p-6 sm:p-8 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50 space-y-4">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-base font-bold">Danger Zone: Permanent Account Deletion</h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Deleting your account will permanently purge your profile, email address, password hash, saved tools, bookmarked workflows, and cached AI generation logs. This action cannot be reversed.
          </p>

          <button
            onClick={() => {
              setShowDeleteModal(true);
              setDeleteError(null);
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition"
          >
            Permanently Delete My Account
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Confirm Account Deletion
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                For security reasons, please enter your password to confirm that you wish to permanently delete your account:
              </p>

              {deleteError && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                  {deleteError}
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Enter Password
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold transition flex items-center gap-1.5"
                >
                  {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Confirm Deletion</span>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
