"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Shield,
  Car,
  QrCode,
  AlertTriangle,
  ArrowRightLeft,
  Bell,
  Clock,
  PhoneCall,
  ChevronRight,
  MoreVertical,
  LogOut,
  Radio,
  Video,
  CheckCircle2,
  RefreshCw,
  Fingerprint,
  UserCheck
} from "lucide-react";
import { performLogout } from "@/lib/auth";

export default function SecurityGuardDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col">
      {/* 1. TOP APP HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Operational Unit Brand */}
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

            {/* Top Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 pl-4 text-xs font-semibold text-slate-600">
              <Link
                href="/dashboard/guard"
                className="py-5 relative transition cursor-pointer text-blue-700 font-bold border-b-2 border-blue-700"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/guard/handoff"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Handoff
              </Link>
              <Link
                href="/dashboard/guard/parking"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Parking
              </Link>
              <Link
                href="/dashboard/guard/incidents"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Incidents
              </Link>
              <Link
                href="/dashboard/guard/notifications"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Notifications
              </Link>
              <Link
                href="/dashboard/guard/profile"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Profile
              </Link>
            </nav>
          </div>

          {/* Right Status & Guard Profile */}
          <div className="flex items-center gap-3">
            {/* Gate Status Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Gate 04 Online • Shift Active</span>
            </div>

            {/* Notifications */}
            <Link href="/dashboard/guard/notifications" className="relative cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition">
                <Bell className="w-4 h-4" />
              </div>
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                3
              </span>
            </Link>

            {/* Officer Profile Badge */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#0a2f77] text-white flex items-center justify-center font-bold text-xs">
                MV
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  Officer Marcus Vance
                </span>
                <span className="text-[11px] text-slate-500 leading-tight">
                  Shield #4082
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
        {/* LEFT SIDEBAR: GUARD NAVIGATION */}
        <aside className="w-60 shrink-0 hidden md:flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
              Guard Navigation
            </div>
            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveTab("Dashboard")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === "Dashboard"
                    ? "bg-[#0a2f77] text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Dashboard</span>
                </div>
              </button>

              <Link
                href="/dashboard/guard/handoff"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                <div className="flex items-center gap-2.5">
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>Handoff</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded">
                  16:00
                </span>
              </Link>

              <Link
                href="/dashboard/guard/parking"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                <div className="flex items-center gap-2.5">
                  <Car className="w-4 h-4" />
                  <span>Parking</span>
                </div>
                <span className="text-[10px] font-bold bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded">
                  Zone N
                </span>
              </Link>

              <Link
                href="/dashboard/guard/incidents"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Incidents</span>
                </div>
                <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded">
                  2 Active
                </span>
              </Link>

              <Link
                href="/dashboard/guard/notifications"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              </Link>

              <Link
                href="/dashboard/guard/profile"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4" />
                  <span>Profile</span>
                </div>
              </Link>
            </nav>
          </div>

          {/* Bottom Sidebar Dispatch Card */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Elapsed:
              </span>
              <span className="font-bold text-slate-800 font-mono">04h 15m</span>
            </div>
            <button
              type="button"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Dispatch NOC: Ext 4000</span>
            </button>
          </div>
        </aside>

        {/* MAIN OPERATIONS FEED */}
        <main className="flex-1 space-y-5">
          {/* Top Shift Advisory Alert */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3 sm:px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-bold uppercase tracking-wider text-blue-900 mr-2">
                  Shift Advisory •
                </span>
                <span className="font-medium text-slate-800">
                  Perimeter Access Protocol: Level 2 Heightened Screening active for North Quad.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-slate-500 font-medium">
                Clearance Route: <strong className="text-slate-700">Alpha-4</strong>
              </span>
              <button
                type="button"
                className="px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded text-slate-700 font-semibold transition"
              >
                Details
              </button>
            </div>
          </div>

          {/* Operational Header Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-blue-800 uppercase">
                <span>• OPERATIONAL ROSTER • SHIFT B •</span>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                <RefreshCw className="w-3 h-3 text-slate-400" />
                <span>Today, Oct 24, 2025 • 14:15 PST | All terminal connections synchronized</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Welcome, Officer Marcus Vance
              </h1>
              <p className="text-xs text-slate-500">
                Campus Security Division • West Perimeter Checkpoint • Shield #4082
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition"
              >
                <QrCode className="w-3.5 h-3.5 text-slate-600" />
                <span>Quick QR Scan</span>
              </button>
              <button
                type="button"
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Report Incident</span>
              </button>
              <Link
                href="/dashboard/guard/handoff"
                className="px-3.5 py-2 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Start Handoff</span>
              </Link>
            </div>
          </div>

          {/* DUTY TELEMETRY - CURRENT ACTIVE SHIFT CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-700" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Duty Telemetry
                </span>
                <span className="text-xs font-bold text-slate-900 tracking-tight">
                  CURRENT ACTIVE SHIFT
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  ● ACTIVE
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  ON DUTY
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Telemetry Left 2 cols */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Gate / Post Allocation */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-blue-700" />
                      Gate / Post Allocation
                    </div>
                    <p className="text-sm font-bold text-slate-900">
                      Gate 04 — North Academic Quad
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Post Type: Fixed Entry Terminal + Barrier Arm Automated Sensor
                    </p>
                  </div>

                  {/* Assigned Partner / Reliever */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-blue-700" />
                      Assigned Partner / Reliever
                    </div>
                    <p className="text-sm font-bold text-slate-900">
                      Officer S. Jenkins
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Scheduled Relieving Window: 16:00 (Shield #4120 • Shift C)
                    </p>
                  </div>
                </div>

                {/* Shift Schedule & Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">
                      Shift Schedule: 08:00 – 16:00 <span className="font-normal text-slate-500">(8h Duration)</span>
                    </span>
                    <span className="font-bold text-blue-700">
                      06h 15m completed • 01h 45m remaining
                    </span>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="bg-[#0a2f77] h-full rounded-full transition-all duration-500" style={{ width: "78%" }}></div>
                  </div>

                  {/* Timeline Marks */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5 font-medium">
                    <span>08:00 AM (Check-In)</span>
                    <span className="font-bold text-slate-800">Current: 14:15 PST (78%)</span>
                    <span>16:00 PM (Relief Transfer)</span>
                  </div>
                </div>

                {/* Biometric Verification Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs">
                  <div className="flex items-center gap-2 text-emerald-900">
                    <Fingerprint className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>
                      <strong>Biometric Authorization:</strong> Verified at 07:54 AM (SSO &amp; Facial Recognition Token #AF99)
                    </span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                    TERMINAL HASH: 99X-SEC
                  </span>
                </div>
              </div>

              {/* Telemetry Right 1 col: Live Terminal Feed Graphic */}
              <div className="bg-slate-900 rounded-xl p-3.5 text-white flex flex-col justify-between relative overflow-hidden border border-slate-800">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                    <span className="font-semibold text-slate-200">Camera 04-North</span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-400">LIVE FEED</span>
                </div>

                <div className="my-5 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full border border-dashed border-blue-500/40 flex items-center justify-center mb-2">
                    <Car className="w-7 h-7 text-blue-400" />
                  </div>
                  <p className="text-xs font-semibold text-slate-200">
                    ANPR Optical Sensor: Active
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Optical barrier barrier arm engaged
                  </p>
                </div>

                <div className="text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-800 pt-2 font-mono">
                  <span>FPS: 30.0</span>
                  <span>LATENCY: 14ms</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 STAT KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Vehicles Checked */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Vehicles Checked
                </p>
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none mt-1">
                  184
                </p>
                <p className="text-xs font-semibold text-emerald-700 mt-1 flex items-center gap-1">
                  <span>↑ +18%</span>
                  <span className="font-normal text-slate-500">from morning average</span>
                </p>
              </div>
            </div>

            {/* Card 2: Incidents Today */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Incidents Today
                </p>
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none mt-1">
                  1
                </p>
                <p className="text-xs font-semibold text-slate-600 mt-1">
                  <strong className="text-emerald-700">1 Resolved</strong> • <span className="text-slate-400">0 Critical</span>
                </p>
              </div>
            </div>

            {/* Card 3: QR Scans Logged */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  QR Scans Logged
                </p>
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none mt-1">
                  142
                </p>
                <p className="text-xs font-semibold text-emerald-700 mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>All 100% Validated Real-time</span>
                </p>
              </div>
            </div>
          </div>

          {/* RECENT ACTIVITY LOG CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-700" />
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Recent Activity Log</h2>
                  <p className="text-[11px] text-slate-500">Live chronological dispatch journal for Post 04</p>
                </div>
              </div>
              <button
                type="button"
                className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
              >
                <span>View Full History</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Log Item 1 */}
              <div className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 flex items-start justify-between gap-4 transition">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">[13:42]</span>
                      <h3 className="text-xs font-bold text-slate-900">
                        Unauthorized Vehicle Access Attempt — Gate 04
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      License plate FL-8291 logged. Supervisor notified, vehicle redirected to Visitor Lot B with temporary pass guidance.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>Incident • Resolved</span>
                  </span>
                  <button type="button" aria-label="Incident options" className="text-slate-400 hover:text-slate-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Log Item 2 */}
              <div className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 flex items-start justify-between gap-4 transition">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">[11:30]</span>
                      <h3 className="text-xs font-bold text-slate-900">
                        Mid-Shift Perimeter Checkpoint Relay
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Handed off terminal log to Patrol Unit 3 for 15-minute gate perimeter sweep and inspection. All physical barriers secure.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    <span>Checkpoint • Complete</span>
                  </span>
                  <button type="button" aria-label="Checkpoint options" className="text-slate-400 hover:text-slate-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Log Item 3 */}
              <div className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 flex items-start justify-between gap-4 transition">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">[09:15]</span>
                      <h3 className="text-xs font-bold text-slate-900">
                        Intercom Speaker Audio Crackle Flagged
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Automated maintenance ticket #CG-4819 routed to Campus Facilities. Technicians dispatched for 16:30 maintenance window.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                    <span>Maintenance • Dispatched</span>
                  </span>
                  <button type="button" aria-label="Maintenance options" className="text-slate-400 hover:text-slate-600">
                    <MoreVertical className="w-4 h-4" />
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
