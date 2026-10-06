"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Bell,
  AlertTriangle,
  RotateCcw,
  LogOut,
  ChevronDown,
  ShieldAlert,
  ArrowUpRight,
  Clock,
  PhoneCall,
  MapPin,
  Radio,
  FileText,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Send,
  Zap,
  UserCheck
} from "lucide-react";
import { performLogout } from "@/lib/auth";

export default function GuardIncidentsPage() {
  const [selectedSeverity, setSelectedSeverity] = useState("Level 1");
  const [category, setCategory] = useState("");
  const [narrative, setNarrative] = useState("");
  const [autoForward, setAutoForward] = useState(true);
  const [incidentsList, setIncidentsList] = useState([
    {
      id: "#INC-2025-084",
      level: "Level 2 (High)",
      levelType: "high",
      location: "Gate 04 Automated Barrier",
      time: "Today, 13:42",
      title: "Unauthorized Vehicle Barrier Breach Attempt – Gate 04",
      description:
        "Dark gray SUV (Plate #UNR-9024) attempted to tailgate delivery vehicle through Gate 04 automated hydraulic barrier. Hydraulic anti-ram bollards automatically raised. Driver failed to present valid digital RFID clearance and reversed hastily toward North Connector Rd.",
      tags: ["Vehicle Security", "Auto ALPR Tagged"],
      escalated: true,
      status: "Escalated to Proctor",
      fileNum: "Incident File #084",
    },
    {
      id: "#INC-2025-081",
      level: "Level 1 (Moderate)",
      levelType: "moderate",
      location: "West Quad Library Plaza",
      time: "Today, 12:15",
      title: "Suspicious Unattended Bag – West Quad Library Plaza",
      description:
        "Black nylon duffel bag left unattended on concrete bench near the East Entrance fountain for over 45 minutes according to faculty report. Officer Jenkins arrived on scene at 12:22. Performed preliminary perimeter isolation; currently conducting optical scan.",
      tags: ["Suspicious Item", "Public Safety Zone 3"],
      escalated: false,
      status: "Patrol Dispatched (Jenkins)",
      fileNum: "Contact Officer Jenkins (Ext 4012)",
    },
    {
      id: "#INC-2025-079",
      level: "Low Priority",
      levelType: "low",
      location: "Gate 02 Turnstiles",
      time: "Today, 10:04",
      title: "Lost Student ID / Access Card Flagged at Gate 02",
      description:
        "Cardholder credential (ID #990142) deactivated after three rapid failed badge-in attempts at Gate 02 turnstile. Student surrendered badge to Gate 02 security officer. Physical card safely deposited at Student Life Center desk for formal reissue.",
      tags: ["Badge Credential", "Closed by Sgt. O'Connor"],
      escalated: false,
      resolved: true,
      status: "Resolved",
      fileNum: "Archived Log Available",
    },
  ]);

  const [filterSeverity, setFilterSeverity] = useState("All Severities");

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!narrative.trim()) return;

    const newInc = {
      id: `#INC-2025-08${incidentsList.length + 5}`,
      level: selectedSeverity === "SOS" ? "Critical SOS" : selectedSeverity,
      levelType: selectedSeverity === "Level 2" || selectedSeverity === "SOS" ? "high" : "moderate",
      location: "Gate 04 (North Outer Ring)",
      time: "Just now",
      title: category ? `${category} Reported at Gate 04` : "Incident Report at Gate 04",
      description: narrative,
      tags: ["Gate 04", "Field Log"],
      escalated: autoForward,
      status: autoForward ? "Escalated to Proctor" : "Under Triage",
      fileNum: "Immediate Log",
    };

    setIncidentsList([newInc, ...incidentsList]);
    setNarrative("");
    alert("Incident successfully dispatched and logged to NOC triage queue.");
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
                className="py-5 relative transition cursor-pointer text-[#1a44c2] font-bold border-b-2 border-[#1a44c2]"
              >
                Incidents
              </Link>
              <Link
                href="/dashboard/guard/notifications"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
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

      {/* TOP CRITICAL ALERT PROTOCOL BANNER */}
      <div className="bg-red-50 border-b border-red-200 px-4 sm:px-8 py-3">
        <div className="max-w-[1520px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-start md:items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-red-700">
                  Active Critical Alert Protocol: Zone B perimeter check in progress
                </span>
                <span className="bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider animate-pulse">
                  LIVE FEED
                </span>
              </div>
              <p className="text-slate-600 mt-0.5">
                Gate 04 surveillance matrix synced with campus tactical response unit. Shift Handover log locked until triage resolution.
              </p>
            </div>
          </div>

          <div className="bg-white border border-red-200 text-slate-800 font-semibold px-3 py-1.5 rounded-xl shadow-2xs shrink-0 self-start md:self-center">
            Active Proctor on Duty: <strong className="text-slate-900">Dr. Arthur Vance (DSW-09)</strong>
          </div>
        </div>
      </div>

      {/* 2. BODY LAYOUT: SIDEBAR + MAIN CONTENT */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* LEFT SIDEBAR */}
        <aside className="w-60 shrink-0 hidden md:flex flex-col justify-between bg-white border-r border-slate-200/90 min-h-[calc(100vh-120px)] p-4">
          <div>
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
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-bold bg-[#1a44c2] text-white shadow-xs"
              >
                Incidents
              </Link>

              <Link
                href="/dashboard/guard/notifications"
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
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
          </div>

          {/* Bottom Dispatch Card */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Elapsed:
              </span>
              <span className="font-bold text-slate-800 font-mono">04h 15m</span>
            </div>
            <button
              type="button"
              onClick={() => alert("Calling Dispatch NOC: Ext 4000...")}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Dispatch NOC: Ext 4000</span>
            </button>
          </div>
        </aside>

        {/* MAIN INCIDENTS CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-extrabold tracking-wider text-blue-800 uppercase">
                CAMPUSGUARD DISPATCH NOC • Grid Station 04 / North Perimeter
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Incident Dispatch &amp; Situational Triage
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-normal mt-1">
                Real-time incident logging, patrol unit telemetry, and proctor escalation terminal.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative">
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="appearance-none bg-white border border-slate-200 px-3.5 py-2 pr-8 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer shadow-2xs"
                >
                  <option>Filter: All Severities</option>
                  <option>Filter: High Priority</option>
                  <option>Filter: Moderate</option>
                  <option>Filter: Low Priority</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                type="button"
                onClick={() => {
                  const target = document.getElementById("narrative-input");
                  target?.focus();
                }}
                className="px-4 py-2 bg-[#1a44c2] hover:bg-[#1538a6] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Report New Incident</span>
              </button>
            </div>
          </div>

          {/* TRIAGE STAT CARDS (3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                <span>ACTIVE TRIAGE</span>
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
              </div>
              <div className="text-2xl font-black text-slate-900">
                2 <span className="text-xs font-bold text-red-600">Incidents in Queue</span>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1 font-semibold">
                <span className="text-red-600 font-bold">!</span>
                <span>Requiring security action</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                <span>ESCALATED TO PROCTOR</span>
                <span className="w-2 h-2 rounded bg-blue-600"></span>
              </div>
              <div className="text-2xl font-black text-slate-900">
                1 <span className="text-xs font-bold text-[#1a44c2]">DSW Protocol</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Executive intervention active</span>
                <span className="font-bold text-[#1a44c2]">Gate 04 Breach</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                <span>RESOLVED TODAY</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-2xl font-black text-slate-900">
                5 <span className="text-xs font-bold text-slate-500">Logs Closed</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Cleared across all gates</span>
                <span className="font-bold text-emerald-600">100% Logged</span>
              </div>
            </div>
          </div>

          {/* TWO COLUMNS: LIVE TRIAGE LEDGER + FAST SUBMISSION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: LIVE TRIAGE LEDGER */}
            <div className="lg:col-span-7 space-y-4">
              {/* Ledger Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900">
                    Live Triage Ledger
                  </h2>
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {incidentsList.length} Active Records
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium">
                    <RotateCcw className="w-3 h-3 text-[#1a44c2]" />
                    Auto-Refresh (15s)
                  </span>
                  <button
                    type="button"
                    className="flex items-center gap-1 text-slate-700 font-bold hover:underline cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Incidents Feed */}
              <div className="space-y-4">
                {incidentsList.map((inc) => (
                  <div
                    key={inc.id}
                    className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3 hover:border-slate-300 transition"
                  >
                    {/* Top Row Badges & Escalation Button */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-mono font-bold text-slate-900">
                          {inc.id}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inc.levelType === "high"
                              ? "bg-red-100 text-red-700"
                              : inc.levelType === "moderate"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          ● {inc.level}
                        </span>
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded">
                          {inc.location}
                        </span>
                      </div>

                      {inc.escalated ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#1a44c2] text-white">
                          <ArrowUpRight className="w-3 h-3" />
                          Escalated to Proctor
                        </span>
                      ) : inc.resolved ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          Resolved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          <Radio className="w-3 h-3" />
                          {inc.status}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 font-medium">
                      Reported: {inc.time}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {inc.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                        {inc.description}
                      </p>
                    </div>

                    {/* Tags & Action Links */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        {inc.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="text-[#1a44c2] hover:underline font-bold text-xs cursor-pointer"
                        >
                          View Escalation Trail ⌵
                        </button>
                        <span className="text-slate-500 font-mono text-[11px]">
                          {inc.fileNum}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: FAST INCIDENT SUBMISSION & COMMAND PERSONNEL */}
            <div className="lg:col-span-5 space-y-6">
              {/* Card 1: Fast Incident Submission Form */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1a44c2] flex items-center justify-center">
                      <Zap className="w-4 h-4" />
                    </div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Fast Incident Submission
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    GUARD STATION 04
                  </span>
                </div>

                <form onSubmit={handleCreateIncident} className="space-y-3.5 text-xs">
                  {/* Category */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Incident Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select category...</option>
                      <option value="Unauthorized Vehicle Attempt">Unauthorized Vehicle Attempt</option>
                      <option value="Suspicious Unattended Object">Suspicious Unattended Object</option>
                      <option value="Turnstile Tailgating">Turnstile Tailgating</option>
                      <option value="Perimeter Barrier Defect">Perimeter Barrier Defect</option>
                      <option value="Medical Emergency Assist">Medical Emergency Assist</option>
                    </select>
                  </div>

                  {/* Campus Location */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Campus Location / Checkpoint
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value="Gate 04 (North Outer Ring)"
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-slate-800 font-semibold"
                      />
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Operational Severity */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Operational Severity
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {["Low", "Level 1", "Level 2", "SOS"].map((sev) => (
                        <button
                          key={sev}
                          type="button"
                          onClick={() => setSelectedSeverity(sev)}
                          className={`py-1.5 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                            selectedSeverity === sev
                              ? sev === "SOS"
                                ? "bg-red-600 text-white"
                                : "bg-[#1a44c2] text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {sev}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Situational Narrative */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Situational Narrative
                    </label>
                    <textarea
                      id="narrative-input"
                      rows={3}
                      value={narrative}
                      onChange={(e) => setNarrative(e.target.value)}
                      placeholder="Describe observations, vehicle descriptions, badge numbers, or suspect directives..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                      required
                    ></textarea>
                  </div>

                  {/* Auto Forward Checkbox */}
                  <label className="flex items-start gap-2.5 cursor-pointer select-none bg-blue-50/50 border border-blue-100 rounded-xl p-3">
                    <input
                      type="checkbox"
                      checked={autoForward}
                      onChange={(e) => setAutoForward(e.target.checked)}
                      className="mt-0.5 rounded text-[#1a44c2] focus:ring-0"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block leading-tight">
                        Auto-Forward to University Proctor &amp; DSW
                      </span>
                      <span className="text-[11px] text-slate-500 leading-snug">
                        Injects dispatch ticket directly into senior emergency radio queue.
                      </span>
                    </div>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#1a44c2] hover:bg-[#1538a6] text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs shadow-xs transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch &amp; File Incident</span>
                  </button>
                </form>
              </div>

              {/* Card 2: Command Personnel on Triage */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  COMMAND PERSONNEL ON TRIAGE
                </div>

                <div className="space-y-3">
                  {/* Personnel 1 */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#0a2f77] text-white font-bold text-xs flex items-center justify-center overflow-hidden">
                        <Image
                          src="/officer-vance.jpg"
                          alt="Officer Vance"
                          width={36}
                          height={36}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 leading-tight">
                          Officer Marcus Vance
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Lead Triage Officer • Shield #4082
                        </div>
                      </div>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      In Station
                    </span>
                  </div>

                  {/* Personnel 2 */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-700 text-white font-bold text-xs flex items-center justify-center overflow-hidden">
                        <Image
                          src="/officer-jenkins.jpg"
                          alt="Officer Jenkins"
                          width={36}
                          height={36}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 leading-tight">
                          Officer T. Jenkins
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Mobile Response Patrol • Unit 04
                        </div>
                      </div>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      En Route
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
