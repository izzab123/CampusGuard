"use client";

import React, { useState } from "react";
import {
  FileText,
  Gavel,
  Shield,
  Clock,
  PieChart,
  Filter,
  Download,
  ShieldCheck,
  Search,
  RotateCcw,
  ArrowRight,
  Video,
  Building,
  CheckCircle2,
  AlertTriangle,
  Radio,
  FileCheck,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from "lucide-react";

interface IncidentItem {
  id: string;
  time: string;
  category: string;
  sector: string;
  primaryParty: string;
  primaryPartySub: string;
  isPartyRed?: boolean;
  severity: "MAJOR" | "MODERATE" | "ROUTINE";
  status: string;
  statusType: "action" | "pending" | "resolved" | "investigating" | "forensics";
  actionLabel: string;
  actionPrimary?: boolean;
}

const INCIDENTS_DATA: IncidentItem[] = [
  {
    id: "#INC-2025-084",
    time: "Today, 11:42 EST",
    category: "Vehicle Barrier Crash",
    sector: "North Perimeter (Gate 07)",
    primaryParty: "UNR-9024 (Sedan)",
    primaryPartySub: "No Valid Campus Decal",
    isPartyRed: true,
    severity: "MAJOR",
    status: "Action Required",
    statusType: "action",
    actionLabel: "Open Dossier",
    actionPrimary: true,
  },
  {
    id: "#INC-2025-081",
    time: "Today, 09:15 EST",
    category: "Physical Altercation",
    sector: "South Quad Hall C, Rm 204",
    primaryParty: "Marcus Keller",
    primaryPartySub: "NetID: mk-4010",
    severity: "MODERATE",
    status: "Hearing Pending",
    statusType: "pending",
    actionLabel: "Assign Hearing",
    actionPrimary: false,
  },
  {
    id: "#INC-2025-079",
    time: "Today, 08:30 EST",
    category: "Unattended Baggage / K9 Clear",
    sector: "West Quad Library Atrium",
    primaryParty: "Elena Rostova",
    primaryPartySub: "NetID: er-7720 (Claimed)",
    severity: "ROUTINE",
    status: "Resolved",
    statusType: "resolved",
    actionLabel: "Archive Log",
    actionPrimary: false,
  },
  {
    id: "#INC-2025-076",
    time: "Yesterday, 23:45 EST",
    category: "Restricted Zone Encroachment",
    sector: "Zone N Faculty Parking Lot",
    primaryParty: "Kareem Al-Jamil",
    primaryPartySub: "NetID: ka-5531 (Grad)",
    severity: "MODERATE",
    status: "Under Investigation",
    statusType: "investigating",
    actionLabel: "Issue Sanction",
    actionPrimary: false,
  },
  {
    id: "#INC-2025-072",
    time: "Yesterday, 21:10 EST",
    category: "Biometric Lockout (3x Fail)",
    sector: "Athletic Armory Facility South",
    primaryParty: "Unknown / Keycard Spoof",
    primaryPartySub: "UID: BF-A2-00-E1",
    isPartyRed: true,
    severity: "MAJOR",
    status: "Forensics Escalation",
    statusType: "forensics",
    actionLabel: "Open Dossier",
    actionPrimary: true,
  },
];

export default function ProctorIncidentsView() {
  const [activeFilterTab, setActiveFilterTab] = useState("All Incidents (18)");
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All Sectors");
  const [severityFilter, setSeverityFilter] = useState("Severity: Any");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleAction = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner Notice */}
      {actionNotice && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs font-semibold text-blue-900 flex items-center justify-between shadow-xs animate-in fade-in">
          <span>{actionNotice}</span>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="text-blue-700 hover:text-blue-900 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* TOP HEADER & CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
            <span>CAMPUS SAFETY OPERATIONS</span>
            <span className="text-slate-400">&gt;</span>
            <span className="text-slate-700">OFFICE OF STUDENT WELFARE</span>
            <span className="text-slate-400">&gt;</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight mt-1">
            Proctor Incident Command &amp; Case Dossier
          </h1>
          <p className="text-xs text-slate-500 max-w-3xl mt-0.5 leading-relaxed">
            Comprehensive Disciplinary &amp; Perimeter Incident Management: Proctorial oversight, student conduct adjudication, and formal sanctions.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => handleAction("Incident Queue filters loaded.")}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filter Incident Queue</span>
          </button>
          <button
            type="button"
            onClick={() => handleAction("Case roster PDF exported successfully.")}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Case Roster</span>
          </button>
          <button
            type="button"
            onClick={() => handleAction("Proctorial Authorization Directive modal ready.")}
            className="px-4 py-2 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Authorize Directive</span>
          </button>
        </div>
      </div>

      {/* 4 STAT KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: ACTIVE CASES */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Active Cases
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 leading-none">18</span>
              <span className="text-xs font-semibold text-slate-500">total docket</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 mt-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              <span>4 pending proctorial sign-off</span>
            </div>
          </div>
          {/* Progress bar line */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: "65%" }}></div>
          </div>
        </div>

        {/* Card 2: HEARING SCHEDULE */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Hearing Schedule
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Gavel className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 leading-none">3</span>
              <span className="text-xs font-semibold text-slate-500">scheduled today</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-blue-700 mt-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Next : 15:30 EST (DSW-12)</span>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-100">
              Conduct Board A
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-100">
              DSW Panel
            </span>
          </div>
        </div>

        {/* Card 3: SANCTIONS & INJUNCTIONS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Sanctions &amp; Injunctions
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 leading-none">7</span>
              <span className="text-xs font-semibold text-slate-500">active geofences</span>
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              5 student restrictions, 2 vehicles
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 text-slate-600">
            <span>Zero breaches past 48h</span>
            <span className="font-bold text-blue-700">100% Enforced</span>
          </div>
        </div>

        {/* Card 4: SLA ADJUDICATION RATE */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              SLA Adjudication Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 leading-none">96.4%</span>
              <span className="text-xs font-semibold text-slate-500">on-time</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Avg. closure latency: 4.2h</span>
            </div>
          </div>
          <div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-700 h-full rounded-full" style={{ width: "96.4%" }}></div>
            </div>
            <div className="flex justify-end text-[10px] font-semibold text-slate-500 mt-1">
              <span>Benchmark: 90%</span>
            </div>
          </div>
        </div>
      </div>

      {/* RED MAJOR INCIDENT BANNER (Gate 07 Automated Hydraulic Barrier Breach) */}
      <div className="bg-white border-2 border-red-500/80 rounded-2xl shadow-xs overflow-hidden">
        {/* Top Accent Strip with Badges */}
        <div className="px-5 py-3 bg-red-50/70 border-b border-red-200 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-red-600 text-white flex items-center gap-1 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              LEVEL 2 MAJOR INCIDENT
            </span>
            <span className="font-mono text-xs font-bold text-slate-700">
              INC-2025-084 / ESC-0422
            </span>
            <span className="text-slate-300">•</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white border border-slate-200 text-slate-700">
              Perimeter Violation
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Logged 14 mins ago (11:42 EST)</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              Gate 07 North Perimeter: Automated Hydraulic Barrier Breach &amp; Tailgating Attempt
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mt-1">
              Unregistered dark sedan (License Plate: <strong className="text-slate-900 font-mono">UNR-9024</strong>) accelerated through Gate 07 hydraulic drop arm directly behind certified university delivery van #T-44. ANPR optical cameras captured aggressive mechanical contact. Vehicle stalled 40 meters interior near Faculty Lot C. Driver refused dispatch instruction to disembark.
            </p>
          </div>

          {/* 4 Metadata Columns Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Sector
              </div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">
                Sector 4 - North Gate
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Suspect / Plate
              </div>
              <div className="text-xs font-bold text-red-600 mt-0.5">
                UNR-9024 (Black Honda)
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                On-Scene Units
              </div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">
                Patrol Unit #12 &amp; #08
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Proctor Dossier
              </div>
              <div className="text-xs font-bold text-blue-700 mt-0.5">
                Pending Lockdown
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleAction("Referred to Campus Police NOC. Incident escalated.")}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Refer to Campus Police NOC</span>
              </button>
              <button
                type="button"
                onClick={() => handleAction("Perimeter Sanction approved. Bollards locked.")}
                className="px-4 py-2 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Approve Perimeter Sanction</span>
              </button>
              <button
                type="button"
                onClick={() => handleAction("Telemetry requested from Field Supervisor Rostova.")}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5 text-slate-500" />
                <span>Request Supervisor Telemetry</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleAction("Opening full evidence chain modal...")}
              className="text-blue-700 hover:text-blue-900 font-bold text-xs flex items-center gap-1 transition self-end sm:self-center cursor-pointer"
            >
              <span>Inspect Full Evidence Chain</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SPLIT SECTION: TABLE (LEFT) + HEARINGS DOCKET (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: TABLE */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                "All Incidents (18)",
                "Major / Critical (4)",
                "Student Conduct (8)",
                "Perimeter Breaches (3)",
              ].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFilterTab(tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    activeFilterTab === tab
                      ? "bg-[#0a2f77] text-white font-bold shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing 5 of 18 Cases
            </div>

            {/* Filter Bar Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search gate ID, NetID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
              >
                <option>All Sectors</option>
                <option>Sector 4 - North Gate</option>
                <option>South Quad</option>
                <option>West Quad</option>
                <option>Zone N</option>
              </select>

              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
              >
                <option>Severity: Any</option>
                <option>Major</option>
                <option>Moderate</option>
                <option>Routine</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSectorFilter("All Sectors");
                  setSeverityFilter("Severity: Any");
                  handleAction("Incident table refreshed.");
                }}
                title="Refresh Table"
                aria-label="Refresh table"
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Cases Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">INCIDENT &amp; TIME</th>
                    <th className="py-2.5 px-3">CATEGORY &amp; SECTOR</th>
                    <th className="py-2.5 px-3">PRIMARY PARTY</th>
                    <th className="py-2.5 px-3">SEVERITY</th>
                    <th className="py-2.5 px-3">DOSSIER STATUS</th>
                    <th className="py-2.5 px-3 text-right">ADJUDICATION / ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {INCIDENTS_DATA.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition">
                      {/* Incident & Time */}
                      <td className="py-3 px-3 align-top whitespace-nowrap">
                        <div className="font-bold text-blue-700 font-mono">
                          {row.id}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {row.time}
                        </div>
                      </td>

                      {/* Category & Sector */}
                      <td className="py-3 px-3 align-top">
                        <div className="font-bold text-slate-900">
                          {row.category}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {row.sector}
                        </div>
                      </td>

                      {/* Primary Party */}
                      <td className="py-3 px-3 align-top">
                        <div
                          className={`font-bold ${
                            row.isPartyRed ? "text-red-600" : "text-slate-900"
                          }`}
                        >
                          {row.primaryParty}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {row.primaryPartySub}
                        </div>
                      </td>

                      {/* Severity */}
                      <td className="py-3 px-3 align-top whitespace-nowrap">
                        {row.severity === "MAJOR" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                            MAJOR
                          </span>
                        )}
                        {row.severity === "MODERATE" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                            MODERATE
                          </span>
                        )}
                        {row.severity === "ROUTINE" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                            ROUTINE
                          </span>
                        )}
                      </td>

                      {/* Dossier Status */}
                      <td className="py-3 px-3 align-top whitespace-nowrap">
                        {row.statusType === "action" && (
                          <div className="flex items-center gap-1.5 text-red-600 font-bold text-xs">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Action Required</span>
                          </div>
                        )}
                        {row.statusType === "pending" && (
                          <div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Hearing Pending</span>
                          </div>
                        )}
                        {row.statusType === "resolved" && (
                          <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Resolved</span>
                          </div>
                        )}
                        {row.statusType === "investigating" && (
                          <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs">
                            <Search className="w-3.5 h-3.5 text-slate-400" />
                            <span>Under Investigation</span>
                          </div>
                        )}
                        {row.statusType === "forensics" && (
                          <div className="flex items-center gap-1.5 text-red-600 font-bold text-xs">
                            <Shield className="w-3.5 h-3.5" />
                            <span>Forensics Escalation</span>
                          </div>
                        )}
                      </td>

                      {/* Adjudication / Action */}
                      <td className="py-3 px-3 align-top text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleAction(`${row.actionLabel} initiated for ${row.id}`)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer ${
                            row.actionPrimary
                              ? "bg-[#0a2f77] hover:bg-[#082660] text-white"
                              : "bg-white border border-slate-300 hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          {row.actionLabel}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
              <div>Displaying 1-5 of 18 Incidents (Page 1 of 4)</div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled
                  className="px-2.5 py-1 rounded border border-slate-200 text-slate-300 cursor-not-allowed text-xs font-semibold"
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded bg-[#0a2f77] text-white text-xs font-bold flex items-center justify-center shadow-xs"
                >
                  1
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center cursor-pointer"
                >
                  2
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center cursor-pointer"
                >
                  3
                </button>
                <button
                  type="button"
                  className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: HEARINGS DOCKET */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Gavel className="w-4 h-4 text-blue-700" />
                <h2 className="text-sm font-bold text-slate-900">Hearings Docket</h2>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                Today (3)
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Docket Item 1 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-red-700">15:30 EST • Room DSW-12</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-200/80 text-slate-700">
                    CODE §4.2 (ASSAULT)
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Marcus Keller (mk-4010)
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Board: Dean Vance, Prof. A. Thorne, Proctor NOC Rep
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                  <button
                    type="button"
                    onClick={() => handleAction("Launching Virtual Video Link for Hearing #12...")}
                    className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Virtual Video Link</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction("Opening Dossier #081...")}
                    className="font-bold text-slate-800 hover:underline cursor-pointer"
                  >
                    Dossier #081
                  </button>
                </div>
              </div>

              {/* Docket Item 2 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-blue-700">16:45 EST • Chamber B</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-200/80 text-slate-700">
                    CODE §11.8 (PROPERTY)
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Julian Vance-Wu (jv-9102)
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Board: Assoc. Dean Henderson, Officer Sterling
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                  <button
                    type="button"
                    onClick={() => handleAction("Navigating to In-Person Chamber schedule...")}
                    className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>In-Person Chamber</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction("Opening Dossier #074...")}
                    className="font-bold text-slate-800 hover:underline cursor-pointer"
                  >
                    Dossier #074
                  </button>
                </div>
              </div>

              {/* Docket Item 3 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-700">17:30 EST • Proctor Office</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-200/80 text-slate-700">
                    ACADEMIC INTEGRITY
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    S. Lin (sl-1200)
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Board: DSW Administrative Panel
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                  <span className="text-[11px] text-slate-500 italic">
                    Pre-adjudication briefing
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAction("Opening Dossier #060...")}
                    className="font-bold text-slate-800 hover:underline cursor-pointer"
                  >
                    Dossier #060
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
