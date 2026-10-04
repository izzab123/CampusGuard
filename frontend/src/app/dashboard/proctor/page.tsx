"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Shield,
  AlertTriangle,
  Gavel,
  Bell,
  Search,
  Download,
  PhoneCall,
  ExternalLink,
  ChevronRight,
  Clock,
  UserCheck,
  Calendar,
  Lock,
  LogOut,
  RefreshCw,
  PlusCircle,
  FileText
} from "lucide-react";
import { performLogout } from "@/lib/auth";

export default function ProctorAndDswDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [filterTab, setFilterTab] = useState("All Active");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col">
      {/* 1. TOP APP HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Portal Brand */}
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
                  PROCTOR &amp; DSW
                </span>
              </div>
            </Link>

            {/* Top Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 pl-4 text-xs font-semibold text-slate-600">
              {["Dashboard", "Incidents", "Notifications", "Profile"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`py-5 relative transition cursor-pointer ${
                    activeTab === tab
                      ? "text-blue-700 font-bold border-b-2 border-blue-700"
                      : "hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Status & Profile */}
          <div className="flex items-center gap-3">
            {/* System Online Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>SYSTEM ONLINE</span>
            </div>

            <button
              type="button"
              aria-label="Notifications"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 relative transition"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-600 border-2 border-white"></span>
            </button>

            {/* Dr. Vance Profile Badge */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#0a2f77] text-white flex items-center justify-center font-bold text-xs">
                AV
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  Dr. Arthur Vance
                </span>
                <span className="text-[11px] text-slate-500 leading-tight">
                  DSW Executive Dean #PR-109
                </span>
              </div>
              <button
                type="button"
                onClick={() => performLogout()}
                title="Log out"
                className="ml-1 p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. BODY LAYOUT: SIDEBAR + MAIN */}
      <div className="flex-1 max-w-[1520px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* LEFT SIDEBAR: EXECUTIVE CONTROLS */}
        <aside className="w-60 shrink-0 hidden md:flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
              Executive Controls
            </div>
            <nav className="space-y-1">
              {[
                { name: "Dashboard", icon: ShieldCheck },
                { name: "Incidents", icon: AlertTriangle },
                { name: "Notifications", icon: Bell },
                { name: "Profile", icon: UserCheck },
              ].map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === item.name
                      ? "bg-[#0a2f77] text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Bottom Card: DSW Status */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 inline-block">
              DSW STATUS: LEVEL BRAVO
            </span>
            <p className="text-xs text-slate-600 font-medium">
              Dean of Student Welfare Jurisdiction active campus-wide.
            </p>
            <div className="pt-1 text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-blue-700" />
              <span>24/7 Hotline: x9110</span>
            </div>
          </div>
        </aside>

        {/* MAIN EXECUTIVE COMMAND FEED */}
        <main className="flex-1 space-y-5">
          {/* HEADER TAG & ACTIONS */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-blue-800 uppercase">
                <span>• PROCTORIAL COMMAND &amp; STUDENT WELFARE • EXECUTIVE OVERSIGHT • TERM 2024-2025</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Incident overview
              </h1>
              <p className="text-xs text-slate-500">
                Real-time disciplinary triage, perimeter emergency escalations, welfare checks, and student safety directives.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>TELEMETRY ACTIVE • 3S SYNC</span>
              </div>
              <button
                type="button"
                className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Dossier</span>
              </button>
              <button
                type="button"
                className="px-3.5 py-2 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Issue Directive</span>
              </button>
            </div>
          </div>

          {/* 4 STAT KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: OPEN INCIDENTS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">Open Incidents</span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 leading-none">18</span>
                <span className="text-xs font-bold text-slate-500">+3 vs 08:00</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                <span>Across 6 campus zones</span>
                <span className="font-bold text-blue-700">4 pending review</span>
              </div>
            </div>

            {/* Card 2: MAJOR SEVERITY */}
            <div className="bg-red-50/40 border border-red-200 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-red-700 font-bold uppercase tracking-wider text-[11px]">Major Severity</span>
                <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-red-600 leading-none">04</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-200 text-red-900 uppercase">
                  ACTION REQ.
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-red-800 pt-1 border-t border-red-200/60">
                <span>Proctor Intervention</span>
                <span className="font-bold">2 Critical • 2 Level II</span>
              </div>
            </div>

            {/* Card 3: RESOLVED THIS WEEK */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">Resolved This Week</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 leading-none">42</span>
                <span className="text-xs font-bold text-emerald-700">+12% cycle</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                <span>94.8% SLA compliance</span>
                <span className="font-bold text-slate-700">Median 28m</span>
              </div>
            </div>

            {/* Card 4: INJUNCTIONS & ORDERS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">Injunctions &amp; Orders</span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Gavel className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 leading-none">07</span>
                <span className="text-xs font-bold text-slate-500">Monitored</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                <span>0 perimeter breaches</span>
                <span className="font-bold text-blue-700">ANPR Geofenced</span>
              </div>
            </div>
          </div>

          {/* ESCALATION IN REVIEW RED ALERT BOX */}
          <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
                <Gavel className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-200 text-red-900 uppercase">
                    ESCALATION IN REVIEW #ESC-8822 • GATE 07
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-800">
                  Unattended Vehicle &amp; Barrier Breach Attempt. Supervisor Elena Rostova flagged for proctorial sign-off and lockdown authorization.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg shadow-xs transition"
              >
                Review Telemetry &amp; ANPR
              </button>
              <button
                type="button"
                className="px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Authorize Level 1 Lock</span>
              </button>
            </div>
          </div>

          {/* TWO-COLUMN GRID: INCIDENT QUEUE PREVIEW & DISCIPLINARY DOCKET */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT 2 COLUMNS: INCIDENT QUEUE PREVIEW */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-900">Incident Queue Preview</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                      5 Priority
                    </span>
                  </div>

                  {/* Search and Filter */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search NetID, INC#, gate..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-7 pr-3 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <select className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-700">
                      <option>Severity: All</option>
                      <option>Major</option>
                      <option>Minor</option>
                    </select>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3">
                  {[
                    { label: "All Active", count: 18 },
                    { label: "Major Severity", count: 4 },
                    { label: "Student Welfare", count: 6 },
                    { label: "Perimeter Breaches", count: 3 },
                    { label: "Disciplinary", count: 5 },
                  ].map((tab) => (
                    <button
                      key={tab.label}
                      type="button"
                      onClick={() => setFilterTab(tab.label)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        filterTab === tab.label
                          ? "bg-[#0a2f77] text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>

                {/* 5 Incident Items */}
                <div className="space-y-3">
                  {/* Item 1: Major Perimeter */}
                  <div className="p-4 rounded-xl border border-red-200 bg-red-50/20 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white">
                          ● MAJOR
                        </span>
                        <span className="font-semibold text-slate-700">
                          Perimeter Security #INC-2025-084 / ESC-8822
                        </span>
                      </div>
                      <span className="text-[11px] text-red-700 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        18m ago (14:18 EST)
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">
                      Unauthorized Vehicle Barrier Breach Attempt &amp; Tailgate at Gate 07
                    </h3>

                    <p className="text-xs text-slate-500">
                      Reported by: <strong>Supv. Elena Rostova</strong> (ANPR Matrix) • Gate 07 South Quad Outer Ring
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg shadow-xs transition"
                      >
                        Take Command
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg shadow-xs transition"
                      >
                        Dispatch NOC
                      </button>
                      <button type="button" aria-label="Incident details" className="p-1.5 text-slate-400 hover:text-slate-600">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Item 2: Major Welfare */}
                  <div className="p-4 rounded-xl border border-red-200 bg-red-50/20 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white">
                          ● MAJOR
                        </span>
                        <span className="font-semibold text-slate-700">
                          Student Welfare &amp; Conduct #INC-2025-082
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        42m ago (13:54 EST)
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">
                      Student Residence Physical Altercation &amp; Noise Violation — South Quad Hall C
                    </h3>

                    <p className="text-xs text-slate-500">
                      Resident Advisor T. Morales • Dormitory Hall C, 3rd Floor Commons
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg shadow-xs transition"
                      >
                        Assign Conduct Officer
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg shadow-xs transition"
                      >
                        Review Statement
                      </button>
                    </div>
                  </div>

                  {/* Item 3: Minor Staffing */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                          MINOR
                        </span>
                        <span className="font-semibold text-slate-700">
                          Staffing Protocol #INC-2025-080 / ESC-8819
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        1h 12m ago (13:24 EST)
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">
                      Biometric Check-in Timeout &amp; Unmanned Guard Kiosk — Officer D. Thorne
                    </h3>

                    <p className="text-xs text-slate-500">
                      Shift Supervisor System Daemon • Gate 07 Checkpoint
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition"
                      >
                        Acknowledge Relief
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition"
                      >
                        View Handoff
                      </button>
                    </div>
                  </div>

                  {/* Item 4: Minor Public Safety */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                          MINOR
                        </span>
                        <span className="font-semibold text-slate-700">
                          Public Safety #INC-2025-078
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        2h 05m ago (12:31 EST)
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">
                      Unattended Suspicious Duffel Bag Flagged at West Quad Library Plaza
                    </h3>

                    <p className="text-xs text-slate-500">
                      Officer Marcus Vance (#4082) • West Quad Library Plaza Fountain
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition"
                      >
                        Log Safe Inspection
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition"
                      >
                        Review
                      </button>
                    </div>
                  </div>

                  {/* Item 5: Minor Traffic */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                          MINOR
                        </span>
                        <span className="font-semibold text-slate-700">
                          Traffic &amp; Logistics #INC-2025-075
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        3h 15m ago (11:21 EST)
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">
                      Zone N Parking Facility Over-Capacity &amp; Traffic Queue on University Blvd
                    </h3>

                    <p className="text-xs text-slate-500">
                      ANPR Induction Sensor Matrix • Zone N &amp; Visitor Lot B
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition"
                      >
                        Reroute to Lot C
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>

                {/* Queue Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <button type="button" className="text-blue-700 font-bold hover:underline flex items-center gap-1">
                    <span>View full incident queue (18 total)</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="font-mono">Audit Ref: DSW-LOG-0418</span>
                    <button type="button" className="text-slate-700 font-semibold hover:underline">
                      Export Compliance PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: DISCIPLINARY DOCKET */}
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-700" />
                    <h2 className="text-sm font-bold text-slate-900">Disciplinary Docket</h2>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    Today
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Docket Item 1 */}
                  <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                      <span className="font-mono text-blue-700 font-bold">15:30 EST</span>
                      <span>Room DSW-12</span>
                    </div>
                    <h3 className="font-bold text-slate-900">
                      Hearing #H-401 (Academic Conduct)
                    </h3>
                    <p className="text-[11px] text-slate-600">
                      Committee: Dr. Vance, Prof. Higgins, Registrar Rep.
                    </p>
                  </div>

                  {/* Docket Item 2 */}
                  <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                      <span className="font-mono text-blue-700 font-bold">17:00 EST</span>
                      <span>Dean&apos;s Briefing Rm</span>
                    </div>
                    <h3 className="font-bold text-slate-900">
                      Gate 07 Breach Protocol Debrief
                    </h3>
                    <p className="text-[11px] text-slate-600">
                      Attending: Field Supervisor Elena Rostova, Campus Ops
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    className="w-full text-center text-xs font-bold text-blue-700 hover:text-blue-900 py-1 transition"
                  >
                    View Complete Proctor Calendar →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
