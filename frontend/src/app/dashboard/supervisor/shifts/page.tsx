"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Bell,
  Clock,
  LogOut,
  Users,
  Search,
  Filter,
  FileSpreadsheet,
  Plus,
  ArrowRightLeft,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Radio,
  ChevronDown,
  ChevronRight,
  Shield,
  UserCheck,
  Send,
  Zap
} from "lucide-react";
import { performLogout } from "@/lib/auth";

export default function SupervisorShiftsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState("North Academic Quad");

  const rosterList = [
    {
      name: "Marcus Vance",
      shield: "Shield #4082 • Radio Ch 2",
      post: "Gate 04 Main Portal",
      sector: "North Academic Quad",
      hours: "08:00 - 16:00",
      hoursNote: "Extended (OT Approved)",
      status: "On Duty",
      statusType: "on-duty",
      reliever: "Off. S. Jenkins",
      relieverNote: "Staged in Armory",
      avatar: "/officer-vance.jpg",
    },
    {
      name: "Maya Lin",
      shield: "Shield #4105 • Radio Ch 3",
      post: "Gate 02 West Pedestrian",
      sector: "Library Esplanade Sector",
      hours: "14:00 - 22:00",
      hoursNote: "Shift B Regular",
      status: "Armory Verified",
      statusType: "verified",
      reliever: "Self (Double Coverage)",
      relieverNote: "No relief required",
      avatar: "/officer-jenkins.jpg",
    },
    {
      name: "Rachel Delgado",
      shield: "Shield #3901 • Radio Ch 1",
      post: "East Campus Gate 01",
      sector: "Medical Sciences Quad",
      hours: "06:00 - 14:00 (+4h)",
      hoursNote: "Exceeding safe fatigue threshold",
      hoursAlert: true,
      status: "Handoff Overdue",
      statusType: "overdue",
      reliever: "⚠️ Off. D. Thorne",
      relieverNote: "No Check-In (Overdue 45m)",
      relieverAlert: true,
      initials: "RD",
    },
    {
      name: "Kenji Sato",
      shield: "Shield #4218 • Mobile Unit 02",
      post: "Science & Eng. Rover",
      sector: "Sector South Corridor",
      hours: "12:00 - 20:00",
      hoursNote: "Active Mobile Sweep",
      status: "GPS Active (1.2 mi/h)",
      statusType: "gps",
      reliever: "Off. T. Bradley",
      relieverNote: "Shift C Staged (20:00)",
      avatar: "/officer-vance.jpg",
    },
    {
      name: "VACANT POST",
      shield: "Biometric Terminal Offline",
      isVacant: true,
      post: "Gate 07 Delivery Terminal",
      sector: "Logistics & Warehouse Spur",
      hours: "Unstaffed",
      hoursNote: "Critical Freight Entrance",
      hoursAlert: true,
      status: "Escalation Queued",
      statusType: "escalated",
      reliever: "None Assigned",
      relieverNote: "Auto-dispatch required",
      relieverAlert: true,
    },
    {
      name: "Luis Gomez",
      shield: "Shield #4311 • Armed / ANPR Certified",
      post: "Central Armory Shack",
      sector: "Standby Rapid Deployment",
      hours: "14:00 - 22:00",
      hoursNote: "On-Call Reserve",
      status: "Standby Reserve",
      statusType: "standby",
      reliever: "Ready for Reliever Slot",
      relieverNote: "Assigned on call",
      initials: "LG",
    },
  ];

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
                className="py-5 relative transition cursor-pointer text-[#1a44c2] font-bold border-b-2 border-[#1a44c2]"
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

      {/* TOP STATUS RIBBON */}
      <div className="bg-slate-100/80 border-b border-slate-200 px-4 sm:px-8 py-2.5">
        <div className="max-w-[1520px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span className="font-extrabold text-[#1a44c2] uppercase tracking-wider text-[11px]">
              SUPERVISOR POST COMMAND
            </span>
            <span className="text-slate-400">•</span>
            <span className="font-semibold text-slate-700">
              SHIFT B (14:00 - 22:00) • UPCOMING SHIFT C HANDOFF ACTIVE
            </span>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 font-bold px-2.5 py-0.5 rounded text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5" />
              2 Deficit Posts Detected
            </span>
            <span className="text-slate-500 font-medium">
              UTC-04:00 | Eastern Campus Operations
            </span>
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
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-bold bg-[#1a44c2] text-white shadow-xs"
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

          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl space-y-1">
            <div className="text-[10px] font-extrabold uppercase text-[#1a44c2]">
              Watch Command
            </div>
            <div className="text-xs font-bold text-slate-900">
              Zone Alpha • Shift B
            </div>
          </div>
        </aside>

        {/* MAIN SHIFTS CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Shift Management &amp; Post Roster
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-normal mt-1 max-w-3xl">
                Live post coverage, automated attendance surveillance, guard reassignments, and shift transition scheduling across 26 campus sectors.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filter by Sector</span>
              </button>

              <button
                type="button"
                className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export Roster (CSV)</span>
              </button>

              <button
                type="button"
                onClick={() => alert("Opening Ad-hoc Shift Creator modal...")}
                className="px-4 py-2 bg-[#1a44c2] hover:bg-[#1538a6] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Ad-hoc Shift</span>
              </button>
            </div>
          </div>

          {/* 4 KPI METRIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span>POST COVERAGE</span>
                <ShieldCheck className="w-4 h-4 text-[#1a44c2]" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                24 <span className="text-xs font-bold text-slate-400">/ 26 Active</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Target: 22 Min</span>
                <span className="font-bold text-blue-700">92.3% Effective</span>
              </div>
              <div className="bg-blue-50 text-[#1a44c2] font-bold text-[10px] px-2 py-0.5 rounded text-center">
                Optimal (+2 above baseline)
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span>SHIFT C HANDOFFS</span>
                <ArrowRightLeft className="w-4 h-4 text-[#1a44c2]" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                8 <span className="text-xs font-bold text-slate-500">Scheduled</span>
              </div>
              <div className="text-[11px] text-slate-500 pt-1">
                Staging Windows: <strong className="text-slate-800">16:00 &amp; 22:00</strong>
              </div>
              <div className="bg-slate-100 text-slate-700 font-bold text-[10px] px-2 py-0.5 rounded text-center">
                ⏱ 3 Check-In Pings Pending
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span>STANDBY &amp; RESERVES</span>
                <Zap className="w-4 h-4 text-[#1a44c2]" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                4 <span className="text-xs font-bold text-slate-500">Units</span>
              </div>
              <div className="text-[11px] text-slate-500 pt-1">
                Fleet Standby: <strong className="text-slate-800">Mobile 01 - 04</strong>
              </div>
              <div className="bg-blue-50 text-[#1a44c2] font-bold text-[10px] px-2 py-0.5 rounded text-center">
                Ready to Deploy (Central Hub)
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span>RELIEF DEFICIT</span>
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-2xl font-black text-red-600">
                2 <span className="text-xs font-bold text-red-600">Unassigned</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Gate 07, West Lot Kiosk</span>
                <span className="font-bold text-red-600">Critical</span>
              </div>
              <div className="bg-red-100 text-red-700 font-bold text-[10px] px-2 py-0.5 rounded text-center">
                🚨 Immediate Backfill Req.
              </div>
            </div>
          </div>

          {/* SHIFT TIMELINE & TRANSITION HORIZON */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Shift Timeline &amp; Transition Horizon
                </h2>
                <p className="text-xs text-slate-500">
                  Active 24-hour cycle coverage across campus duty sectors
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-300"></span> A: Past
                </span>
                <span className="flex items-center gap-1.5 font-bold text-[#1a44c2]">
                  <span className="w-2 h-2 rounded-full bg-[#1a44c2]"></span> B: Active
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-300"></span> C: Incoming
                </span>
              </div>
            </div>

            {/* Milestones labels */}
            <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
              <div>08:00 - Shift A Handover Complete</div>
              <div className="font-bold text-[#1a44c2] text-center">
                14:00 - Shift B Active Window (16:45 NOW)
              </div>
              <div>22:00 - Shift C Night Watch</div>
            </div>

            {/* Horizontal Timeline Bar */}
            <div className="grid grid-cols-12 gap-1 h-9 rounded-xl overflow-hidden p-1 bg-slate-100">
              <div className="col-span-4 bg-slate-200/90 rounded-lg flex items-center justify-center text-xs font-bold text-slate-600">
                Shift A (06:00 - 14:00)
              </div>
              <div className="col-span-4 bg-[#1a44c2] text-white rounded-lg flex items-center justify-center text-xs font-bold shadow-xs">
                ● Shift B (14:00 - 22:00)
              </div>
              <div className="col-span-4 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-center text-xs font-bold">
                Shift C (22:00 - 06:00)
              </div>
            </div>

            {/* Ticks */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>06:00</span>
              <span>10:00</span>
              <span>14:00</span>
              <span className="font-bold text-[#1a44c2]">16:45 (T-5h 15m to Night Transfer)</span>
              <span>22:00</span>
              <span>02:00</span>
              <span>06:00</span>
            </div>
          </div>

          {/* TWO COLUMNS: ROSTER TABLE + RESERVE POOL */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: ROSTER TABLE */}
            <div className="lg:col-span-8 space-y-4">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search guard by name, shield #, post..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                </div>

                <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 shadow-2xs">
                  North Academic Quad
                </div>

                <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 shadow-2xs">
                  Active / Checked-In
                </div>
              </div>

              {/* Roster Table Card */}
              <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4">ASSIGNED GUARD</th>
                        <th className="py-3 px-3">POST &amp; SECTOR</th>
                        <th className="py-3 px-3">SHIFT HOURS</th>
                        <th className="py-3 px-3">DEPLOYMENT STATUS</th>
                        <th className="py-3 px-4">SCHEDULED RELIEVER</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {rosterList.map((guard, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60 transition">
                          {/* Assigned Guard */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              {guard.isVacant ? (
                                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs shrink-0">
                                  <AlertTriangle className="w-4 h-4" />
                                </div>
                              ) : guard.avatar ? (
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0">
                                  <Image
                                    src={guard.avatar}
                                    alt={guard.name}
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-[#1a44c2] text-white flex items-center justify-center font-bold text-xs shrink-0">
                                  {guard.initials}
                                </div>
                              )}

                              <div>
                                <div
                                  className={`font-bold leading-tight ${
                                    guard.isVacant ? "text-red-600 font-black" : "text-slate-900"
                                  }`}
                                >
                                  {guard.name}
                                </div>
                                <div
                                  className={`text-[11px] ${
                                    guard.isVacant ? "text-red-500" : "text-slate-500"
                                  }`}
                                >
                                  {guard.shield}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Post & Sector */}
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900 leading-tight">
                              {guard.post}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {guard.sector}
                            </div>
                          </td>

                          {/* Shift Hours */}
                          <td className="py-3 px-3">
                            <div
                              className={`font-mono text-xs ${
                                guard.hoursAlert ? "text-red-600 font-bold" : "text-slate-800"
                              }`}
                            >
                              {guard.hours}
                            </div>
                            <div
                              className={`text-[10px] ${
                                guard.hoursAlert ? "text-red-500 font-bold" : "text-slate-400"
                              }`}
                            >
                              {guard.hoursNote}
                            </div>
                          </td>

                          {/* Deployment Status */}
                          <td className="py-3 px-3">
                            {guard.statusType === "on-duty" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-[#1a44c2]">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                                On Duty
                              </span>
                            )}
                            {guard.statusType === "verified" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                <Shield className="w-3 h-3 text-blue-600" />
                                Armory Verified
                              </span>
                            )}
                            {guard.statusType === "overdue" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                                <AlertTriangle className="w-3 h-3 text-red-600" />
                                Handoff Overdue
                              </span>
                            )}
                            {guard.statusType === "gps" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                                <Radio className="w-3 h-3 text-blue-600" />
                                {guard.status}
                              </span>
                            )}
                            {guard.statusType === "escalated" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-600 text-white">
                                <AlertTriangle className="w-3 h-3" />
                                Escalation Queued
                              </span>
                            )}
                            {guard.statusType === "standby" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                                <Zap className="w-3 h-3 text-slate-500" />
                                Standby Reserve
                              </span>
                            )}
                          </td>

                          {/* Scheduled Reliever */}
                          <td className="py-3 px-4">
                            <div
                              className={`font-bold leading-tight ${
                                guard.relieverAlert ? "text-red-600" : "text-slate-900"
                              }`}
                            >
                              {guard.reliever}
                            </div>
                            <div
                              className={`text-[10px] ${
                                guard.relieverAlert ? "text-red-500 font-semibold" : "text-slate-500"
                              }`}
                            >
                              {guard.relieverNote}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer Pagination */}
                <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Showing 6 of 26 post rosters across active Shift B sectors.</span>
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
                    <button
                      type="button"
                      className="px-2.5 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: RESERVE POOL + DIRECTIVE */}
            <div className="lg:col-span-4 space-y-6">
              {/* Card 1: Reserve Officer Pool */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Reserve Officer Pool
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Central Armory &amp; Standby Quarters
                    </p>
                  </div>
                  <span className="bg-blue-100 text-[#1a44c2] text-[10px] font-bold px-2 py-0.5 rounded">
                    3 Available
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Reserve 1 */}
                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#0a2f77] text-white font-bold text-xs flex items-center justify-center shrink-0">
                        DT
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">
                          David Thorne
                        </div>
                        <div className="text-[10px] text-slate-500">
                          ANPR • Armed Cleared
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert("Dispatched Officer David Thorne to Gate 07")}
                      className="px-3 py-1 bg-[#1a44c2] hover:bg-[#1538a6] text-white font-bold text-xs rounded-lg shadow-2xs transition cursor-pointer"
                    >
                      Dispatch
                    </button>
                  </div>

                  {/* Reserve 2 */}
                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        AP
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">
                          Anita Patel
                        </div>
                        <div className="text-[10px] text-slate-500">
                          EMT / First Aid • Bike Patrol
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert("Dispatched Officer Anita Patel")}
                      className="px-3 py-1 bg-[#1a44c2] hover:bg-[#1538a6] text-white font-bold text-xs rounded-lg shadow-2xs transition cursor-pointer"
                    >
                      Dispatch
                    </button>
                  </div>

                  {/* Reserve 3 */}
                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#1a44c2] text-white font-bold text-xs flex items-center justify-center shrink-0">
                        CR
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">
                          Carlos Reyes
                        </div>
                        <div className="text-[10px] text-slate-500">
                          K-9 Handler • Tactical Sweep
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert("Dispatched Officer Carlos Reyes")}
                      className="px-3 py-1 bg-[#1a44c2] hover:bg-[#1538a6] text-white font-bold text-xs rounded-lg shadow-2xs transition cursor-pointer"
                    >
                      Dispatch
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    className="text-xs font-bold text-[#1a44c2] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Manage Overtime Rosters &amp; Union Shift Limits</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card 2: Standing Directive */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#1a44c2] flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5" />
                  <span>SUPERVISOR STANDING DIRECTIVE</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">
                  Shift B Security Protocol #14-B
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong className="text-slate-900">Heightened Vigilance:</strong> Science &amp; Engineering Annex is hosting an evening robotics symposium (18:00 - 23:00). Ensure vehicle checkpoint barriers at Gate 04 conduct manual trunk spot-checks every 30 minutes. Report unauthorized delivery vans immediately via Radio Channel 1.
                </p>

                <button
                  type="button"
                  onClick={() => alert("Pushed standing directive to all field radios and mobile terminals.")}
                  className="w-full py-2.5 px-4 bg-[#1a44c2] hover:bg-[#1538a6] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Push Directive to Radios &amp; MDTs</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
