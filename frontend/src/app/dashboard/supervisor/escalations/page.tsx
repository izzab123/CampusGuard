"use client";

import React, { useState } from "react";
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
  Eye,
  Check,
  Zap,
  Users
} from "lucide-react";
import { performLogout } from "@/lib/auth";

export default function SupervisorEscalationsPage() {
  const [severityFilter, setSeverityFilter] = useState("All Severity Tiers");

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

          {/* Right Status & Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f1f5f9] border border-slate-200/80 text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Sync Active (3s)</span>
              <span className="text-slate-400 font-mono text-[10px]">#NOC-SEC-V4</span>
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

      {/* 2. BODY LAYOUT: SIDEBAR + MAIN */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* LEFT SIDEBAR */}
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

          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl space-y-1">
            <div className="text-[10px] font-extrabold uppercase text-[#1a44c2]">
              Watch Command
            </div>
            <div className="text-xs font-bold text-slate-900">
              Zone Alpha • Shift B
            </div>
          </div>
        </aside>

        {/* MAIN ESCALATIONS CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-extrabold tracking-wider text-blue-800 uppercase">
                SUPERVISOR DISPATCH NOC • REAL-TIME INCIDENT TRIAGE &amp; PROCTOR ESCALATIONS
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Supervisor Escalation Command
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-normal mt-1 max-w-3xl">
                Protocol enforcement, Proctor executive intervention queue, automated no-show alerts, and tactical perimeter incident routing.
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

              <button
                type="button"
                onClick={() => alert("Exporting escalation command dossier...")}
                className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Export Dossier</span>
              </button>
            </div>
          </div>

          {/* 3 KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>ACTIVE ESCALATIONS</span>
                <span className="p-1 rounded bg-red-100 text-red-600">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900">
                4
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-red-600 font-bold">2 Critical</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600">2 Moderate</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>PROCTOR INTERVENTIONS</span>
                <span className="p-1 rounded bg-blue-100 text-[#1a44c2]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900">
                1
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-slate-700">Dr. A. Vance (DSW)</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Online
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>SENTINEL TRIGGERS</span>
                <span className="p-1 rounded bg-blue-50 text-[#1a44c2]">
                  <Zap className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900">
                14
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>ANPR &amp; Perimeter loop triggers</span>
                <span className="font-bold text-[#1a44c2]">100% Processed</span>
              </div>
            </div>
          </div>

          {/* TWO COLUMNS: ESCALATION TRIAGE STREAM + PROCTOR DESK */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: ESCALATION STREAM */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">
                  Urgent Escalation Triage Stream
                </h2>
                <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                  3 ACTIVE NOW
                </span>
              </div>

              {/* CARD 1: Gate 07 Barrier Breach Attempt (Critical) */}
              <div className="bg-white border-t-4 border-t-red-600 border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-red-600 text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded uppercase">
                      ● LEVEL 2 • CRITICAL
                    </span>
                    <span className="bg-blue-100 text-[#1a44c2] font-bold text-[10px] px-2.5 py-0.5 rounded uppercase">
                      PROCTOR ESCALATED
                    </span>
                    <span className="bg-slate-100 text-slate-700 font-bold text-[10px] px-2 py-0.5 rounded">
                      ANPR AUTO-FLAG
                    </span>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded">
                      Gate 07 Automated Barrier
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="font-bold text-slate-900">#ESC-8022</span>
                    <span className="text-red-600 font-bold">14:18 EST • 22m Elapsed</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  Unattended Delivery Vehicle &amp; Gate 07 Barrier Breach Attempt
                </h3>

                {/* Narrative Box with Image */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-2 text-xs">
                    <div className="text-[10px] font-extrabold uppercase text-slate-400">
                      INCIDENT NARRATIVE BRIEF
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      Vehicle Plate <strong className="text-blue-700 font-mono">UNR-9024</strong> (White Sprinter) tailgated authorized vendor truck into Gate 07. ANPR identified mismatched commercial placard. Hydraulic bollards engaged automatically. Male driver abandoned vehicle on perimeter apron and fled on foot toward North Quad Connector.
                    </p>
                    <div className="flex items-center gap-2 text-red-600 font-bold text-xs pt-1">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Guard on Post: Unassigned (Off. Thorne Breach)</span>
                    </div>
                  </div>

                  {/* CCTV Preview */}
                  <div className="relative w-full sm:w-48 h-32 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-slate-900 shadow-2xs">
                    <Image
                      src="/cctv-gate07.jpg"
                      alt="CCTV Gate 07"
                      width={200}
                      height={130}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 bg-black/70 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                      CAM 07-N
                    </div>
                    <div className="absolute bottom-1 right-1 bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded">
                      BOLLARDS UP
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => alert("Deploying Tactical Patrol Rover 02 to Gate 07...")}
                      className="px-3.5 py-2 bg-[#1a44c2] hover:bg-[#1538a6] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Deploy Tactical Patrol Rover 02</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => alert("Connecting to Proctor Desk Hotline...")}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Contact Proctor Desk</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => alert("Downloading encrypted CCTV footage packet...")}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Download Footage</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    className="text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer"
                  >
                    Mark Resolved / False Alarm
                  </button>
                </div>
              </div>

              {/* CARD 2: Biometric Check-in Timeout (Staffing Breach) */}
              <div className="bg-white border-t-4 border-t-amber-500 border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-amber-100 text-amber-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded uppercase">
                      ● STAFFING BREACH
                    </span>
                    <span className="bg-amber-50 text-amber-700 font-bold text-[10px] px-2 py-0.5 rounded">
                      18M OVERDUE
                    </span>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded">
                      Gate 07 Post Unmanned
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="font-bold text-slate-900">#ESC-8019</span>
                    <span className="text-amber-700 font-bold">Shift B Scheduled 14:00</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  Biometric Check-in Timeout — Officer Daniel Thorne (#3942)
                </h3>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2.5 text-xs">
                  <p className="text-slate-700 leading-relaxed">
                    Officer Thorne failed to complete biometric check-in at Gate 07 Security Sentry kiosk at 14:00. Automated push pings and radio chirp on Terminal B-07 are unacknowledged. Gate fail-secure mechanism triggered at 14:05, contributing to congestion and subsequent tailgate attempt (#ESC-8022).
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-600 pt-1">
                    <span>Direct Call: <strong className="text-slate-900 font-mono">+1 (555) 019-2834</strong></span>
                    <span>GPS Beacon: <strong className="text-red-600 font-bold">Inactive</strong></span>
                    <span>Assigned Post: <strong className="text-slate-900">Perimeter Gate 07</strong></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => alert("Assigned standby guard Off. L. Gomez to Gate 07")}
                      className="px-3.5 py-2 bg-[#1a44c2] hover:bg-[#1538a6] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                    >
                      Assign Standby Guard Off. L. Gomez
                    </button>

                    <button
                      type="button"
                      onClick={() => alert("Initiating acoustic welfare ping on Officer Thorne's radio...")}
                      className="px-3.5 py-2 bg-blue-50 text-[#1a44c2] hover:bg-blue-100 font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      Initiate Welfare Ping
                    </button>

                    <button
                      type="button"
                      onClick={() => alert("Calling Officer Thorne...")}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call Phone</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    className="text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer"
                  >
                    Dismiss Alert
                  </button>
                </div>
              </div>

              {/* CARD 3: Zone N Parking Over-Capacity */}
              <div className="bg-white border-t-4 border-t-[#1a44c2] border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-blue-100 text-[#1a44c2] font-extrabold text-[10px] px-2.5 py-0.5 rounded uppercase">
                      LOGISTICS ALERT
                    </span>
                    <span className="bg-blue-50 text-blue-700 font-bold text-[10px] px-2 py-0.5 rounded">
                      LEVEL 1 MODERATE
                    </span>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded">
                      Zone N &amp; Visitor Lot B
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="font-bold text-slate-900">#ESC-8015</span>
                    <span className="text-slate-500">14:02 EST</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  Zone N Parking Facility Over-Capacity (89%) &amp; Visitor Gate Jam
                </h3>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3 text-xs">
                  <p className="text-slate-700 leading-relaxed">
                    Automated induction loops register queuing back onto Perimeter Parkway. Induction Loop Sensor 04 reports 42 vehicles waiting; entry arm cycles taking &gt;45 seconds per guest ticket print.
                  </p>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-700">Capacity: 445 / 500 Vehicles Occupied (89%)</span>
                      <span className="text-red-600">89%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 rounded-full" style={{ width: "89%" }}></div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => alert("Triggered variable message signs directing overflow traffic to Lot C.")}
                      className="px-3.5 py-2 bg-[#1a44c2] hover:bg-[#1538a6] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                    >
                      Trigger Overflow Signage to Lot C
                    </button>

                    <button
                      type="button"
                      onClick={() => alert("Dispatched parking enforcement team.")}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      Dispatch Parking Unit
                    </button>
                  </div>

                  <button
                    type="button"
                    className="text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer"
                  >
                    Acknowledge &amp; Hold
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: PROCTOR LIAISON DESK & CLEARED LOG */}
            <div className="lg:col-span-4 space-y-6">
              {/* Card 1: Proctor Liaison Desk */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#1a44c2]" />
                    <h2 className="text-sm font-bold text-slate-900">
                      Proctor Liaison Desk
                    </h2>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    ● ACTIVE
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                    <Image
                      src="/proctor-vance.jpg"
                      alt="Dr. Arthur Vance"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 leading-tight">
                      Dr. Arthur Vance
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Dean of Student Welfare • DSW-09
                    </div>
                    <div className="text-[10px] font-mono text-[#1a44c2] font-semibold mt-0.5">
                      Terminal Console ID: PR-109
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl space-y-1 text-xs">
                  <div className="text-[10px] font-extrabold uppercase text-[#1a44c2]">
                    CURRENT EXECUTIVE DIRECTIVE
                  </div>
                  <p className="text-slate-700 italic text-[11px] leading-relaxed">
                    &ldquo;Heightened visual checks in effect for North Quad and Perimeter Gates through 18:00 due to guest chancellor visit.&rdquo;
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={() => alert("Calling Proctor Emergency Hotline (Ext 4099)...")}
                    className="w-full py-2.5 px-4 bg-[#0a2f77] hover:bg-[#07245c] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>One-Touch Proctor Emergency Hotline (Ext 4099)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => alert("Opening Encrypted NOC Dispatch Note editor...")}
                    className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Encrypted NOC Dispatch Note</span>
                  </button>
                </div>
              </div>

              {/* Card 2: Cleared Escalations */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Cleared Escalations
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Today&apos;s Shift
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {/* Row 1 */}
                  <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 font-mono">
                        #ESC-8012 Dorm West Access
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Sign-off: Supv. Rostova • 13:42
                      </div>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      RESOLVED
                    </span>
                  </div>

                  {/* Row 2 */}
                  <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 font-mono">
                        #ESC-8008 Science Hall Fire Sensor
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Sign-off: DSW Proctor Desk • 12:55
                      </div>
                    </div>
                    <span className="bg-blue-100 text-[#1a44c2] text-[10px] font-bold px-2 py-0.5 rounded">
                      CLEARED
                    </span>
                  </div>

                  {/* Row 3 */}
                  <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 font-mono">
                        #ESC-8004 Tailgate Alert Gate 01
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Sign-off: Officer M. Chen • 11:30
                      </div>
                    </div>
                    <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                      VERIFIED
                    </span>
                  </div>

                  {/* Row 4 */}
                  <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 font-mono">
                        #ESC-7998 Chemical Storage Vault
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Sign-off: Supv. Rostova • 09:15
                      </div>
                    </div>
                    <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                      LOGGED
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <Link
                    href="/dashboard/supervisor/logbook"
                    className="text-xs font-bold text-[#1a44c2] hover:underline flex items-center gap-1"
                  >
                    <span>View Complete Audit Logbook</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
