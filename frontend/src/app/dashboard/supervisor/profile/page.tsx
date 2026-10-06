"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Bell,
  Clock,
  LogOut,
  Edit,
  FileDown,
  Shield,
  Lock,
  Radio,
  Building,
  Mail,
  UserCheck,
  TrendingUp,
  CheckCircle2,
  PhoneCall,
  Users,
  KeyRound,
  ExternalLink
} from "lucide-react";
import { performLogout } from "@/lib/auth";

export default function SupervisorProfilePage() {
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
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Notifications
              </Link>
              <Link
                href="/dashboard/supervisor/profile"
                className="py-5 relative transition cursor-pointer text-[#1a44c2] font-bold border-b-2 border-[#1a44c2]"
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

      {/* TOP SESSION EXPIRY RIBBON */}
      <div className="bg-slate-100/90 border-b border-slate-200 px-4 sm:px-8 py-2.5">
        <div className="max-w-[1520px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
              LIVE SESSION ENFORCED
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs self-start md:self-center">
            <span>
              SESSION EXPIRES: <strong className="font-mono font-bold text-slate-900">05:42:19</strong>
            </span>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={() => alert("Watch session token renewed for +8 hours.")}
              className="font-bold text-[#1a44c2] hover:underline cursor-pointer"
            >
              Extend Watch Session
            </button>
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
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-bold bg-[#1a44c2] text-white shadow-xs"
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

        {/* MAIN PROFILE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header Row */}
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#1a44c2]">
              SUPERVISOR DOSSIER • COMMAND AUTHORIZATION &amp; AUDIT CLEARANCE
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-1">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Supervisor Profile &amp; Command Dossier
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-normal mt-1 max-w-3xl">
                  Tactical supervisory credentials, institutional single sign-on authorizations, sector delegation management, and continuous security audit records.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => alert("Opening supervisor profile editor...")}
                  className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert("Exporting official Command Dossier record...")}
                  className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Export Record</span>
                </button>
              </div>
            </div>
          </div>

          {/* TWO COLUMNS: BIO/METRICS + PERMISSIONS/AUDIT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: BIO & TELEMETRY */}
            <div className="lg:col-span-5 space-y-6">
              {/* Card 1: Elena Rostova Bio Card */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-200 border-2 border-white shadow-md shrink-0">
                    <Image
                      src="/supervisor-elena.jpg"
                      alt="Supervisor Elena Rostova"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-blue-900/90 text-white text-[9px] font-bold text-center py-0.5 font-mono">
                      SS-104
                    </div>
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-[#1a44c2] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                        SHIFT SUPERVISOR
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                        ZONE ALPHA
                      </span>
                    </div>

                    <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                      Elena Rostova
                    </h2>
                    <div className="text-xs text-slate-600 font-medium">
                      Tactical NOC Commander
                    </div>
                    <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 pt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      ON DUTY • SHIFT B (14:00 - 22:00)
                    </div>
                  </div>
                </div>

                {/* 2x2 Details Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="text-[10px] font-bold uppercase text-slate-400">
                      CLEARANCE LEVEL
                    </div>
                    <div className="font-extrabold text-[#1a44c2] mt-0.5">
                      Level 4 • Exec Access
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="text-[10px] font-bold uppercase text-slate-400">
                      RADIO CALL SIGN
                    </div>
                    <div className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-blue-600" />
                      <span>Echo-Leader</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="text-[10px] font-bold uppercase text-slate-400">
                      TERMINAL DESK
                    </div>
                    <div className="font-bold text-slate-900 mt-0.5">
                      NOC Station 01
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="text-[10px] font-bold uppercase text-slate-400">
                      COMMAND POST
                    </div>
                    <div className="font-bold text-slate-900 mt-0.5">
                      Annex Building A
                    </div>
                  </div>
                </div>

                {/* Contact Rows */}
                <div className="space-y-2 pt-1 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      Institutional Email:
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      e.rostova@campusguard.edu
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      Primary Unit:
                    </span>
                    <span className="font-semibold text-slate-800">
                      Operations &amp; Threat Assessment
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Operational Telemetry */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Operational Telemetry
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Current Cycle (M-04)
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-600">Shifts Supervised</span>
                    <span className="font-bold text-slate-900">
                      28 <span className="text-slate-400">/ 30 Target (93.3%)</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-600">Escalation Response Latency</span>
                    <span className="font-bold text-emerald-600">
                      1m 24s <span className="text-[11px] font-normal text-slate-500">(Top 1%)</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-600">Zero-Breach Compliance</span>
                    <span className="font-bold text-slate-900">
                      100% <span className="text-slate-400">(420 gate checks)</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-600">Overtime Authorized</span>
                    <span className="font-bold font-mono text-slate-900">
                      14.5 hrs
                    </span>
                  </div>
                </div>

                {/* 7-Day Resolution Line Chart */}
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                      7-DAY INCIDENT RESOLUTION RATE
                    </span>
                    <span className="font-black text-[#1a44c2]">98.2% AVG</span>
                  </div>

                  {/* SVG Chart */}
                  <div className="h-16 w-full pt-1">
                    <svg className="w-full h-full" viewBox="0 0 300 60" preserveAspectRatio="none">
                      <path
                        d="M0,45 Q50,15 100,30 T200,20 T300,10"
                        fill="none"
                        stroke="#1a44c2"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: PERMISSIONS & AUDIT LOG */}
            <div className="lg:col-span-7 space-y-6">
              {/* Card 1: Sector Supervisory Permissions & Delegations */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900">
                    Sector Supervisory Permissions &amp; Delegations
                  </h2>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    CLEARANCE RANK: TIER-1 OPS
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Item 1 */}
                  <div className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900">
                        Perimeter Gate Access Override
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Master Override Authorized across Perimeter Gates 01 through 14
                      </div>
                    </div>
                    <span className="bg-blue-100 text-[#1a44c2] font-extrabold text-[10px] px-2.5 py-1 rounded uppercase shrink-0">
                      MASTER AUTHORIZED
                    </span>
                  </div>

                  {/* Item 2 */}
                  <div className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900">
                        Staff Reassignment &amp; Overtime Dispatch
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Full delegation authority across Shift B &amp; incoming Shift C roster
                      </div>
                    </div>
                    <span className="bg-blue-100 text-[#1a44c2] font-extrabold text-[10px] px-2.5 py-1 rounded uppercase shrink-0">
                      FULL AUTHORITY
                    </span>
                  </div>

                  {/* Item 3 */}
                  <div className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900">
                        Proctor Emergency Hotline Speed-Dial
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Tier-1 Direct line to Campus Executive Chancellor &amp; Municipal Swat
                      </div>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2.5 py-1 rounded uppercase shrink-0">
                      DIRECT ACCESS
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Recent Supervisory Audit Log */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Recent Supervisory Audit Log
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">
                    Immutable Hash Log (SHA-256)
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Row 1 */}
                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-500 text-[11px] font-bold">
                          14:18:22
                        </span>
                        <span className="font-bold text-slate-900">
                          Authorized Barrier Lockdown at Gate 07
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Initiated manual hydraulic pop-up bollards following perimeter vehicle alert.
                      </p>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 font-bold bg-white px-2 py-1 rounded border border-slate-200 shrink-0">
                      AUDIT-89412
                    </span>
                  </div>

                  {/* Row 2 */}
                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-500 text-[11px] font-bold">
                          14:15:04
                        </span>
                        <span className="font-bold text-slate-900">
                          Dispatched Reserve Officer L. Gomez
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Reinforced North Quad patrol zone during student union symposium.
                      </p>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 font-bold bg-white px-2 py-1 rounded border border-slate-200 shrink-0">
                      AUDIT-89408
                    </span>
                  </div>

                  {/* Row 3 */}
                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-500 text-[11px] font-bold">
                          13:58:49
                        </span>
                        <span className="font-bold text-slate-900">
                          Signed Off Gate 04 Shift Transition
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Validated physical equipment inventory, handheld scanner checkouts, and visitor logs.
                      </p>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 font-bold bg-white px-2 py-1 rounded border border-slate-200 shrink-0">
                      AUDIT-88397
                    </span>
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
