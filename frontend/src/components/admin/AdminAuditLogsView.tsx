"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Download,
  Search,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ExternalLink,
  ChevronDown,
  ShieldAlert,
  Copy,
  FileText,
  Fingerprint,
  Radio,
  Ban,
  Filter,
  Key
} from "lucide-react";

interface AuditLogRecord {
  id: string;
  time: string;
  date: string;
  severity: "INFO" | "ALERT" | "WARNING" | "SUCCESS";
  title: string;
  description: string;
  actorName: string;
  actorSub: string;
  actorAvatar: string;
  actorBg: string;
  target: string;
  targetSub: string;
  targetSubRed?: boolean;
  sourceIP: string;
  sourceNode: string;
  ipRed?: boolean;
  proofType: "payload_check" | "case_button" | "ip_block" | "payload_key" | "hash_copy" | "session_bio";
}

const AUDIT_RECORDS: AuditLogRecord[] = [
  {
    id: "rec-1",
    time: "14:15:22",
    date: "24 Oct 2026",
    severity: "INFO",
    title: "Roster Telemetry Sync Completed",
    description: "Shift B (26 guard posts reporting, Gate 04 active, 2 priority alerts)",
    actorName: "Elena Rostova",
    actorSub: "Supervisor • #SS-104",
    actorAvatar: "SS",
    actorBg: "bg-slate-200 text-slate-800",
    target: "Gate 04 Post Roster",
    targetSub: "Telemetry Cluster B",
    sourceIP: "10.24.110.14",
    sourceNode: "Dispatch Kiosk-02",
    proofType: "payload_check",
  },
  {
    id: "rec-2",
    time: "13:42:09",
    date: "24 Oct 2026",
    severity: "ALERT",
    title: "High Severity Incident Escalation Triggered",
    description: "Gate 07 North Quad Perimeter Barrier • Unauthorized Entry Attempt",
    actorName: "Marcus Vance",
    actorSub: "Security Guard • #GRD-4082",
    actorAvatar: "DM",
    actorBg: "bg-rose-100 text-rose-800",
    target: "Barrier Gate #07",
    targetSub: "Protocol Level 1 Lock Initiated",
    targetSubRed: true,
    sourceIP: "10.24.112.68",
    sourceNode: "Patrol Unit Mobile-04",
    proofType: "case_button",
  },
  {
    id: "rec-3",
    time: "12:04:18",
    date: "24 Oct 2026",
    severity: "WARNING",
    title: "Failed Administrative Authentication (3 attempts)",
    description: "Exceeded threshold rate • Target URI rejected signature handshake",
    actorName: "External Candidate",
    actorSub: "Unknown Actor • Unverified",
    actorAvatar: "??",
    actorBg: "bg-amber-100 text-amber-800",
    target: "/api/v1/auth/seed-verify",
    targetSub: "Admin Root Endpoint",
    sourceIP: "198.51.100.42",
    sourceNode: "WAN Gateway • Throttled",
    ipRed: true,
    proofType: "ip_block",
  },
  {
    id: "rec-4",
    time: "10:12:45",
    date: "24 Oct 2026",
    severity: "SUCCESS",
    title: "Biometric Handshake & Pass Verification",
    description: "Student NFC Token + Facial Template verified in 140ms",
    actorName: "Alex Morgan",
    actorSub: "Student • #STU-88201",
    actorAvatar: "AM",
    actorBg: "bg-blue-100 text-blue-800",
    target: "Science Complex Turnstile B",
    targetSub: "Access Zone: Lab Wings",
    sourceIP: "10.24.108.65",
    sourceNode: "Access Terminal #SC-01",
    proofType: "payload_key",
  },
  {
    id: "rec-5",
    time: "08:30:00",
    date: "24 Oct 2026",
    severity: "INFO",
    title: "Automated Daily Merkle Snapshot Sealed",
    description: "SQLite Dev DB encrypted delta replicated to Postgres Cloud Master",
    actorName: "System Daemon",
    actorSub: "root:cron • #SYS-00",
    actorAvatar: "SYS",
    actorBg: "bg-slate-700 text-white",
    target: "Postgres Primary Cluster",
    targetSub: "Ledger Batch #2026-10-24",
    sourceIP: "127.0.0.1",
    sourceNode: "Local Core Host",
    proofType: "hash_copy",
  },
  {
    id: "rec-6",
    time: "07:54:11",
    date: "24 Oct 2026",
    severity: "SUCCESS",
    title: "Biometric SSO Credential Handshake",
    description: "Officer Marcus Vance verified at Kiosk 04 (SSO Token #AF99)",
    actorName: "Marcus Vance",
    actorSub: "Security Guard • #GRD-4082",
    actorAvatar: "ON",
    actorBg: "bg-blue-100 text-blue-800",
    target: "Guard Shift Console Kiosk-04",
    targetSub: "Token Scope: Perimeter Read/Write",
    sourceIP: "10.24.110.04",
    sourceNode: "Gate 4 Guard Post",
    proofType: "session_bio",
  },
];

export default function AdminAuditLogsView() {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("Today");
  const [selectedSeverity, setSelectedSeverity] = useState("Warning (5)");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

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

      {/* HEIGHTENED SECURITY SCREENING ACTIVE ALERT BANNER */}
      {bannerVisible && (
        <div className="p-3.5 sm:p-4 bg-red-50/90 border border-red-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="flex gap-1 text-red-600">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            </span>
            <div className="text-xs">
              <strong className="text-red-900 uppercase tracking-wide mr-1.5 font-extrabold">
                HEIGHTENED SECURITY SCREENING ACTIVE
              </strong>
              <span className="text-red-700">
                • Level 2 telemetry tracing enforced for Gate 07 North Quad &amp; Admin Endpoints
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs shrink-0 self-end sm:self-center">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-700 font-bold">
              <span>CHAIN ID:</span>
              <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200">
                #SEC-CG-2026-X8
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold text-red-800 bg-red-100 border border-red-200">
              Active Filter Applied
            </span>
            <button
              type="button"
              onClick={() => setBannerVisible(false)}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              title="Dismiss Banner"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* TOP HEADER & CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-rose-700 uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
            <span>CAMPUSGUARD INSTITUTIONAL GOVERNANCE</span>
            <span className="text-slate-300">•</span>
            <span>ROOT ACCESS</span>
            <span className="text-slate-300">•</span>
            <span>CRYPTOGRAPHIC AUDIT</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight mt-1">
            Security Audit Logs &amp; Telemetry Stream
          </h1>
          <p className="text-xs text-slate-500 max-w-3xl mt-0.5 leading-relaxed">
            Tamper-evident real-time record of institutional authentications, role delegations, gate overrides, and critical incident escalations.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>STREAM: LIVE</span>
          </div>

          <button
            type="button"
            onClick={() => handleAction("Merkle root verification executed. Tree height 18 verified intact.")}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>Verify Merkle Tree</span>
          </button>

          <button
            type="button"
            onClick={() => handleAction("Exporting cryptographic full audit archive (JSON-LD)...")}
            className="px-4 py-2 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Full Audit Log</span>
            <ChevronDown className="w-3 h-3 ml-0.5" />
          </button>
        </div>
      </div>

      {/* 3 KPI STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: TOTAL RECORDED EVENTS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Recorded Events
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <div className="my-1">
            <span className="text-3xl font-extrabold text-slate-900 leading-none">40</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Past 30 Days • 0 Dropped Packets</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-blue-700 h-full rounded-full" style={{ width: "95%" }}></div>
          </div>
        </div>

        {/* Card 2: CRITICAL & HIGH ALERTS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Critical &amp; High Alerts
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="my-1">
            <span className="text-3xl font-extrabold text-red-600 leading-none">3 Flagged</span>
            <div className="text-xs text-slate-600 mt-1.5">
              2 Resolved • 1 Under Proctor Review
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-red-600 h-full rounded-full" style={{ width: "35%" }}></div>
          </div>
        </div>

        {/* Card 3: CRYPTOGRAPHIC CHAIN */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Cryptographic Chain
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="my-1">
            <span className="text-3xl font-extrabold text-blue-700 leading-none">Verified Valid</span>
            <div className="text-xs text-slate-600 mt-1.5 font-mono">
              SHA-256 Block #94820 Signed
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: "100%" }}></div>
          </div>
        </div>
      </div>

      {/* SEARCH, TIME SELECTOR & SEVERITY PILLS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by Actor ID, Target Resource, IP Address, or Event Typ"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Time range pills */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            {["Today", "1h", "24h", "7d", "Custom"].map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setTimeFilter(time)}
                className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
                  timeFilter === time
                    ? "bg-white text-slate-900 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {time}
              </button>
            ))}
          </div>

          {/* Categories dropdown */}
          <select className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 cursor-pointer">
            <option>All Event Categories (5)</option>
            <option>Authentication</option>
            <option>Incident Escalation</option>
            <option>Barrier Action</option>
            <option>Merkle Ledger</option>
          </select>
        </div>

        {/* Severity Sub-filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400 mr-1">
              SEVERITY:
            </span>
            {[
              { label: "All Severities (40)", dot: null },
              { label: "Info (40)", dot: "bg-blue-600" },
              { label: "Success (32)", dot: "bg-emerald-600" },
              { label: "Warning (5)", dot: "bg-amber-500" },
              { label: "Alert / Critical (3)", dot: "bg-red-600" },
            ].map((sev) => {
              const isActive = selectedSeverity === sev.label;
              return (
                <button
                  key={sev.label}
                  type="button"
                  onClick={() => setSelectedSeverity(sev.label)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#0a2f77] text-white font-bold shadow-xs"
                      : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {sev.dot && <span className={`w-2 h-2 rounded-full ${sev.dot}`}></span>}
                  <span>{sev.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <RotateCcw className="w-3.5 h-3.5 text-blue-700 animate-spin" />
            <span>Auto-refreshing every 2s</span>
          </div>
        </div>
      </div>

      {/* TAMPER-PROOF AUDIT STREAM TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden space-y-0">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <h3 className="font-bold text-slate-900 text-sm">Tamper-Proof Audit Stream</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
              Ledger Hash Synchronized
            </span>
          </div>
          <div className="text-slate-500 font-medium">
            Showing latest 6 of 148,920 records
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/30">
                <th className="py-3 px-4">TIMESTAMP (PST)</th>
                <th className="py-3 px-4">EVENT TYPE &amp; SEVERITY</th>
                <th className="py-3 px-4">ACTOR &amp; CLEARANCE</th>
                <th className="py-3 px-4">TARGET / RESOURCE</th>
                <th className="py-3 px-4">SOURCE IP &amp; NODE</th>
                <th className="py-3 px-4 text-right">ACTIONS &amp; PROOF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {AUDIT_RECORDS.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/70 transition">
                  {/* Timestamp */}
                  <td className="py-3.5 px-4 align-top whitespace-nowrap font-mono">
                    <div className="font-bold text-slate-900">{rec.time}</div>
                    <div className="text-[11px] text-slate-400">{rec.date}</div>
                  </td>

                  {/* Event Type & Severity */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="flex items-center gap-2 mb-1">
                      {rec.severity === "INFO" && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          INFO
                        </span>
                      )}
                      {rec.severity === "ALERT" && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-100 text-red-700 border border-red-200">
                          ALERT
                        </span>
                      )}
                      {rec.severity === "WARNING" && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          WARNING
                        </span>
                      )}
                      {rec.severity === "SUCCESS" && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          SUCCESS
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-slate-900 leading-tight">
                      {rec.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      {rec.description}
                    </div>
                  </td>

                  {/* Actor & Clearance */}
                  <td className="py-3.5 px-4 align-top whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 ${rec.actorBg}`}
                      >
                        {rec.actorAvatar}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{rec.actorName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{rec.actorSub}</div>
                      </div>
                    </div>
                  </td>

                  {/* Target / Resource */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="font-bold text-slate-900 font-mono text-[11px]">
                      {rec.target}
                    </div>
                    <div
                      className={`text-[11px] mt-0.5 ${
                        rec.targetSubRed ? "text-red-600 font-bold" : "text-slate-500"
                      }`}
                    >
                      {rec.targetSub}
                    </div>
                  </td>

                  {/* Source IP & Node */}
                  <td className="py-3.5 px-4 align-top whitespace-nowrap">
                    <div
                      className={`font-mono text-xs font-bold ${
                        rec.ipRed ? "text-red-600" : "text-slate-900"
                      }`}
                    >
                      {rec.sourceIP}
                    </div>
                    <div
                      className={`text-[11px] mt-0.5 ${
                        rec.ipRed ? "text-red-600 font-semibold" : "text-slate-500"
                      }`}
                    >
                      {rec.sourceNode}
                    </div>
                  </td>

                  {/* Actions & Proof */}
                  <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                    {rec.proofType === "payload_check" && (
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAction("Inspecting telemetry payload...")}
                          className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-blue-700 font-bold text-xs rounded transition shadow-2xs cursor-pointer"
                        >
                          Payload
                        </button>
                        <CheckCircle2 className="w-4 h-4 text-slate-400" />
                      </div>
                    )}

                    {rec.proofType === "case_button" && (
                      <button
                        type="button"
                        onClick={() => handleAction("Opening Case #INC-8481 in incident command...")}
                        className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded transition shadow-2xs flex items-center gap-1.5 cursor-pointer ml-auto"
                      >
                        <span>Case #INC-8481</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}

                    {rec.proofType === "ip_block" && (
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAction("Inspecting IP 198.51.100.42 geolocation & WHOIS...")}
                          className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded transition shadow-2xs cursor-pointer"
                        >
                          Inspect IP
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAction("CIDR block 198.51.100.0/24 added to firewall deny-list.")}
                          className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs rounded transition cursor-pointer"
                        >
                          Block CIDR
                        </button>
                      </div>
                    )}

                    {rec.proofType === "payload_key" && (
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAction("Inspecting biometric authorization ticket...")}
                          className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-blue-700 font-bold text-xs rounded transition shadow-2xs cursor-pointer"
                        >
                          Payload
                        </button>
                        <Key className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    )}

                    {rec.proofType === "hash_copy" && (
                      <div className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                        <span>4f8a...9c2e</span>
                        <button
                          type="button"
                          onClick={() => handleAction("Hash copied to clipboard: 4f8a7e19b024d9c2e")}
                          className="p-0.5 hover:text-blue-700 cursor-pointer"
                          title="Copy Full Hash"
                        >
                          <Copy className="w-3 h-3 text-slate-400" />
                        </button>
                      </div>
                    )}

                    {rec.proofType === "session_bio" && (
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAction("Opening session #AF99 diagnostics...")}
                          className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-blue-700 font-bold text-xs rounded transition shadow-2xs cursor-pointer"
                        >
                          Session
                        </button>
                        <Fingerprint className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-mono text-[11px]">
              Ledger state: <strong className="text-slate-800">Block #94820</strong> (Signed with CampusGuard Institutional RSA-4096)
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              className="px-2.5 py-1 rounded border border-slate-200 text-slate-300 cursor-not-allowed font-semibold"
            >
              Previous
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded bg-[#0a2f77] text-white font-bold flex items-center justify-center shadow-xs"
            >
              1
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold flex items-center justify-center cursor-pointer"
            >
              2
            </button>
            <button
              type="button"
              className="w-7 h-7 rounded border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold flex items-center justify-center cursor-pointer"
            >
              3
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button
              type="button"
              className="w-7 h-7 rounded border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold flex items-center justify-center cursor-pointer"
            >
              5
            </button>
            <button
              type="button"
              className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
