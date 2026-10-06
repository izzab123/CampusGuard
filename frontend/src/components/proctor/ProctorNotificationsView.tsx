"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Gavel,
  PhoneCall,
  Radio,
  Wifi,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Headset,
  CheckCircle2,
  Building,
  RotateCcw,
  Filter,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  FileText
} from "lucide-react";

export default function ProctorNotificationsView() {
  const [activeFilterTab, setActiveFilterTab] = useState("All Alerts (18)");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Alert Channel Toggles State
  const [channels, setChannels] = useState({
    sms: true,
    voice: true,
    email: false,
    radio: true,
  });

  const toggleChannel = (key: keyof typeof channels) => {
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAction = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="space-y-5">
      {/* Notice Banner */}
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

      {/* TOP 4 STAT KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: PRIORITY ESCALATIONS */}
        <div className="bg-white border border-slate-200 border-l-4 border-l-red-500 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Priority Escalations
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
              <Gavel className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-slate-900 leading-none">3</span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 mt-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              <span>2 Require Proctorial Sign-off</span>
            </div>
          </div>
        </div>

        {/* Card 2: HOTLINE DIRECT PINGS */}
        <div className="bg-white border border-slate-200 border-l-4 border-l-amber-500 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Hotline Direct Pings
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-slate-900 leading-none">1</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1.5">
              <span>Direct line: Sup. Rostova</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: AUTOMATED SENTINELS */}
        <div className="bg-white border border-slate-200 border-l-4 border-l-blue-600 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Automated Sentinels
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-slate-900 leading-none">8</span>
            <div className="flex items-center justify-between text-xs text-slate-600 mt-1.5">
              <span>Past 24h • ANPR &amp; Tripwires</span>
              <span className="font-bold text-blue-700">0 Missed</span>
            </div>
          </div>
        </div>

        {/* Card 4: SYSTEM BROADCASTS */}
        <div className="bg-white border border-slate-200 border-l-4 border-l-blue-600 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              System Broadcasts
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Wifi className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-slate-900 leading-none">2</span>
            <div className="flex items-center justify-between text-xs text-slate-600 mt-1.5">
              <span>Welfare notices published</span>
              <span className="font-mono text-slate-500 text-[11px]">EXP: 21:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* URGENT DIRECTIVE REQUIRED RED BANNER */}
      <div className="bg-red-50/90 border border-red-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white">
                URGENT DIRECTIVE REQUIRED
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-900 border border-red-200">
                JURISDICTION: BRAVO-07
              </span>
              <span className="text-xs font-bold text-red-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>11m 41s until automated Chancellor escalation</span>
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              Emergency Level Bravo Review: North Perimeter Gate 07 Vehicle Breach
            </h2>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              Hydraulic barrier deployed upon unauthorized tailgate intrusion. Vehicle contained; Field Supervisor Rostova reports occupant refuses identification. Executive Proctor authorization required to initiate municipal inter-agency transfer protocol.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 self-end md:self-center">
          <button
            type="button"
            onClick={() => handleAction("Directive acknowledged and digitally signed with PKI seal.")}
            className="px-4 py-2.5 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Acknowledge &amp; Sign Directive</span>
          </button>
          <button
            type="button"
            onClick={() => handleAction("Connecting to Direct NOC Line (x9110)...")}
            className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Headset className="w-4 h-4 text-slate-500" />
            <span>Connect Direct NOC Line</span>
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS STREAM + RIGHT SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLUMNS: NOTIFICATIONS FEED */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Tabs Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                "All Alerts (18)",
                "Critical Escalations (3)",
                "Conduct & Welfare (6)",
                "Gate & Perimeter (5)",
                "Automated Sentinels (4)",
              ].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFilterTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    activeFilterTab === tab
                      ? "bg-[#0a2f77] text-white font-bold shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-white border border-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleAction("Notification filters configured.")}
                title="Filter Alerts"
                aria-label="Filter alerts"
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleAction("Notifications feed synchronized.")}
                title="Refresh Stream"
                aria-label="Refresh stream"
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Alert Cards Stream */}
          <div className="space-y-4">
            {/* Card 1: Critical Escalation (Red Accent) */}
            <div className="bg-white border border-red-200 rounded-2xl p-5 shadow-xs space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-red-600"></div>
              {/* Header Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                    CRITICAL ESCALATION
                  </span>
                  <span className="font-mono font-bold text-slate-700">INC-2024-0042</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-semibold text-slate-600">Gate 07 North Sector</span>
                </div>
                <span className="text-slate-500 font-medium flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3 text-slate-400" />
                  14:58 EST (34m ago)
                </span>
              </div>

              {/* Title & Body */}
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Gate 07 Hydraulic Barrier Engagement - Vehicle Tailgate Breach
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Automated sentinel tripwire triggered emergency bollards. Unregistered dark grey crossover attempted tailgate entry behind campus bus #12. Barrier raised with zero casualty. Occupant actively detained at security sallyport.
                </p>
              </div>

              {/* Inset Box with Gate 07 Photo & Telemetry Details */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-44 h-28 rounded-lg overflow-hidden relative bg-slate-900 shrink-0">
                  <Image
                    src="/cctv-gate07.jpg"
                    alt="CCTV Gate 07"
                    width={180}
                    height={110}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 text-white font-mono text-[9px] font-bold">
                    CAM-07-ANPR
                  </span>
                </div>

                <div className="flex-1 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">SUPERVISOR:</span>
                    <span className="font-bold text-slate-800">Elena Rostova (Desk 4)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">PLATE ANPR:</span>
                    <span className="font-mono font-bold text-red-600">UNKNOWN [ORPHANED]</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">BOLLARD PSI:</span>
                    <span className="font-mono font-bold text-slate-800">2,410 PSI [Locked]</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">PERIMETER STATUS:</span>
                    <span className="font-bold text-red-600">Containment Ring A Active</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    Requires: <span className="font-semibold text-slate-700">Formal Inter-Agency Notice</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAction("Opening Incident Dossier for #INC-2024-0042...")}
                    className="px-3.5 py-1.5 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg shadow-xs transition cursor-pointer"
                  >
                    Review Incident Dossier
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction("Legal Notice authorized and transmitted.")}
                    className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg shadow-xs transition cursor-pointer"
                  >
                    Authorize Legal Notice
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleAction("Displaying full telemetry log...")}
                  className="text-blue-700 hover:text-blue-900 font-bold text-xs flex items-center gap-1 transition self-end sm:self-center cursor-pointer"
                >
                  <span>View Full Telemetry Log</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 2: High Conduct Escalation (Yellow/Amber Accent) */}
            <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-xs space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>
              {/* Header Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                    HIGH CONDUCT ESCALATION
                  </span>
                  <span className="font-mono font-bold text-slate-700">INC-2024-0039</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-semibold text-slate-600">East Quad • Res Hall C, 3rd Floor</span>
                </div>
                <span className="text-slate-500 font-medium flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3 text-slate-400" />
                  13:54 EST (58m ago)
                </span>
              </div>

              {/* Title & Body */}
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Student Conduct Escalation: Residence Hall C Common Lounge Altercation
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Physical altercation between registered residents reported by RA T. Morales. Two students separated and temporarily isolated in proctor-designated quiet suites. Medical triage cleared minor abrasions. Hearing recommendation submitted.
                </p>
              </div>

              {/* Inset Box: RA Morales info */}
              <div className="p-3 bg-amber-50/50 border border-amber-200/80 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-xs">
                    TM
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">
                      Filed by RA T. Morales (Student Life ID #4091)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Proctorial Hearing recommended within 24h + No Weapons Identified
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200 shrink-0">
                  DSW Welfare Level 2
                </span>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAction("Scheduling Emergency Proctorial Hearing...")}
                    className="px-3.5 py-1.5 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg shadow-xs transition cursor-pointer"
                  >
                    Schedule Emergency Hearing
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction("Student Affairs notified via priority memo.")}
                    className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg transition cursor-pointer"
                  >
                    Notify Student Affairs
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleAction("Opening RA Incident Narrative...")}
                  className="text-blue-700 hover:text-blue-900 font-bold text-xs flex items-center gap-1 transition self-end sm:self-center cursor-pointer"
                >
                  <span>View RA Incident Narrative</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 3: Kiosk Telemetry • Medium (Blue Accent) */}
            <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-xs space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600"></div>
              {/* Header Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    KIOSK TELEMETRY • MEDIUM
                  </span>
                  <span className="font-mono font-bold text-slate-700">STAFF-CHECKIN-208</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-semibold text-slate-600">Post 14 • Engineering Arch</span>
                </div>
                <span className="text-slate-500 font-medium flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3 text-slate-400" />
                  13:30 EST (1h 22m ago)
                </span>
              </div>

              {/* Title & Body */}
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Biometric Guard Kiosk Check-In Timeout: Officer D. Thorne (+18m Overdue)
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Scheduled 13:15 check-in missed at Engineering Arch Guard Booth. Secondary patrol unit was dispatched automatically. Standby Officer M. Hernandez confirmed on-site handoff; Officer Thorne reported brief radio malfunction during shift relief.
                </p>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAction("Guard relief handoff acknowledged.")}
                    className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg transition cursor-pointer"
                  >
                    Acknowledge Handoff
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction("Opening Officer Thorne check-in log...")}
                    className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg transition cursor-pointer"
                  >
                    Review Thorne Log
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 self-end sm:self-center">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Booth Manning Restored</span>
                </div>
              </div>
            </div>

            {/* Card 4: Routine Traffic Sentinel (Green Accent) */}
            <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-xs space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>
              {/* Header Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    ROUTINE TRAFFIC SENTINEL
                  </span>
                  <span className="font-mono font-bold text-slate-700">TRAF-SENT-04</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-semibold text-slate-600">South Campus Transit Hub</span>
                </div>
                <span className="text-slate-500 font-medium flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3 text-slate-400" />
                  12:45 EST (2h 07m ago)
                </span>
              </div>

              {/* Title & Body */}
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Zone N Parking Facility Over-Capacity: Dynamic Signage Activated
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Facility reached 96% bay occupancy at 12:44. Automated VMS roadside sign redirected incoming faculty &amp; visitor traffic to Lot C Multi-Tier Deck. Traffic flow normalized; zero gridlock detected by perimeter radar.
                </p>
              </div>

              {/* Footer row */}
              <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-blue-600" />
                  <span>Automated detour active • Lot C capacity currently at 42%</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                  AUTO-RESOLVED
                </span>
              </div>
            </div>
          </div>

          {/* Stream Footer Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 text-xs text-slate-500">
            <div>
              Showing 4 of 18 live proctorial events • Auto-syncing every 10s
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-300 font-semibold cursor-not-allowed"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => handleAction("Loading page 2 of events...")}
                className="px-3 py-1.5 rounded-lg bg-[#0a2f77] hover:bg-[#082660] text-white font-bold transition shadow-xs cursor-pointer"
              >
                Next Page
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CHANNELS & HOTLINE */}
        <div className="space-y-5">
          {/* Card 1: Proctorial Alert Channels */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-blue-700" />
                <h2 className="text-sm font-bold text-slate-900">
                  Proctorial Alert Channels
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                LIVE GATEWAY
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-snug">
              Direct escalation routing rules for Proctor &amp; Dean Arthur Vance during Active Duty shifts.
            </p>

            <div className="space-y-3 text-xs">
              {/* Channel 1: SMS */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-bold text-slate-900">SMS Push to Executive Phone</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    +1 (555) 019-9022 • High / Crit only
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleChannel("sms")}
                  className={`w-11 h-6 rounded-full p-1 transition cursor-pointer ${
                    channels.sms ? "bg-[#0a2f77]" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      channels.sms ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></div>
                </button>
              </div>

              {/* Channel 2: Voice */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-bold text-slate-900">Automated Voice Call Tree</div>
                  <div className="text-[11px] text-slate-500">
                    Level 1 breaches trigger phone call
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleChannel("voice")}
                  className={`w-11 h-6 rounded-full p-1 transition cursor-pointer ${
                    channels.voice ? "bg-[#0a2f77]" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      channels.voice ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></div>
                </button>
              </div>

              {/* Channel 3: Email */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-bold text-slate-900">Email Incident Dossier Digest</div>
                  <div className="text-[11px] text-slate-500">
                    Batch transmission hourly
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleChannel("email")}
                  className={`w-11 h-6 rounded-full p-1 transition cursor-pointer ${
                    channels.email ? "bg-[#0a2f77]" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      channels.email ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></div>
                </button>
              </div>

              {/* Channel 4: Radio */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-bold text-slate-900">Direct Radio NOC Bridge</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Encrypted Motorola APX channel 2
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleChannel("radio")}
                  className={`w-11 h-6 rounded-full p-1 transition cursor-pointer ${
                    channels.radio ? "bg-[#0a2f77]" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      channels.radio ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></div>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleAction("Device Routing Matrix configuration opened.")}
              className="w-full py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg transition shadow-xs cursor-pointer text-center"
            >
              Manage Device Routing Matrix
            </button>
          </div>

          {/* Card 2: Executive Hotline Connect */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-blue-700" />
                <h2 className="text-sm font-bold text-slate-900">
                  Executive Hotline Connect
                </h2>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            <p className="text-xs text-slate-500 leading-snug">
              Priority-switched one-touch dispatch lines bypassing external university switchboard.
            </p>

            <div className="space-y-2.5 text-xs">
              {/* Line 1: NOC */}
              <div
                onClick={() => handleAction("Dialing Campus Police NOC (Ext 9110)...")}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/50 hover:border-blue-200 transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Campus Police NOC</div>
                    <div className="text-[11px] text-slate-500">Primary Dispatch Desk</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-800 font-mono font-bold text-xs border border-blue-100">
                  EXT 9110
                </span>
              </div>

              {/* Line 2: Dean of Students */}
              <div
                onClick={() => handleAction("Dialing Dean of Students Office (Ext 4402)...")}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/50 hover:border-blue-200 transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Dean of Students Office</div>
                    <div className="text-[11px] text-slate-500">Executive Secretariat</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-800 font-mono font-bold text-xs border border-blue-100">
                  EXT 4402
                </span>
              </div>

              {/* Line 3: Municipal 911 */}
              <div
                onClick={() => handleAction("Connecting direct secure line to Metro 911 Precinct 4...")}
                className="p-3 rounded-xl border border-red-200 bg-red-50/40 hover:bg-red-50 transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Municipal Dispatch (911 Direct)</div>
                    <div className="text-[11px] text-slate-500">Metro Precinct 4 Liaison</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-red-100 text-red-800 font-mono font-bold text-xs border border-red-200">
                  PRIORITY 1
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
