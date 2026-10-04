"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  QrCode,
  AlertTriangle,
  Bell,
  Smartphone,
  PhoneCall,
  UserCheck,
  RefreshCw,
  Car,
  KeyRound,
  Footprints,
  CreditCard,
  Wrench,
  ChevronRight,
  LogOut,
  CheckCircle2,
  Maximize2,
  Wallet
} from "lucide-react";
import { performLogout } from "@/lib/auth";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [selectedIncidentType, setSelectedIncidentType] = useState<string | null>(null);
  const [feedFilter, setFeedFilter] = useState("All");

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col">
      {/* 1. TOP APP HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Student & Staff Brand */}
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
                  STUDENT &amp; STAFF
                </span>
              </div>
            </Link>

            {/* Top Nav Links */}
            <nav className="hidden md:flex items-center gap-6 pl-4 text-xs font-semibold text-slate-600">
              {["Dashboard", "My QR code", "Report incident", "Notifications", "Profile"].map((tab) => (
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
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>

            <button
              type="button"
              aria-label="Notifications"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 relative transition"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-600"></span>
            </button>

            {/* Alex Morgan Profile */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#0a2f77] text-white flex items-center justify-center font-bold text-xs">
                AM
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  Alex Morgan - #STU-88201
                </span>
                <span className="text-[11px] text-slate-500 leading-tight">
                  Dept. of Computer Science &amp; Eng.
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
        {/* LEFT SIDEBAR: STUDENT ACCESS */}
        <aside className="w-60 shrink-0 hidden md:flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
              Student / Staff Access
            </div>
            <nav className="space-y-1">
              {[
                { name: "Dashboard", icon: ShieldCheck },
                { name: "My QR code", icon: QrCode },
                { name: "Report incident", icon: AlertTriangle },
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

          {/* Bottom Sidebar Card: Identity Pass */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">IDENTITY PASS</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                VERIFIED
              </span>
            </div>
            <p className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              CAMPUS SECURE • NORMAL
            </p>
            <div className="pt-1 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100">
              <span>Hotline:</span>
              <strong className="text-slate-800">x9110 (24/7)</strong>
            </div>
          </div>
        </aside>

        {/* MAIN STUDENT CONTENT */}
        <main className="flex-1 space-y-5">
          {/* HEADER BAR */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                <span className="text-blue-800 uppercase tracking-wide">
                  • FALL 2024 • ACTIVE ENROLLMENT
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
                  • SAFETY STATUS: NORMAL
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Zone: North Academic Quad</p>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Welcome back, Alex Morgan
              </h1>
              <p className="text-xs text-slate-500">
                • Undergrad Senior, Computer Science &amp; Engineering • Level-1 Building &amp; Laboratory Clearance
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                className="px-3.5 py-2 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-800 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile Pass</span>
              </button>
              <button
                type="button"
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Emergency Dispatch Ping</span>
              </button>
            </div>
          </div>

          {/* TWO-COLUMN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT 2 COLUMNS: PARKING QR & REPORT INCIDENT */}
            <div className="lg:col-span-2 space-y-5">
              {/* CARD 1: MY PARKING QR */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                      P
                    </div>
                    <h2 className="text-sm font-bold text-slate-900">My Parking QR</h2>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    ● VALID PERMIT: LOT C &amp; ZONE N PERIMETER
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  {/* QR Box Visual */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
                    {/* Stylized QR Box */}
                    <div className="w-36 h-36 bg-white p-3 rounded-lg border border-slate-300 shadow-2xs flex items-center justify-center">
                      <div className="grid grid-cols-4 gap-1 w-full h-full p-1 bg-slate-900 rounded">
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-slate-900"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-slate-900"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-slate-900"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-slate-900"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-slate-900"></div>
                        <div className="bg-white rounded-xs"></div>
                        <div className="bg-white rounded-xs"></div>
                      </div>
                    </div>
                    <div className="text-[11px]">
                      <span className="font-bold text-slate-800 uppercase tracking-wide block">
                        Dynamic Pass Token
                      </span>
                      <span className="text-blue-700 font-semibold flex items-center justify-center gap-1 mt-0.5">
                        <RefreshCw className="w-3 h-3 text-blue-700 animate-spin" />
                        Refreshes in 14m 19s
                      </span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="md:col-span-2 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                          Assigned Bay
                        </span>
                        <p className="font-extrabold text-slate-900">Lot C • Deck #314</p>
                        <p className="text-[11px] text-slate-500">Multi-tier shaded parking</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                          Registered Vehicle
                        </span>
                        <p className="font-extrabold text-slate-900">7XYZ-42</p>
                        <p className="text-[11px] text-slate-500">Gray Honda Civic (2022)</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                          Sensor Gate Clearances
                        </span>
                        <p className="font-extrabold text-slate-900">Gate 04 &amp; Gate 07</p>
                        <p className="text-[11px] text-slate-500">RFID + Optical Barrier Sync</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                          Verification NetID
                        </span>
                        <p className="font-extrabold text-slate-900">#STU-88201-ALX</p>
                        <p className="text-[11px] text-slate-500">Token: SHA-256 Validated</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        className="px-4 py-2 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>View Fullscreen QR</span>
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition"
                      >
                        <Wallet className="w-3.5 h-3.5" />
                        <span>Add to Wallet</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: REPORT AN INCIDENT */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-red-600" />
                    <h2 className="text-sm font-bold text-slate-900">Report an Incident</h2>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                    CONFIDENTIAL • DIRECT TO DISPATCH
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  Witnessed suspicious activity, a damaged perimeter turnstile, or need an on-demand officer escort across campus after hours? Campus Safety dispatchers respond in <strong>&lt; 4 minutes</strong>.
                </p>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    SELECT INCIDENT OR SERVICE TYPE
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: "suspicious", label: "Suspicious Activity", icon: AlertTriangle },
                      { id: "escort", label: "Safe Walk Escort", icon: Footprints },
                      { id: "lost-card", label: "Lost Card / Access", icon: CreditCard },
                      { id: "facility", label: "Gate / Facility Risk", icon: Wrench },
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedIncidentType(type.id)}
                        className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-2 ${
                          selectedIncidentType === type.id
                            ? "border-blue-600 bg-blue-50/70 text-blue-900"
                            : "border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700"
                        }`}
                      >
                        <type.icon className={`w-5 h-5 ${selectedIncidentType === type.id ? "text-blue-700" : "text-slate-500"}`} />
                        <span className="text-xs font-bold leading-tight">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    className="px-4 py-2.5 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Report Incident</span>
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition"
                  >
                    <Footprints className="w-3.5 h-3.5" />
                    <span>Request Instant Safe Walk Patrol</span>
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: CAMPUS UPDATES LIVE FEED */}
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-700" />
                    <h2 className="text-sm font-bold text-slate-900">Campus Updates</h2>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    LIVE FEED
                  </span>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 text-[11px] font-semibold border-b border-slate-100 pb-2">
                  {["All (4)", "Alerts", "Facilities", "Personal Pass"].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setFeedFilter(tab)}
                      className={`px-2.5 py-1 rounded-md transition ${
                        feedFilter === tab
                          ? "bg-[#0a2f77] text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Feed Items */}
                <div className="space-y-3">
                  {/* Feed 1 */}
                  <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <Wrench className="w-3.5 h-3.5 text-amber-600" />
                        <span>Gate 04 Turnstile Calibration</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[10px]">25m ago</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Scheduled between 16:00 – 17:00. Use adjacent Gate 02 Library Portal during this window.
                    </p>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pt-0.5">
                      FACILITIES LOGISTICS
                    </span>
                  </div>

                  {/* Feed 2 */}
                  <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Parking Permit Lot C Validated</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[10px]">2h ago</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Your monthly academic permit was validated at Zone N entry loop without discrepancy.
                    </p>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pt-0.5">
                      PARKING ENFORCEMENT
                    </span>
                  </div>

                  {/* Feed 3 */}
                  <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <AlertTriangle className="w-3.5 h-3.5 text-blue-600" />
                        <span>Advisory: Evening Robotics Symposium</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[10px]">10:15 AM</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Heightened guest traffic near East Perimeter. Parking overflow will route into Lot C upper tier.
                    </p>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pt-0.5">
                      DEAN OF STUDENT WELFARE
                    </span>
                  </div>

                  {/* Feed 4 */}
                  <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <Footprints className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Escort Concluded Successfully</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[10px]">Yesterday</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Officer Lin safely concluded escort transit from West Quad Library to Residence Hall B.
                    </p>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pt-0.5">
                      CAMPUS PATROL DISPATCH
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 transition"
                  >
                    View all 12 notifications →
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
