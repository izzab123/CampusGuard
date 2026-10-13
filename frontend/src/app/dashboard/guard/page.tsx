"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  UserCheck,
  Calendar,
  CalendarDays,
  MapPin,
  ChevronRight,
  RotateCcw
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

interface DutyRosterShift {
  id: number;
  dutyDate: string;
  startTime: string;
  endTime: string;
  postLocation: string;
  shiftType: string;
  guardName: string;
  guardBadgeNumber: string;
  supervisorName: string;
  relieverName?: string;
  status: string;
  notes?: string;
}

export default function SecurityGuardDashboard() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeShift, setActiveShift] = useState<any>(null);
  const [incidents, setIncidents] = useState<IncidentItem[]>([]);
  const [vehiclePassesCount, setVehiclePassesCount] = useState<number>(0);
  const [todayDuty, setTodayDuty] = useState<DutyRosterShift | null>(null);
  const [upcomingDuties, setUpcomingDuties] = useState<DutyRosterShift[]>([]);
  const [isLiveSyncing, setIsLiveSyncing] = useState<boolean>(false);

  const fetchGuardTelemetry = useCallback(async () => {
    const stored = getStoredAuthUser();
    try {
      // 1. Shifts Log
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

      // 4. Guard Duty Roster (Today's duty at top + upcoming duties)
      if (stored) {
        const queryParams = new URLSearchParams();
        if (stored.email) queryParams.set("email", stored.email);
        if (stored.badgeNumber) queryParams.set("badgeNumber", stored.badgeNumber);
        if (stored.fullName || stored.name)
          queryParams.set("name", stored.fullName || stored.name || "");

        const rosterRes = await fetch(
          `${API_ENDPOINTS.dutyRoster.myRoster}?${queryParams.toString()}`,
          {
            headers: {
              "X-User-Role": stored.role || "Security Guard",
              "X-User-Email": stored.email || "",
              "X-Guard-Badge": stored.badgeNumber || "",
              "X-Guard-Name": stored.fullName || stored.name || "",
              "Cache-Control": "no-cache",
            },
            cache: "no-store",
          }
        );

        if (rosterRes.ok) {
          const data = await rosterRes.json();
          setTodayDuty(data.todayDuty || null);
          setUpcomingDuties(data.upcomingDuties || []);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    setUser(getStoredAuthUser());
    fetchGuardTelemetry();

    // Polling interval every 5s for live sync without re-login
    const interval = setInterval(() => {
      fetchGuardTelemetry();
    }, 5000);

    // Visibility / window focus listener
    const onFocus = () => fetchGuardTelemetry();
    window.addEventListener("focus", onFocus);
    window.addEventListener("visibilitychange", onFocus);

    // Cross-tab broadcast channel for instant supervisor sync
    let bc: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      bc = new BroadcastChannel("campusguard_roster_channel");
      bc.onmessage = () => {
        fetchGuardTelemetry();
        setIsLiveSyncing(true);
        setTimeout(() => setIsLiveSyncing(false), 3000);
      };
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("visibilitychange", onFocus);
      if (bc) bc.close();
    };
  }, [fetchGuardTelemetry]);

  const officerName = user?.fullName || user?.name || "Officer Marcus Vance";
  const badgeNum = user?.badgeNumber || "Shield #4082";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col">
      {/* 1. TOP APP HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
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
                href="/dashboard/guard/view-my-duty"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                View My Duty
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
              <span>Online • Roster Live</span>
            </div>

            <Link href="/dashboard/guard/notifications" className="relative cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition">
                <Bell className="w-4 h-4" />
              </div>
            </Link>

            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#0a2f77] text-white flex items-center justify-center font-bold text-xs shadow-xs">
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
                href="/dashboard/guard/view-my-duty"
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                <CalendarDays className="w-4 h-4" />
                <span>View My Duty</span>
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
                href="/dashboard/guard/view-my-duty"
                className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition"
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>View My Duty</span>
              </Link>
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

          {/* ============================================================== */}
          {/* TODAY'S DUTY ROSTER CARD (PROMINENT AT TOP)                     */}
          {/* ============================================================== */}
          <div className="bg-white border-2 border-blue-600/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-700" />
                <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  TODAY'S DUTY ASSIGNMENT
                </span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                  ROSTER TOP PRIORITY
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ● {todayDuty?.status || activeShift?.status || "ON_DUTY"}
                </span>
                <Link
                  href="/dashboard/guard/view-my-duty"
                  className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-0.5"
                >
                  <span>Upcoming Duties ({upcomingDuties.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-700" />
                  <span>Assigned Gate / Post</span>
                </div>
                <div className="font-extrabold text-slate-900 mt-1 text-sm">
                  {todayDuty?.postLocation || activeShift?.postLocation || "Main North Gate & Barrier 04"}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-700" />
                  <span>Shift Window</span>
                </div>
                <div className="font-extrabold text-slate-900 mt-1 text-sm">
                  {todayDuty ? `${todayDuty.startTime} — ${todayDuty.endTime}` : "08:00 — 16:00"}
                </div>
                <div className="text-[10px] text-slate-500">
                  {todayDuty?.shiftType || "MORNING"} SHIFT
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-blue-700" />
                  <span>Supervisor in Charge</span>
                </div>
                <div className="font-extrabold text-slate-900 mt-1">
                  {todayDuty?.supervisorName || "Supervisor Elena Rostova"}
                </div>
                <div className="text-[10px] text-slate-500">
                  Operations Dispatch SS-104
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-blue-700" />
                  <span>Reliever Guard</span>
                </div>
                <div className="font-extrabold text-slate-900 mt-1">
                  {todayDuty?.relieverName || "Officer David Chen"}
                </div>
                <div className="text-[10px] text-blue-700 font-semibold truncate">
                  {todayDuty?.notes ? todayDuty.notes.slice(0, 30) + "..." : "Relief window verified"}
                </div>
              </div>
            </div>

            {/* Upcoming Duties Preview Strip */}
            {upcomingDuties.length > 0 && (
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="font-bold text-slate-900">Next Upcoming Duty:</span>
                  <span className="text-blue-800 font-semibold">
                    {upcomingDuties[0].dutyDate} • {upcomingDuties[0].startTime} - {upcomingDuties[0].endTime} at {upcomingDuties[0].postLocation}
                  </span>
                </div>
                <Link
                  href="/dashboard/guard/roster"
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>View All {upcomingDuties.length} Upcoming Duties →</span>
                </Link>
              </div>
            )}
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
                <CalendarDays className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Upcoming Duties
                </p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">
                  {upcomingDuties.length}
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
