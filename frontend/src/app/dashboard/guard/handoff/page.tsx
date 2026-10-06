"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Shield,
  Bell,
  Clock,
  Fingerprint,
  MapPin,
  MessageSquare,
  Info,
  Lock,
  RotateCcw,
  CheckCircle2,
  Battery,
  SlidersHorizontal,
  LogOut,
  UserCheck,
  KeyRound,
  Check,
  Radio,
  FileCheck2,
  AlertCircle
} from "lucide-react";
import { performLogout } from "@/lib/auth";

export default function GuardHandoffPage() {
  // Real-time ticking countdown simulation for the transfer target
  const [secondsRemaining, setSecondsRemaining] = useState(17 * 60 + 41); // 00:17:41
  const [acknowledged, setAcknowledged] = useState(true);
  const [checklist, setChecklist] = useState({
    radio: true,
    keys: true,
    terminal: true,
    barrier: true,
  });
  const [isSealed, setIsSealed] = useState(false);
  const [showSealModal, setShowSealModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  const handleSealHandoff = () => {
    setShowSealModal(true);
  };

  const confirmSeal = () => {
    setIsSealed(true);
    setShowSealModal(false);
  };

  const toggleChecklist = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
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
                className="py-5 relative transition cursor-pointer text-[#1a44c2] font-bold border-b-2 border-[#1a44c2]"
              >
                Handoff
              </Link>
              <Link
                href="/dashboard/guard"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Parking
              </Link>
              <Link
                href="/dashboard/guard"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Incidents
              </Link>
              <Link
                href="/dashboard/guard"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Notifications
              </Link>
              <Link
                href="/dashboard/guard"
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
            <div className="relative">
              <button
                type="button"
                aria-label="Notifications"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
              >
                <Bell className="w-4 h-4" />
              </button>
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                3
              </span>
            </div>

            {/* Officer Profile Badge */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#0a2f77] text-white flex items-center justify-center font-bold text-xs">
                <UserCheck className="w-4 h-4" />
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

      {/* 2. BODY LAYOUT: SIDEBAR + MAIN CONTENT */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* LEFT SIDEBAR: GUARD NAVIGATION */}
        <aside className="w-60 shrink-0 hidden md:block bg-white border-r border-slate-200/90 min-h-[calc(100vh-64px)] p-4">
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
              className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-bold bg-[#1a44c2] text-white shadow-xs"
            >
              Handoff
            </Link>

            <Link
              href="/dashboard/guard"
              className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
            >
              Parking
            </Link>

            <Link
              href="/dashboard/guard"
              className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
            >
              Incidents
            </Link>

            <Link
              href="/dashboard/guard"
              className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
            >
              Notifications
            </Link>

            <Link
              href="/dashboard/guard"
              className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
            >
              Profile
            </Link>
          </nav>
        </aside>

        {/* MAIN HANDOFF CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Top Title & Target Countdown Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              {/* Badges / Breadcrumbs */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 tracking-wide uppercase">
                  <span className="w-2 h-2 rounded-full bg-[#1a44c2]"></span>
                  GATE 04 NORTH ACADEMIC QUAD
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                  Protocol CG-H7
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Shift Handoff & Transfer of Custody
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-normal mt-1 max-w-2xl leading-relaxed">
                Shift B (Day Patrol) transitioning to Shift C (Evening Perimeter). Operational post custody transfer in progress.
              </p>
            </div>

            {/* Target Countdown Box */}
            <div className="bg-[#f0f5ff] border border-blue-200/70 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-2xs shrink-0">
              <div className="w-11 h-11 rounded-xl bg-[#1a44c2] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">
                  SCHEDULED TRANSFER TARGET (16:00:00)
                </div>
                <div className="flex items-baseline mt-0.5">
                  <span className="font-mono font-black text-2xl text-[#0a2f77] tracking-tight">
                    {formatCountdown(secondsRemaining)}
                  </span>
                  <span className="text-xs text-slate-500 font-medium ml-1.5">
                    remaining
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* TWO-COLUMN WORKFLOW GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ================= LEFT COLUMN ================= */}
            <div className="lg:col-span-5 space-y-6">
              {/* CARD 1: Reliever Verification */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-[#1a44c2]" />
                    <h2 className="text-base font-bold text-slate-900">
                      Reliever Verification
                    </h2>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700 tracking-wider uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    ARRIVED & STAGED
                  </span>
                </div>

                {/* Reliever Officer Profile Card */}
                <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl p-3.5 flex items-center gap-3.5">
                  <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-slate-200 shadow-2xs bg-slate-200">
                    <Image
                      src="/officer-jenkins.jpg"
                      alt="Officer S. Jenkins"
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#1a44c2] text-white flex items-center justify-center ring-2 ring-white">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      INCOMING RELIEVER
                    </div>
                    <div className="text-base font-bold text-slate-900 leading-tight">
                      Officer S. Jenkins
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs">
                      <span className="font-bold text-[#1a44c2]">
                        Shield #4120
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600 font-medium">
                        Patrol Unit 02
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verification Points List */}
                <div className="space-y-3 pt-1">
                  {/* Biometric Clearance */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Fingerprint className="w-4 h-4 text-slate-500" />
                      <span>Biometric Clearance:</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      Verified (15:52:19 EST)
                    </span>
                  </div>

                  {/* Physical Presence */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span>Physical Presence:</span>
                    </div>
                    <span className="font-bold text-[#1a44c2]">
                      Gate 04 Guard Shack
                    </span>
                  </div>

                  {/* Briefing Status */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <MessageSquare className="w-4 h-4 text-slate-500" />
                      <span>Briefing Status:</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      Verbal Recap Complete
                    </span>
                  </div>
                </div>

                {/* Callout Notice */}
                <div className="bg-blue-50/70 border border-blue-200/60 rounded-xl p-3 flex items-start gap-2.5 text-xs text-blue-900">
                  <Info className="w-4 h-4 text-[#1a44c2] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Incoming officer credentials and duty qualification validated against dispatch registry for Shift C.
                  </p>
                </div>
              </div>

              {/* CARD 2: Dual Custody Authorization */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#1a44c2]" />
                    <h2 className="text-base font-bold text-slate-900">
                      Dual Custody Authorization
                    </h2>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    STEP 2 OF 2
                  </span>
                </div>

                {/* Outgoing Officer Box */}
                <div className="bg-[#f0f5ff]/60 border border-blue-100 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                      <UserCheck className="w-4 h-4 text-[#1a44c2]" />
                      <span>Outgoing: Officer M. Vance (#4082)</span>
                    </div>
                    <span className="bg-blue-100/90 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      PIN Verified
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[11px] text-slate-500">
                      Signature Auth Key:
                    </span>
                    <span className="font-mono font-bold text-xs text-slate-900">
                      AUTH-8820-MV-OK
                    </span>
                  </div>
                </div>

                {/* Incoming Officer Acceptance Box */}
                <div className="bg-blue-50/50 border border-blue-200/70 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Shield className="w-4 h-4 text-[#1a44c2]" />
                    <span>Incoming Acceptance: Officer S. Jenkins</span>
                  </div>

                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={acknowledged}
                      onChange={(e) => setAcknowledged(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center shrink-0 transition ${
                        acknowledged
                          ? "bg-[#1a44c2] border-[#1a44c2] text-white"
                          : "bg-white border-slate-300"
                      }`}
                    >
                      {acknowledged && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs text-slate-700 leading-relaxed font-medium">
                      I acknowledge physical receipt of all listed master keys, active radios, barrier controls, and open incident logs for Gate 04.
                    </span>
                  </label>
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={handleSealHandoff}
                  disabled={!acknowledged || isSealed}
                  className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer ${
                    isSealed
                      ? "bg-emerald-600 text-white"
                      : acknowledged
                      ? "bg-[#1a44c2] hover:bg-[#1538a6] text-white active:scale-[0.99]"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {isSealed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Shift Handoff Sealed & Archived</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Complete & Seal Shift Handoff</span>
                    </>
                  )}
                </button>

                {/* Card Footer Telemetry */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <span className="text-slate-500 font-medium">
                    NOC Auto-Telemetry
                  </span>
                  <div className="flex items-center gap-1.5 text-blue-700 font-bold">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                    <span>Sync Armed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= RIGHT COLUMN ================= */}
            <div className="lg:col-span-7 space-y-6">
              {/* CARD 1: Handover Verification Checklist */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-[#1a44c2]" />
                    <div>
                      <h2 className="text-base font-bold text-slate-900 leading-tight">
                        Handover Verification Checklist
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Physical terminal assets, barrier infrastructure, and ongoing perimeter logs.
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 border border-blue-200 text-blue-700 shrink-0">
                    <span>All 7 Required Points Verified</span>
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  </span>
                </div>

                {/* Section Title */}
                <div className="pt-2">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800">
                    1. HARDWARE & MASTER KEYS PHYSICAL CUSTODY
                  </div>
                </div>

                {/* 2x2 Assets Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Item 1: Radio Handheld Unit */}
                  <div
                    onClick={() => toggleChecklist("radio")}
                    className="bg-[#f8fafc] border border-slate-200/80 hover:border-blue-300 rounded-xl p-3.5 flex items-start justify-between gap-3 cursor-pointer transition select-none"
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center shrink-0 transition ${
                          checklist.radio
                            ? "bg-[#1a44c2] border-[#1a44c2] text-white"
                            : "bg-white border-slate-300"
                        }`}
                      >
                        {checklist.radio && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">
                          Radio Handheld Unit (Ch 4)
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Serial #RAD-0441 • Tactical Audio
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-[#1a44c2] shrink-0">
                      <Battery className="w-4 h-4" />
                      <span>88%</span>
                    </div>
                  </div>

                  {/* Item 2: Master Gate Key Ring #04 */}
                  <div
                    onClick={() => toggleChecklist("keys")}
                    className="bg-[#f8fafc] border border-slate-200/80 hover:border-blue-300 rounded-xl p-3.5 flex items-start justify-between gap-3 cursor-pointer transition select-none"
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center shrink-0 transition ${
                          checklist.keys
                            ? "bg-[#1a44c2] border-[#1a44c2] text-white"
                            : "bg-white border-slate-300"
                        }`}
                      >
                        {checklist.keys && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">
                          Master Gate Key Ring #04
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Brass Set (Quad, Knox, Bollards)
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded border border-slate-300/50 shrink-0">
                      Ring Tag 04
                    </span>
                  </div>

                  {/* Item 3: QR / RFID Terminal Handheld */}
                  <div
                    onClick={() => toggleChecklist("terminal")}
                    className="bg-[#f8fafc] border border-slate-200/80 hover:border-blue-300 rounded-xl p-3.5 flex items-start justify-between gap-3 cursor-pointer transition select-none"
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center shrink-0 transition ${
                          checklist.terminal
                            ? "bg-[#1a44c2] border-[#1a44c2] text-white"
                            : "bg-white border-slate-300"
                        }`}
                      >
                        {checklist.terminal && (
                          <Check className="w-3 h-3 stroke-[3]" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">
                          QR / RFID Terminal Handheld
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Sync Dock Stn #1 • FastRead OK
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-[#1a44c2] shrink-0">
                      <Battery className="w-4 h-4" />
                      <span>94%</span>
                    </div>
                  </div>

                  {/* Item 4: Manual Barrier Override Fob */}
                  <div
                    onClick={() => toggleChecklist("barrier")}
                    className="bg-[#f8fafc] border border-slate-200/80 hover:border-blue-300 rounded-xl p-3.5 flex items-start justify-between gap-3 cursor-pointer transition select-none"
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center shrink-0 transition ${
                          checklist.barrier
                            ? "bg-[#1a44c2] border-[#1a44c2] text-white"
                            : "bg-white border-slate-300"
                        }`}
                      >
                        {checklist.barrier && (
                          <Check className="w-3 h-3 stroke-[3]" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">
                          Manual Barrier Override Fob
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Gate Arm Auto-Engage Tested
                        </div>
                      </div>
                    </div>

                    <span className="bg-blue-100/80 text-blue-800 font-bold text-[10px] px-2.5 py-0.5 rounded shrink-0">
                      Operational
                    </span>
                  </div>
                </div>
              </div>

              {/* CARD 2: Recent Gate 04 Custody Transfers */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-5 h-5 text-[#1a44c2]" />
                    <h2 className="text-base font-bold text-slate-900">
                      Recent Gate 04 Custody Transfers
                    </h2>
                  </div>
                  <button
                    type="button"
                    className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 hover:text-[#1a44c2] cursor-pointer transition"
                  >
                    AUDIT LOG VAULT
                  </button>
                </div>

                {/* Audit Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        <th className="py-2.5 px-3">TRANSFER TIMESTAMP</th>
                        <th className="py-2.5 px-3">OUTGOING GUARD</th>
                        <th className="py-2.5 px-3">INCOMING GUARD</th>
                        <th className="py-2.5 px-3">KEY/ASSET AUDIT</th>
                        <th className="py-2.5 px-3">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {/* Row 1 */}
                      <tr className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-3 font-mono text-slate-600">
                          Today, 08:00 EST
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-slate-900">
                          Off. R. Delgado (#3901)
                        </td>
                        <td className="py-3.5 px-3 font-bold text-[#1a44c2] hover:underline cursor-pointer">
                          Off. M. Vance (#4082)
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-slate-800">
                          100% Accounted
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-100/80 text-blue-800">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
                            Audited & Archived
                          </span>
                        </td>
                      </tr>

                      {/* Row 2 */}
                      <tr className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-3 font-mono text-slate-600">
                          Yesterday, 16:00 EST
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-slate-900">
                          Off. M. Vance (#4082)
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-slate-900">
                          Off. K. Thorne (#4102)
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-slate-800">
                          100% Accounted
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-100/80 text-blue-800">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
                            Audited & Archived
                          </span>
                        </td>
                      </tr>

                      {/* Row 3 */}
                      <tr className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-3 font-mono text-slate-600">
                          Yesterday, 08:00 EST
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-slate-900">
                          Off. D. Chen (#3490)
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-slate-900">
                          Off. M. Vance (#4082)
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-slate-800">
                          100% Accounted
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-100/80 text-blue-800">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
                            Audited & Archived
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* SEAL CONFIRMATION MODAL */}
      {showSealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-[#1a44c2] flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Seal Shift Custody Transfer?
                </h3>
                <p className="text-xs text-slate-500">
                  Protocol CG-H7 • Gate 04 Post Transfer
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              Confirming this transfer will formally pass physical key custody, radio telemetry, and barrier operational command to{" "}
              <strong className="text-slate-900">Officer S. Jenkins (#4120)</strong>. This digital log will be sealed and transmitted to Central Dispatch NOC.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowSealModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSeal}
                className="px-4 py-2 text-xs font-bold text-white bg-[#1a44c2] hover:bg-[#1538a6] rounded-lg shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                Confirm & Seal Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
