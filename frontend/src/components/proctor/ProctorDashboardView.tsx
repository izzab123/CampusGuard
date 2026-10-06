"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  Gavel,
  Download,
  PlusCircle,
  Clock,
  RotateCcw,
  CheckCircle2
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api";

interface IncidentItem {
  id: number;
  title: string;
  description: string;
  severity: string;
  location: string;
  status: string;
  routedTo?: string;
  reporterName?: string;
  createdAt: string;
}

export default function ProctorDashboardView() {
  const [incidents, setIncidents] = useState<IncidentItem[]>([]);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchIncidents = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.incidents.base);
      if (res.ok) {
        const data = await res.json();
        setIncidents(data);
      }
    } catch {}
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleAction = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleResolve = async (id: number) => {
    try {
      const res = await fetch(API_ENDPOINTS.incidents.resolve(id), { method: "PATCH" });
      if (res.ok) {
        handleAction(`Incident #${id} resolved successfully.`);
        fetchIncidents();
      }
    } catch {
      handleAction("Failed to resolve incident.");
    }
  };

  const activeCount = incidents.filter((i) => i.status !== "RESOLVED").length;
  const criticalCount = incidents.filter((i) => (i.severity === "CRITICAL" || i.severity === "HIGH") && i.status !== "RESOLVED").length;
  const resolvedCount = incidents.filter((i) => i.status === "RESOLVED").length;
  const dispatchedCount = incidents.filter((i) => i.status === "DISPATCHED").length;

  return (
    <div className="space-y-5">
      {/* Action Notice */}
      {actionNotice && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs font-semibold text-blue-900 flex items-center justify-between shadow-xs animate-in fade-in">
          <span>{actionNotice}</span>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="text-blue-700 hover:text-blue-900 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* HEADER TAG & ACTIONS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-blue-800 uppercase">
            <span>• PROCTORIAL COMMAND &amp; STUDENT WELFARE • EXECUTIVE OVERSIGHT</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight mt-1">
            Incident Overview &amp; Triage Roster
          </h1>
          <p className="text-xs text-slate-500">
            Real-time disciplinary triage, perimeter emergency escalations, welfare checks, and student safety directives.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>TELEMETRY ACTIVE • LIVE SYNC</span>
          </div>
          <button
            type="button"
            onClick={fetchIncidents}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI METRICS (4 CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Active Triage Queue
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{activeCount}</div>
          <p className="text-[11px] text-slate-500">Cases awaiting review</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              High / Critical Urgency
            </span>
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-red-600">{criticalCount}</div>
          <p className="text-[11px] text-slate-500">Requiring immediate routing</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Dispatched Patrols
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Gavel className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-purple-700">{dispatchedCount}</div>
          <p className="text-[11px] text-slate-500">Officers deployed to site</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Resolved Cases
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-700">{resolvedCount}</div>
          <p className="text-[11px] text-slate-500">Closed incidents logged</p>
        </div>
      </div>

      {/* RECENT LIVE INCIDENTS TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900">
            Live Incident Feed &amp; Case Routing ({incidents.length})
          </h2>
          <Link
            href="/dashboard/proctor/incidents"
            className="text-xs font-bold text-blue-700 hover:underline"
          >
            Manage All Incidents →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">CASE / ID</th>
                <th className="py-2.5 px-3">TITLE &amp; LOCATION</th>
                <th className="py-2.5 px-3">SEVERITY</th>
                <th className="py-2.5 px-3">STATUS</th>
                <th className="py-2.5 px-3">REPORTER</th>
                <th className="py-2.5 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {incidents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">
                    No active incident records in system.
                  </td>
                </tr>
              ) : (
                incidents.slice(0, 6).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3 font-mono font-bold text-blue-700">
                      #INC-{item.id}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-500">{item.location}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.severity === "CRITICAL"
                            ? "bg-red-100 text-red-800"
                            : item.severity === "HIGH"
                            ? "bg-orange-100 text-orange-800"
                            : item.severity === "MEDIUM"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {item.severity}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === "RESOLVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.status === "DISPATCHED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {item.reporterName || "Unknown"}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {item.status !== "RESOLVED" ? (
                        <button
                          type="button"
                          onClick={() => handleResolve(item.id)}
                          className="px-2.5 py-1 rounded bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-[11px] shadow-xs transition cursor-pointer"
                        >
                          Resolve
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-bold">Closed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
