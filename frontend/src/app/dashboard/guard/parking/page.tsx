"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Bell,
  Search,
  QrCode,
  AlertTriangle,
  RotateCcw,
  Car,
  Zap,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  LogOut,
  ChevronRight,
  Filter,
  Truck,
  UserCheck
} from "lucide-react";
import { performLogout } from "@/lib/auth";

export default function GuardParkingPage() {
  const [searchQuery, setSearchQuery] = useState("FL-8291");
  const [filterViolations, setFilterViolations] = useState(false);
  const [searchResultModal, setSearchResultModal] = useState<string | null>(null);

  const vehicles = [
    {
      plate: "FL-8291",
      permit: "CG-FAC-2024-909",
      owner: "Dr. Jonathan Vance",
      role: "Faculty Resident",
      time: "08:14 AM",
      stall: "Stall N-42",
      status: "Valid",
      statusType: "valid",
      isViolation: false,
    },
    {
      plate: "TX-9014",
      permit: "TMP-VIS-8812",
      owner: "Elena Rostova",
      role: "Visitor Pass (Lot B)",
      time: "09:30 AM",
      stall: "Stall B-14 (+45m)",
      status: "Warning Issued",
      statusType: "warning",
      isViolation: true,
    },
    {
      plate: "CA-4882",
      permit: "STU-COMM-4410",
      owner: "Marcus Holloway",
      role: "Undergrad Commuter",
      time: "10:02 AM",
      stall: "Stall N-18",
      status: "Valid",
      statusType: "valid",
      isViolation: false,
    },
    {
      plate: "NY-6120",
      permit: "CONTR-FAC-011",
      owner: "Apex HVAC Services",
      role: "Contractor (Daily)",
      time: "07:45 AM",
      stall: "Bay EV-04",
      status: "Expired (11:00 AM)",
      statusType: "expired",
      isViolation: true,
    },
    {
      plate: "UNKNOWN-CON",
      permit: "NO-PERMIT",
      owner: "Unregistered Box Truck",
      role: "Commercial Courier",
      time: "11:15 AM",
      stall: "Fire Lane Zone N",
      status: "Unauthorized",
      statusType: "unauthorized",
      isViolation: true,
    },
  ];

  const displayedVehicles = filterViolations
    ? vehicles.filter((v) => v.isViolation)
    : vehicles;

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
                className="py-5 relative transition cursor-pointer text-[#1a44c2] font-bold border-b-2 border-[#1a44c2]"
              >
                Parking
              </Link>
              <Link
                href="/dashboard/guard/incidents"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
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

      {/* 2. BODY LAYOUT: SIDEBAR + MAIN CONTENT */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* LEFT SIDEBAR */}
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
              className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
            >
              Handoff
            </Link>

            <Link
              href="/dashboard/guard/parking"
              className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-bold bg-[#1a44c2] text-white shadow-xs"
            >
              Parking
            </Link>

            <Link
              href="/dashboard/guard/incidents"
              className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
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
        </aside>

        {/* MAIN PARKING CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Top Status Ribbon */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="flex items-center gap-1.5 font-extrabold text-slate-900">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                ACTIVE SECTOR
              </span>
              <span className="text-slate-700 font-semibold">
                Zone N &amp; Visitor Lot B — Operational Shift Active
              </span>
              <span className="bg-slate-200/70 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">
                ANPR Sync: Stable
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-500 font-medium">
              <span>Last Auto-Sweep: 2m ago</span>
              <button
                type="button"
                className="flex items-center gap-1 text-[#1a44c2] font-bold hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Refresh Feed</span>
              </button>
            </div>
          </div>

          {/* Heading Row & Overall Occupancy Ring Card */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="text-[11px] font-extrabold tracking-wider text-blue-800 uppercase">
                CAMPUSGUARD TACTICAL TELEMETRY • Gate 04 Automated Terminal
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Hardware-Free Parking &amp; Stall Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-normal mt-1">
                Parking Management Portal — Zone N &amp; Visitor Lot B.
              </p>
            </div>

            {/* Overall Occupancy Meter Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center gap-5 shrink-0">
              <div>
                <div className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                  OVERALL OCCUPANCY
                </div>
                <div className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  142 <span className="text-base font-bold text-slate-400">/ 180 Stalls</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-red-600 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>79% Capacity Reached</span>
                </div>
              </div>

              {/* Progress Ring */}
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#1a44c2]"
                    strokeDasharray="79, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xs font-black text-slate-900">79%</span>
              </div>
            </div>
          </div>

          {/* Enforcement & QR Validation Console */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1a44c2] flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Enforcement &amp; QR Validation Console
                  </h2>
                  <p className="text-xs text-slate-500">
                    Instant OCR lookup by vehicle license or student/faculty digital credential pass.
                  </p>
                </div>
              </div>

              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider w-fit">
                Station #04 Active
              </span>
            </div>

            {/* Search Input Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Car className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Plate Number or Permit ID..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={() => setSearchResultModal(searchQuery)}
                className="px-5 py-2.5 bg-[#1a44c2] hover:bg-[#1538a6] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Lookup Permit</span>
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                className="px-3.5 py-2 bg-blue-50/80 hover:bg-blue-100 text-[#1a44c2] font-bold text-xs rounded-xl flex items-center gap-2 transition cursor-pointer border border-blue-100"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Scan Digital QR Pass</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl flex items-center gap-2 transition cursor-pointer border border-red-100"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Issue Citation / Warning</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sub-Zone Capacity & Specialized Bays */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-blue-100 text-[#1a44c2] font-black text-xs flex items-center justify-center">
                  P
                </span>
                <span>Sub-Zone Capacity &amp; Specialized Bays</span>
              </h2>
              <span className="text-xs text-slate-500">
                Threshold Alerts Configured at 90%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Zone N */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900">
                    ZONE N
                  </span>
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    FACULTY / STAFF
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-xl font-black text-slate-900">
                    86 <span className="text-xs font-bold text-slate-400">/ 100</span>
                  </div>
                  <span className="text-xs font-bold text-[#1a44c2]">
                    86% Occupied
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1a44c2] rounded-full" style={{ width: "86%" }}></div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>14 Stalls Open</span>
                  <span className="font-semibold text-slate-700">Clearance OK</span>
                </div>
              </div>

              {/* Card 2: Visitor Lot B */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900">
                    VISITOR LOT B
                  </span>
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    TIMED PASS
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-xl font-black text-slate-900">
                    34 <span className="text-xs font-bold text-slate-400">/ 50</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    68% Occupied
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1a44c2] rounded-full" style={{ width: "68%" }}></div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>16 Stalls Open</span>
                  <span className="font-bold text-[#1a44c2]">Avg Stay: 1h 40m</span>
                </div>
              </div>

              {/* Card 3: EV Charging Bays */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900">
                    EV CHARGING BAYS
                  </span>
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    LEVEL 2 / DC FAST
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-xl font-black text-slate-900">
                    10 <span className="text-xs font-bold text-slate-400">/ 15</span>
                  </div>
                  <span className="text-xs font-bold text-[#1a44c2]">
                    Active Charging
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1a44c2] rounded-full" style={{ width: "66%" }}></div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>5 Bays Unplugged</span>
                  <span className="font-bold text-slate-700">Power Grid: Normal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real-Time Vehicle Log & Stall Feed Table */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Real-Time Vehicle Log &amp; Stall Feed
                </h2>
                <p className="text-xs text-slate-500">
                  Live optical camera captures and gate access logs across Zone N &amp; Lot B.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFilterViolations(!filterViolations)}
                  className={`px-3 py-1.5 font-bold text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                    filterViolations
                      ? "bg-red-600 text-white"
                      : "bg-blue-50 text-[#1a44c2] hover:bg-blue-100 border border-blue-200"
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>{filterViolations ? "Showing Violations" : "Filter Violations Only"}</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">PLATE NUMBER</th>
                    <th className="py-2.5 px-3">PERMIT ID</th>
                    <th className="py-2.5 px-3">OWNER / CATEGORY</th>
                    <th className="py-2.5 px-3">CHECK-IN</th>
                    <th className="py-2.5 px-3">STATUS</th>
                    <th className="py-2.5 px-3">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {displayedVehicles.map((v) => (
                    <tr
                      key={v.plate}
                      className={`transition ${
                        v.statusType === "unauthorized"
                          ? "bg-red-50/60 hover:bg-red-50"
                          : "hover:bg-slate-50/70"
                      }`}
                    >
                      <td className="py-3.5 px-3">
                        <span
                          className={`font-black font-mono ${
                            v.statusType === "unauthorized"
                              ? "text-red-700"
                              : "text-slate-900"
                          }`}
                        >
                          {v.plate}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`font-mono text-xs ${
                            v.statusType === "unauthorized"
                              ? "text-red-600 font-bold"
                              : "text-slate-600"
                          }`}
                        >
                          {v.permit}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div
                          className={`font-bold ${
                            v.statusType === "unauthorized"
                              ? "text-red-800"
                              : "text-slate-900"
                          }`}
                        >
                          {v.owner}
                        </div>
                        <div
                          className={`text-[11px] ${
                            v.statusType === "unauthorized"
                              ? "text-red-600"
                              : "text-slate-500"
                          }`}
                        >
                          {v.role}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div
                          className={`font-mono ${
                            v.statusType === "unauthorized"
                              ? "text-red-700 font-bold"
                              : "text-slate-800"
                          }`}
                        >
                          {v.time}
                        </div>
                        <div
                          className={`text-[11px] ${
                            v.statusType === "unauthorized"
                              ? "text-red-600 font-bold"
                              : v.stall.includes("+")
                              ? "text-red-600 font-bold"
                              : "text-slate-500"
                          }`}
                        >
                          {v.stall}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        {v.statusType === "valid" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100/70 text-blue-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                            Valid
                          </span>
                        )}
                        {v.statusType === "warning" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                            Warning Issued
                          </span>
                        )}
                        {v.statusType === "expired" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-200/80 text-slate-700">
                            Expired (11:00 AM)
                          </span>
                        )}
                        {v.statusType === "unauthorized" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-red-600 text-white shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                            Unauthorized
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3">
                        {v.statusType === "unauthorized" ? (
                          <button
                            type="button"
                            onClick={() => alert(`Dispatching tow service for vehicle ${v.plate}`)}
                            className="bg-red-700 hover:bg-red-800 text-white font-bold px-3 py-1 rounded-lg text-xs shadow-xs transition cursor-pointer"
                          >
                            Dispatch Tow
                          </button>
                        ) : v.statusType === "warning" ? (
                          <button
                            type="button"
                            onClick={() => alert(`Flagged violation for ${v.plate}`)}
                            className="text-red-600 hover:underline font-bold text-xs cursor-pointer"
                          >
                            Flag Violation
                          </button>
                        ) : v.statusType === "expired" ? (
                          <button
                            type="button"
                            onClick={() => alert(`Extended permit for ${v.plate}`)}
                            className="text-[#1a44c2] hover:underline font-bold text-xs cursor-pointer"
                          >
                            Extend
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSearchResultModal(v.plate)}
                            className="text-[#1a44c2] hover:underline font-bold text-xs cursor-pointer"
                          >
                            Details
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination / Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
              <span>Showing 5 of 142 actively monitored vehicles</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="px-2.5 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="w-7 h-7 bg-[#1a44c2] text-white rounded font-bold cursor-pointer"
                >
                  1
                </button>
                <button
                  type="button"
                  className="w-7 h-7 border border-slate-200 rounded text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  2
                </button>
                <button
                  type="button"
                  className="w-7 h-7 border border-slate-200 rounded text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  3
                </button>
                <button
                  type="button"
                  className="px-2.5 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL LOOKUP */}
      {searchResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <Car className="w-5 h-5 text-[#1a44c2]" />
                <h3 className="text-base font-bold text-slate-900">
                  Vehicle Permit Record: {searchResultModal}
                </h3>
              </div>
            </div>
            <div className="space-y-2.5 text-xs text-slate-700 mb-5">
              <p>
                <strong>License Plate:</strong> {searchResultModal}
              </p>
              <p>
                <strong>Permit Category:</strong> Institutional Priority Clearance
              </p>
              <p>
                <strong>Authorized Sector:</strong> Zone N (Faculty / Staff Reserved)
              </p>
              <p>
                <strong>Access Log:</strong> Cleared Gate 04 Automated Terminal at 08:14 AM
              </p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSearchResultModal(null)}
                className="px-4 py-2 bg-[#1a44c2] text-white font-bold text-xs rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
