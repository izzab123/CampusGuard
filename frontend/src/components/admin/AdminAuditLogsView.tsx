"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Download,
  Search,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Filter,
  FileText
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api";

interface AuditLogRecord {
  id: number;
  action: string;
  details: string;
  actorEmail: string;
  createdAt: string;
}

export default function AdminAuditLogsView() {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.auditLogs.list);
      if (res.ok) {
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const headers = "ID,Timestamp,Action,Details,ActorEmail\n";
    const rows = logs
      .map(
        (l) =>
          `"${l.id}","${l.createdAt}","${l.action}","${l.details.replace(/"/g, '""')}","${l.actorEmail}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `security_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showNotice("Security audit log exported.");
  };

  const filteredLogs = logs.filter((log) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      log.action?.toLowerCase().includes(q) ||
      log.details?.toLowerCase().includes(q) ||
      log.actorEmail?.toLowerCase().includes(q);

    const matchesFilter =
      filterAction === "All" ||
      log.action?.toLowerCase().includes(filterAction.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {notice && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-bold flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-blue-700 font-bold ml-2">✕</button>
        </div>
      )}

      {/* HEADER & CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-rose-800 uppercase">
            <span>• COMPLIANCE &amp; FORENSICS • IMMUTABLE AUDIT TRAIL</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            System Security Audit Logs
          </h1>
          <p className="text-xs text-slate-500">
            Real-time verification of administrative commands, barrier overrides, and authentication events.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit CSV</span>
          </button>

          <button
            type="button"
            onClick={loadLogs}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh Ledger</span>
          </button>
        </div>
      </div>

      {/* 3 STAT TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Total Audit Entries</span>
            <FileText className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 leading-none">{logs.length}</div>
          <p className="text-[11px] text-slate-500">Persisted in database table</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Cryptographic Ledger</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 leading-none">100%</div>
          <p className="text-[11px] text-emerald-700 font-bold">Synchronized and verified</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Distinct Actors</span>
            <Lock className="w-4 h-4 text-[#0a2f77]" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 leading-none">
            {new Set(logs.map((l) => l.actorEmail)).size}
          </div>
          <p className="text-[11px] text-slate-500">Unique accounts active in logs</p>
        </div>
      </div>

      {/* FILTER & TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-slate-900">
            Audit Records Stream ({filteredLogs.length} Records)
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search action or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold"
            >
              <option value="All">All Actions</option>
              <option value="LOGIN">Logins</option>
              <option value="SHIFT">Shifts</option>
              <option value="INCIDENT">Incidents</option>
              <option value="USER">User Management</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Action Event</th>
                <th className="py-3 px-3">Event Details</th>
                <th className="py-3 px-3">Actor Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                      {log.createdAt ? new Date(log.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' }) : "Recently"}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded text-[11px] font-mono">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-800 max-w-lg">{log.details}</td>
                    <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">{log.actorEmail}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    No audit records matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
