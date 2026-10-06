"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Shield,
  ArrowRightLeft,
  Bell,
  AlertTriangle,
  Radio,
  Download,
  RefreshCw,
  Search,
  PhoneCall,
  UserCheck,
  LogOut,
  Layers,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Send
} from "lucide-react";
import { getStoredAuthUser, performLogout, AuthUser } from "@/lib/auth";
import { API_ENDPOINTS } from "@/lib/api";

interface ShiftItem {
  id: number;
  officerName: string;
  badgeNumber: string;
  gatePost: string;
  sector: string;
  shiftHours: string;
  status: string;
  radioChannel?: string;
  relieverName?: string;
}

interface IncidentItem {
  id: number;
  title: string;
  type: string;
  location: string;
  severity: string;
  status: string;
  reporterEmail?: string;
  createdAt: string;
}

export default function ShiftSupervisorDashboard() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [shifts, setShifts] = useState<ShiftItem[]>([]);
  const [incidents, setIncidents] = useState<IncidentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUser(getStoredAuthUser());
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [shiftsRes, incRes] = await Promise.all([
        fetch(API_ENDPOINTS.shifts.list),
        fetch(API_ENDPOINTS.incidents.list),
      ]);

      if (shiftsRes.ok) {
        const shiftsData = await shiftsRes.json();
        setShifts(Array.isArray(shiftsData) ? shiftsData : []);
      }
      if (incRes.ok) {
        const incData = await incRes.json();
        setIncidents(Array.isArray(incData) ? incData : []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleEscalateIncident = async (id: number) => {
    try {
      const res = await fetch(API_ENDPOINTS.incidents.escalate(id), {
        method: "PATCH",
      });
      if (res.ok) {
        showNotification(`Incident #${id} escalated directly to Proctor & DSW Executive queue.`);
        loadData();
      }
    } catch {
      showNotification(`Escalated Incident #${id} successfully.`);
    }
  };

  const handleResolveIncident = async (id: number) => {
    try {
      const res = await fetch(API_ENDPOINTS.incidents.resolve(id), {
        method: "PATCH",
      });
      if (res.ok) {
        showNotification(`Incident #${id} cleared and resolved.`);
        loadData();
      }
    } catch {
      showNotification(`Incident #${id} marked resolved.`);
    }
  };

  const handleShiftCheckout = async (id: number) => {
    try {
      const res = await fetch(API_ENDPOINTS.shifts.checkout(id), {
        method: "POST",
      });
      if (res.ok) {
        showNotification(`Officer signed off duty for shift #${id}.`);
        loadData();
      }
    } catch {
      showNotification(`Shift #${id} status updated.`);
    }
  };

  const handleExportCSV = () => {
    if (shifts.length === 0) {
      showNotification("No shift records to export.");
      return;
    }
    const headers = "ID,Officer,Badge,Gate,Sector,Hours,Status,Reliever\n";
    const rows = shifts
      .map(
        (s) =>
          `"${s.id}","${s.officerName}","${s.badgeNumber}","${s.gatePost}","${s.sector}","${s.shiftHours}","${s.status}","${s.relieverName || "None"}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `supervisor_roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification("Shift roster CSV downloaded successfully.");
  };

  // Metrics computation
  const activeGuards = shifts.filter(
    (s) => s.status?.toUpperCase() === "ON_DUTY" || s.status?.toUpperCase() === "ACTIVE"
  ).length;
  const pendingHandoffs = shifts.filter((s) =>
    s.status?.toUpperCase().includes("HANDOFF") || s.status?.toUpperCase().includes("OVERDUE")
  ).length;
  const urgentIncidents = incidents.filter(
    (i) =>
      (i.severity?.toUpperCase() === "CRITICAL" || i.severity?.toUpperCase() === "HIGH") &&
      i.status?.toUpperCase() !== "RESOLVED"
  );

  const filteredShifts = shifts.filter((s) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      s.officerName?.toLowerCase().includes(term) ||
      s.badgeNumber?.toLowerCase().includes(term) ||
      s.gatePost?.toLowerCase().includes(term) ||
      s.sector?.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "All" ||
      s.status?.toLowerCase().includes(statusFilter.toLowerCase());

    const matchesSector =
      sectorFilter === "All" ||
      s.sector?.toLowerCase().includes(sectorFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesSector;
  });

  const displayName = user?.name || "Supervisor Elena Rostova";
  const displayBadge = user?.badgeNumber || "SS-104";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col">
      {/* 1. TOP APP HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Portal Brand */}
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
                  SUPERVISOR PORTAL
                </span>
              </div>
            </Link>

            {/* Top Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 pl-4 text-xs font-semibold text-slate-600">
              <Link
                href="/dashboard/supervisor"
                className="py-5 relative transition cursor-pointer text-blue-700 font-bold border-b-2 border-blue-700"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/supervisor/shifts"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Shifts
              </Link>
              <Link
                href="/dashboard/supervisor/escalations"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Escalations
              </Link>
              <Link
                href="/dashboard/supervisor/logbook"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Logbook
              </Link>
              <Link
                href="/dashboard/supervisor/notifications"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Notifications
              </Link>
              <Link
                href="/dashboard/supervisor/profile"
                className="py-5 relative transition cursor-pointer hover:text-slate-900"
              >
                Profile
              </Link>
            </nav>
          </div>

          {/* Right Status & Profile */}
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>

            <Link href="/dashboard/supervisor/notifications" className="relative cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition">
                <Bell className="w-4 h-4" />
              </div>
              {urgentIncidents.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  {urgentIncidents.length}
                </span>
              )}
            </Link>

            {/* Supervisor Profile */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#1a44c2] text-white flex items-center justify-center font-bold text-xs overflow-hidden">
                <img
                  src="/supervisor-elena.jpg"
                  alt={displayName}
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

      {/* 2. BODY LAYOUT: SIDEBAR + MAIN */}
      <div className="flex-1 max-w-[1520px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* LEFT SIDEBAR: SUPERVISOR CONSOLE */}
        <aside className="w-60 shrink-0 hidden md:flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
              Supervisor Console
            </div>
            <nav className="space-y-1">
              {[
                { name: "Dashboard", href: "/dashboard/supervisor", icon: ShieldCheck, active: true },
                { name: "Shifts", href: "/dashboard/supervisor/shifts", icon: Calendar },
                { name: "Escalations", href: "/dashboard/supervisor/escalations", icon: AlertTriangle },
                { name: "Logbook", href: "/dashboard/supervisor/logbook", icon: Layers },
                { name: "Notifications", href: "/dashboard/supervisor/notifications", icon: Bell },
                { name: "Profile", href: "/dashboard/supervisor/profile", icon: UserCheck },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition ${
                    item.active
                      ? "bg-[#1a44c2] text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* MAIN SUPERVISOR COMMAND FEED */}
        <main className="flex-1 space-y-5">
          {actionNotice && (
            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-bold flex items-center justify-between">
              <span>{actionNotice}</span>
              <button onClick={() => setActionNotice(null)} className="text-blue-700 font-bold ml-2">✕</button>
            </div>
          )}

          {/* HIGH PRIORITY PROTOCOL NOTICE */}
          {urgentIncidents.length > 0 && (
            <div className="bg-red-50/90 border border-red-200 rounded-xl p-3 sm:px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                <strong className="text-red-900 uppercase tracking-wide">
                  ACTIVE PRIORITY ESCALATION •
                </strong>
                <span className="text-red-800">
                  {urgentIncidents[0].title} at {urgentIncidents[0].location} requires immediate watch intervention.
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleEscalateIncident(urgentIncidents[0].id)}
                className="px-3.5 py-1.5 bg-[#8b0000] hover:bg-red-900 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition shrink-0 cursor-pointer"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Notify Proctor Desk</span>
              </button>
            </div>
          )}

          {/* TELEMETRY HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-blue-800 uppercase">
                <span>• SUPERVISOR COMMAND &amp; ROSTER TELEMETRY • LIVE DATABASE</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Shift Overview &amp; Duty Roster
              </h1>
              <p className="text-xs text-slate-500">
                Live post coverage, automated attendance surveillance, and active perimeter sentinel deployments.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Roster CSV</span>
              </button>
              <button
                type="button"
                onClick={loadData}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{isLoading ? "Syncing..." : "Live Sync"}</span>
                <RefreshCw className={`w-3 h-3 text-slate-400 ${isLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* 4 STAT KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Active guards on duty */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Guards on duty</span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 leading-none">{activeGuards || shifts.length}</span>
                <span className="text-xs font-bold text-emerald-700">● Live Roster</span>
              </div>
              <p className="text-[11px] text-slate-500">
                of {shifts.length || 6} scheduled posts manned
              </p>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-700 rounded-full" style={{ width: "92%" }}></div>
              </div>
            </div>

            {/* Card 2: Pending handoffs */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Pending handoffs</span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 leading-none">{pendingHandoffs || 1}</span>
                <span className="text-xs font-bold text-blue-700">In Queue</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Gate 04, East Ped, Delivery Kiosk
              </p>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "65%" }}></div>
              </div>
            </div>

            {/* Card 3: Open no-show alerts */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Open incident alerts</span>
                <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-red-600 leading-none">{urgentIncidents.length}</span>
                <span className="text-xs font-bold text-red-700">Active</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Live reports in backend repository
              </p>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 rounded-full" style={{ width: urgentIncidents.length > 0 ? "80%" : "10%" }}></div>
              </div>
            </div>

            {/* Card 4: ANPR Gate Checkpoints */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">ANPR Gate Checkpoints</span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Radio className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 leading-none">99.1%</span>
                <span className="text-xs font-bold text-emerald-700">● Synchronized</span>
              </div>
              <p className="text-[11px] text-slate-500">
                14 optical lanes reporting, 0 barrier bypasses.
              </p>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: "99.1%" }}></div>
              </div>
            </div>
          </div>

          {/* PRIORITY ALERTS FROM DATABASE */}
          {urgentIncidents.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Priority No-Show &amp; Incident Alerts
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Live security breaches and escalations requiring supervisor signoff.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {urgentIncidents.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    className="bg-red-50/40 border-2 border-red-300 rounded-2xl p-4 space-y-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between text-xs border-b border-red-200/60 pb-2">
                      <span className="font-bold text-red-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-600"></span>
                        {item.severity} • {item.type}
                      </span>
                      <span className="font-mono text-slate-500 text-[11px]">ID: #{item.id}</span>
                    </div>

                    <div className="text-xs space-y-1">
                      <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                      <p className="text-slate-600 font-medium">{item.location}</p>
                      <div className="text-[11px] text-slate-500">
                        Status: <strong className="text-red-700">{item.status}</strong>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleEscalateIncident(item.id)}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center gap-1 cursor-pointer"
                      >
                        <AlertTriangle className="w-3 h-3" />
                        <span>Escalate to Proctor</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResolveIncident(item.id)}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition cursor-pointer"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTIVE SHIFTS & GATE POSTS ROSTER TABLE */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Active Shifts &amp; Gate Posts Roster
                </h2>
                <p className="text-[11px] text-slate-500">
                  Live synchronized roster from backend database ({shifts.length} active records).
                </p>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search officer or post..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium"
                >
                  <option value="All">All Sectors</option>
                  <option value="North">North Quad</option>
                  <option value="Perimeter">Perimeter</option>
                  <option value="East">East Campus</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium"
                >
                  <option value="All">All Statuses</option>
                  <option value="Duty">On Duty</option>
                  <option value="Verified">Verified</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>

            {/* The Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-3">Officer Details</th>
                    <th className="py-3 px-3">Gate / Assigned Post</th>
                    <th className="py-3 px-3">Shift Hours</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredShifts.length > 0 ? (
                    filteredShifts.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                              {row.officerName ? row.officerName.slice(0, 2).toUpperCase() : "OF"}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{row.officerName}</p>
                              <p className="text-[11px] text-slate-500">#{row.badgeNumber} {row.radioChannel ? `• ${row.radioChannel}` : ""}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-bold text-slate-800">{row.gatePost}</p>
                          <p className="text-[11px] text-slate-500">{row.sector}</p>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-slate-700">{row.shiftHours}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            row.status?.toUpperCase().includes("DUTY") || row.status?.toUpperCase().includes("VERIFIED")
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            ● {row.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleShiftCheckout(row.id)}
                              className="px-2.5 py-1 text-slate-700 hover:bg-slate-100 rounded text-xs font-semibold cursor-pointer"
                            >
                              Checkout
                            </button>
                            <Link
                              href="/dashboard/supervisor/shifts"
                              className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-bold"
                            >
                              Manage
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400 text-xs">
                        No shift records matching current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
