"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  RotateCcw,
  CheckCircle2,
  LogOut,
  FileCheck2,
  Loader2,
  AlertTriangle,
  Eye,
  AlertCircle,
  ClipboardList,
  CheckSquare,
  Building,
  User,
  ArrowRight,
  Info
} from "lucide-react";
import { performLogout, getStoredAuthUser, AuthUser } from "@/lib/auth";
import { API_ENDPOINTS } from "@/lib/api";

interface ShiftHandoffRecord {
  id: number;
  outgoingGuardId: string;
  outgoingGuardName?: string;
  outgoingGuardEmail?: string;
  postLocation: string;
  incidents: string;
  generalObservations: string;
  pendingIssues: string;
  itemsToWatch: string;
  timestamp: string;
  shiftLogId?: number;
}

export default function GuardHandoffPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [handoffs, setHandoffs] = useState<ShiftHandoffRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form State
  const [postLocation, setPostLocation] = useState("North Perimeter & Gate 04");
  const [incidents, setIncidents] = useState("");
  const [generalObservations, setGeneralObservations] = useState("");
  const [pendingIssues, setPendingIssues] = useState("");
  const [itemsToWatch, setItemsToWatch] = useState("");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  // Dynamic Outgoing Guard Info (from session)
  const outgoingGuardId =
    user?.badgeNumber ||
    (user?.id ? `SEC-${user.id}` : "") ||
    user?.email ||
    "";
  const outgoingGuardName = user?.fullName || user?.name || user?.email || "Security Guard";

  // Section completion validations
  const isIncidentsValid = incidents.trim().length > 0;
  const isObservationsValid = generalObservations.trim().length > 0;
  const isPendingValid = pendingIssues.trim().length > 0;
  const isWatchItemsValid = itemsToWatch.trim().length > 0;

  const allRequiredFilled =
    isIncidentsValid &&
    isObservationsValid &&
    isPendingValid &&
    isWatchItemsValid &&
    postLocation.trim().length > 0;

  const fetchHandoffs = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.handoffs.list);
      if (res.ok) {
        const data = await res.json();
        setHandoffs(Array.isArray(data) ? data : []);
      }
    } catch {
      // Offline fallback handling
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const auth = getStoredAuthUser();
    setUser(auth);
    fetchHandoffs();
  }, []);

  const handleAction = (type: "success" | "error", message: string) => {
    setActionNotice({ type, message });
    setTimeout(() => setActionNotice(null), 6000);
  };

  const handleSubmitHandoff = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);

    if (!allRequiredFilled) {
      handleAction("error", "All 4 required sections (Incidents, Observations, Pending Issues, Items to Watch) must be filled before submission is allowed.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        outgoingGuardId: outgoingGuardId || "SEC-001",
        outgoingGuardName: outgoingGuardName,
        outgoingGuardEmail: user?.email || "",
        postLocation: postLocation.trim(),
        incidents: incidents.trim(),
        generalObservations: generalObservations.trim(),
        pendingIssues: pendingIssues.trim(),
        itemsToWatch: itemsToWatch.trim(),
      };

      const res = await fetch(API_ENDPOINTS.handoffs.base, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Guard-Id": outgoingGuardId,
          "X-Guard-Name": outgoingGuardName,
          "X-User-Email": user?.email || "",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const saved: ShiftHandoffRecord = await res.json();
        handleAction(
          "success",
          `Digital handoff form successfully recorded at ${new Date(saved.timestamp).toLocaleTimeString()} with Outgoing Guard ID: ${saved.outgoingGuardId}. Briefing is ready for incoming officer.`
        );
        // Reset form
        setIncidents("");
        setGeneralObservations("");
        setPendingIssues("");
        setItemsToWatch("");
        setAttemptedSubmit(false);
        fetchHandoffs();
      } else {
        const err = await res.json().catch(() => null);
        handleAction("error", err?.error || err?.message || "Failed to submit handoff form. Please verify all sections.");
      }
    } catch {
      handleAction("error", "Network connection error. Verify backend server is reachable.");
    } finally {
      setSubmitting(false);
    }
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
              <Link href="/dashboard/guard/view-my-duty" className="py-5 hover:text-slate-900 transition">
                View My Duty
              </Link>
              <Link href="/dashboard/guard/handoff" className="py-5 text-blue-700 font-bold border-b-2 border-blue-700">
                Shift Handoff
              </Link>
              <Link href="/dashboard/guard/parking" className="py-5 hover:text-slate-900 transition">
                Parking
              </Link>
              <Link href="/dashboard/guard/incidents" className="py-5 hover:text-slate-900 transition">
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
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-900">{outgoingGuardName}</span>
              <span className="text-[10px] font-mono font-semibold text-blue-700">
                {outgoingGuardId || "Duty Guard"}
              </span>
            </div>
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
          <div
            className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border ${
              actionNotice.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-red-50 border-red-200 text-red-900"
            }`}
          >
            <div className="flex items-center gap-2">
              {actionNotice.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{actionNotice.message}</span>
            </div>
            <button
              onClick={() => setActionNotice(null)}
              className="font-bold ml-3 text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Page Title & Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Digital Shift Handoff Portal
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              End-of-shift digital handover protocol: Log incidents, observations, pending issues, and items to watch for the incoming security officer.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchHandoffs}
              className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
            >
              <RotateCcw className={`w-3.5 h-3.5 text-slate-500 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh Log</span>
            </button>
          </div>
        </div>

        {/* Outgoing Guard Identification Strip */}
        <div className="bg-gradient-to-r from-[#0a2f77] to-blue-900 text-white rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                Outgoing Guard Verification
              </div>
              <div className="text-lg font-extrabold text-white">
                {outgoingGuardName}
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-blue-100">
                <span>Guard ID / Badge:</span>
                <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded text-white">
                  {outgoingGuardId || "SEC-ACTIVE"}
                </span>
                {user?.email && <span className="opacity-80">({user.email})</span>}
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl px-4 py-3 text-xs flex flex-col gap-1 min-w-[240px]">
            <div className="flex items-center justify-between text-blue-200">
              <span>Handoff Timestamp:</span>
              <span className="font-mono font-bold text-white">
                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} (Live)
              </span>
            </div>
            <div className="flex items-center justify-between text-blue-200">
              <span>Section Completion:</span>
              <span className={`font-bold ${allRequiredFilled ? "text-emerald-300" : "text-amber-300"}`}>
                {[isIncidentsValid, isObservationsValid, isPendingValid, isWatchItemsValid].filter(Boolean).length} / 4 Required
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Left: Handoff Form, Right: Briefing / Log Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Handoff Form Column */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-blue-700" />
                  <span>Digital Handoff Submission Form</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  All 4 sections below are mandatory and must be documented before transition checkout.
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                <Info className="w-3.5 h-3.5 text-blue-700" />
                <span>ID: {outgoingGuardId || "Dynamic"}</span>
              </div>
            </div>

            <form onSubmit={handleSubmitHandoff} className="space-y-5 text-xs">
              {/* Post / Checkpoint Selection */}
              <div>
                <label className="font-bold text-slate-800 flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-slate-500" />
                    <span>Watch Post / Gate Location</span>
                    <span className="text-red-500 font-bold">*</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Assigned Duty Post</span>
                </label>
                <input
                  type="text"
                  required
                  value={postLocation}
                  onChange={(e) => setPostLocation(e.target.value)}
                  placeholder="e.g. North Perimeter & Gate 04, Science Complex Checkpoint..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
              </div>

              {/* Section 1: Incidents */}
              <div className={`p-4 rounded-xl border transition ${
                attemptedSubmit && !isIncidentsValid
                  ? "bg-red-50/50 border-red-300 ring-1 ring-red-200"
                  : isIncidentsValid
                  ? "bg-slate-50/60 border-slate-200"
                  : "bg-slate-50/30 border-slate-200"
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-red-100 text-red-700 font-extrabold flex items-center justify-center text-[10px]">
                      1
                    </span>
                    <span className="text-sm">Incidents Section</span>
                    <span className="text-red-500 font-extrabold">* Required</span>
                  </label>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isIncidentsValid
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {isIncidentsValid ? "Filled ✓" : "Mandatory"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-2">
                  Record all security incidents, perimeter alarms, unauthorized access attempts, or disturbance calls. If no incidents occurred, explicitly state &quot;None - Quiet shift with zero incidents reported.&quot;
                </p>
                <textarea
                  rows={3}
                  value={incidents}
                  onChange={(e) => setIncidents(e.target.value)}
                  placeholder="Example: 14:20 - Unauthorized vehicle turned around at Gate 04; or 'Zero incidents during watch'."
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-y"
                />
                {attemptedSubmit && !isIncidentsValid && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1">
                    ⚠ This required section must be filled before submission.
                  </p>
                )}
              </div>

              {/* Section 2: General Observations */}
              <div className={`p-4 rounded-xl border transition ${
                attemptedSubmit && !isObservationsValid
                  ? "bg-red-50/50 border-red-300 ring-1 ring-red-200"
                  : isObservationsValid
                  ? "bg-slate-50/60 border-slate-200"
                  : "bg-slate-50/30 border-slate-200"
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-[10px]">
                      2
                    </span>
                    <span className="text-sm">General Observations</span>
                    <span className="text-red-500 font-extrabold">* Required</span>
                  </label>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isObservationsValid
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {isObservationsValid ? "Filled ✓" : "Mandatory"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-2">
                  Summarize campus environment conditions, barrier and door integrity, visitor volume, weather events, or key checkpoint turnover notes.
                </p>
                <textarea
                  rows={3}
                  value={generalObservations}
                  onChange={(e) => setGeneralObservations(e.target.value)}
                  placeholder="Example: Heavy student foot traffic during mid-day class change. North perimeter gate lock checked and secure. Weather clear."
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-y"
                />
                {attemptedSubmit && !isObservationsValid && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1">
                    ⚠ This required section must be filled before submission.
                  </p>
                )}
              </div>

              {/* Section 3: Pending Issues */}
              <div className={`p-4 rounded-xl border transition ${
                attemptedSubmit && !isPendingValid
                  ? "bg-red-50/50 border-red-300 ring-1 ring-red-200"
                  : isPendingValid
                  ? "bg-slate-50/60 border-slate-200"
                  : "bg-slate-50/30 border-slate-200"
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center text-[10px]">
                      3
                    </span>
                    <span className="text-sm">Pending Issues</span>
                    <span className="text-red-500 font-extrabold">* Required</span>
                  </label>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isPendingValid
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {isPendingValid ? "Filled ✓" : "Mandatory"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-2">
                  Detail unresolved matters, hardware malfunctions, unreturned guest badges, or maintenance tickets requiring the incoming guard&apos;s follow-up.
                </p>
                <textarea
                  rows={3}
                  value={pendingIssues}
                  onChange={(e) => setPendingIssues(e.target.value)}
                  placeholder="Example: Barrier arm Lane 2 has 3-second motor lag (ticket #310). Awaiting delivery driver return pass #44."
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-y"
                />
                {attemptedSubmit && !isPendingValid && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1">
                    ⚠ This required section must be filled before submission.
                  </p>
                )}
              </div>

              {/* Section 4: Items to Watch */}
              <div className={`p-4 rounded-xl border transition ${
                attemptedSubmit && !isWatchItemsValid
                  ? "bg-red-50/50 border-red-300 ring-1 ring-red-200"
                  : isWatchItemsValid
                  ? "bg-slate-50/60 border-slate-200"
                  : "bg-slate-50/30 border-slate-200"
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center text-[10px]">
                      4
                    </span>
                    <span className="text-sm">Items to Watch</span>
                    <span className="text-red-500 font-extrabold">* Required</span>
                  </label>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isWatchItemsValid
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {isWatchItemsValid ? "Filled ✓" : "Mandatory"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-2">
                  Key areas of elevated attention: suspicious vehicles, VIP visits, scheduled student gatherings, or sensitive facilities for the incoming watch.
                </p>
                <textarea
                  rows={3}
                  value={itemsToWatch}
                  onChange={(e) => setItemsToWatch(e.target.value)}
                  placeholder="Example: Monitor silver sedan plate #CG-481 seen loitering near library rear. Special event at auditorium at 18:00."
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-y"
                />
                {attemptedSubmit && !isWatchItemsValid && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1">
                    ⚠ This required section must be filled before submission.
                  </p>
                )}
              </div>

              {/* Submission Controls */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-[11px] text-slate-500">
                  {allRequiredFilled ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Ready for submission (All sections validated)
                    </span>
                  ) : (
                    <span className="text-amber-700 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" /> Fill all 4 sections to enable submission
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting || !allRequiredFilled}
                  className="w-full sm:w-auto px-6 py-3 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileCheck2 className="w-4 h-4" />
                  )}
                  <span>Submit Digital Shift Handoff</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Feed of Digital Handoffs for Incoming Guard */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-700" />
                    <span>Incoming Guard Briefings</span>
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    What happened &amp; what is pending from previous shift handovers.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded-md">
                  {handoffs.length} Recorded
                </span>
              </div>

              <div className="mt-4 space-y-4 max-h-[850px] overflow-y-auto pr-1">
                {handoffs.length === 0 ? (
                  <div className="py-12 px-4 text-center space-y-2">
                    <ClipboardList className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-semibold text-slate-500">No shift handoffs logged yet.</p>
                    <p className="text-[11px] text-slate-400">
                      Submit the form on the left to document this shift&apos;s digital handoff.
                    </p>
                  </div>
                ) : (
                  handoffs.map((record) => (
                    <div
                      key={record.id}
                      className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3 hover:border-blue-300 transition"
                    >
                      {/* Entry Header */}
                      <div className="flex items-start justify-between gap-2 border-b border-slate-200/60 pb-2">
                        <div>
                          <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            <span>{record.outgoingGuardName || "Security Officer"}</span>
                            <span className="font-mono text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                              ID: {record.outgoingGuardId}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Post: <span className="font-semibold text-slate-700">{record.postLocation}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-[10px] font-mono font-bold text-slate-600 flex items-center gap-1 justify-end">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{new Date(record.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {new Date(record.timestamp).toLocaleDateString([], { month: "short", day: "numeric" })}
                          </div>
                        </div>
                      </div>

                      {/* 4 Sections Breakdown */}
                      <div className="space-y-2 text-xs">
                        {/* Section 1 */}
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                          <div className="font-bold text-[10px] uppercase tracking-wider text-red-700 flex items-center gap-1 mb-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>Incidents During Shift</span>
                          </div>
                          <p className="text-slate-700 text-[11px] whitespace-pre-wrap leading-relaxed">
                            {record.incidents}
                          </p>
                        </div>

                        {/* Section 2 */}
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                          <div className="font-bold text-[10px] uppercase tracking-wider text-blue-700 flex items-center gap-1 mb-1">
                            <Eye className="w-3 h-3" />
                            <span>General Observations</span>
                          </div>
                          <p className="text-slate-700 text-[11px] whitespace-pre-wrap leading-relaxed">
                            {record.generalObservations}
                          </p>
                        </div>

                        {/* Section 3 */}
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                          <div className="font-bold text-[10px] uppercase tracking-wider text-amber-700 flex items-center gap-1 mb-1">
                            <Clock className="w-3 h-3" />
                            <span>Pending Issues</span>
                          </div>
                          <p className="text-slate-700 text-[11px] whitespace-pre-wrap leading-relaxed">
                            {record.pendingIssues}
                          </p>
                        </div>

                        {/* Section 4 */}
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                          <div className="font-bold text-[10px] uppercase tracking-wider text-purple-700 flex items-center gap-1 mb-1">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Items to Watch</span>
                          </div>
                          <p className="text-slate-700 text-[11px] whitespace-pre-wrap leading-relaxed">
                            {record.itemsToWatch}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
