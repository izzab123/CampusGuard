"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Shield,
  Bell,
  LogOut,
  Users,
  Search,
  Filter,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Clock,
  UserX,
  UserCheck,
  ArrowRightLeft,
  Info,
  CalendarDays,
  Sparkles,
  Sliders
} from "lucide-react";
import { getStoredAuthUser, performLogout, AuthUser } from "@/lib/auth";
import { API_ENDPOINTS } from "@/lib/api";

interface DutyAttendanceItem {
  id: number;
  guardName: string;
  guardBadgeNumber: string;
  guardEmail?: string;
  postLocation: string;
  dutyDate: string;
  shiftType: string;
  startTime?: string;
  endTime?: string;
  shiftStart?: string;
  shiftEnd?: string;
  status: string;
  attendanceStatus?: string;
  checkedIn?: boolean;
  checkInTime?: string;
  leaveApproved?: boolean;
  leaveReason?: string;
  isReassigned?: boolean;
  absentGuardAttendanceStatus?: string;
  countsAsNoShow?: boolean;
  noShowFlaggedAt?: string;
  noShowReason?: string;
  reassignmentReason?: string;
  supervisorName?: string;
}

export default function SupervisorAttendancePage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [noShowRecords, setNoShowRecords] = useState<DutyAttendanceItem[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<DutyAttendanceItem[]>([]);
  const [gracePeriod, setGracePeriod] = useState<number>(15);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditNotice, setAuditNotice] = useState<string | null>(null);

  useEffect(() => {
    setUser(getStoredAuthUser());
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [noShowsRes, recordsRes, configRes] = await Promise.all([
        fetch(API_ENDPOINTS.attendance.noShows),
        fetch(API_ENDPOINTS.attendance.records),
        fetch(API_ENDPOINTS.attendance.config),
      ]);

      if (noShowsRes.ok) {
        const data = await noShowsRes.json();
        setNoShowRecords(Array.isArray(data) ? data : []);
      }
      if (recordsRes.ok) {
        const data = await recordsRes.json();
        setAttendanceRecords(Array.isArray(data) ? data : []);
      }
      if (configRes.ok) {
        const cfg = await configRes.json();
        if (cfg.gracePeriodMinutes) setGracePeriod(cfg.gracePeriodMinutes);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunAudit = async () => {
    setIsAuditing(true);
    setAuditNotice(null);
    try {
      const res = await fetch(API_ENDPOINTS.attendance.evaluate, {
        method: "POST",
      });
      if (res.ok) {
        const flagged: DutyAttendanceItem[] = await res.json();
        await loadData();
        if (flagged.length > 0) {
          setAuditNotice(`Sentinel audit completed: ${flagged.length} unstaffed duty shift(s) flagged as No-Show.`);
        } else {
          setAuditNotice("Sentinel audit completed: All scheduled shifts are compliant with grace period rules.");
        }
        setTimeout(() => setAuditNotice(null), 60000);
      }
    } catch {
      setAuditNotice("Audit trigger failed: check connection.");
    } finally {
      setIsAuditing(false);
    }
  };

  const filteredAttendance = attendanceRecords.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.guardName?.toLowerCase().includes(q) ||
      item.guardBadgeNumber?.toLowerCase().includes(q) ||
      item.postLocation?.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (statusFilter === "ALL") return true;
    if (statusFilter === "NO_SHOW") {
      return item.status === "NO_SHOW" || item.attendanceStatus === "NO_SHOW";
    }
    if (statusFilter === "CHECKED_IN") {
      return item.checkedIn || item.status === "CHECKED_IN" || item.attendanceStatus === "PRESENT";
    }
    if (statusFilter === "EXCUSED") {
      return item.isReassigned || item.absentGuardAttendanceStatus === "EXCUSED_ABSENCE";
    }
    if (statusFilter === "LEAVE") {
      return item.leaveApproved || item.attendanceStatus === "ON_LEAVE" || item.status === "APPROVED_LEAVE";
    }
    return true;
  });

  const checkedInCount = attendanceRecords.filter(
    (r) => r.checkedIn || r.status === "CHECKED_IN" || r.attendanceStatus === "PRESENT"
  ).length;

  const excusedCount = attendanceRecords.filter(
    (r) => r.isReassigned || r.absentGuardAttendanceStatus === "EXCUSED_ABSENCE"
  ).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col antialiased">
      {/* 1. TOP SUPERVISOR HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#1a44c2] flex items-center justify-center text-white shadow-xs group-hover:bg-[#1537a0] transition">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-slate-900 leading-none">
                  CampusGuard
                </span>
                <span className="text-[11px] font-extrabold tracking-wider text-slate-700 uppercase leading-none mt-0.5">
                  SUPERVISOR PORTAL
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 pl-4 text-xs font-semibold">
              <Link
                href="/dashboard/supervisor"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/supervisor/shifts"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Shifts
              </Link>
              <Link
                href="/dashboard/supervisor/attendance"
                className="py-5 relative transition cursor-pointer text-[#1a44c2] font-bold border-b-2 border-[#1a44c2]"
              >
                Attendance
              </Link>
              <Link
                href="/dashboard/supervisor/escalations"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Escalations
              </Link>
              <Link
                href="/dashboard/supervisor/logbook"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Logbook
              </Link>
              <Link
                href="/dashboard/supervisor/notifications"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Notifications
              </Link>
              <Link
                href="/dashboard/supervisor/profile"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Profile
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard/supervisor/notifications" className="relative cursor-pointer">
              <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition">
                <Bell className="w-4 h-4" />
                {noShowRecords.length > 0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-600 rounded-full border-2 border-white animate-pulse"></span>
                )}
              </div>
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                {user?.name ? user.name[0] : "S"}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-none">
                  {user?.name || "Shift Supervisor"}
                </span>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                  #{user?.badgeNumber || "SS-104"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={performLogout}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 max-w-[1520px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* HEADER BAR & RUN AUDIT BUTTON */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-rose-800 uppercase">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
              <span>LIVE ATTENDANCE SURVEILLANCE • AUTOMATIC GUARD NO-SHOW RADAR</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Guard Attendance &amp; No-Show Surveillance
            </h1>
            <p className="text-xs text-slate-500">
              Real-time shift start monitoring with automated no-show enforcement. Grace period: <strong className="text-slate-800 font-bold">{gracePeriod} minutes</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition cursor-pointer"
            >
              <AlertTriangle className={`w-3.5 h-3.5 ${isAuditing ? "animate-spin" : ""}`} />
              <span>{isAuditing ? "Auditing Sentinel..." : "Run No-Show Audit"}</span>
            </button>

            <button
              type="button"
              onClick={loadData}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700 border border-slate-200 transition cursor-pointer"
            >
              <RotateCcw className={`w-3.5 h-3.5 text-slate-500 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* AUDIT NOTICE BANNER */}
        {auditNotice && (
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between gap-3 text-xs font-semibold text-blue-900 shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{auditNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setAuditNotice(null)}
              className="text-blue-500 hover:text-blue-700 text-xs cursor-pointer font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 4 KPI METRIC TILES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Flagged No-Shows</span>
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <UserX className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-rose-700 leading-none">
                {noShowRecords.length}
              </span>
              <span className="text-xs font-bold text-rose-700">Unstaffed</span>
            </div>
            <p className="text-[11px] text-slate-500">Unexcused guard absences flagged</p>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-600 rounded-full"
                style={{ width: noShowRecords.length > 0 ? "100%" : "0%" }}
              ></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Checked-In On Post</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-700 leading-none">
                {checkedInCount}
              </span>
              <span className="text-xs font-bold text-emerald-700">Verified</span>
            </div>
            <p className="text-[11px] text-slate-500">Active guards present at posts</p>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: "85%" }}></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Excused / Reassigned</span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <ArrowRightLeft className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-blue-800 leading-none">
                {excusedCount}
              </span>
              <span className="text-xs font-bold text-blue-700">Protected</span>
            </div>
            <p className="text-[11px] text-slate-500">Never flagged as no-show</p>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: "60%" }}></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Configured Grace Period</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 leading-none">
                {gracePeriod}m
              </span>
              <span className="text-xs font-bold text-indigo-700">Window</span>
            </div>
            <p className="text-[11px] text-slate-500">Auto-flag after {gracePeriod}m without check-in</p>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: "100%" }}></div>
            </div>
          </div>
        </div>

        {/* 3. DEDICATED NO-SHOW RECORDS SECTION (REQUIREMENT) */}
        <div className="bg-white border border-rose-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                <UserX className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Flagged Guard No-Show Incidents</span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-extrabold">
                    {noShowRecords.length} Active Records
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500">
                  Duties flagged automatically because no guard check-in was registered within the {gracePeriod}-minute grace period.
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/supervisor/shifts"
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Go to Shift Reassignment</span>
            </Link>
          </div>

          {noShowRecords.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {noShowRecords.map((item) => (
                <div
                  key={item.id}
                  className="bg-rose-50/40 border-2 border-rose-300 rounded-2xl p-4 space-y-3 shadow-xs hover:border-rose-400 transition"
                >
                  <div className="flex items-center justify-between text-xs border-b border-rose-200 pb-2">
                    <span className="font-extrabold text-rose-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                      NO-SHOW UNSTAFFED
                    </span>
                    <span className="font-mono text-slate-500 text-[11px]">Roster #{item.id}</span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-sm">
                        {item.guardName}
                      </span>
                      <span className="font-mono text-[11px] bg-white border border-rose-200 px-1.5 py-0.5 rounded font-bold text-slate-700">
                        {item.guardBadgeNumber}
                      </span>
                    </div>

                    <div className="text-slate-600 font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      <span>Post: <strong>{item.postLocation}</strong></span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Shift Start: {item.startTime || "Scheduled"} • Flagged at: {item.noShowFlaggedAt ? new Date(item.noShowFlaggedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Auto"}
                      </span>
                    </div>

                    <div className="p-2.5 bg-white border border-rose-200 rounded-xl text-[11px] text-rose-900 leading-relaxed">
                      <strong>Audit Note:</strong> {item.noShowReason || `No check-in detected within ${gracePeriod}m grace period.`}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-rose-200/80 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">
                      ● Unexcused Absence
                    </span>

                    <Link
                      href="/dashboard/supervisor/shifts"
                      className="px-2.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1"
                    >
                      <ArrowRightLeft className="w-3 h-3" />
                      <span>Reassign Post</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="text-xs font-bold text-slate-800">
                Zero Active No-Shows Recorded
              </div>
              <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                All scheduled duty posts have either checked in on time, received supervisor shift reassignment, or have approved leave.
              </p>
            </div>
          )}
        </div>

        {/* 4. COMPREHENSIVE DAILY ATTENDANCE MASTER LEDGER */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Daily Duty Attendance Ledger ({filteredAttendance.length} Shifts)
              </h2>
              <p className="text-[11px] text-slate-500">
                Complete roster attendance tracking with no-show, reassignment, and leave status.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search guard or post..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold"
              >
                <option value="ALL">All Statuses</option>
                <option value="NO_SHOW">No-Shows Only</option>
                <option value="CHECKED_IN">Checked-In (Present)</option>
                <option value="EXCUSED">Excused / Reassigned</option>
                <option value="LEAVE">Approved Leave</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                  <th className="py-3 px-3">Guard / Officer</th>
                  <th className="py-3 px-3">Post Location</th>
                  <th className="py-3 px-3">Scheduled Timing</th>
                  <th className="py-3 px-3">Attendance Status</th>
                  <th className="py-3 px-3">No-Show Impact</th>
                  <th className="py-3 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((item) => {
                    const isNoShow = item.status === "NO_SHOW" || item.attendanceStatus === "NO_SHOW";
                    const isCheckedIn = item.checkedIn || item.status === "CHECKED_IN" || item.attendanceStatus === "PRESENT";
                    const isExcused = item.isReassigned || item.absentGuardAttendanceStatus === "EXCUSED_ABSENCE";
                    const isOnLeave = item.leaveApproved || item.attendanceStatus === "ON_LEAVE" || item.status === "APPROVED_LEAVE";

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-3">
                          <div>
                            <div className="font-bold text-slate-900">{item.guardName}</div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              #{item.guardBadgeNumber}
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-slate-700 font-semibold">
                          {item.postLocation}
                        </td>

                        <td className="py-3 px-3 text-slate-600 font-mono">
                          {item.startTime || "08:00"} - {item.endTime || "16:00"}
                        </td>

                        <td className="py-3 px-3">
                          {isNoShow ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                              NO-SHOW
                            </span>
                          ) : isCheckedIn ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                              PRESENT (Checked In)
                            </span>
                          ) : isExcused ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                              EXCUSED (Reassigned)
                            </span>
                          ) : isOnLeave ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-purple-100 text-purple-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                              APPROVED LEAVE
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                              SCHEDULED
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3">
                          {isNoShow ? (
                            <span className="text-[11px] font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              Unexcused (Counts as No-Show)
                            </span>
                          ) : isExcused ? (
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Protected (No Penalty)
                            </span>
                          ) : isOnLeave ? (
                            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                              Approved (No Penalty)
                            </span>
                          ) : isCheckedIn ? (
                            <span className="text-[11px] font-medium text-emerald-700">
                              Fulfilled
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">
                              Pending ({gracePeriod}m grace)
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3">
                          {isNoShow ? (
                            <Link
                              href="/dashboard/supervisor/shifts"
                              className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition inline-flex items-center gap-1"
                            >
                              <ArrowRightLeft className="w-3 h-3" />
                              <span>Reassign</span>
                            </Link>
                          ) : (
                            <span className="text-slate-400 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No attendance records matching filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
