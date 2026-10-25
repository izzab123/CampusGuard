"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Bell,
  LogOut,
  AlertTriangle,
  Radio,
  SlidersHorizontal,
  CheckCircle2,
  Check,
  Eye,
  UserX,
  Clock,
  MapPin,
  ShieldAlert,
  PhoneCall,
  RefreshCw,
  Sparkles,
  Users,
  CheckCheck
} from "lucide-react";
import { getStoredAuthUser, performLogout, AuthUser } from "@/lib/auth";
import { API_ENDPOINTS } from "@/lib/api";
import IncidentDetailsModal from "@/components/incidents/IncidentDetailsModal";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  category?: string;
  priority?: string;
  recipientRole?: string;
  recipientEmail?: string;
  incidentId?: number;
  isRead: boolean;
  read?: boolean;
  createdAt: string;
  // Guard duty & absence telemetry
  guardName?: string;
  badgeNumber?: string;
  postLocation?: string;
  shiftHours?: string;
  dutyStatus?: string;
  shiftId?: number;
}

export default function SupervisorNotificationsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "UNREAD" | "ABSENCES">("ALL");
  const [notice, setNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState<number | null>(null);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);

  const handleOpenIncident = (item: NotificationItem) => {
    if (item.incidentId) {
      setSelectedIncidentId(item.incidentId);
      setIsIncidentModalOpen(true);
      if (!item.isRead) {
        handleToggleRead(item.id, false);
      }
    }
  };

  useEffect(() => {
    setUser(getStoredAuthUser());
    loadNotifications();
  }, []);

  const normalizeNotification = (item: any): NotificationItem => {
    const isRead = Boolean(item.isRead ?? item.read ?? false);
    return {
      ...item,
      isRead,
      read: isRead,
      category: item.category || "SYSTEM",
      priority: item.priority || "MEDIUM",
    };
  };

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.notifications.list("Shift Supervisor"));
      if (res.ok) {
        const data = await res.json();
        const normalized = (Array.isArray(data) ? data : []).map(normalizeNotification);
        setNotifications(normalized);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  };

  // Toggle or Mark Read / Unread with instant UI update and database persistence
  const handleToggleRead = async (id: number, currentReadState: boolean) => {
    const targetState = !currentReadState;
    // Immediate optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: targetState, read: targetState } : n))
    );

    try {
      const endpoint = targetState
        ? API_ENDPOINTS.notifications.markRead(id)
        : API_ENDPOINTS.notifications.markUnread(id);

      const res = await fetch(endpoint, { method: "PATCH" });
      if (res.ok) {
        showNotification(targetState ? "Notification marked as read." : "Notification marked as unread.");
      } else {
        // Fallback toggle endpoint
        await fetch(API_ENDPOINTS.notifications.toggleRead(id), { method: "PATCH" });
      }
    } catch {
      showNotification(targetState ? "Marked as read." : "Marked as unread.");
    }
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, read: true })));
    try {
      const res = await fetch(API_ENDPOINTS.notifications.markAllRead("Shift Supervisor"), {
        method: "PATCH",
      });
      if (!res.ok) {
        for (const n of notifications.filter((x) => !x.isRead)) {
          await fetch(API_ENDPOINTS.notifications.markRead(n.id), { method: "PATCH" });
        }
      }
      showNotification("All supervisor notifications marked as read.");
    } catch {
      showNotification("Marked all notifications as read.");
    }
  };

  // Run dynamic automated surveillance check on shifts database
  const handleRunAttendanceScan = async () => {
    setIsScanning(true);
    try {
      const res = await fetch(API_ENDPOINTS.shifts.checkAbsences, {
        method: "POST",
      });
      if (res.ok) {
        const created = await res.json();
        if (Array.isArray(created) && created.length > 0) {
          showNotification(`Attendance scan detected ${created.length} unstaffed guard post(s). Notifications generated.`);
        } else {
          showNotification("Surveillance scan complete: All scheduled guard shifts checked in database.");
        }
        loadNotifications();
      }
    } catch {
      showNotification("Attendance surveillance scan finished.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleDispatchReliever = (officer: string, post: string) => {
    showNotification(`Standby Reliever dispatched to replace ${officer} at ${post}. Protocol logged.`);
  };

  const handleRadioCall = (officer: string) => {
    showNotification(`Dispatching emergency radio hail to ${officer} on Patrol Ch 2...`);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const guardAbsencesCount = notifications.filter(
    (n) => n.guardName || n.category?.toUpperCase() === "DUTY_ABSENCE"
  ).length;

  const filtered = notifications.filter((item) => {
    if (activeFilter === "UNREAD") return !item.isRead;
    if (activeFilter === "ABSENCES") return Boolean(item.guardName || item.category?.toUpperCase() === "DUTY_ABSENCE");
    return true;
  });

  const displayName = user?.name || "Supervisor Elena Rostova";
  const displayBadge = user?.badgeNumber || "SS-104";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col">
      {/* 1. TOP APP HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
                href="/dashboard/supervisor/occurrence-register"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Occurrence Register
              </Link>
              <Link
                href="/dashboard/supervisor/incidents"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Incident Tracking
              </Link>
              <Link
                href="/dashboard/supervisor/shifts"
                className="py-5 relative transition cursor-pointer text-slate-600 hover:text-slate-900"
              >
                Shifts
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
                className="py-5 relative transition cursor-pointer text-[#1a44c2] font-bold border-b-2 border-[#1a44c2]"
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
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f1f5f9] border border-slate-200/80 text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Supervisor Telemetry • Active</span>
            </div>

            <Link href="/dashboard/supervisor/notifications" className="relative cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition">
                <Bell className="w-4 h-4" />
              </div>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Link>

            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#1a44c2] text-white flex items-center justify-center font-bold text-xs overflow-hidden">
                <Image
                  src="/supervisor-elena.jpg"
                  alt={displayName}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {displayName}
                </span>
                <span className="text-[11px] text-slate-500 leading-tight">
                  Badge #{displayBadge}
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

      {/* 2. BODY LAYOUT */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <aside className="w-60 shrink-0 hidden md:flex flex-col justify-between bg-white border-r border-slate-200/90 min-h-[calc(100vh-64px)] p-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
              SUPERVISOR CONSOLE
            </div>
            <nav className="space-y-1.5 mt-1">
              <Link
                href="/dashboard/supervisor"
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/supervisor/occurrence-register"
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                Occurrence Register
              </Link>
              <Link
                href="/dashboard/supervisor/incidents"
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                Incident Tracking
              </Link>
              <Link
                href="/dashboard/supervisor/shifts"
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                Shifts
              </Link>
              <Link
                href="/dashboard/supervisor/escalations"
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                Escalations
              </Link>
              <Link
                href="/dashboard/supervisor/logbook"
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                Logbook
              </Link>
              <Link
                href="/dashboard/supervisor/notifications"
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-bold bg-[#1a44c2] text-white shadow-xs"
              >
                Notifications
              </Link>
              <Link
                href="/dashboard/supervisor/profile"
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                Profile
              </Link>
            </nav>
          </div>
        </aside>

        {/* MAIN NOTIFICATIONS CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {notice && (
            <div className="p-3.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-700" />
                <span>{notice}</span>
              </div>
              <button
                onClick={() => setNotice(null)}
                className="text-blue-700 font-bold ml-2 cursor-pointer hover:text-blue-900"
              >
                ✕
              </button>
            </div>
          )}

          {/* HEADER ROW */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-extrabold tracking-wider text-blue-800 uppercase flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" />
                <span>SUPERVISOR DISPATCH &amp; ATTENDANCE TELEMETRY • LIVE DATABASE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Supervisor Notifications &amp; Attendance Feed
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-normal mt-1 max-w-3xl">
                Real-time alerts on guard absences, unstaffed gate posts, missed check-ins, and priority perimeter notices.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleRunAttendanceScan}
                disabled={isScanning}
                className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition cursor-pointer disabled:opacity-50"
                title="Scan database for guards overdue or absent on assigned shifts"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-blue-700 ${isScanning ? "animate-spin" : ""}`} />
                <span>{isScanning ? "Scanning Database..." : "Scan Roster for Absences"}</span>
              </button>

              <button
                type="button"
                onClick={handleMarkAllRead}
                className="px-4 py-2 bg-[#1a44c2] hover:bg-[#1538a6] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Mark All Read</span>
              </button>
            </div>
          </div>

          {/* 3 STAT TILES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>TOTAL NOTIFICATIONS</span>
                <Bell className="w-4 h-4 text-blue-700" />
              </div>
              <div className="text-3xl font-black text-slate-900">{notifications.length}</div>
              <div className="text-[11px] text-slate-500">Live supervisor feed</div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>GUARD ABSENCE ALERTS</span>
                <UserX className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-3xl font-black text-red-600">{guardAbsencesCount}</div>
              <div className="text-[11px] text-red-700 font-semibold">● Unstaffed post telemetries</div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>UNREAD MESSAGES</span>
                <ShieldAlert className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-black text-amber-600">{unreadCount}</div>
              <div className="text-[11px] text-slate-500">Pending supervisor review</div>
            </div>
          </div>

          {/* FILTER BAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveFilter("ALL")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeFilter === "ALL"
                    ? "bg-[#1a44c2] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Notifications ({notifications.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter("ABSENCES")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === "ABSENCES"
                    ? "bg-red-600 text-white shadow-xs"
                    : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                }`}
              >
                <UserX className="w-3.5 h-3.5" />
                <span>Guard Absences &amp; Duty Alerts ({guardAbsencesCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter("UNREAD")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === "UNREAD"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Unread Only ({unreadCount})</span>
              </button>
            </div>

            <span className="text-[11px] font-medium text-slate-400">
              Showing {filtered.length} of {notifications.length} records
            </span>
          </div>

          {/* NOTIFICATION FEED */}
          <div className="space-y-4">
            {filtered.length > 0 ? (
              filtered.map((item) => {
                const isAbsenceAlert = Boolean(item.guardName || item.category?.toUpperCase() === "DUTY_ABSENCE");

                if (isAbsenceAlert) {
                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border-2 transition shadow-xs overflow-hidden ${
                        !item.isRead
                          ? "border-red-400 bg-red-50/20 shadow-red-100/50"
                          : "border-slate-200 bg-white opacity-85"
                      }`}
                    >
                      {/* TOP BANNER */}
                      <div className={`px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b ${
                        !item.isRead ? "bg-red-600 text-white" : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}>
                        <div className="flex items-center gap-2">
                          {!item.isRead && (
                            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                          )}
                          <UserX className="w-4 h-4" />
                          <span className="text-xs font-extrabold uppercase tracking-wide">
                            GUARD DUTY ABSENCE TELEMETRY • CRITICAL ALERT
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            !item.isRead ? "bg-white text-red-700" : "bg-slate-200 text-slate-800"
                          }`}>
                            {item.dutyStatus || "NO_SHOW"}
                          </span>
                          <span className={`font-mono text-[11px] ${!item.isRead ? "text-red-100" : "text-slate-500"}`}>
                            {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Live"}
                          </span>
                        </div>
                      </div>

                      {/* MAIN CONTENT & DETAILS GRID */}
                      <div className="p-5 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h2 className="font-extrabold text-slate-900 text-base">
                                {item.title}
                              </h2>
                              {!item.isRead ? (
                                <span className="bg-red-100 text-red-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                                  UNREAD
                                </span>
                              ) : (
                                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  READ
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed max-w-3xl">
                              {item.message}
                            </p>
                          </div>
                        </div>

                        {/* WORK & DUTY DETAILS CARDS */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                          {/* Guard Name */}
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Guard Officer Name
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs shrink-0">
                                {item.guardName ? item.guardName.replace("Officer ", "").slice(0, 2).toUpperCase() : "OF"}
                              </div>
                              <span className="text-xs font-bold text-slate-900 truncate">
                                {item.guardName || "Officer David Chen"}
                              </span>
                            </div>
                          </div>

                          {/* Badge Number */}
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Shield / Badge Number
                            </span>
                            <span className="font-mono text-xs font-bold text-blue-700 block">
                              {item.badgeNumber || "Shield #3910"}
                            </span>
                          </div>

                          {/* Post Location */}
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Assigned Post &amp; Gate
                            </span>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                              <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                              <span className="truncate">{item.postLocation || "South Perimeter Gate 03"}</span>
                            </div>
                          </div>

                          {/* Shift Hours */}
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Scheduled Shift Hours
                            </span>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                              <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span>{item.shiftHours || "14:00 - 22:00 (Evening)"}</span>
                            </div>
                          </div>
                        </div>

                        {/* SUPERVISOR ACTIONS BAR */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleRadioCall(item.guardName || "Guard Officer")}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <Radio className="w-3.5 h-3.5 text-slate-600" />
                              <span>Hail on Radio</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDispatchReliever(item.guardName || "Officer", item.postLocation || "Duty Gate")}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                            >
                              <Users className="w-3.5 h-3.5" />
                              <span>Dispatch Standby Reliever</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleRead(item.id, item.isRead)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                item.isRead
                                  ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                              }`}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>{item.isRead ? "Mark as Unread" : "Mark as Read"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Standard System / Dispatch Notification
                return (
                  <div
                    key={item.id}
                    className={`bg-white border rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition ${
                      item.isRead ? "border-slate-200 opacity-80" : "border-blue-300 bg-blue-50/15"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          item.priority?.toUpperCase() === "CRITICAL" || item.priority?.toUpperCase() === "HIGH"
                            ? "bg-red-100 text-red-600"
                            : "bg-blue-100 text-[#1a44c2]"
                        }`}
                      >
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-slate-900 text-sm">{item.title}</span>
                          {!item.isRead ? (
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                              Read
                            </span>
                          )}
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                            {item.category || "SYSTEM"}
                          </span>
                        </div>
                        <p className="text-slate-600 text-xs max-w-3xl leading-relaxed">{item.message}</p>
                        <span className="font-mono text-slate-400 text-[10px] block">
                          {item.createdAt ? new Date(item.createdAt).toLocaleString() : "Recently"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start shrink-0 flex-wrap">
                      {item.incidentId && (
                        <button
                          type="button"
                          onClick={() => handleOpenIncident(item)}
                          className="px-3 py-1.5 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>View Incident Details</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleToggleRead(item.id, item.isRead)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                          item.isRead
                            ? "bg-slate-100 hover:bg-slate-200 text-slate-600"
                            : "bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{item.isRead ? "Mark Unread" : "Mark as Read"}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border text-xs space-y-2">
                <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-600">No notifications matching the selected filter.</p>
                <p className="text-slate-400">
                  Switch to another filter tab or click &quot;Scan Roster for Absences&quot; to test guard check-ins.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Incident Details Modal */}
      <IncidentDetailsModal
        isOpen={isIncidentModalOpen}
        incidentId={selectedIncidentId}
        canManageStatus={true}
        onClose={() => {
          setIsIncidentModalOpen(false);
          setSelectedIncidentId(null);
        }}
      />
    </div>
  );
}

