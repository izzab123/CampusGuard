"use client";

import React, { useState } from "react";
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  Gavel,
  Download,
  PlusCircle,
  Lock,
  Search,
  Clock,
  ExternalLink,
  ChevronRight,
  Calendar
} from "lucide-react";

export default function ProctorDashboardView() {
  const [filterTab, setFilterTab] = useState("All Active");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleAction = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="space-y-5">
      {/* Action Notice */}
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

      {/* HEADER TAG & ACTIONS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-blue-800 uppercase">
            <span>• PROCTORIAL COMMAND &amp; STUDENT WELFARE • EXECUTIVE OVERSIGHT • TERM 2024-2025</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight mt-1">
            Incident overview
          </h1>
          <p className="text-xs text-slate-500">
            Real-time disciplinary triage, perimeter emergency escalations, welfare checks, and student safety directives.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>TELEMETRY ACTIVE • 3S SYNC</span>
          </div>
          <button
            type="button"
            onClick={() => handleAction("Exporting comprehensive Proctor dossier...")}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Dossier</span>
          </button>
          <button
            type="button"
            onClick={() => handleAction("Opening directive issuance modal...")}
            className="px-3.5 py-2 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Issue Directive</span>
          </button>
        </div>
      </div>

      {/* 4 STAT KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: OPEN INCIDENTS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">Open Incidents</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 leading-none">18</span>
            <span className="text-xs font-bold text-slate-500">+3 vs 08:00</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span>Across 6 campus zones</span>
            <span className="font-bold text-blue-700">4 pending review</span>
          </div>
        </div>

        {/* Card 2: MAJOR SEVERITY */}
        <div className="bg-red-50/40 border border-red-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-red-700 font-bold uppercase tracking-wider text-[11px]">Major Severity</span>
            <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-red-600 leading-none">04</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-200 text-red-900 uppercase">
              ACTION REQ.
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-red-800 pt-1 border-t border-red-200/60">
            <span>Proctor Intervention</span>
            <span className="font-bold">2 Critical • 2 Level II</span>
          </div>
        </div>

        {/* Card 3: RESOLVED THIS WEEK */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">Resolved This Week</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 leading-none">42</span>
            <span className="text-xs font-bold text-emerald-700">+12% cycle</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span>94.8% SLA compliance</span>
            <span className="font-bold text-slate-700">Median 28m</span>
          </div>
        </div>

        {/* Card 4: INJUNCTIONS & ORDERS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">Injunctions &amp; Orders</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Gavel className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 leading-none">07</span>
            <span className="text-xs font-bold text-slate-500">Monitored</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span>0 perimeter breaches</span>
            <span className="font-bold text-blue-700">ANPR Geofenced</span>
          </div>
        </div>
      </div>

      {/* ESCALATION IN REVIEW RED ALERT BOX */}
      <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
            <Gavel className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-200 text-red-900 uppercase">
                ESCALATION IN REVIEW #ESC-8822 • GATE 07
              </span>
            </div>
            <p className="text-xs font-medium text-slate-800">
              Unattended Vehicle &amp; Barrier Breach Attempt. Supervisor Elena Rostova flagged for proctorial sign-off and lockdown authorization.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => handleAction("Reviewing Telemetry & ANPR optical matrix...")}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg shadow-xs transition cursor-pointer"
          >
            Review Telemetry &amp; ANPR
          </button>
          <button
            type="button"
            onClick={() => handleAction("Level 1 Lock authorized across Gate 07 Perimeter.")}
            className="px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Authorize Level 1 Lock</span>
          </button>
        </div>
      </div>

      {/* TWO-COLUMN GRID: INCIDENT QUEUE PREVIEW & DISCIPLINARY DOCKET */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLUMNS: INCIDENT QUEUE PREVIEW */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">Incident Queue Preview</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  5 Priority
                </span>
              </div>

              {/* Search and Filter */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search NetID, INC#, gate..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-7 pr-3 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <select className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 cursor-pointer">
                  <option>Severity: All</option>
                  <option>Major</option>
                  <option>Minor</option>
                </select>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3">
              {[
                { label: "All Active", count: 18 },
                { label: "Major Severity", count: 4 },
                { label: "Student Welfare", count: 6 },
                { label: "Perimeter Breaches", count: 3 },
                { label: "Disciplinary", count: 5 },
              ].map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setFilterTab(tab.label)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    filterTab === tab.label
                      ? "bg-[#0a2f77] text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* 5 Incident Items */}
            <div className="space-y-3">
              {/* Item 1: Major Perimeter */}
              <div className="p-4 rounded-xl border border-red-200 bg-red-50/20 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white">
                      ● MAJOR
                    </span>
                    <span className="font-semibold text-slate-700">
                      Perimeter Security #INC-2025-084 / ESC-8822
                    </span>
                  </div>
                  <span className="text-[11px] text-red-700 font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    18m ago (14:18 EST)
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">
                  Unauthorized Vehicle Barrier Breach Attempt &amp; Tailgate at Gate 07
                </h3>

                <p className="text-xs text-slate-500">
                  Reported by: <strong>Supv. Elena Rostova</strong> (ANPR Matrix) • Gate 07 South Quad Outer Ring
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleAction("Taking Command of Gate 07 Breach...")}
                    className="px-3 py-1.5 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg shadow-xs transition cursor-pointer"
                  >
                    Take Command
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction("Dispatching Police NOC to Gate 07...")}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg shadow-xs transition cursor-pointer"
                  >
                    Dispatch NOC
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction("Opening Incident details dialog...")}
                    aria-label="Incident details"
                    className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Item 2: Major Welfare */}
              <div className="p-4 rounded-xl border border-red-200 bg-red-50/20 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white">
                      ● MAJOR
                    </span>
                    <span className="font-semibold text-slate-700">
                      Student Welfare &amp; Conduct #INC-2025-082
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    42m ago (13:54 EST)
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">
                  Student Residence Physical Altercation &amp; Noise Violation — South Quad Hall C
                </h3>

                <p className="text-xs text-slate-500">
                  Resident Advisor T. Morales • Dormitory Hall C, 3rd Floor Commons
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleAction("Conduct Officer assigned.")}
                    className="px-3 py-1.5 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg shadow-xs transition cursor-pointer"
                  >
                    Assign Conduct Officer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction("Opening RA statement...")}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg shadow-xs transition cursor-pointer"
                  >
                    Review Statement
                  </button>
                </div>
              </div>

              {/* Item 3: Minor Staffing */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                      MINOR
                    </span>
                    <span className="font-semibold text-slate-700">
                      Staffing Protocol #INC-2025-080 / ESC-8819
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    1h 12m ago (13:24 EST)
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">
                  Biometric Check-in Timeout &amp; Unmanned Guard Kiosk — Officer D. Thorne
                </h3>

                <p className="text-xs text-slate-500">
                  Shift Supervisor System Daemon • Gate 07 Checkpoint
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleAction("Relief acknowledged.")}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition cursor-pointer"
                  >
                    Acknowledge Relief
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction("Opening handoff details...")}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition cursor-pointer"
                  >
                    View Handoff
                  </button>
                </div>
              </div>

              {/* Item 4: Minor Public Safety */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                      MINOR
                    </span>
                    <span className="font-semibold text-slate-700">
                      Public Safety #INC-2025-078
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    2h 05m ago (12:31 EST)
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">
                  Unattended Suspicious Duffel Bag Flagged at West Quad Library Plaza
                </h3>

                <p className="text-xs text-slate-500">
                  Officer Marcus Vance (#4082) • West Quad Library Plaza Fountain
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleAction("Safe inspection logged.")}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition cursor-pointer"
                  >
                    Log Safe Inspection
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction("Reviewing duffel inspection...")}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition cursor-pointer"
                  >
                    Review
                  </button>
                </div>
              </div>

              {/* Item 5: Minor Traffic */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                      MINOR
                    </span>
                    <span className="font-semibold text-slate-700">
                      Traffic &amp; Logistics #INC-2025-075
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    3h 15m ago (11:21 EST)
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">
                  Zone N Parking Facility Over-Capacity &amp; Traffic Queue on University Blvd
                </h3>

                <p className="text-xs text-slate-500">
                  ANPR Induction Sensor Matrix • Zone N &amp; Visitor Lot B
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleAction("Dynamic sign activated to reroute traffic to Lot C.")}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition cursor-pointer"
                  >
                    Reroute to Lot C
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction("Queue warning dismissed.")}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>

            {/* Queue Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
              <button
                type="button"
                onClick={() => handleAction("Viewing complete 18 incidents...")}
                className="text-blue-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View full incident queue (18 total)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="font-mono">Audit Ref: DSW-LOG-0418</span>
                <button
                  type="button"
                  onClick={() => handleAction("Compliance PDF generated.")}
                  className="text-slate-700 font-semibold hover:underline cursor-pointer"
                >
                  Export Compliance PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DISCIPLINARY DOCKET */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-700" />
                <h2 className="text-sm font-bold text-slate-900">Disciplinary Docket</h2>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                Today
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Docket Item 1 */}
              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span className="font-mono text-blue-700 font-bold">15:30 EST</span>
                  <span>Room DSW-12</span>
                </div>
                <h3 className="font-bold text-slate-900">
                  Hearing #H-401 (Academic Conduct)
                </h3>
                <p className="text-[11px] text-slate-600">
                  Committee: Dr. Vance, Prof. Higgins, Registrar Rep.
                </p>
              </div>

              {/* Docket Item 2 */}
              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span className="font-mono text-blue-700 font-bold">17:00 EST</span>
                  <span>Dean&apos;s Briefing Rm</span>
                </div>
                <h3 className="font-bold text-slate-900">
                  Gate 07 Breach Protocol Debrief
                </h3>
                <p className="text-[11px] text-slate-600">
                  Attending: Field Supervisor Elena Rostova, Campus Ops
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleAction("Opening complete Proctor master calendar...")}
                className="w-full text-center text-xs font-bold text-blue-700 hover:text-blue-900 py-1 transition cursor-pointer"
              >
                View Complete Proctor Calendar →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
