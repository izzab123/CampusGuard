"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Gavel,
  Shield,
  Clock,
  Filter,
  Download,
  ShieldCheck,
  Search,
  RotateCcw,
  AlertTriangle,
  Radio,
  FileCheck,
  CheckCircle2,
  Plus,
  X,
  Loader2,
  Save
} from "lucide-react";
import { getStoredAuthUser } from "@/lib/auth";
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
  reporterRole?: string;
  createdAt: string;
}

export default function ProctorIncidentsView() {
  const [incidents, setIncidents] = useState<IncidentItem[]>([]);
  const [severityFilter, setSeverityFilter] = useState("All Severities");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // New Incident Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [caseTitle, setCaseTitle] = useState("");
  const [caseLocation, setCaseLocation] = useState("Central Academic Quad");
  const [caseSeverity, setCaseSeverity] = useState("HIGH");
  const [caseDescription, setCaseDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const user = getStoredAuthUser();
      const reporter = user?.fullName || user?.name || "Dr. Arthur Vance";
      const res = await fetch(API_ENDPOINTS.incidents.base, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: caseTitle,
          description: caseDescription,
          severity: caseSeverity,
          location: caseLocation,
          reporterName: reporter,
          reporterRole: "Proctor and DSW",
        }),
      });

      if (res.ok) {
        const saved = await res.json();
        handleAction(`Disciplinary Case #INC-${saved.id} successfully recorded into Institutional Dossier.`);
        setIsModalOpen(false);
        setCaseTitle("");
        setCaseDescription("");
        fetchIncidents();
      } else {
        const err = await res.json().catch(() => null);
        handleAction(err?.message || "Failed to record case. Verify inputs.");
      }
    } catch {
      handleAction("Network error: Could not reach backend.");
    } finally {
      setIsSubmitting(false);
    }
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

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(API_ENDPOINTS.incidents.status(id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        handleAction(`Incident #${id} status updated to ${newStatus.replace("_", " ")}.`);
        fetchIncidents();
      }
    } catch {
      handleAction("Failed to update incident status.");
    }
  };

  const handleDispatch = async (id: number) => {
    handleUpdateStatus(id, "DISPATCHED");
  };

  const handleEscalate = async (id: number) => {
    try {
      const res = await fetch(API_ENDPOINTS.incidents.escalate(id), { method: "PATCH" });
      if (res.ok) {
        handleAction(`Incident #${id} escalated to CRITICAL.`);
        fetchIncidents();
      }
    } catch {
      handleAction("Failed to escalate incident.");
    }
  };

  const filteredIncidents = incidents.filter((item) => {
    if (severityFilter !== "All Severities" && item.severity !== severityFilter.toUpperCase()) {
      return false;
    }
    if (statusFilter !== "All Statuses" && item.status !== statusFilter.toUpperCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        (item.reporterName && item.reporterName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Notice Banner */}
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

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-blue-800 uppercase flex items-center gap-1.5">
            <Gavel className="w-3.5 h-3.5 text-blue-700" />
            <span>DISCIPLINARY CASEWORK &amp; INVESTIGATION</span>
            <span className="text-slate-300">•</span>
            <span>ACTIVE DOSSIER MANAGEMENT</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight mt-1">
            Institutional Incident Dossiers &amp; Triage Queue
          </h1>
          <p className="text-xs text-slate-500 max-w-3xl mt-0.5 leading-relaxed">
            Review security reports, dispatch patrol officers, escalate critical hazards, and close resolved tickets.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Incident / New Case</span>
          </button>
          <button
            type="button"
            onClick={fetchIncidents}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer self-start"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Refresh Incidents</span>
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search incident title, sector, reporter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
        >
          <option>All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
        >
          <option>All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DISPATCHED">Dispatched</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {/* INCIDENTS TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">INCIDENT ID</th>
                <th className="py-3 px-4">DETAILS &amp; LOCATION</th>
                <th className="py-3 px-4">SEVERITY</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">REPORTER</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No incidents match your current filter.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      #INC-{item.id}
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-bold text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.location}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {item.description}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
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
                    <td className="py-3.5 px-4">
                      {(() => {
                        const s = item.status?.toUpperCase().replace(" ", "_");
                        return (
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                s === "RESOLVED"
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : s === "DISPATCHED"
                                  ? "bg-sky-100 text-sky-800 border border-sky-200"
                                  : s === "IN_PROGRESS"
                                  ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                                  : "bg-amber-100 text-amber-800 border border-amber-200"
                              }`}
                            >
                              {s === "IN_PROGRESS" ? "IN PROGRESS" : item.status}
                            </span>
                            <select
                              value={s || "OPEN"}
                              onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                              className="text-[11px] font-semibold px-2 py-0.5 rounded border border-slate-200 bg-white text-slate-700 cursor-pointer hover:border-blue-500"
                            >
                              <option value="OPEN">Open</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="DISPATCHED">Dispatched</option>
                              <option value="RESOLVED">Resolved</option>
                            </select>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div>{item.reporterName || "Unknown"}</div>
                      <div className="text-[10px] text-slate-400">{item.reporterRole || "Campus"}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {item.status !== "RESOLVED" && (
                          <>
                            {item.status !== "DISPATCHED" && (
                              <button
                                type="button"
                                onClick={() => handleDispatch(item.id)}
                                className="px-2.5 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold text-[11px] transition cursor-pointer"
                              >
                                Dispatch
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleResolve(item.id)}
                              className="px-2.5 py-1 rounded bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-[11px] transition cursor-pointer"
                            >
                              Resolve
                            </button>
                            {item.severity !== "CRITICAL" && (
                              <button
                                type="button"
                                onClick={() => handleEscalate(item.id)}
                                className="px-2.5 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 font-bold text-[11px] transition cursor-pointer"
                              >
                                Escalate
                              </button>
                            )}
                          </>
                        )}
                        {item.status === "RESOLVED" && (
                          <span className="text-[11px] font-bold text-emerald-700">
                            Resolved
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW CASE / INCIDENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Gavel className="w-4 h-4 text-[#0a2f77]" />
                <span>Record Disciplinary Case / Safety Incident</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Case / Incident Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Code §4.2 Academic Conduct / Library Altercation"
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Severity</label>
                  <select
                    value={caseSeverity}
                    onChange={(e) => setCaseSeverity(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sector / Zone</label>
                  <input
                    type="text"
                    required
                    value={caseLocation}
                    onChange={(e) => setCaseLocation(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Case Evidence &amp; Disciplinary Findings</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Record summary of misconduct, student statements, surveillance references..."
                  value={caseDescription}
                  onChange={(e) => setCaseDescription(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save &amp; Log Case</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
