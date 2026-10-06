"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Bell,
  Clock,
  LogOut,
  Sliders,
  CheckCircle2,
  FileText,
  PhoneCall,
  Volume2,
  Monitor,
  Radio,
  SlidersHorizontal,
  ChevronDown,
  Car,
  AlertTriangle,
  Gavel,
  Shield,
  Check
} from "lucide-react";
import { performLogout } from "@/lib/auth";

export default function GuardNotificationsPage() {
  const [activeFilter, setActiveFilter] = useState("All 12");
  const [preferences, setPreferences] = useState({
    radioChimes: true,
    terminalPopups: true,
    smsRelay: true,
    hapticAlarm: false,
  });

  const togglePref = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col">
      {/* 1. TOP APP HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Operational Unit Brand */}
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
                  GUARD PORTAL
                </span>
              </div>
            </Link>

            {/* Top Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 pl-4 text-xs font-semibold">
              <Link
                href="/dashboard/guard"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/guard/handoff"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Handoff
              </Link>
              <Link
                href="/dashboard/guard/parking"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Parking
              </Link>
              <Link
                href="/dashboard/guard/incidents"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Incidents
              </Link>
              <Link
                href="/dashboard/guard/notifications"
                className="py-5 relative transition cursor-pointer text-[#1a44c2] font-bold border-b-2 border-[#1a44c2]"
              >
                Notifications
              </Link>
              <Link
                href="/dashboard/guard/profile"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Profile
              </Link>
            </nav>
          </div>

          {/* Right Status & Guard Profile */}
          <div className="flex items-center gap-3">
            {/* Gate Status Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f1f5f9] border border-slate-200/80 text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Gate 04 Online • Shift Active</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition">
                <Bell className="w-4 h-4" />
              </div>
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                3
              </span>
            </div>

            {/* Officer Profile Badge */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#0a2f77] text-white flex items-center justify-center font-bold text-xs overflow-hidden">
                <Image
                  src="/officer-vance.jpg"
                  alt="Marcus Vance"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
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
                className="ml-1 p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. BODY LAYOUT: SIDEBAR + MAIN CONTENT */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* LEFT SIDEBAR */}
        <aside className="w-60 shrink-0 hidden md:block bg-white border-r border-slate-200/90 min-h-[calc(100vh-64px)] p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
            GUARD STATION NAVIGATION
          </div>
          <nav className="space-y-1.5 mt-1">
            <Link
              href="/dashboard/guard"
              className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
            >
              Dashboard
            </Link>

            <Link
              href="/dashboard/guard/handoff"
              className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
            >
              Handoff
            </Link>

            <Link
              href="/dashboard/guard/parking"
              className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
            >
              Parking
            </Link>

            <Link
              href="/dashboard/guard/incidents"
              className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
            >
              Incidents
            </Link>

            <Link
              href="/dashboard/guard/notifications"
              className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-bold bg-[#1a44c2] text-white shadow-xs"
            >
              Notifications
            </Link>

            <Link
              href="/dashboard/guard/profile"
              className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
            >
              Profile
            </Link>
          </nav>
        </aside>

        {/* MAIN NOTIFICATIONS CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Top Filter Tabs Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {["All 12", "Priority / Alerts 4", "Shift Logs 5", "System & Equipment 3"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                    activeFilter === tab
                      ? "bg-[#1a44c2] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => alert("Marked all notifications as read.")}
                className="flex items-center gap-1 font-bold text-[#1a44c2] hover:underline cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Mark all as read</span>
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                className="text-slate-500 hover:text-slate-800 cursor-pointer p-1"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* TWO COLUMNS: FEED + SIDEBAR PREFERENCES */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: NOTIFICATION FEED */}
            <div className="lg:col-span-8 space-y-4">
              {/* Notification 1: Security Directive */}
              <div className="bg-white border-l-4 border-l-red-500 border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <Gavel className="w-5 h-5" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#1a44c2]">
                          ● SECURITY DIRECTIVE
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-600 font-mono">
                          Incident #INC-2025-084
                        </span>
                      </div>
                      <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        12m ago
                      </span>
                    </div>

                    <h2 className="text-sm font-bold text-slate-900 leading-snug">
                      Proctor Acknowledged Incident #INC-2025-084
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      University Proctor Dr. Harrison reviewed unauthorized access report for Gate 04 and initiated campus-wide advisory. Security dispatch instructed to monitor secondary turnstiles.
                    </p>

                    <div className="flex flex-wrap items-center gap-2.5 pt-2">
                      <Link
                        href="/dashboard/guard/incidents"
                        className="px-3.5 py-1.5 bg-[#1a44c2] hover:bg-[#1538a6] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Incident Report</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => alert("Calling Proctor Desk...")}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        Contact Proctor Desk
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification 2: Shift Handoff */}
              <div className="bg-white border-l-4 border-l-[#1a44c2] border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1a44c2] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#1a44c2]">
                          ● SHIFT HANDOFF
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-600">Shift C Transition</span>
                      </div>
                      <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        28m ago
                      </span>
                    </div>

                    <h2 className="text-sm font-bold text-slate-900 leading-snug">
                      Officer S. Jenkins Biometric Check-In Confirmed
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Relieving guard for Shift C checked in at Central Depot. Pre-briefing complete. Physical station relief scheduled precisely for 16:00 at Guard Post 04.
                    </p>

                    <div className="flex flex-wrap items-center gap-2.5 pt-2">
                      <Link
                        href="/dashboard/guard/handoff"
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Handoff Sheet</span>
                      </Link>

                      <span className="text-xs font-bold text-[#1a44c2] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Auth: Shield #4119
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification 3: Traffic & Parking */}
              <div className="bg-white border-l-4 border-l-[#1a44c2] border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1a44c2] font-black text-sm flex items-center justify-center shrink-0">
                    P
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#1a44c2]">
                          ● TRAFFIC &amp; PARKING
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-600">North Quad Bay</span>
                      </div>
                      <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        1h 10m ago
                      </span>
                    </div>

                    <h2 className="text-sm font-bold text-slate-900 leading-snug">
                      Zone N Capacity Threshold Exceeded (85%)
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Automated optical vehicle counters indicate 142 of 165 stalls occupied. Standard overflow protocol suggests rerouting visitor sedans to Lot C parking deck immediately.
                    </p>

                    <div className="flex flex-wrap items-center gap-2.5 pt-2">
                      <Link
                        href="/dashboard/guard/parking"
                        className="px-3.5 py-1.5 bg-[#1a44c2] hover:bg-[#1538a6] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
                      >
                        <Car className="w-3.5 h-3.5" />
                        <span>Reroute Traffic to Lot C</span>
                      </Link>

                      <Link
                        href="/dashboard/guard/parking"
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                      >
                        Telemetry Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification 4: Hardware Diagnostics */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700 uppercase text-[10px]">
                          HARDWARE DIAGNOSTICS
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-600">Barrier Gate 04</span>
                      </div>
                      <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        2h ago
                      </span>
                    </div>

                    <h2 className="text-sm font-bold text-slate-900 leading-snug">
                      Barrier Arm Sensor Gate 04 Recalibrated
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Facilities Maintenance completed routine laser telemetry sweep. Pressure sensitivity and optical interrupt tests passed. Round-trip loop latency: nominal (12ms).
                    </p>

                    <div className="flex items-center gap-3 pt-2 text-[11px] font-semibold text-slate-500">
                      <span className="text-emerald-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        All systems functional
                      </span>
                      <span>Audit ID: #FC-9941</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification 5: Campus Notice */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700 uppercase text-[10px]">
                          CAMPUS NOTICE
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-600">Night Operations</span>
                      </div>
                      <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        3h ago
                      </span>
                    </div>

                    <h2 className="text-sm font-bold text-slate-900 leading-snug">
                      Scheduled Night Drill at South Halls (21:00)
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Residential Life will conduct an unannounced fire evacuation drill at dorm buildings Alpha through Delta. Field patrol teams are instructed to position auxiliary safety floodlights at muster points.
                    </p>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => alert("Opening Muster Grid map...")}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        View Muster Grid
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 font-medium">
                <span>Displaying 5 of 12 notifications</span>
                <button
                  type="button"
                  className="flex items-center gap-1 text-[#1a44c2] font-bold hover:underline cursor-pointer"
                >
                  <span>Load archive logs</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: PREFERENCES & VOLUME */}
            <div className="lg:col-span-4 space-y-6">
              {/* Card 1: Alert Preferences */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#1a44c2]" />
                    <h2 className="text-sm font-bold text-slate-900">
                      Alert Preferences
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase">
                    TERMINAL 04
                  </span>
                </div>

                <div className="space-y-3.5 text-xs">
                  {/* Setting 1 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-2.5">
                      <Volume2 className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900">
                          Radio Dispatch Chimes
                        </div>
                        <div className="text-[11px] text-slate-500">
                          800MHz voice override tone
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => togglePref("radioChimes")}
                      className={`w-10 h-5 rounded-full transition cursor-pointer relative p-0.5 shrink-0 ${
                        preferences.radioChimes ? "bg-[#1a44c2]" : "bg-slate-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          preferences.radioChimes ? "translate-x-5" : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                  </div>

                  {/* Setting 2 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-2.5">
                      <Monitor className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900">
                          Terminal Popups
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Full-screen critical prompts
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => togglePref("terminalPopups")}
                      className={`w-10 h-5 rounded-full transition cursor-pointer relative p-0.5 shrink-0 ${
                        preferences.terminalPopups ? "bg-[#1a44c2]" : "bg-slate-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          preferences.terminalPopups ? "translate-x-5" : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                  </div>

                  {/* Setting 3 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-2.5">
                      <Radio className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900">
                          SMS Backup Relay
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Forward SOS to duty mobile
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => togglePref("smsRelay")}
                      className={`w-10 h-5 rounded-full transition cursor-pointer relative p-0.5 shrink-0 ${
                        preferences.smsRelay ? "bg-[#1a44c2]" : "bg-slate-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          preferences.smsRelay ? "translate-x-5" : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                  </div>

                  {/* Setting 4 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-2.5">
                      <Bell className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900">
                          Station Haptic Alarm
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Hardware buzzer on alert 1
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => togglePref("hapticAlarm")}
                      className={`w-10 h-5 rounded-full transition cursor-pointer relative p-0.5 shrink-0 ${
                        preferences.hapticAlarm ? "bg-[#1a44c2]" : "bg-slate-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          preferences.hapticAlarm ? "translate-x-5" : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                  <span className="text-slate-500">Sound Volume: 85%</span>
                  <button
                    type="button"
                    onClick={() => alert("Testing station siren tone...")}
                    className="font-bold text-[#1a44c2] hover:underline cursor-pointer"
                  >
                    Test Alert Siren
                  </button>
                </div>
              </div>

              {/* Card 2: Notification Volume (24h) */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Notification Volume (24h)
                </h3>

                {/* Bar Chart Simulation */}
                <div className="flex items-end justify-between h-28 pt-4 px-2 border-b border-slate-200">
                  <div className="flex flex-col items-center gap-1.5 flex-1">
                    <div className="w-6 bg-blue-100 rounded-t h-8"></div>
                    <span className="text-[10px] text-slate-500 font-mono">00:00</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 flex-1">
                    <div className="w-6 bg-blue-100 rounded-t h-12"></div>
                    <span className="text-[10px] text-slate-500 font-mono">04:00</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 flex-1">
                    <div className="w-6 bg-[#1a44c2] rounded-t h-24 shadow-2xs"></div>
                    <span className="text-[10px] font-bold text-slate-800 font-mono">08:00 (PEAK)</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 flex-1">
                    <div className="w-6 bg-[#1a44c2] rounded-t h-20 shadow-2xs"></div>
                    <span className="text-[10px] text-slate-500 font-mono">12:00</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 flex-1">
                    <div className="w-6 bg-blue-100 rounded-t h-14"></div>
                    <span className="text-[10px] text-slate-500 font-mono">16:00</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 flex-1">
                    <div className="w-6 bg-blue-100 rounded-t h-6"></div>
                    <span className="text-[10px] text-slate-500 font-mono">24:00</span>
                  </div>
                </div>

                {/* 2 Stats bottom */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-red-50/70 border border-red-100 rounded-xl">
                    <div className="text-[10px] font-extrabold uppercase text-slate-500">
                      Critical Ratio
                    </div>
                    <div className="text-xl font-black text-red-600 mt-0.5">
                      8.3%
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl">
                    <div className="text-[10px] font-extrabold uppercase text-slate-500">
                      Mean ACK Time
                    </div>
                    <div className="text-xl font-black text-[#1a44c2] mt-0.5">
                      1m 44s
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
