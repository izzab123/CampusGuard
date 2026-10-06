"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Shield,
  Car,
  QrCode,
  AlertTriangle,
  ArrowRightLeft,
  Bell,
  Clock,
  PhoneCall,
  LogOut,
  Radio,
  Video,
  RefreshCw,
  Fingerprint,
  UserCheck
} from "lucide-react";
import { performLogout, getStoredAuthUser, AuthUser } from "@/lib/auth";
import { API_ENDPOINTS } from "@/lib/api";

interface IncidentItem {
  id: number;
  title: string;
  description: string;
  severity: string;
  location: string;
  status: string;
  createdAt: string;
}

export default function SecurityGuardDashboard() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeShift, setActiveShift] = useState<any>(null);
  const [incidents, setIncidents] = useState<IncidentItem[]>([]);
  const [vehiclePassesCount, setVehiclePassesCount] = useState<number>(0);

  const fetchGuardTelemetry = async () => {
    try {
      // 1. Shifts
      const shiftsRes = await fetch(API_ENDPOINTS.shifts.base);
      if (shiftsRes.ok) {
        const shifts = await shiftsRes.json();
        if (shifts.length > 0) {
          setActiveShift(shifts[0]);
        }
      }

      // 2. Incidents
      const incRes = await fetch(API_ENDPOINTS.incidents.base);
      if (incRes.ok) {
        const incData = await incRes.json();
        setIncidents(incData);
      }

      // 3. Parking passes
      const parkRes = await fetch(API_ENDPOINTS.parking.passes);
      if (parkRes.ok) {
        const parkData = await parkRes.json();
        setVehiclePassesCount(parkData.length);
      }
    } catch {}
  };

  useEffect(() => {
    setUser(getStoredAuthUser());
    fetchGuardTelemetry();
  }, []);

  const officerName = user?.fullName || "Officer Marcus Vance";
  const badgeNum = user?.badgeNumber || "Shield #4082";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col">
      {/* 1. TOP APP HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
                  OPERATIONS UNIT
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 pl-4 text-xs font-semibold text-slate-600">
              <Link
                href="/dashboard/guard"
                className="py-5 relative transition cursor-pointer text-blue-700 font-bold border-b-2 border-blue-700"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/guard/handoff"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Handoff
              </Link>
              <Link
                href="/dashboard/guard/parking"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Parking
              </Link>
              <Link
                href="/dashboard/guard/incidents"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Incidents
              </Link>
              <Link
                href="/dashboard/guard/notifications"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Notifications
              </Link>
              <Link
                href="/dashboard/guard/profile"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Profile
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Online • Shift Live</span>
            </div>

            <Link href="/dashboard/guard/notifications" className="relative cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition">
                <Bell className="w-4 h-4" />
              </div>
            </Link>

            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#0a2f77] text-white flex items-center justify-center font-bold text-xs">
                {officerName.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {officerName}
                </span>
                <span className="text-[11px] text-slate-500 leading-tight">
                  {badgeNum}
                </span>
              </div>
              <button
                type="button"
                onClick={() => performLogout()}
                title="Log out"
                className="ml-1 p-2 rounded-lg text-slate-400 hover:text-red-600 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. BODY LAYOUT */}
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col lg:flex-row gap-6 w-full">
        {/* SIDEBAR */}
        <aside className="w-full lg:w-64 shrink-0 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              Gate Operations
            </div>
            <nav className="space-y-1">
              <Link
                href="/dashboard/guard"
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold bg-[#0a2f77] text-white shadow-xs transition"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Active Duty Monitor</span>
              </Link>
              <Link
                href="/dashboard/guard/handoff"
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Shift Handoff</span>
              </Link>
              <Link
                href="/dashboard/guard/parking"
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                <Car className="w-4 h-4" />
                <span>Parking Clearance</span>
              </Link>
              <Link
                href="/dashboard/guard/incidents"
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Field Incidents</span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* MAIN FEED */}
        <main className="flex-1 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-blue-800 uppercase">
                <span>• OPERATIONAL ROSTER • SHIFT ON-DUTY •</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Welcome, {officerName}
              </h1>
              <p className="text-xs text-slate-500">
                Campus Security Division • {badgeNum}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/dashboard/guard/parking"
                className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition"
              >
                <QrCode className="w-3.5 h-3.5 text-slate-600" />
                <span>Scan / Verify Permit</span>
              </Link>
              <Link
                href="/dashboard/guard/incidents"
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Log Incident</span>
              </Link>
            </div>
          </div>

          {/* ACTIVE SHIFT TELEMETRY CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-700" />
                <span className="text-xs font-bold text-slate-900">
                  CURRENT ACTIVE SHIFT
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                ● {activeShift?.status || "ON_DUTY"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-bold uppercase text-slate-400">Post Allocation</div>
                <div className="font-bold text-slate-900 mt-0.5">{activeShift?.postLocation || "North Perimeter & Gate 04"}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-bold uppercase text-slate-400">Assigned Officer</div>
                <div className="font-bold text-slate-900 mt-0.5">{activeShift?.officerName || officerName}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-bold uppercase text-slate-400">Watch Notes</div>
                <div className="font-bold text-slate-900 mt-0.5">{activeShift?.notes || "Operational watch nominal."}</div>
              </div>
            </div>
          </div>

          {/* 3 STAT KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Registered Passes
                </p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">
                  {vehiclePassesCount}
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-700 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Field Incidents
                </p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">
                  {incidents.length}
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Resolved Tickets
                </p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">
                  {incidents.filter((i) => i.status === "RESOLVED").length}
                </p>
              </div>
            </div>
          </div>

          {/* RECENT FIELD ACTIVITY */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Recent Incident Journal</h2>
              <Link href="/dashboard/guard/incidents" className="text-xs font-bold text-blue-700 hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-2.5">
              {incidents.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400">No field incidents logged.</div>
              ) : (
                incidents.slice(0, 4).map((inc) => (
                  <div key={inc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{inc.title}</div>
                      <div className="text-[11px] text-slate-500">{inc.location} • {new Date(inc.createdAt).toLocaleTimeString()}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      {inc.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
