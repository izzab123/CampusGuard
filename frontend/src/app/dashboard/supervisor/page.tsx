"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Shield,
  Users,
  ArrowRightLeft,
  Bell,
  AlertTriangle,
  Radio,
  Download,
  RefreshCw,
  Search,
  Filter,
  PhoneCall,
  UserCheck,
  Video,
  LogOut,
  ChevronDown,
  Layers,
  Calendar,
  AlertCircle,
  MoreVertical,
  CheckCircle2
} from "lucide-react";
import { performLogout } from "@/lib/auth";

export default function ShiftSupervisorDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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
                  SUPERVISOR PORTAL
                </span>
              </div>
            </Link>

            {/* Top Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 pl-4 text-xs font-semibold text-slate-600">
              <Link
                href="/dashboard/supervisor"
                className="py-5 relative transition cursor-pointer text-blue-700 font-bold border-b-2 border-blue-700"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/supervisor/shifts"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Shifts
              </Link>
              <Link
                href="/dashboard/supervisor/escalations"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Escalations
              </Link>
              <Link
                href="/dashboard/supervisor/logbook"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Logbook
              </Link>
              <Link
                href="/dashboard/supervisor/notifications"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Notifications
              </Link>
              <Link
                href="/dashboard/supervisor/profile"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Profile
              </Link>
            </nav>
          </div>

          {/* Right Status & Profile */}
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>

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
                <img
                  src="/supervisor-elena.jpg"
                  alt="Supervisor Elena"
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

      {/* 2. BODY LAYOUT: SIDEBAR + MAIN */}
      <div className="flex-1 max-w-[1520px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* LEFT SIDEBAR: SUPERVISOR CONSOLE */}
        <aside className="w-60 shrink-0 hidden md:flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
              Supervisor Console
            </div>
            <nav className="space-y-1">
              {[
                { name: "Dashboard", href: "/dashboard/supervisor", icon: ShieldCheck, active: true },
                { name: "Shifts", href: "/dashboard/supervisor/shifts", icon: Calendar },
                { name: "Escalations", href: "/dashboard/supervisor/escalations", icon: AlertTriangle },
                { name: "Logbook", href: "/dashboard/supervisor/logbook", icon: Layers },
                { name: "Notifications", href: "/dashboard/supervisor/notifications", icon: Bell },
                { name: "Profile", href: "/dashboard/supervisor/profile", icon: UserCheck },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition ${
                    item.active
                      ? "bg-[#1a44c2] text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* MAIN SUPERVISOR COMMAND FEED */}
        <main className="flex-1 space-y-5">
          {/* HIGH PRIORITY PROTOCOL NOTICE */}
          <div className="bg-red-50/90 border border-red-200 rounded-xl p-3 sm:px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
              <strong className="text-red-900 uppercase tracking-wide">
                HIGH PRIORITY PROTOCOL NOTICE •
              </strong>
              <span className="text-red-800">
                Automatic Proctor Escalation queued in <strong>1m 42s</strong> for unmanned Gate 07 barrier post.
              </span>
            </div>
            <button
              type="button"
              className="px-3.5 py-1.5 bg-[#8b0000] hover:bg-red-900 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition shrink-0"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Acknowledge Escalation</span>
            </button>
          </div>

          {/* TELEMETRY HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-blue-800 uppercase">
                <span>• SUPERVISOR COMMAND &amp; ROSTER TELEMETRY • SHIFT B (14:00 - 22:00)</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Shift overview
              </h1>
              <p className="text-xs text-slate-500">
                Live post coverage, automated attendance surveillance, and active perimeter sentinel deployments.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Roster CSV</span>
              </button>
              <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Live Sync: 9s</span>
                <RefreshCw className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          </div>

          {/* 4 STAT KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Active guards on duty */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Active guards on duty</span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 leading-none">24</span>
                <span className="text-xs font-bold text-emerald-700">↑ +2 over min</span>
              </div>
              <p className="text-[11px] text-slate-500">
                of 26 budgeted posts manned (<strong>92.3%</strong> coverage)
              </p>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-700 rounded-full" style={{ width: "92.3%" }}></div>
              </div>
            </div>

            {/* Card 2: Pending handoffs */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Pending handoffs</span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 leading-none">3</span>
                <span className="text-xs font-bold text-blue-700">+1 in progress</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Within next 30 mins: Gate 04, East Ped, Library
              </p>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "65%" }}></div>
              </div>
            </div>

            {/* Card 3: Open no-show alerts */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Open no-show alerts</span>
                <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-red-600 leading-none">2</span>
                <span className="text-xs font-bold text-red-700">Urgent action required</span>
              </div>
              <p className="text-[11px] text-slate-500">
                1 Critical overdue (&gt;15m), 1 Warning (&gt;8m)
              </p>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 rounded-full" style={{ width: "85%" }}></div>
              </div>
            </div>

            {/* Card 4: ANPR Gate Checkpoints */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">ANPR Gate Checkpoints</span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Radio className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 leading-none">99.1%</span>
                <span className="text-xs font-bold text-emerald-700">● Synchronized</span>
              </div>
              <p className="text-[11px] text-slate-500">
                14 of 14 optical lanes reporting, 0 barrier bypasses.
              </p>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: "99.1%" }}></div>
              </div>
            </div>
          </div>

          {/* PRIORITY NO-SHOW ALERTS & AUTOMATED ESCALATIONS */}
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Priority No-Show Alerts &amp; Automated Escalations
                </h2>
                <p className="text-[11px] text-slate-500">
                  Algorithmic post monitoring: Biometric breach triggers supervisor action at 5m, Proctor escalation at 15m.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Alert Card 1: Critical Overdue */}
              <div className="bg-red-50/40 border-2 border-red-300 rounded-2xl p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between text-xs border-b border-red-200/60 pb-2">
                  <span className="font-bold text-red-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                    CRITICAL OVERDUE (18m overdue)
                  </span>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="font-semibold text-slate-600">Relief Unit 03</span>
                    <span className="font-mono text-slate-400">ID: ESC-8822</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm shrink-0">
                    DT
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900">Officer Daniel Thorne</h3>
                      <span className="text-slate-400 font-mono">#3942</span>
                    </div>
                    <p className="text-slate-600 font-medium">Gate 07 — South Delivery Terminal</p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-1">
                      <span>Expected Check-in: <strong>14:00 EST</strong></span>
                      <span className="text-red-700 font-bold">Current Time: 14:18 EST (+18m)</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-700 bg-white/70 p-2.5 rounded-lg border border-red-100">
                  Biometric kiosk untouched. Radio beacon unresponsive (Ping failed 14:14). Barrier lane locked down in fail-secure mode.
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="px-3 py-1.5 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg shadow-xs transition"
                    >
                      Reassign Post
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      <span>Escalate to Proctor</span>
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-lg transition"
                    >
                      Clear
                    </button>
                  </div>
                  <a
                    href="tel:+15550182834"
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call +1(555)018-2834</span>
                  </a>
                </div>
              </div>

              {/* Alert Card 2: Attendance Warning */}
              <div className="bg-amber-50/40 border-2 border-amber-300 rounded-2xl p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between text-xs border-b border-amber-200/60 pb-2">
                  <span className="font-bold text-amber-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                    ATTENDANCE WARNING (9m overdue)
                  </span>
                  <span className="font-mono text-slate-400 text-[11px]">ID: ESC-8823</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0">
                    ML
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900">Officer Maya Lin</h3>
                      <span className="text-slate-400 font-mono">#4105</span>
                    </div>
                    <p className="text-slate-600 font-medium">Gate 02 — West Perimeter Pedestrian Portal</p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-1">
                      <span>Expected Check-in: <strong>14:10 EST</strong></span>
                      <span className="text-amber-700 font-bold">Current Time: 14:19 EST (+9m)</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-700 bg-white/70 p-2.5 rounded-lg border border-amber-100">
                  En route from central armory; FIDO token scanned at equipment locker station 6m ago. Pending physical gate beacon handshake.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition"
                  >
                    Reassign
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition"
                  >
                    Escalate
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg shadow-xs transition"
                  >
                    Confirm Check-In
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition flex items-center gap-1"
                  >
                    <Radio className="w-3 h-3" />
                    <span>Ping Radio Ch 3</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIVE SHIFTS & GATE POSTS ROSTER TABLE */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Active Shifts &amp; Gate Posts Roster
                </h2>
                <p className="text-[11px] text-slate-500">
                  Real-time status of 26 assigned surveillance sectors, vehicle terminals, and security patrol units.
                </p>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search guard, shield #, or gate..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <select className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium">
                  <option>Sector: All Sectors</option>
                  <option>North Academic Quad</option>
                  <option>East Perimeter</option>
                  <option>West Portal</option>
                </select>
                <select className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium">
                  <option>Status: All (26)</option>
                  <option>On Duty</option>
                  <option>Relief in Progress</option>
                  <option>Unstaffed / Alert</option>
                </select>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                >
                  Reorder Roster
                </button>
              </div>
            </div>

            {/* The Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-3">Guard Details</th>
                    <th className="py-3 px-3">Gate / Assigned Post</th>
                    <th className="py-3 px-3">Shift Time &amp; Progress</th>
                    <th className="py-3 px-3">Biometric &amp; Telemetry</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {/* Row 1: Officer Marcus Vance */}
                  <tr className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                          MV
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Officer Marcus Vance</p>
                          <p className="text-[11px] text-slate-500">#4082 • Ch 4 (Ops)</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-800">Gate 04 — North Academic Quad</p>
                      <p className="text-[11px] text-slate-500">Barrier Terminal (Automated)</p>
                    </td>
                    <td className="py-3 px-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-700">08:00 – 16:00</span>
                          <span className="text-slate-400 font-mono">78%</span>
                        </div>
                        <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#0a2f77] rounded-full" style={{ width: "78%" }}></div>
                        </div>
                        <span className="text-[10px] text-slate-400 block">6h 18m elapsed</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        FIDO SSO + In-Zone
                      </p>
                      <p className="text-[11px] text-slate-500">ANPR Node #4 Active</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        ● On Duty
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-slate-400">
                        <button type="button" aria-label="View camera" className="p-1 hover:text-slate-700"><Video className="w-3.5 h-3.5" /></button>
                        <button type="button" aria-label="View telemetry" className="p-1 hover:text-slate-700"><Radio className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 2: Officer S. Jenkins */}
                  <tr className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                          SJ
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Officer S. Jenkins</p>
                          <p className="text-[11px] text-slate-500">#4120 • Ch 4 (Ops)</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-800">Gate 04 Relief (Incoming)</p>
                      <p className="text-[11px] text-slate-500">Staged at Guard Shack</p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-700">16:00 – 00:00</p>
                      <span className="text-[10px] text-blue-700 font-bold block">Shift begins in 8m</span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800">Biometric Pass (15:52)</p>
                      <p className="text-[11px] text-slate-500">Armory cleared</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                        Relief in Progress
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-slate-400">
                        <button type="button" aria-label="View telemetry" className="p-1 hover:text-slate-700"><Radio className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 3: Officer Rachel Delgado */}
                  <tr className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center">
                          RD
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Officer Rachel Delgado</p>
                          <p className="text-[11px] text-slate-500">#3901 • Ch 2 (Perimeter)</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-800">East Campus Perimeter Gate 01</p>
                      <p className="text-[11px] text-slate-500">Fixed Checkpoint Portal</p>
                    </td>
                    <td className="py-3 px-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-700">08:00 – 14:00</span>
                          <span className="text-slate-400 font-mono">97%</span>
                        </div>
                        <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: "97%" }}></div>
                        </div>
                        <span className="text-[10px] text-amber-700 font-bold block">7h 45m elapsed (Nearing End)</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800">Checkpoint Scan Valid</p>
                      <p className="text-[11px] text-slate-500">Logs signed off</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                        Handoff Ready
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-slate-400">
                        <button type="button" aria-label="View options" className="p-1 hover:text-slate-700"><MoreVertical className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 4: Officer Kenji Sato */}
                  <tr className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                          KS
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Officer Kenji Sato</p>
                          <p className="text-[11px] text-slate-500">#4219 • Ch 5 (Patrol)</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-800">Science &amp; Engineering Annex</p>
                      <p className="text-[11px] text-slate-500">Mobile Foot Patrol (Rover 02)</p>
                    </td>
                    <td className="py-3 px-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-700">12:00 – 20:00</span>
                          <span className="text-slate-400 font-mono">29%</span>
                        </div>
                        <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#0a2f77] rounded-full" style={{ width: "29%" }}></div>
                        </div>
                        <span className="text-[10px] text-slate-400 block">2h 18m elapsed</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800">GPS Sector Verified</p>
                      <p className="text-[11px] text-slate-500">Speed: 1.2 m/s (Walking)</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        ● On Duty
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-slate-400">
                        <button type="button" aria-label="View video" className="p-1 hover:text-slate-700"><Video className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 5: Officer Daniel Thorne (Alert) */}
                  <tr className="bg-red-50/30 hover:bg-red-50/50 transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center">
                          DT
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Officer Daniel Thorne</p>
                          <p className="text-[11px] text-red-600 font-semibold">#3942 • Ch 3 (Offline)</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-800">Gate 07 — South Quad Delivery</p>
                      <p className="text-[11px] text-red-700 font-semibold">Automated Barrier Terminal</p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-700">14:00 – 22:00</p>
                      <span className="text-[10px] text-red-700 font-bold block">+18m overdue • Check-in breached</span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-red-700">Unresponsive Beacon</p>
                      <p className="text-[11px] text-slate-500">Last contact: 13:42 EST</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-600 text-white">
                        Unstaffed / Alert
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded shadow-xs"
                      >
                        Assign Standby
                      </button>
                    </td>
                  </tr>

                  {/* Row 6: Officer Maya Lin (Warning) */}
                  <tr className="bg-amber-50/30 hover:bg-amber-50/50 transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center">
                          ML
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Officer Maya Lin</p>
                          <p className="text-[11px] text-slate-500">#4105 • Ch 3 (Transit)</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-800">Gate 02 — West Pedestrian Portal</p>
                      <p className="text-[11px] text-slate-500">Turnstile Gate Facility</p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-700">14:10 – 22:00</p>
                      <span className="text-[10px] text-amber-700 font-bold block">+9m overdue • En route from Armory</span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800">Token Ping: Locker Kiosk</p>
                      <p className="text-[11px] text-slate-500">Physical portal unverified</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900">
                        Pending Arrival
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-slate-400">
                        <button type="button" aria-label="Confirm check in" className="p-1 hover:text-slate-700"><CheckCircle2 className="w-3.5 h-3.5 text-blue-700" /></button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Table Pagination Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
              <p>
                Showing <strong>6 of 26</strong> rostered posts • <strong className="text-emerald-700">21 On Duty</strong> • <strong className="text-red-600">2 Urgent Actions</strong>
              </p>
              <div className="flex items-center gap-1">
                <button type="button" className="px-2.5 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-50">Previous</button>
                <button type="button" className="px-2.5 py-1 bg-[#0a2f77] text-white rounded font-bold">1</button>
                <button type="button" className="px-2.5 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-50">2</button>
                <button type="button" className="px-2.5 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-50">3</button>
                <button type="button" className="px-2.5 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-50">Next</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
