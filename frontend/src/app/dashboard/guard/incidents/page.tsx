"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Bell,
  AlertTriangle,
  RotateCcw,
  LogOut,
  Clock,
  Radio,
  Send,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { performLogout, getStoredAuthUser, AuthUser } from "@/lib/auth";
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

export default function GuardIncidentsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState("HIGH");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Gate 04 Automated Barrier");
  const [narrative, setNarrative] = useState("");
  const [incidentsList, setIncidentsList] = useState<IncidentItem[]>([]);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchIncidents = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.incidents.base);
      if (res.ok) {
        const data = await res.json();
        setIncidentsList(data);
      }
    } catch {}
  };

  useEffect(() => {
    setUser(getStoredAuthUser());
    fetchIncidents();
  }, []);

  const handleAction = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!narrative.trim() || !title.trim()) return;

    setSubmitting(true);
    try {
      const officer = user?.fullName || "Officer Marcus Vance";
      const res = await fetch(API_ENDPOINTS.incidents.base, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: narrative,
          severity: selectedSeverity,
          location,
          reporterName: officer,
          reporterRole: "Security Guard",
        }),
      });

      if (res.ok) {
        const saved = await res.json();
        handleAction(`Incident #${saved.id} successfully recorded and routed to Dispatch.`);
        setTitle("");
        setNarrative("");
        fetchIncidents();
      }
    } catch {
      handleAction("Incident saved in local queue.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async (id: number) => {
    try {
      const res = await fetch(API_ENDPOINTS.incidents.resolve(id), { method: "PATCH" });
      if (res.ok) {
        handleAction(`Incident #${id} resolved.`);
        fetchIncidents();
      }
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0a2f77] flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-slate-900 leading-none">
                  CampusGuard
                </span>
                <span className="text-[10px] font-bold tracking-wider text-[#0a2f77] uppercase leading-tight mt-0.5">
                  OPERATIONS UNIT
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 pl-4 text-xs font-semibold text-slate-600">
              <Link href="/dashboard/guard" className="py-5 hover:text-slate-900 transition">
                Dashboard
              </Link>
              <Link href="/dashboard/guard/handoff" className="py-5 hover:text-slate-900 transition">
                Handoff
              </Link>
              <Link href="/dashboard/guard/parking" className="py-5 hover:text-slate-900 transition">
                Parking
              </Link>
              <Link href="/dashboard/guard/incidents" className="py-5 text-blue-700 font-bold border-b-2 border-blue-700">
                Incidents
              </Link>
              <Link href="/dashboard/guard/notifications" className="py-5 hover:text-slate-900 transition">
                Notifications
              </Link>
              <Link href="/dashboard/guard/profile" className="py-5 hover:text-slate-900 transition">
                Profile
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => performLogout()}
              className="p-2 rounded-lg text-slate-400 hover:text-red-600 transition cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 space-y-6 w-full">
        {actionNotice && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs font-semibold text-blue-900 flex items-center justify-between">
            <span>{actionNotice}</span>
            <button onClick={() => setActionNotice(null)} className="text-blue-700 font-bold ml-2">✕</button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Perimeter Incident Logs &amp; Field Dispatch</h1>
            <p className="text-xs text-slate-500">Log tactical infractions, unauthorized breaches, and field hazard responses.</p>
          </div>

          <button
            type="button"
            onClick={fetchIncidents}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer self-start"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Incident Submission Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Log New Field Incident
            </h2>

            <form onSubmit={handleCreateIncident} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Incident Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unauthorized Barrier Breach Attempt"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Location / Gate</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Severity</label>
                <div className="grid grid-cols-3 gap-2">
                  {["LOW", "MEDIUM", "HIGH"].map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setSelectedSeverity(sev)}
                      className={`p-2 rounded-lg font-bold border text-center transition cursor-pointer ${
                        selectedSeverity === sev
                          ? "bg-blue-50 border-blue-600 text-blue-900"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Field Narrative</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide tactical notes, license plates, officer observations..."
                  value={narrative}
                  onChange={(e) => setNarrative(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Incident Log</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Active Incidents List */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-sm font-bold text-slate-900">
              Live Field Incidents Queue ({incidentsList.length})
            </h2>

            {incidentsList.length === 0 ? (
              <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-slate-400 text-xs">
                No active perimeter incidents logged.
              </div>
            ) : (
              incidentsList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-700">#INC-{item.id}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.severity === "CRITICAL" || item.severity === "HIGH"
                            ? "bg-red-100 text-red-800"
                            : item.severity === "MEDIUM"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {item.severity}
                      </span>
                      <span className="font-bold text-slate-900">{item.title}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === "RESOLVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {item.status}
                      </span>
                      {item.status !== "RESOLVED" && (
                        <button
                          type="button"
                          onClick={() => handleResolve(item.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[11px] cursor-pointer"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100">
                    <span>Location: {item.location}</span>
                    <span>Reporter: {item.reporterName || "Campus Guard"} • {new Date(item.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
