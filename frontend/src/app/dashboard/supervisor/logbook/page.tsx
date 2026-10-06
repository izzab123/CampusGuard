"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Bell,
  Clock,
  LogOut,
  Layers,
  Search,
  Filter,
  FileDown,
  Lock,
  RotateCcw,
  CheckCircle2,
  Calendar,
  KeyRound,
  ShieldAlert,
  AlertTriangle,
  ChevronDown,
  Check,
  FileText,
  Radio,
  FileCheck
} from "lucide-react";
import { performLogout } from "@/lib/auth";

export default function SupervisorLogbookPage() {
  const [activeTab, setActiveTab] = useState("All Events (184)");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSealed, setIsSealed] = useState(false);
  const [checklist, setChecklist] = useState({
    keyInventory: true,
    sidearms: true,
    bollard: false,
  });

  const toggleCheck = (k: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col">
      {/* 1. TOP APP HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Portal Brand */}
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

            {/* Top Navigation Links */}
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
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Escalations
              </Link>
              <Link
                href="/dashboard/supervisor/logbook"
                className="py-5 relative transition cursor-pointer text-[#1a44c2] font-bold border-b-2 border-[#1a44c2]"
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

          {/* Right Status & Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f1f5f9] border border-slate-200/80 text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>ACTIVE DISPATCH</span>
            </div>

            <Link href="/dashboard/supervisor/notifications" className="relative cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition">
                <Bell className="w-4 h-4" />
              </div>
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                3
              </span>
            </Link>

            {/* Supervisor Profile */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#1a44c2] text-white flex items-center justify-center font-bold text-xs overflow-hidden">
                <Image
                  src="/supervisor-elena.jpg"
                  alt="Supervisor Elena"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  Supervisor Elena Rostova
                </span>
                <span className="text-[11px] text-slate-500 leading-tight">
                  Badge #SS-104
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

      {/* TOP AUDIT COMPLIANCE BANNER */}
      <div className="bg-slate-100/90 border-b border-slate-200 px-4 sm:px-8 py-2.5">
        <div className="max-w-[1520px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span className="font-extrabold text-[#1a44c2] uppercase tracking-wider text-[11px]">
              SUPERVISOR AUDIT &amp; COMPLIANCE • SHIFT B OFFICIAL RECORD
            </span>
            <span className="text-slate-400">|</span>
            <span className="font-mono text-slate-600 text-[11px]">
              LEDGER ID: #SHA-8849-20251024-B
            </span>
          </div>

          <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5 self-start md:self-center">
            <span>NODE: HQ-VXL-02 (SYNCHRONIZED)</span>
            <Lock className="w-3 h-3 text-[#1a44c2]" />
          </div>
        </div>
      </div>

      {/* 2. BODY LAYOUT: SIDEBAR + MAIN */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* LEFT SIDEBAR */}
        <aside className="w-60 shrink-0 hidden md:flex flex-col justify-between bg-white border-r border-slate-200/90 min-h-[calc(100vh-115px)] p-4">
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
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                Escalations
              </Link>
              <Link
                href="/dashboard/supervisor/logbook"
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-bold bg-[#1a44c2] text-white shadow-xs"
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

          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl space-y-1">
            <div className="text-[10px] font-extrabold uppercase text-[#1a44c2]">
              Watch Command
            </div>
            <div className="text-xs font-bold text-slate-900">
              Zone Alpha • Shift B
            </div>
          </div>
        </aside>

        {/* MAIN LOGBOOK CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Master Security Logbook</span>
                <Lock className="w-5 h-5 text-[#1a44c2]" />
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-normal mt-1 max-w-3xl">
                Permanent, tamper-evident digital ledger recording all gate telemetry, barrier overrides, biometric enrollments, radio dispatches, and custodial master-key handoffs across Zone Alpha.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Today: Oct 24, 2025</span>
              </span>

              <button
                type="button"
                onClick={() => alert("Exporting tamper-evident audit report...")}
                className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Export Audit</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSealed(true)}
                className="px-4 py-2 bg-[#1a44c2] hover:bg-[#1538a6] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isSealed ? "Logbook Sealed & Bound" : "Sign & Seal Logbook"}</span>
              </button>
            </div>
          </div>

          {/* 4 KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>TOTAL LOG ENTRIES</span>
                <FileText className="w-4 h-4 text-[#1a44c2]" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                184 <span className="text-xs font-bold text-slate-400">Shift B</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="text-blue-700 font-bold">100% Hash Verified</span>
                <span>0 Latency</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>CUSTODIAL KEY TRANSFERS</span>
                <KeyRound className="w-4 h-4 text-[#1a44c2]" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                12 <span className="text-xs font-bold text-slate-400">Completed</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="bg-blue-50 text-[#1a44c2] font-bold px-1.5 py-0.5 rounded text-[10px]">
                  Dual-PIN Signed
                </span>
                <span>Vault 02 Secure</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>BARRIER OVERRIDES</span>
                <ShieldCheck className="w-4 h-4 text-[#1a44c2]" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                3 <span className="text-xs font-bold text-slate-400">Authorized</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="text-blue-700 font-bold">Audited &amp; Recorded</span>
                <span>1 Emer / 2 Maint</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>INCIDENT FLAGS</span>
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-2xl font-black text-red-600">
                2 <span className="text-xs font-bold text-red-600">Action Items Open</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="text-red-600 font-bold">Review Pending</span>
                <span>Gate 07 / Zone N</span>
              </div>
            </div>
          </div>

          {/* CRITICAL ANOMALY BANNER */}
          <div className="bg-red-50/90 border border-red-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-red-700 text-xs">
                    Critical Ledger Anomaly Detected
                  </span>
                  <span className="bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded font-mono">
                    EVENT #ESC-8022
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Automated bollard deployment triggered at Gate 07 South Quad at 14:18:02 EST. Shift Supervisor physical review required within 45 minutes.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => alert("Flag dismissed from active view.")}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg cursor-pointer"
              >
                Dismiss Flag
              </button>
              <Link
                href="/dashboard/supervisor/escalations"
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-2xs"
              >
                Review Incident File
              </Link>
            </div>
          </div>

          {/* FILTER & CATEGORY TABS BAR */}
          <div className="space-y-3">
            {/* Search Input & Severity Selector */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by event ID, officer shield #, gate location, or action type..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  SEVERITY:
                </span>
                {["All", "Routine", "Elevated", "Critical (1)"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeverityFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      severityFilter === s
                        ? s.includes("Critical")
                          ? "bg-red-600 text-white"
                          : "bg-[#1a44c2] text-white"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-slate-200 pb-2">
              {[
                "All Events (184)",
                "Shift Handoffs (12)",
                "Access & Barrier Events (69)",
                "Incidents & Citations (18)",
                "System Diagnostics (35)",
                "Dispatches (30)",
              ].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setActiveTab(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === t
                      ? "bg-[#1a44c2] text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* CONTINUOUS AUDIT LOG TABLE */}
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden space-y-2">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#1a44c2]" />
                <h2 className="text-sm font-bold text-slate-900">
                  Shift B Continuous Audit Log
                </h2>
                <span className="text-xs text-slate-500">
                  Ledger sync interval: real-time streaming • Consensus protocol: Active SOC
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <button
                  type="button"
                  className="flex items-center gap-1 text-[#1a44c2] font-bold hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Refresh block</span>
                </button>
                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold">
                  BLOCK #44,912
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-4">TIMESTAMP &amp; BLOCK HASH</th>
                    <th className="py-2.5 px-3">CATEGORY</th>
                    <th className="py-2.5 px-3">LOCATION / POST</th>
                    <th className="py-2.5 px-3">OPERATOR / SHIELD</th>
                    <th className="py-2.5 px-4">EVENT TELEMETRY &amp; NARRATIVE</th>
                    <th className="py-2.5 px-4">VERIFICATION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {/* Row 1 */}
                  <tr className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-slate-900">14:18:02 EST</div>
                      <div className="text-[10px] text-slate-400">#7a8e...8924f</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                        ● Barrier Override
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">Gate 07 South Quad</div>
                      <div className="text-[10px] text-slate-500">Sub-terminal Bravo</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      Auto-Lock Daemon
                    </td>
                    <td className="py-3 px-4 leading-relaxed text-slate-700">
                      Hydraulic bollards auto-raised on tailgating vehicle plate{" "}
                      <strong className="text-red-700 font-mono">UNR-9024</strong>. Alert{" "}
                      <strong className="text-slate-900 font-mono">#ESC-8022</strong> generated. Perimeter lock sequence initiated.
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Cryptographic Seal SHA-256 Valid
                      </span>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-slate-900">14:15:39 EST</div>
                      <div className="text-[10px] text-slate-400">#4c11...bb068</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-[#1a44c2]">
                        ● Supervisor Note
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">Watch Command Desk</div>
                      <div className="text-[10px] text-slate-500">Station Alpha-1</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">Sup. Elena Rostova</div>
                      <div className="text-[10px] text-slate-500">#SS-104</div>
                    </td>
                    <td className="py-3 px-4 leading-relaxed text-slate-700">
                      Dispatched Officer L. Gomez from reserve pool to relieve unmanned Gate 07 post during vehicle inspection. Tactical radio channel 02 cleared.
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Signed &amp; Bound SmartCard Auth
                      </span>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-slate-900">14:10:14 EST</div>
                      <div className="text-[10px] text-slate-400">#0e03...fa221</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        ● Biometrics
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">Armory Locker Kiosk</div>
                      <div className="text-[10px] text-slate-500">Zone Alpha Secured</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">Off. Maya Lin</div>
                      <div className="text-[10px] text-slate-500">#4105</div>
                    </td>
                    <td className="py-3 px-4 leading-relaxed text-slate-700">
                      FIDO token scanned and locker access logged for duty sidearm and mobile radio transceiver #RT-19. Biometric facial match 99.4%.
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified Auth Token Valid
                      </span>
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-slate-900">13:58:45 EST</div>
                      <div className="text-[10px] text-slate-400">#12dd...833ea</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-[#1a44c2]">
                        ● Shift Handoff
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">Gate 04 Checkpoint</div>
                      <div className="text-[10px] text-slate-500">West Sector Main</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">Off. Vance &amp; Jenkins</div>
                      <div className="text-[10px] text-slate-500">#4082 • #3991</div>
                    </td>
                    <td className="py-3 px-4 leading-relaxed text-slate-700">
                      Shift handoff physical checklist completed. Radio Ch 4 calibrated, Master Safe Ring Keys #04 transferred without discrepancy.
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Dual-Custody Witnessed
                      </span>
                    </td>
                  </tr>

                  {/* Row 5 */}
                  <tr className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-slate-900">12:45:10 EST</div>
                      <div className="text-[10px] text-slate-400">#68bb...ea218</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        ● Citation
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">Zone N Loading Bay 14</div>
                      <div className="text-[10px] text-slate-500">Service Corridor</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">Off. Marcus Vance</div>
                      <div className="text-[10px] text-slate-500">#4082</div>
                    </td>
                    <td className="py-3 px-4 leading-relaxed text-slate-700">
                      Citation #CIT-9912 issued for commercial box truck blocking designated emergency fire access lane. Tow dispatch alerted.
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Validated GPS Attached
                      </span>
                    </td>
                  </tr>

                  {/* Row 6 */}
                  <tr className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-slate-900">11:30:00 EST</div>
                      <div className="text-[10px] text-slate-400">#3e10...000ef</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                        ● Diagnostics
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">Gate 01 East Perimeter</div>
                      <div className="text-[10px] text-slate-500">Primary Access Barrier</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">Techs + Off. Delgado</div>
                      <div className="text-[10px] text-slate-500">#4911</div>
                    </td>
                    <td className="py-3 px-4 leading-relaxed text-slate-700">
                      Laser barrier optic alignment calibrated following thermal shift. Beam latency measured at 14ms (Pass standard: &lt;25ms).
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Certified Sensor Telemetry
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Showing 1-6 of 184 Shift Entries • Page 1 of 31</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="px-2.5 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="w-7 h-7 bg-[#1a44c2] text-white rounded font-bold cursor-pointer"
                >
                  1
                </button>
                <button
                  type="button"
                  className="w-7 h-7 border border-slate-200 rounded text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  2
                </button>
                <button
                  type="button"
                  className="w-7 h-7 border border-slate-200 rounded text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  3
                </button>
                <span className="px-1">..</span>
                <button
                  type="button"
                  className="w-7 h-7 border border-slate-200 rounded text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  31
                </button>
                <button
                  type="button"
                  className="px-2.5 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* BOTTOM ATTESTATION & SHIFT SEALING CONSOLE */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1a44c2] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      Supervisor Attestation &amp; Shift Sealing Console
                    </h3>
                    <span className="bg-blue-100 text-[#1a44c2] text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                      STAGE 1 OPEN
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Shift B Logbook Open • Scheduled for official electronic signature &amp; state regulatory filing at 22:00 EST.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-700 font-medium flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Shift Closes In: <strong className="font-mono text-slate-900">07h 41m 58s</strong></span>
              </div>
            </div>

            {/* Notes Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Supervisor Shift Summary &amp; Operational Notes</span>
                <span className="text-[11px] font-normal text-slate-400">Audit Trail Append-Only</span>
              </div>
              <textarea
                rows={2}
                defaultValue="Gate 07 bollard deployment at 14:18 EST under active review. Officer Gomez secured post. All campus master keys cataloged in Vault 02 with zero variance."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* 3 Checkboxes */}
            <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-800 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checklist.keyInventory}
                  onChange={() => toggleCheck("keyInventory")}
                  className="rounded text-[#1a44c2] focus:ring-0"
                />
                <span>Dual-custody key inventory certified</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checklist.sidearms}
                  onChange={() => toggleCheck("sidearms")}
                  className="rounded text-[#1a44c2] focus:ring-0"
                />
                <span>Armory sidearms reconciliation verified</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none text-red-600 font-bold">
                <input
                  type="checkbox"
                  checked={checklist.bollard}
                  onChange={() => toggleCheck("bollard")}
                  className="rounded text-red-600 focus:ring-0"
                />
                <span>Bollard incident #ESC-8022 resolved</span>
              </label>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
