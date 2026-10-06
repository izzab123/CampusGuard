"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Bell,
  Clock,
  LogOut,
  AlertTriangle,
  Radio,
  SlidersHorizontal,
  CheckCircle2,
  Volume2,
  PhoneCall,
  Send,
  Video,
  ExternalLink,
  Car,
  ShieldAlert,
  UserCheck,
  Check,
  Eye,
  Sliders,
  ChevronDown
} from "lucide-react";
import { performLogout } from "@/lib/auth";

export default function SupervisorNotificationsPage() {
  const [activeFilter, setActiveFilter] = useState("All (18)");
  const [countdown, setCountdown] = useState(4 * 60 + 11); // 04:11
  const [routingPrefs, setRoutingPrefs] = useState({
    sms: true,
    proctorAutoDial: true,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const togglePref = (k: keyof typeof routingPrefs) => {
    setRoutingPrefs((prev) => ({ ...prev, [k]: !prev[k] }));
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
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Logbook
              </Link>
              <Link
                href="/dashboard/supervisor/notifications"
                className="py-5 relative transition cursor-pointer text-[#1a44c2] font-bold border-b-2 border-[#1a44c2]"
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

            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition">
                <Bell className="w-4 h-4" />
              </div>
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                3
              </span>
            </div>

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

      {/* CRITICAL SENTINEL COUNTDOWN BANNER (RED) */}
      <div className="bg-red-600 text-white px-4 sm:px-8 py-2.5 shadow-xs">
        <div className="max-w-[1520px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="bg-black/40 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded tracking-wider">
              PRIORITY LEVEL 1
            </span>
            <span className="font-bold">
              ACTIVE SENTINEL COUNTDOWN: Gate 07 auto-escalation timer engaged. Automated Proctor alert will trigger in{" "}
              <strong className="font-mono text-sm underline">{formatCountdown(countdown)}</strong>.
            </span>
          </div>

          <button
            type="button"
            onClick={() => alert("Halted automated Proctor auto-dial queue.")}
            className="px-3.5 py-1 bg-white text-red-700 hover:bg-red-50 font-bold text-xs rounded-lg transition self-start md:self-center shadow-xs cursor-pointer"
          >
            Halt Proctor Auto-Dial
          </button>
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
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                Logbook
              </Link>
              <Link
                href="/dashboard/supervisor/notifications"
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-bold bg-[#1a44c2] text-white shadow-xs"
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

        {/* MAIN NOTIFICATIONS CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Top Quick Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filter Unresolved</span>
              </button>

              <button
                type="button"
                onClick={() => alert("Testing audio strobe tone...")}
                className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Audio Strobe</span>
              </button>

              <button
                type="button"
                className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Configure Webhooks</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => alert("Marked all notifications as read.")}
              className="px-4 py-2 bg-[#1a44c2] hover:bg-[#1538a6] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Mark All Read</span>
            </button>
          </div>

          {/* 4 KPI METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-1.5">
              <div className="text-[10px] font-extrabold uppercase text-red-600">
                03 UNREAD CRITICAL ALERTS
              </div>
              <div className="text-xs text-slate-600">
                Requires immediate supervisor electronic sign-off
              </div>
              <div className="text-[11px] font-bold text-red-700 pt-1">
                ● 2 Protocol Violations • 1 Perimeter Breach
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-1.5">
              <div className="text-[10px] font-extrabold uppercase text-[#1a44c2]">
                02 ACTIVE RADIO CHANNELS
              </div>
              <div className="text-xs text-slate-600">
                Frequency Chimes: Automated dispatch synthesis standing by
              </div>
              <div className="text-[11px] font-bold text-blue-800 pt-1">
                Ch 2 (Tactical Operations) • Ch 4 (Gate Control)
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-1.5">
              <div className="text-[10px] font-extrabold uppercase text-slate-700">
                05 AWAITING GUARD ACK
              </div>
              <div className="text-xs text-slate-600">
                Shift Directive #B-102 (Perimeter Vehicle Search)
              </div>
              <div className="text-[11px] font-bold text-slate-800 pt-1">
                14 of 19 Acknowledged <span className="text-[#1a44c2]">(73.6%)</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-1.5">
              <div className="text-[10px] font-extrabold uppercase text-slate-700">
                01 AUTOMATED ESCALATIONS
              </div>
              <div className="text-xs text-slate-600">
                Gate 07: Proctor Dr. Arthur Vance auto-call queue
              </div>
              <div className="text-[11px] font-bold text-red-600 pt-1">
                ⏱ Auto-dial armed at 14:24 EST
              </div>
            </div>
          </div>

          {/* TWO COLUMNS: FEED + ROUTING PREFERENCES */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: NOTIFICATION FEED */}
            <div className="lg:col-span-8 space-y-4">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    "All (18)",
                    "Critical Protocols (3)",
                    "Attendance & No-Shows (4)",
                    "Gate Telemetry (6)",
                    "Proctor Directives (5)",
                  ].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setActiveFilter(f)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                        activeFilter === f
                          ? "bg-[#1a44c2] text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Socket Connected
                </span>
              </div>

              {/* CARD 1: Emergency Protocol Violation (Red) */}
              <div className="bg-white border border-red-300 rounded-2xl overflow-hidden shadow-2xs">
                <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    EMERGENCY PROTOCOL VIOLATION • GATE 07
                  </span>
                  <span className="bg-black/30 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                    URGENT SIGN-OFF
                  </span>
                </div>

                <div className="p-5 space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      Barrier Arm Anti-Ram Engagement Triggered
                    </h3>
                    <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Proctor Dial: {formatCountdown(countdown)}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 font-mono">
                    Sensor Telemetry ID: #SNS-BAR-07A • 4m ago (14:18 EST)
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    Optical tripwire bypassed without valid RFID credentials. Vehicle reversed towards North Connector bypass. Video recording archived to Cloud Vault #8994. Dual spike-strip auto-deployed at 14:18:22.
                  </p>

                  {/* CCTV Preview & Metadata */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row gap-4">
                    <div className="relative w-full sm:w-56 h-36 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-slate-900">
                      <Image
                        src="/cctv-gate07.jpg"
                        alt="Gate 07 CCTV"
                        width={220}
                        height={140}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 left-1 bg-black/70 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                        CAM 07 - LIVE
                      </div>
                      <div className="absolute bottom-1 right-1 bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded">
                        BREACH #82
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-[10px] font-bold uppercase text-slate-400">
                          LICENSE PLATE (ANPR)
                        </div>
                        <div className="font-bold text-slate-900 font-mono">
                          VA • 8XL-9022
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase text-slate-400">
                          VEHICLE CLASSIFICATION
                        </div>
                        <div className="font-bold text-slate-900">
                          Black SUV (Ford Explorer)
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase text-slate-400">
                          POST GUARD ASSIGNED
                        </div>
                        <div className="font-bold text-red-600">
                          Unmanned (Relief Pending)
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase text-slate-400">
                          PHYSICAL STATE
                        </div>
                        <div className="font-bold text-red-600">
                          Spikes Deployed / Impasse
                        </div>
                      </div>
                      <div className="col-span-2 text-[11px] text-blue-700 font-semibold pt-1">
                        ● Sensor confidence score 99.8% confirmed by ground induction loop.
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => alert("Acknowledged and took command of Gate 07 breach.")}
                      className="px-4 py-2 bg-[#1a44c2] hover:bg-[#1538a6] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                    >
                      Acknowledge &amp; Take Command
                    </button>

                    <button
                      type="button"
                      onClick={() => alert("Forwarded incident packet to Campus Police NOC.")}
                      className="px-4 py-2 bg-white border border-red-300 text-red-700 hover:bg-red-50 font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      Forward to Campus Police NOC
                    </button>
                  </div>
                </div>
              </div>

              {/* CARD 2: No-Show Escalation Warning (Orange) */}
              <div className="bg-white border border-amber-300 rounded-2xl overflow-hidden shadow-2xs">
                <div className="bg-amber-600 text-white px-4 py-2 flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    NO-SHOW ESCALATION WARNING • GATE 07 RELIEF
                  </span>
                  <span className="bg-black/30 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                    +18 MIN DELINQUENT
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      Officer Daniel Thorne (+18m Overdue)
                    </h3>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      Tier-1 Absentee Rule
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500">
                    Personnel Badge #GD-442 • Scheduled Post Handoff: 14:00 EST (18m ago)
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    Biometric reader failure at scheduled post station. Phone ping returned cellular voicemail. Automated fallback protocol active: Standby guard relief advised from Central Guardhouse Reserve Pool.
                  </p>

                  <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">
                        Available Standby Officer: Guard Kenneth Morris (Badge #GD-119)
                      </div>
                      <div className="text-[11px] text-slate-600">
                        Location: Station Room 102 (Deploy time: 2 mins to Gate 07)
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => alert("Deployed Reserve Guard Morris to Gate 07.")}
                      className="px-4 py-2 bg-[#1a44c2] hover:bg-[#1538a6] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                    >
                      Deploy Reserve Guard (Morris)
                    </button>

                    <button
                      type="button"
                      onClick={() => alert("Sent SMS directive to Officer Thorne.")}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      Send SMS Directive to Phone
                    </button>

                    <button
                      type="button"
                      className="px-3 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer"
                    >
                      Snooze Alert (5m)
                    </button>
                  </div>
                </div>
              </div>

              {/* CARD 3: Executive Dispatch (Dark blue) */}
              <div className="bg-white border border-blue-300 rounded-2xl overflow-hidden shadow-2xs">
                <div className="bg-[#0a2f77] text-white px-4 py-2 flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    EXECUTIVE DISPATCH • DR. ARTHUR VANCE (PROCTOR)
                  </span>
                  <span className="bg-blue-900 text-blue-200 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                    ORD-2024-409
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      Heightened Inspection Order Approved for Quad &amp; West Perimeter
                    </h3>
                    <span className="bg-blue-100 text-[#1a44c2] text-[10px] font-bold px-2 py-0.5 rounded">
                      Valid until 18:00 EST
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500">
                    Authentication Hash: 0x9AF41B • 42m ago (13:40 EST)
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    Authorization for random secondary inspections of all delivery vans entered into institutional record until 18:00. Mandatory dual-officer sign-off on bill of lading documents. Digital log entries must be completed via handheld Guard App v4.1.
                  </p>

                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => alert("Broadcast order to all active Guard terminals.")}
                      className="px-4 py-2 bg-[#1a44c2] hover:bg-[#1538a6] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                    >
                      Broadcast to All Guard Terminals
                    </button>

                    <button
                      type="button"
                      onClick={() => alert("Confirmed receipt of executive directive.")}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      Confirm Received
                    </button>
                  </div>
                </div>
              </div>

              {/* CARD 4: Routine Sensor */}
              <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
                <div className="bg-slate-100 text-slate-700 px-4 py-2 flex items-center justify-between text-xs font-bold">
                  <span>ANPR CHECKPOINT • LOT B BARRIER SENSOR</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    ROUTINE SENSOR
                  </span>
                </div>

                <div className="p-5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">
                      Zone N Parking Threshold Exceeded 85%
                    </h3>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded">
                      Auto-managed
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500">
                    Sensor Telemetry ID: #SNS-LOT-B • 1h 10m ago (13:12 EST)
                  </div>

                  <p className="text-slate-600 leading-relaxed">
                    Electronic gantry signage has redirected non-permitted visitor traffic to Lot C. Gate 04 throughput is currently averaging 1.4 seconds per vehicle. No queue backlog detected onto University Boulevard.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: PREFERENCES & NOC HOTLINE */}
            <div className="lg:col-span-4 space-y-6">
              {/* Card 1: Elena Rostova Card */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                  <Image
                    src="/supervisor-elena.jpg"
                    alt="Supervisor Elena"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-900">
                      Elena Rostova
                    </h3>
                    <CheckCircle2 className="w-4 h-4 text-[#1a44c2]" />
                  </div>
                  <div className="text-xs text-slate-500">
                    Shift Supervisor • Badge #SS-104
                  </div>
                  <div className="text-[11px] font-bold text-[#1a44c2] mt-0.5">
                    Active Station: Watch Room B
                  </div>
                </div>
              </div>

              {/* Card 2: Alert Routing Preferences */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#1a44c2]" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Alert Routing Preferences
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">
                    SS-104
                  </span>
                </div>

                <div className="text-xs text-slate-500">
                  Hardware terminal alert settings and multi-device paging triggers for active shift watch.
                </div>

                <div className="space-y-3.5 text-xs">
                  {/* Pref 1 */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">
                        Mobile Push &amp; Emergency SMS
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Relay to: +1-555-019-8832
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => togglePref("sms")}
                      className={`w-10 h-5 rounded-full transition cursor-pointer relative p-0.5 shrink-0 ${
                        routingPrefs.sms ? "bg-[#1a44c2]" : "bg-slate-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          routingPrefs.sms ? "translate-x-5" : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                  </div>

                  {/* Pref 2 */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">
                        Proctor Auto-Dial Escalation
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Ring Dr. Vance if alert is unacknowledged &gt; 5m
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => togglePref("proctorAutoDial")}
                      className={`w-10 h-5 rounded-full transition cursor-pointer relative p-0.5 shrink-0 ${
                        routingPrefs.proctorAutoDial ? "bg-[#1a44c2]" : "bg-slate-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          routingPrefs.proctorAutoDial ? "translate-x-5" : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => alert("Preferences preset saved to supervisor profile.")}
                    className="text-xs font-bold text-[#1a44c2] hover:underline cursor-pointer"
                  >
                    Save Preference Preset
                  </button>
                </div>
              </div>

              {/* Card 3: Campus Police NOC Hot-Line */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Campus Police NOC Hot-Line
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Extension 4409 • Direct Patch
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert("Patching direct to Campus Police NOC Extension 4409...")}
                    className="px-4 py-2 bg-[#0a2f77] hover:bg-[#07245c] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                  >
                    Call NOC
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
