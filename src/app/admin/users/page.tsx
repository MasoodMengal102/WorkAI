"use client";

import React, { useState, useEffect } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import {
  Users,
  Shield,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit2,
  Loader2,
  Search,
  AlertTriangle,
  UserCheck,
  UserX,
} from "lucide-react";
import { Role } from "@/types";

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("ALL");
  const [actionMsg, setActionMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Edit Role Modal State
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [newRole, setNewRole] = useState<Role>("USER");
  const [savingRole, setSavingRole] = useState(false);

  // Delete User Confirmation State
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin?view=users");
      const data = await res.json();
      if (data.success && data.users) {
        setUsers(data.users);
      }
    } catch {
      setActionMsg({ type: "error", text: "Failed to fetch user directory." });
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentSession = async () => {
    try {
      const res = await fetch("/api/auth");
      const data = await res.json();
      if (data.session) {
        setCurrentUser(data.session);
      }
    } catch {}
  };

  useEffect(() => {
    fetchUsers();
    fetchCurrentSession();
  }, []);

  const handleUpdateRole = async () => {
    if (!editingUser) return;
    setSavingRole(true);
    setActionMsg(null);

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-user-role",
          targetUserId: editingUser.id,
          newRole,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionMsg({ type: "success", text: data.message });
        setEditingUser(null);
        await fetchUsers();
      } else {
        setActionMsg({ type: "error", text: data.error || "Failed to update role." });
      }
    } catch {
      setActionMsg({ type: "error", text: "Error sending role update request." });
    } finally {
      setSavingRole(false);
    }
  };

  const handleToggleStatus = async (user: AdminUser) => {
    const nextStatus = !user.isActive;
    setActionMsg(null);

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle-user-status",
          targetUserId: user.id,
          isActive: nextStatus,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionMsg({ type: "success", text: data.message });
        await fetchUsers();
      } else {
        setActionMsg({ type: "error", text: data.error || "Failed to change user status." });
      }
    } catch {
      setActionMsg({ type: "error", text: "Error changing user status." });
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    if (deleteConfirmText.trim().toLowerCase() !== "delete") {
      setActionMsg({ type: "error", text: "Please type 'delete' to confirm." });
      return;
    }

    setIsDeleting(true);
    setActionMsg(null);

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete-user",
          targetUserId: deletingUser.id,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionMsg({ type: "success", text: data.message });
        setDeletingUser(null);
        setDeleteConfirmText("");
        await fetchUsers();
      } else {
        setActionMsg({ type: "error", text: data.error || "Failed to delete user." });
      }
    } catch {
      setActionMsg({ type: "error", text: "Error deleting user." });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = selectedRole === "ALL" || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const isActorSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <AdminNav
          title="User Administration & RBAC Management"
          subtitle="Manage user profiles, assign operational roles, control activation status, and monitor administrative security."
        />

        {actionMsg && (
          <div
            className={`p-4 rounded-2xl text-xs flex items-start gap-2.5 ${
              actionMsg.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
                : "bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200"
            }`}
          >
            {actionMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
            )}
            <span>{actionMsg.text}</span>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-slate-500 font-medium">Filter Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            >
              <option value="ALL">All Roles ({users.length})</option>
              <option value="USER">USER</option>
              <option value="REVIEWER">REVIEWER</option>
              <option value="EDITOR">EDITOR</option>
              <option value="ADMIN">ADMIN</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Registered Accounts ({filteredUsers.length})</span>
            </h2>
            <button
              onClick={fetchUsers}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              Refresh Table
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
              <p className="mt-2 text-xs text-slate-500">Loading user accounts...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">User</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Verification</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Joined Date</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map((u) => {
                    const isSuper = u.role === "SUPER_ADMIN";
                    const isAdmin = u.role === "ADMIN";
                    const canEditThisUser =
                      isActorSuperAdmin || (!isSuper && !isAdmin);

                    return (
                      <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/40">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {u.name || "Anonymous User"}
                          </div>
                          <div className="text-[11px] text-slate-500">{u.email}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              u.role === "SUPER_ADMIN"
                                ? "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                                : u.role === "ADMIN"
                                ? "bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300"
                                : u.role === "EDITOR"
                                ? "bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300"
                                : u.role === "REVIEWER"
                                ? "bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {u.emailVerified ? (
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verified</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-[11px]">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Unverified</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {u.isActive ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                              Active
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                              Deactivated
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-500 text-[11px]">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {canEditThisUser ? (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingUser(u);
                                    setNewRole(u.role);
                                  }}
                                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-600 hover:text-indigo-600 dark:text-slate-400 transition"
                                  title="Change User Role"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleToggleStatus(u)}
                                  className={`p-1.5 rounded-lg transition ${
                                    u.isActive
                                      ? "bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950 text-slate-600 hover:text-amber-600"
                                      : "bg-emerald-50 dark:bg-emerald-950 text-emerald-600"
                                  }`}
                                  title={u.isActive ? "Deactivate User" : "Activate User"}
                                >
                                  {u.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  onClick={() => setDeletingUser(u)}
                                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-600 hover:text-rose-600 transition"
                                  title="Delete User Account"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">Protected</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Change Role Modal */}
        {editingUser && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Update Role for {editingUser.email}
                </h3>
              </div>
              <p className="text-slate-500">
                Assign permission tiers according to the principle of least privilege.
              </p>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assign Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as Role)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="USER">USER (Standard Member)</option>
                  <option value="REVIEWER">REVIEWER (Can verify tool provenance & fact-check)</option>
                  <option value="EDITOR">EDITOR (Can manage articles, guides, workflows)</option>
                  {isActorSuperAdmin && <option value="ADMIN">ADMIN (Can manage users and content)</option>}
                  {isActorSuperAdmin && <option value="SUPER_ADMIN">SUPER_ADMIN (Full system ownership)</option>}
                </select>
              </div>

              {!isActorSuperAdmin && (newRole === "ADMIN" || newRole === "SUPER_ADMIN") && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200">
                  Only Super Administrators can assign Admin or Super Admin privileges.
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateRole}
                  disabled={savingRole}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition flex items-center gap-1.5"
                >
                  {savingRole ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Save Role Change</span>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingUser && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Confirm User Deletion
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                You are about to permanently expunge the user account for <strong>{deletingUser.email}</strong>. This removes all their saved data and terminates active sessions.
              </p>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  Type <strong className="text-rose-600">delete</strong> below to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="delete"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setDeletingUser(null);
                    setDeleteConfirmText("");
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={deleteConfirmText.trim().toLowerCase() !== "delete" || isDeleting}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold transition flex items-center gap-1.5"
                >
                  {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Delete Permanently</span>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
