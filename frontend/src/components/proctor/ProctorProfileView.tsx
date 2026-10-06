"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Key,
  ShieldCheck,
  Edit3,
  Mail,
  Building,
  PhoneCall,
  Shield,
  BarChart3,
  RotateCcw,
  Clock,
  Filter,
  Monitor,
  AlertTriangle,
  FileText,
  Lock,
  Download,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

export default function ProctorProfileView() {
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

      {/* TOP HEADER & ACTION BUTTONS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
            <span>STATUTORY AUTHORITY REGISTER</span>
            <span className="text-slate-400">&gt;</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight mt-1">
            Executive Proctor &amp; Dean of Student Welfare Command Dossier
          </h1>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => handleAction("Security Token renewed. PKI certificates refreshed.")}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-slate-500" />
            <span>Renew Security Token</span>
          </button>
          <button
            type="button"
            onClick={() => handleAction("Exporting comprehensive executive audit log (CSV/PDF)...")}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Full Audit</span>
          </button>
          <button
            type="button"
            onClick={() => handleAction("Opening Executive Profile editor...")}
            className="px-4 py-2 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Executive Profile</span>
          </button>
        </div>
      </div>

      {/* TWO COLUMN GRID: LEFT HERO & TELEMETRY (65%) + RIGHT AUDIT & STATION (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: HERO + STATUTORY PURVIEW + CHART */}
        <div className="lg:col-span-2 space-y-5">
          {/* 1. HERO BANNER: DR. ARTHUR VANCE */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#061c47] via-[#0a2f77] to-[#124294] text-white p-6 shadow-md border border-blue-900/40">
            {/* Background Emblem Watermark */}
            <div className="absolute right-0 top-0 translate-x-10 -translate-y-8 pointer-events-none opacity-10">
              <Shield className="w-72 h-72 text-white" />
            </div>

            <div className="relative z-10 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                {/* Photo with Overlay Badge */}
                <div className="relative shrink-0 w-24 h-24 rounded-2xl overflow-hidden ring-3 ring-white/20 bg-slate-900 shadow-lg">
                  <Image
                    src="/proctor-vance.jpg"
                    alt="Dr. Arthur Vance"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <div className="absolute bottom-1 right-1 w-6 h-6 rounded-md bg-[#0a2f77] text-white flex items-center justify-center shadow-xs ring-1 ring-white/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Name & Title */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/15 text-white border border-white/20">
                      BADGE #PR-109
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      ACTIVE: ON DUTY
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                    Dr. Arthur Vance, Ph.D.
                  </h2>
                  <p className="text-xs sm:text-sm text-blue-100 font-medium">
                    Executive University Proctor • Dean of Student Welfare
                  </p>
                </div>
              </div>

              {/* Bottom Strip: NetID, Chambers, Hotline */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/15 bg-black/15 backdrop-blur-xs rounded-xl p-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                    Institutional NetID
                  </div>
                  <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5 mt-0.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                    <span>a.vance@campusguard.edu</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                    Proctorial Chambers
                  </div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                    <span>Admin Hall, DSW-101</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                    Priority Direct Hotline
                  </div>
                  <div className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5 mt-0.5">
                    <PhoneCall className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                    <span>Ext : x4099</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. STATUTORY AUTHORITY & PURVIEW */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    Statutory Authority &amp; Purview
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    University Statutes Title IV &amp; Chancellor Executive Order #12
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                LEVEL 4 DISCRETION
              </span>
            </div>

            {/* 4 Purview Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Jurisdiction
                </div>
                <div className="text-2xl font-extrabold text-slate-900 leading-none">
                  6
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Active Zones
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Perimeter Gates
                </div>
                <div className="text-2xl font-extrabold text-slate-900 leading-none">
                  26
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Checkpoints Under Purview
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Discipline
                </div>
                <div className="text-2xl font-extrabold text-slate-900 leading-none">
                  Final
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Conduct Adjudication
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Lockdown
                </div>
                <div className="text-2xl font-extrabold text-red-600 leading-none">
                  Tier-1
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Direct Override Key
                </div>
              </div>
            </div>
          </div>

          {/* 3. TERM ADJUDICATION & OVERSIGHT TELEMETRY + CHART */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    Term Adjudication &amp; Oversight Telemetry
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Current Academic Term (Fall 2024 - Spring 2025)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleAction("Live Telemetry data synchronized.")}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Live Sync</span>
              </button>
            </div>

            {/* 3 Summary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Cases Reviewed
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900">142</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    98.2% Resolution
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#0a2f77] h-full rounded-full" style={{ width: "98.2%" }}></div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Directives Issued
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900">14</span>
                  <span className="text-xs font-semibold text-slate-600">
                    Emergency Protocols
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: "70%" }}></div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Unadjudicated Breaches
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900">0</span>
                  <span className="text-xs font-bold text-emerald-700">Clean Ledger</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>
            </div>

            {/* CHART SECTION */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  6-Month Disciplinary Disposition Volume &amp; Resolution Rate
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0a2f77]"></span>
                    <span className="text-slate-600">Closed Cases</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                    <span className="text-slate-600">Directives</span>
                  </div>
                </div>
              </div>

              {/* Responsive SVG Line Chart */}
              <div className="w-full h-48 bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between">
                <svg className="w-full h-32 overflow-visible" viewBox="0 0 600 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0a2f77" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#0a2f77" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  <line x1="0" y1="20" x2="600" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="0" y1="60" x2="600" y2="60" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="0" y1="100" x2="600" y2="100" stroke="#e2e8f0" strokeDasharray="3 3" />

                  {/* Gradient Area under line */}
                  <polygon
                    points="0,95 100,82 200,70 300,58 400,48 500,40 600,32 600,120 0,120"
                    fill="url(#chartGradient)"
                  />

                  {/* Directives line (Sky blue) */}
                  <polyline
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                    points="0,110 100,105 200,98 300,95 400,90 500,85 600,82"
                  />

                  {/* Closed Cases primary curve (Dark blue) */}
                  <polyline
                    fill="none"
                    stroke="#0a2f77"
                    strokeWidth="3"
                    points="0,95 100,82 200,70 300,58 400,48 500,40 600,32"
                  />

                  {/* Data Points */}
                  {[
                    { cx: 0, cy: 95 },
                    { cx: 100, cy: 82 },
                    { cx: 200, cy: 70 },
                    { cx: 300, cy: 58 },
                    { cx: 400, cy: 48 },
                    { cx: 500, cy: 40 },
                    { cx: 600, cy: 32 },
                  ].map((pt, i) => (
                    <circle
                      key={i}
                      cx={pt.cx}
                      cy={pt.cy}
                      r="4.5"
                      fill="#0a2f77"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  ))}
                </svg>

                {/* X-Axis Month Labels */}
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pt-2 border-t border-slate-200">
                  <span>NOV</span>
                  <span>DEC</span>
                  <span>JAN</span>
                  <span>FEB</span>
                  <span>MAR</span>
                  <span>APR</span>
                  <span className="text-[#0a2f77] font-extrabold">MAY (RUNNING)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AUDIT LOG & STATION LINK */}
        <div className="space-y-5">
          {/* Card 1: Executive Action Audit Log */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-700" />
                <h2 className="text-sm font-bold text-slate-900">
                  Executive Action Audit Log
                </h2>
              </div>
              <button
                type="button"
                onClick={() => handleAction("Audit log filters opened.")}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
              >
                <Filter className="w-3 h-3" />
                <span>FILTER</span>
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-snug">
              Immutable ledger of signatures &amp; interventions
            </p>

            <div className="space-y-4 text-xs">
              {/* Log 1 */}
              <div className="space-y-1 relative pl-4 border-l-2 border-blue-700">
                <span className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-blue-700"></span>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">Authorized Barrier Review</h4>
                  <span className="text-[11px] text-slate-400 font-mono">Today, 14:28</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Investigative bypass authorization granted for <strong className="text-slate-800">Gate 07</strong> breach forensic download.
                </p>
              </div>

              {/* Log 2 */}
              <div className="space-y-1 relative pl-4 border-l-2 border-blue-700">
                <span className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-blue-700"></span>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">Signed Disciplinary Exclusion Order</h4>
                  <span className="text-[11px] text-slate-400 font-mono">Today, 11:30</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Affixed PKI digital seal to Exclusion Order <strong className="text-slate-800">#EX-2025-11</strong> (North Quadrant perimeter).
                </p>
              </div>

              {/* Log 3 */}
              <div className="space-y-1 relative pl-4 border-l-2 border-blue-700">
                <span className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-blue-700"></span>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">Convened Emergency Welfare Panel</h4>
                  <span className="text-[11px] text-slate-400 font-mono">Yesterday, 16:45</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Executive session for Birch Hall residential dispute resolution; provisional housing transfer sanctioned.
                </p>
              </div>

              {/* Log 4 */}
              <div className="space-y-1 relative pl-4 border-l-2 border-blue-700">
                <span className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-blue-700"></span>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">Shift B Contingency Staffing Directive</h4>
                  <span className="text-[11px] text-slate-400 font-mono">Yesterday, 09:15</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Approved 4-officer auxiliary patrol complement for Founder&apos;s Plaza public assembly.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Terminal & Station Link */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-blue-700" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    Terminal &amp; Station Link
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Console Session #SEC-88219-DSW
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                SECURE IP: 10.240.12.1
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Active Terminal
                </div>
                <div className="font-bold text-slate-900 mt-0.5">
                  Console DSW-09
                </div>
                <div className="text-[11px] text-slate-500">
                  Hall of Admin 1st Fl
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Auth Protocol
                </div>
                <div className="font-bold text-emerald-700 mt-0.5">
                  Enforced 2FA Bio
                </div>
                <div className="text-[11px] text-slate-500">
                  Heartbeat Valid
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Danger / Emergency Transfer Box */}
          <button
            type="button"
            onClick={() => handleAction("Emergency Proctorial Command Transfer protocol initiated.")}
            className="w-full bg-red-50/70 hover:bg-red-100/70 border border-red-200/90 rounded-2xl p-4 flex items-center justify-center gap-2.5 text-red-700 font-bold text-xs shadow-xs transition cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>Emergency Transfer of Proctorial Command</span>
          </button>
        </div>
      </div>
    </div>
  );
}
