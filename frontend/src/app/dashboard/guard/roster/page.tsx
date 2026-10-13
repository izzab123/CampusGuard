"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Shield,
  Calendar,
  Clock,
  MapPin,
  RotateCcw,
  UserCheck,
  Users,
  Bell,
  LogOut,
  Car,
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle2,
  CalendarDays,
  Sparkles,
  Info,
  Search
} from "lucide-react";
import { getStoredAuthUser, performLogout, AuthUser } from "@/lib/auth";
import { API_ENDPOINTS } from "@/lib/api";

interface DutyRosterItem {
  id: number;
  dutyDate: string;
  startTime: string;
  endTime: string;
  postLocation: string;
  gatePost?: string;
  shiftType: string;
  guardName: string;
  guardBadgeNumber: string;
  guardEmail?: string;
  supervisorName: string;
  supervisorBadgeNumber?: string;
  relieverName?: string;
  relieverBadgeNumber?: string;
  relieverStatus?: string;
  relieverTimeSlot?: string;
  status: string;
  priority?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface RosterPayload {
  guardEmail: string;
  guardBadgeNumber: string;
  guardName: string;
  hasTodayDuty: boolean;
  todayDuty: DutyRosterItem | null;
  todayDuties: DutyRosterItem[];
  upcomingDuties: DutyRosterItem[];
  pastDuties: DutyRosterItem[];
  allDuties: DutyRosterItem[];
  totalUpcoming: number;
  totalAssigned: number;
  nextUpcomingDuty: DutyRosterItem | null;
  serverTime: string;
}

export default function GuardDutyRosterPage() {
  const [user] = useState<AuthUser | null>(() =>
    typeof window !== "undefined" ? getStoredAuthUser() : null
  );
  const [rosterData, setRosterData] = useState<RosterPayload | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [shiftFilter, setShiftFilter] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [liveNotice, setLiveNotice] = useState<string | null>(null);
  const [timeAgoText, setTimeAgoText] = useState<string>("just now");

  const prevUpdatedRef = useRef<string | null>(null);

  const fetchRoster = useCallback(
    async (isManual = false) => {
      const stored = getStoredAuthUser();
      if (!stored) return;

      if (isManual) setIsRefreshing(true);

      try {
        const queryParams = new URLSearchParams();
        if (stored.email) queryParams.set("email", stored.email);
        if (stored.badgeNumber) queryParams.set("badgeNumber", stored.badgeNumber);
        if (stored.fullName || stored.name)
          queryParams.set("name", stored.fullName || stored.name || "");

        const url = `${API_ENDPOINTS.dutyRoster.myRoster}?${queryParams.toString()}`;

        const res = await fetch(url, {
          headers: {
            "X-User-Role": stored.role || "Security Guard",
            "X-User-Email": stored.email || "",
            "X-Guard-Badge": stored.badgeNumber || "",
            "X-Guard-Name": stored.fullName || stored.name || "",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
          cache: "no-store",
        });

        if (res.ok) {
          const data: RosterPayload = await res.json();
          setRosterData(data);
          setLastRefreshed(new Date());

          // Check if supervisor recently updated
          const currentTimestamp =
            data.todayDuty?.updatedAt ||
            (data.upcomingDuties.length > 0 ? data.upcomingDuties[0].updatedAt : null) ||
            null;

          if (
            prevUpdatedRef.current &&
            currentTimestamp &&
            prevUpdatedRef.current !== currentTimestamp
          ) {
            setLiveNotice("Supervisor updated your roster! Roster refreshed in real time.");
            setTimeout(() => setLiveNotice(null), 5000);
          }
          prevUpdatedRef.current = currentTimestamp;
        }
      } catch (err) {
        console.error("Failed to fetch duty roster:", err);
      } finally {
        setIsLoading(false);
        if (isManual) setIsRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    // Initial fetch
    let active = true;
    (async () => {
      if (active) {
        await fetchRoster();
      }
    })();

    // 1. Automatic polling interval every 5 seconds to reflect supervisor changes in real-time
    const interval = setInterval(() => {
      fetchRoster();
    }, 5000);

    // 2. Focus & visibility change listener: immediately fetch fresh data when switching back to tab
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchRoster();
      }
    };
    window.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("focus", onVisibilityChange);

    // 3. Cross-tab BroadcastChannel listener for immediate sync when supervisor schedules/edits
    let bc: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      bc = new BroadcastChannel("campusguard_roster_channel");
      bc.onmessage = (event) => {
        if (event.data?.type === "ROSTER_UPDATED") {
          fetchRoster();
          setLiveNotice("Supervisor updated shift assignments. Auto-synced.");
          setTimeout(() => setLiveNotice(null), 4000);
        }
      };
    }

    // 4. Storage event fallback for cross-tab sync
    const onStorage = (e: StorageEvent) => {
      if (e.key === "campusguard_roster_last_update") {
        fetchRoster();
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      active = false;
      clearInterval(interval);
      window.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", onVisibilityChange);
      window.removeEventListener("storage", onStorage);
      if (bc) bc.close();
    };
  }, [fetchRoster]);

  // Update relative time display
  useEffect(() => {
    const timer = setInterval(() => {
      const diffSec = Math.round((Date.now() - lastRefreshed.getTime()) / 1000);
      if (diffSec < 5) setTimeAgoText("just now");
      else if (diffSec < 60) setTimeAgoText(`${diffSec}s ago`);
      else setTimeAgoText(`${Math.floor(diffSec / 60)}m ago`);
    }, 2000);
    return () => clearInterval(timer);
  }, [lastRefreshed]);

  const officerName = user?.fullName || user?.name || "Officer Marcus Vance";
  const badgeNum = user?.badgeNumber || "Shield #4082";

  const todayDuty = rosterData?.todayDuty || null;
  const upcomingDuties = rosterData?.upcomingDuties || [];
  const pastDuties = rosterData?.pastDuties || [];

  const displayedList = activeTab === "upcoming" ? upcomingDuties : pastDuties;

  const filteredDuties = displayedList.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.postLocation.toLowerCase().includes(q) ||
      (item.gatePost && item.gatePost.toLowerCase().includes(q)) ||
      (item.notes && item.notes.toLowerCase().includes(q)) ||
      item.shiftType.toLowerCase().includes(q) ||
      item.supervisorName.toLowerCase().includes(q);

    const matchesShift =
      shiftFilter === "ALL" ||
      item.shiftType.toUpperCase() === shiftFilter.toUpperCase();

    return matchesSearch && matchesShift;
  });

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  const getShiftBadgeStyle = (shiftType: string) => {
    switch (shiftType?.toUpperCase()) {
      case "MORNING":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "EVENING":
      case "AFTERNOON":
        return "bg-indigo-50 text-indigo-800 border-indigo-200";
      case "NIGHT":
        return "bg-slate-800 text-slate-100 border-slate-700";
      default:
        return "bg-blue-50 text-blue-800 border-blue-200";
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
      case "ON_DUTY":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "COMPLETED":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-amber-100 text-amber-800 border-amber-300";
    }
  };

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
              <Link href="/dashboard/guard" className="py-5 hover:text-slate-900 transition">
                Dashboard
              </Link>
              <Link
                href="/dashboard/guard/roster"
                className="py-5 text-blue-700 font-bold border-b-2 border-blue-700 transition"
              >
                Duty Roster
              </Link>
              <Link href="/dashboard/guard/handoff" className="py-5 hover:text-slate-900 transition">
                Handoff
              </Link>
              <Link href="/dashboard/guard/parking" className="py-5 hover:text-slate-900 transition">
                Parking
              </Link>
              <Link href="/dashboard/guard/incidents" className="py-5 hover:text-slate-900 transition">
                Incidents
              </Link>
              <Link href="/dashboard/guard/notifications" className="py-5 hover:text-slate-900 transition">
                Notifications
              </Link>
              <Link href="/dashboard/guard/profile" className="py-5 hover:text-slate-900 transition">
                Profile
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Sync Status Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-bold text-emerald-800 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Sync Active • {timeAgoText}</span>
            </div>

            <button
              type="button"
              onClick={() => fetchRoster(true)}
              title="Refresh Roster"
              className="p-2 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <RotateCcw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-blue-700" : ""}`} />
            </button>

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

      {/* 2. MAIN BODY */}
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
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Active Duty Monitor</span>
              </Link>
              <Link
                href="/dashboard/guard/roster"
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-bold bg-[#0a2f77] text-white shadow-xs transition"
              >
                <CalendarDays className="w-4 h-4" />
                <span>Duty Roster &amp; Shifts</span>
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

          {/* GUARD PROFILE IDENTITY CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Shield className="w-4 h-4 text-blue-700" />
              <span>Assigned Personnel</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 text-xs">
              <div className="font-bold text-slate-900">{officerName}</div>
              <div className="text-[11px] text-slate-500 font-mono font-semibold">
                Badge: {badgeNum}
              </div>
              <div className="text-[11px] text-slate-500">
                Email: {user?.email || "guard@campusguard.edu"}
              </div>
              <div className="pt-1.5 border-t border-slate-200 text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Restricted to your own roster</span>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN ROSTER FEED */}
        <main className="flex-1 space-y-6">
          {/* BANNER NOTIFICATION ON SUPERVISOR UPDATES */}
          {liveNotice && (
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-blue-900 flex items-center justify-between shadow-2xs animate-fade-in">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-700 shrink-0" />
                <span>{liveNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setLiveNotice(null)}
                className="text-blue-700 hover:text-blue-900 font-bold ml-2 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* HEADER SECTION */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-blue-800 uppercase">
                <span>CAMPUS SECURITY OPERATIONS • GUARD ROSTER</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Guard Duty Schedule &amp; Post Allocation
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Upcoming watch assignments, gate allocations, shift timings, and reliever handover schedule.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => fetchRoster(true)}
                className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-blue-700" : ""}`} />
                <span>Refresh Roster</span>
              </button>

              <Link
                href="/dashboard/guard/handoff"
                className="px-4 py-2 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Shift Handoff</span>
              </Link>
            </div>
          </div>

          {/* ============================================================== */}
          {/* REQUIREMENT: SHOW TODAY'S DUTY AT THE TOP                     */}
          {/* ============================================================== */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold tracking-wider text-slate-400 uppercase">
                TODAY&apos;S POST ASSIGNMENT
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            {todayDuty ? (
              <div className="bg-linear-to-br from-white via-white to-blue-50/40 border-2 border-blue-600/70 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                {/* Accent ribbon */}
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl tracking-wider uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  TODAY&apos;S ACTIVE POST
                </div>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-4 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeStyle(
                          todayDuty.status
                        )}`}
                      >
                        ● {todayDuty.status}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${getShiftBadgeStyle(
                          todayDuty.shiftType
                        )}`}
                      >
                        {todayDuty.shiftType} SHIFT
                      </span>
                      {todayDuty.priority && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                          Priority: {todayDuty.priority}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-700" />
                        <span>Assigned Gate &amp; Station</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                        {todayDuty.postLocation || todayDuty.gatePost || "Main Gate Checkpoint"}
                      </h2>
                    </div>

                    {/* Operational Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                      <div className="p-3 bg-white/90 border border-slate-200/80 rounded-xl shadow-2xs">
                        <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-700" />
                          <span>Shift Hours</span>
                        </div>
                        <div className="font-extrabold text-slate-900 mt-1 text-sm">
                          {todayDuty.startTime} — {todayDuty.endTime}
                        </div>
                      </div>

                      <div className="p-3 bg-white/90 border border-slate-200/80 rounded-xl shadow-2xs">
                        <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-blue-700" />
                          <span>Supervisor</span>
                        </div>
                        <div className="font-extrabold text-slate-900 mt-1">
                          {todayDuty.supervisorName}
                        </div>
                        {todayDuty.supervisorBadgeNumber && (
                          <div className="text-[10px] text-slate-500">
                            #{todayDuty.supervisorBadgeNumber}
                          </div>
                        )}
                      </div>

                      <div className="p-3 bg-white/90 border border-slate-200/80 rounded-xl shadow-2xs">
                        <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                          <Users className="w-3 h-3 text-blue-700" />
                          <span>Reliever Guard</span>
                        </div>
                        <div className="font-extrabold text-slate-900 mt-1">
                          {todayDuty.relieverName || "Unassigned"}
                        </div>
                        {todayDuty.relieverTimeSlot && (
                          <div className="text-[10px] text-blue-700 font-semibold truncate">
                            {todayDuty.relieverTimeSlot}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Watch Orders / Notes */}
                    {todayDuty.notes && (
                      <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900">
                        <span className="font-bold">Post Directives: </span>
                        <span>{todayDuty.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* Right side actions */}
                  <div className="shrink-0 flex flex-col gap-2.5 sm:w-48">
                    <Link
                      href="/dashboard/guard/handoff"
                      className="w-full py-2.5 px-4 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition text-center"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                      <span>Check In / Handoff</span>
                    </Link>

                    <Link
                      href="/dashboard/guard/parking"
                      className="w-full py-2 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-2 transition text-center"
                    >
                      <Car className="w-3.5 h-3.5 text-slate-600" />
                      <span>Scan Gate Passes</span>
                    </Link>

                    <Link
                      href="/dashboard/guard/incidents"
                      className="w-full py-2 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-2 transition text-center"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Log Post Incident</span>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              /* No duty today fallback */
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      No Duty Scheduled For Today
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      You are currently off-duty or on standby rest. Check your upcoming roster below.
                    </p>
                  </div>
                </div>

                {rosterData?.nextUpcomingDuty && (
                  <div className="px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                    <span className="font-bold">Next Duty: </span>
                    <span>
                      {formatDateDisplay(rosterData.nextUpcomingDuty.dutyDate)} at{" "}
                      {rosterData.nextUpcomingDuty.postLocation} ({rosterData.nextUpcomingDuty.startTime})
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* STATS TILES                                                    */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>UPCOMING DUTIES</span>
                <CalendarDays className="w-4 h-4 text-blue-700" />
              </div>
              <div className="text-3xl font-black text-slate-900 mt-1">
                {upcomingDuties.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Scheduled future watches
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>TODAY&apos;S STATUS</span>
                <Clock className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-700 mt-1">
                {todayDuty ? todayDuty.status : "OFF-DUTY"}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                {todayDuty ? todayDuty.postLocation : "Standby rest day"}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>SECURITY ACCESS</span>
                <ShieldCheck className="w-4 h-4 text-blue-700" />
              </div>
              <div className="text-3xl font-black text-slate-900 mt-1">
                Personal
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Restricted to {officerName}
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* UPCOMING & SCHEDULED DUTY ROSTER                               */}
          {/* ============================================================== */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            {/* Table / List Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("upcoming")}
                  className={`text-sm font-bold pb-1 cursor-pointer transition ${
                    activeTab === "upcoming"
                      ? "text-blue-700 border-b-2 border-blue-700"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Upcoming Duties ({upcomingDuties.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("past")}
                  className={`text-sm font-bold pb-1 cursor-pointer transition ${
                    activeTab === "past"
                      ? "text-blue-700 border-b-2 border-blue-700"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Past History ({pastDuties.length})
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search gate or notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <select
                  value={shiftFilter}
                  onChange={(e) => setShiftFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold"
                >
                  <option value="ALL">All Shifts</option>
                  <option value="MORNING">Morning</option>
                  <option value="EVENING">Evening</option>
                  <option value="NIGHT">Night</option>
                </select>
              </div>
            </div>

            {/* List / Cards for Upcoming Duties */}
            <div className="space-y-3">
              {isLoading ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  Loading duty roster...
                </div>
              ) : filteredDuties.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  {activeTab === "upcoming"
                    ? "No upcoming duties scheduled. Supervisor assignments will appear here automatically."
                    : "No past duty history recorded."}
                </div>
              ) : (
                filteredDuties.map((duty) => (
                  <div
                    key={duty.id}
                    className="p-4 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/90 rounded-xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-700" />
                          <span>{formatDateDisplay(duty.dutyDate)}</span>
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getShiftBadgeStyle(
                            duty.shiftType
                          )}`}
                        >
                          {duty.shiftType}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeStyle(
                            duty.status
                          )}`}
                        >
                          ● {duty.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>Assigned Gate: {duty.postLocation}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Shift Time: {duty.startTime} — {duty.endTime}</span>
                        </span>
                        <span>•</span>
                        <span>Supervisor: {duty.supervisorName}</span>
                        {duty.relieverName && (
                          <>
                            <span>•</span>
                            <span className="text-blue-700 font-semibold">
                              Reliever: {duty.relieverName}
                            </span>
                          </>
                        )}
                      </div>

                      {duty.notes && (
                        <p className="text-[11px] text-slate-600 italic">
                          &ldquo;{duty.notes}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-700 shadow-2xs">
                        {duty.startTime} - {duty.endTime}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Informational Footer Note */}
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  All shift assignments are managed by Operations Dispatch Supervisors. Changes reflect automatically without re-login.
                </span>
              </div>
              <span>Total Duties: {rosterData?.totalAssigned || 0}</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
