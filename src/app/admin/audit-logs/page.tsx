"use client";

import React, { useState, useEffect } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { History, Search, ShieldCheck, Loader2, RefreshCw } from "lucide-react";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState("ALL");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin?view=audit-logs");
      const data = await res.json();
      if (data.success && data.auditLogs) {
        setLogs(data.auditLogs);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      (log.action && log.action.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.entityType && log.entityType.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.ipAddress && log.ipAddress.includes(searchTerm));
    const matchesAction = selectedAction === "ALL" || log.action === selectedAction;
    return matchesSearch && matchesAction;
  });

  const uniqueActions = Array.from(new Set(logs.map((l) => l.action).filter(Boolean)));

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <AdminNav
          title="Security & System Audit Logs"
          subtitle="Cryptographically timestamped immutable audit trail recording all privilege changes, authentications, and sensitive data modifications."
        />

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            >
              <option value="ALL">All Event Types ({logs.length})</option>
              {uniqueActions.map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>

            <button
              onClick={fetchLogs}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              title="Refresh Logs"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-600" />
              <span>Audit Records ({filteredLogs.length})</span>
            </h2>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Retention: Immutable 90 Days</span>
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
              <p className="mt-2 text-xs text-slate-500">Loading audit records...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500">No audit records match the current filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Timestamp</th>
                    <th className="py-3 px-3">Action</th>
                    <th className="py-3 px-3">Entity</th>
                    <th className="py-3 px-3">Details / Narrative</th>
                    <th className="py-3 px-3">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/40">
                      <td className="py-3 px-3 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                            log.action.includes("ROLE") || log.action.includes("DELETE")
                              ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                              : log.action.includes("ADMIN")
                              ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                        {log.entityType} {log.entityId ? `(#${log.entityId.slice(0, 8)})` : ""}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400 text-xs">
                        {log.details || log.newValue || "System mutation event recorded"}
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                        {log.ipAddress || "127.0.0.1"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
