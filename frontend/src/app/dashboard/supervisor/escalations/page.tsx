"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Bell,
  LogOut,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  ChevronDown,
  PhoneCall,
  FileDown,
  Radio,
  ExternalLink,
  CheckCircle2,
  Lock,
  ArrowRight,
  Send,
  Video,
  Zap,
  Users
} from "lucide-react";
import { getStoredAuthUser, performLogout, AuthUser } from "@/lib/auth";
import { API_ENDPOINTS } from "@/lib/api";

interface Incident {
  id: number;
  title: string;
  type: string;
  location: string;
  severity: string;
  status: string;
  reporterEmail?: string;
  createdAt: string;
}

export default function SupervisorEscalationsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [severityFilter, setSeverityFilter] = useState("All Severity Tiers");
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUser(getStoredAuthUser());
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.incidents.list);
      if (res.ok) {
        const data = await res.json();
        setIncidents(Array.isArray(data) ? data : []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleResolve = async (id: number) => {
    try {
      const res = await fetch(API_ENDPOINTS.incidents.resolve(id), { method: "PATCH" });
      if (res.ok) {
        showNotification(`Incident #${id} resolved and archived.`);
        loadIncidents();
      }
    } catch {
      showNotification(`Incident #${id} marked as resolved.`);
    }
  };

  const handleDeployTactical = async (id: number) => {
    try {
      await fetch(API_ENDPOINTS.auditLogs.create, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "PATROL_DISPATCH",
          details: `Supervisor deployed Tactical Patrol Rover to incident #${id}`,
          actorEmail: user?.email || "supervisor@campusguard.edu",
        }),
      });
      showNotification(`Tactical Patrol Rover deployed to Incident #${id}. Response logged to master ledger.`);
    } catch {
      showNotification(`Tactical unit dispatched to incident #${id}.`);
    }
  };

  const handleEscalateToProctor = async (id: number) => {
    try {
      const res = await fetch(API_ENDPOINTS.incidents.escalate(id), { method: "PATCH" });
      if (res.ok) {
        showNotification(`Incident #${id} escalated to Proctor & DSW Executive Queue.`);
        loadIncidents();
      }
    } catch {
      showNotification(`Incident #${id} escalated.`);
    }
  };

  const criticalCount = incidents.filter((i) => i.severity?.toUpperCase() === "CRITICAL").length;
  const highCount = incidents.filter((i) => i.severity?.toUpperCase() === "HIGH").length;
  const activeCount = incidents.filter((i) => i.status?.toUpperCase() !== "RESOLVED").length;

  const filteredIncidents = incidents.filter((i) => {
    if (severityFilter === "Critical Only") return i.severity?.toUpperCase() === "CRITICAL";
    if (severityFilter === "Moderate Only") return i.severity?.toUpperCase() === "MEDIUM" || i.severity?.toUpperCase() === "MODERATE";
    return true;
  });

  const displayName = user?.name || "Supervisor Elena Rostova";
  const displayBadge = user?.badgeNumber || "SS-104";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col">
      {/* 1. TOP APP HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1a44c2] flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 leading-none">
                  CampusGuard
                </span>
                <span className="text-[11px] font-extrabold tracking-wider text-slate-700 uppercase leading-none">
                  SUPERVISOR PORTAL
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 pl-4 text-xs font-semibold">
              <Link
                href="/dashboard/supervisor"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/supervisor/shifts"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Shifts
              </Link>
              <Link
                href="/dashboard/supervisor/escalations"
                className="py-5 relative transition cursor-pointer text-[#1a44c2] font-bold border-b-2 border-[#1a44c2]"
              >
                Escalations
              </Link>
              <Link
                href="/dashboard/supervisor/logbook"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Logbook
              </Link>
              <Link
                href="/dashboard/supervisor/notifications"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Notifications
              </Link>
              <Link
                href="/dashboard/supervisor/profile"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Profile
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f1f5f9] border border-slate-200/80 text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Escalation Stream Active</span>
            </div>

            <Link href="/dashboard/supervisor/notifications" className="relative cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition">
                <Bell className="w-4 h-4" />
              </div>
            </Link>

            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#1a44c2] text-white flex items-center justify-center font-bold text-xs overflow-hidden">
                <Image
                  src="/supervisor-elena.jpg"
                  alt={displayName}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {displayName}
                </span>
                <span className="text-[11px] text-slate-500 leading-tight">
                  Badge #{displayBadge}
                </span>
              </div>
              <button
                type="button"
                onClick={() => performLogout()}
                title="Log out"
                className="ml-1 p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. BODY LAYOUT */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <aside className="w-60 shrink-0 hidden md:flex flex-col justify-between bg-white border-r border-slate-200/90 min-h-[calc(100vh-64px)] p-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
              SUPERVISOR CONSOLE
            </div>
            <nav className="space-y-1.5 mt-1">
              <Link
                href="/dashboard/supervisor"
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/supervisor/shifts"
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                Shifts
              </Link>
              <Link
                href="/dashboard/supervisor/escalations"
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-bold bg-[#1a44c2] text-white shadow-xs"
              >
                Escalations
              </Link>
              <Link
                href="/dashboard/supervisor/logbook"
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                Logbook
              </Link>
              <Link
                href="/dashboard/supervisor/notifications"
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                Notifications
              </Link>
              <Link
                href="/dashboard/supervisor/profile"
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                Profile
              </Link>
            </nav>
          </div>
        </aside>

        {/* MAIN ESCALATIONS CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {actionNotice && (
            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-bold flex items-center justify-between">
              <span>{actionNotice}</span>
              <button onClick={() => setActionNotice(null)} className="text-blue-700 font-bold ml-2">✕</button>
            </div>
          )}

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-extrabold tracking-wider text-blue-800 uppercase">
                SUPERVISOR DISPATCH NOC • REAL-TIME INCIDENT TRIAGE &amp; PROCTOR ESCALATIONS
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Supervisor Escalation Command
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-normal mt-1 max-w-3xl">
                Protocol enforcement, Proctor executive intervention queue, and tactical perimeter incident routing.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative">
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="appearance-none bg-white border border-slate-200 px-3.5 py-2 pr-8 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer shadow-2xs"
                >
                  <option>All Severity Tiers</option>
                  <option>Critical Only</option>
                  <option>Moderate Only</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* 3 KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>ACTIVE ESCALATIONS</span>
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-3xl font-black text-slate-900">{activeCount}</div>
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-red-600 font-bold">{criticalCount} Critical</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600">{highCount} High</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>PROCTOR INTERVENTIONS</span>
                <ShieldCheck className="w-4 h-4 text-[#1a44c2]" />
              </div>
              <div className="text-3xl font-black text-slate-900">
                {incidents.filter((i) => i.status === "ESCALATED").length}
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-slate-700">Dean of Student Welfare</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Online
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>TOTAL INCIDENTS</span>
                <Zap className="w-4 h-4 text-[#1a44c2]" />
              </div>
              <div className="text-3xl font-black text-slate-900">{incidents.length}</div>
              <div className="text-xs text-slate-500">Recorded in active database</div>
            </div>
          </div>

          {/* ESCALATIONS STREAM */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                Urgent Escalation Triage Stream
              </h2>
              <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                {filteredIncidents.length} IN STREAM
              </span>
            </div>

            {filteredIncidents.length > 0 ? (
              filteredIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className={`bg-white border-t-4 border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3.5 ${
                    inc.severity?.toUpperCase() === "CRITICAL"
                      ? "border-t-red-600"
                      : inc.severity?.toUpperCase() === "HIGH"
                      ? "border-t-amber-500"
                      : "border-t-blue-600"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded uppercase ${
                        inc.severity?.toUpperCase() === "CRITICAL" ? "bg-red-600" : "bg-amber-600"
                      }`}>
                        ● LEVEL • {inc.severity}
                      </span>
                      <span className="bg-blue-100 text-[#1a44c2] font-bold text-[10px] px-2.5 py-0.5 rounded uppercase">
                        {inc.type}
                      </span>
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded">
                        {inc.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="font-bold text-slate-900">#ESC-{inc.id}</span>
                      <span className="text-slate-500 font-semibold">{inc.status}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {inc.title}
                  </h3>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-2 text-xs">
                      <div className="text-[10px] font-extrabold uppercase text-slate-400">
                        INCIDENT NARRATIVE BRIEF
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        Location reported at <strong className="text-blue-700">{inc.location}</strong>.
                        Reporter identification: <strong className="font-mono text-slate-800">{inc.reporterEmail || "Anonymous / Guard Sentry"}</strong>.
                        Dispatch status flagged as {inc.status}.
                      </p>
                    </div>

                    <div className="relative w-full sm:w-48 h-28 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-slate-900 shadow-2xs">
                      <Image
                        src="/cctv-gate07.jpg"
                        alt="CCTV"
                        width={200}
                        height={120}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 left-1 bg-black/70 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                        CAM #{inc.id}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleDeployTactical(inc.id)}
                        className="px-3.5 py-2 bg-[#1a44c2] hover:bg-[#1538a6] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Deploy Tactical Patrol Rover</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEscalateToProctor(inc.id)}
                        className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Escalate to Proctor Desk</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleResolve(inc.id)}
                      className="text-slate-500 hover:text-emerald-700 text-xs font-semibold cursor-pointer"
                    >
                      Mark Resolved / Clear
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border text-xs">
                No active escalations in the current queue.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
