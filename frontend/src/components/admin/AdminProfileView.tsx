"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  RotateCcw,
  Power,
  Database,
  CheckCircle2,
  Trash2,
  CloudDownload,
  AlertTriangle,
  Lock,
  Key,
  Fingerprint,
  Clock,
  Cpu,
  FileCheck,
  UserPlus,
  ShieldAlert,
  Shield,
  ExternalLink
} from "lucide-react";
import { performLogout } from "@/lib/auth";

export default function AdminProfileView() {
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
          <div className="text-[11px] font-bold tracking-wider text-rose-700 uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
            <span>CAMPUSGUARD INSTITUTIONAL GOVERNANCE</span>
            <span className="text-slate-300">•</span>
            <span>ROOT ACCESS</span>
            <span className="text-slate-300">•</span>
            <span>ADMIN PROFILE</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight mt-1">
            System Administrator Identity &amp; Root Governance Dossier
          </h1>
          <p className="text-xs text-slate-500 max-w-3xl mt-0.5 leading-relaxed">
            Institutional master account credentials, cryptographic signing keys, dual-database replication status, and administrative session controls.
          </p>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <div className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
            <Shield className="w-3.5 h-3.5 text-rose-600" />
            <span>Root Clearance: Tier 5 (Master Root)</span>
          </div>

          <button
            type="button"
            onClick={() => handleAction("Master RSA-4096 and ECDSA signing keys rotated.")}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Rotate Master Keys</span>
          </button>

          <button
            type="button"
            onClick={() => performLogout()}
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Power className="w-3.5 h-3.5" />
            <span>Sign Out of Terminal</span>
          </button>
        </div>
      </div>

      {/* TWO COLUMN GRID: LEFT HERO (40%) + RIGHT GOVERNANCE & AUTH (60%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: ADMIN PROFILE CARD */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
            {/* Header Identity */}
            <div className="flex items-start gap-4">
              <div className="relative w-16 h-16 rounded-2xl bg-[#0a2f77] text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md ring-4 ring-blue-50">
                SA
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                    System Administrator
                  </h2>
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  admin@campusguard.edu
                </div>
                <div className="pt-1">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#0a2f77] text-white tracking-wide uppercase shadow-2xs">
                    ADMIN • ROOT GOVERNANCE
                  </span>
                </div>
              </div>
            </div>

            {/* Attributes List */}
            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Institutional Title</span>
                <span className="font-bold text-slate-900">Lead Infrastructure Architect</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Department</span>
                <span className="font-bold text-slate-900">Campus IT &amp; Security Services</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Employee Identifier</span>
                <span className="font-mono font-bold text-slate-900">#ADM-001</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Security Clearance</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                  Level 5 (Unrestricted)
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-slate-500">Last Authentication</span>
                <span className="text-slate-700 font-medium">Today, 08:00 AM PST</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Physical Terminal Kiosk</span>
                <span className="font-mono text-slate-700">Terminal #ROOT-01</span>
              </div>
            </div>

            {/* Access Level Scope */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                ACCESS LEVEL SCOPE
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                  Dual-DB Root
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                  Emergency Override
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                  Seed Rebalancer
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PERSISTENCE & 2FA ENFORCEMENT */}
        <div className="lg:col-span-7 space-y-5">
          {/* CARD 1: DATA PERSISTENCE & SEED GOVERNANCE */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-blue-700" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    Data Persistence &amp; Seed Governance
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Control development datasets, synchronization integrity, and session cache.
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800 shrink-0">
                Dual-DB: SQLite (Dev) / Postgres (Prod)
              </span>
            </div>

            {/* 4 Action Boxes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              {/* Box 1: Verify Seed Accounts */}
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/70 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <ShieldCheck className="w-4 h-4 text-blue-700" />
                    <span>Verify Seed Accounts</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Checks default credentials for Student, Proctor, Guard, Supervisor, Admin.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAction("All 5 Seed accounts verified successfully. Credentials valid.")}
                  className="text-blue-700 hover:text-blue-900 font-bold text-xs flex items-center gap-1 self-start cursor-pointer"
                >
                  <span>Run Verification (5 Seeds)</span>
                  <span>&gt;</span>
                </button>
              </div>

              {/* Box 2: Clear Expired Sessions */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <RotateCcw className="w-4 h-4 text-slate-700" />
                    <span>Clear Expired Sessions</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Purges idle session tokens older than 24 hours across all web kiosks.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAction("28 idle session tokens purged successfully.")}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg transition shadow-2xs flex items-center justify-between cursor-pointer"
                >
                  <span>Flush Inactive Tokens</span>
                  <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              {/* Box 3: Trigger DB Snapshot */}
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/70 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <CloudDownload className="w-4 h-4 text-blue-700" />
                    <span>Trigger DB Snapshot</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Generates AES-256 encrypted point-in-time image to offline vault.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAction("Point-in-time snapshot created: SNAP-2026-10-05.enc (38 MB).")}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg transition shadow-2xs flex items-center justify-between cursor-pointer"
                >
                  <span>Snapshot SQLite &amp; Postgres</span>
                  <CloudDownload className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              {/* Box 4: Global Revocation (Red Alert Box) */}
              <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-red-900">
                    <RotateCcw className="w-4 h-4 text-red-600" />
                    <span>Global Revocation</span>
                  </div>
                  <p className="text-[11px] text-red-700 leading-relaxed">
                    Emergency flush of all JWT access tokens requiring immediate re-login.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAction("All active user tokens revoked. Global re-authentication enforced.")}
                  className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-lg transition shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Execute Emergency Revoke</span>
                </button>
              </div>
            </div>
          </div>

          {/* CARD 2: AUTHENTICATION & 2FA ENFORCEMENT */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Authentication &amp; 2FA Enforcement
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Institutional password policies, multi-factor hardware, and biometric bindings.
              </p>
            </div>

            {/* 4 Security Policies Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              {/* Item 1: Master Admin Password */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  MASTER ADMIN PASSWORD
                </div>
                <div className="font-mono text-slate-900 tracking-widest text-sm font-bold">
                  ••••••••••••••••••••
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Last rotated 14 days ago (Meets 24-char entropy requirement).
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => handleAction("Admin password update dialog opened.")}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Lock className="w-3 h-3 text-slate-500" />
                    <span>Update Password</span>
                  </button>
                </div>
              </div>

              {/* Item 2: Hardware MFA Policy */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    HARDWARE MFA POLICY
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                    Enforced Level 4
                  </span>
                </div>
                <div className="font-bold text-slate-900 text-sm">
                  FIDO2 / WebAuthn Active
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Requires physical key presence for administrative configuration mutations.
                </p>
                <div className="pt-1 text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Backup Token Paired (Key #2)</span>
                </div>
              </div>

              {/* Item 3: Biometric SSO Access */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    BIOMETRIC SSO ACCESS
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800">
                    Verified
                  </span>
                </div>
                <div className="font-bold text-slate-900 text-sm">
                  Terminal Kiosk 01 Bound
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Hardware TPM and facial biometric reader validated for physical entry.
                </p>
                <div className="pt-1 text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                  <Fingerprint className="w-3.5 h-3.5 text-blue-700" />
                  <span>Valid through 18:00 PST</span>
                </div>
              </div>

              {/* Item 4: Session Idle Timeout */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  SESSION IDLE TIMEOUT
                </div>
                <div className="p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-900 text-xs">
                  15 Minutes Inactivity (Strict Policy)
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Automatic terminal lockdown occurs when inactivity timer expires.
                </p>
              </div>
            </div>
          </div>

          {/* CARD 3: ELEVATED ADMINISTRATIVE PERMISSIONS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-blue-700" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    Elevated Administrative Permissions
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Explicit grant matrix tied to ID #ADM-001 under Institutional Charter.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">
                4 / 4 GRANTED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              {/* Permission 1 */}
              <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200/70 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-blue-700" />
                  <span>Root Infrastructure Controller</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Full read/write permissions for database clustering, schema, and API bindings.
                </p>
              </div>

              {/* Permission 2 */}
              <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200/70 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-blue-700" />
                  <span>Tamper-Evident Audit Signer</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Authority to seal and sign cryptographically append-only security logs.
                </p>
              </div>

              {/* Permission 3 */}
              <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200/70 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <UserPlus className="w-3.5 h-3.5 text-blue-700" />
                  <span>Institutional User Provisioning</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Direct issuance of Student, Proctor, Guard, and Supervisor credentials.
                </p>
              </div>

              {/* Permission 4 */}
              <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/80 space-y-1">
                <div className="font-bold text-rose-900 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  <span>Barrier Emergency Override</span>
                </div>
                <p className="text-[11px] text-rose-700 leading-relaxed">
                  Level 1-3 instant perimeter lockout and automated lockdown actuation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
