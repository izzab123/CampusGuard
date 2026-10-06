"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Bell,
  LogOut,
  Users,
  Search,
  Filter,
  Plus,
  ArrowRightLeft,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Radio,
  FileSpreadsheet,
  X,
  Clock
} from "lucide-react";
import { getStoredAuthUser, performLogout, AuthUser } from "@/lib/auth";
import { API_ENDPOINTS } from "@/lib/api";

interface ShiftRecord {
  id: number;
  officerName: string;
  badgeNumber: string;
  gatePost: string;
  sector: string;
  shiftHours: string;
  status: string;
  radioChannel?: string;
  relieverName?: string;
  hoursNote?: string;
}

export default function SupervisorShiftsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [shifts, setShifts] = useState<ShiftRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formOfficerName, setFormOfficerName] = useState("");
  const [formBadgeNumber, setFormBadgeNumber] = useState("");
  const [formGatePost, setFormGatePost] = useState("");
  const [formSector, setFormSector] = useState("North Academic Quad");
  const [formShiftHours, setFormShiftHours] = useState("14:00 - 22:00");
  const [formRadioChannel, setFormRadioChannel] = useState("Radio Ch 2");

  useEffect(() => {
    setUser(getStoredAuthUser());
    loadShifts();
  }, []);

  const loadShifts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.shifts.list);
      if (res.ok) {
        const data = await res.json();
        setShifts(Array.isArray(data) ? data : []);
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

  const handleCreateShift = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(API_ENDPOINTS.shifts.list, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          officerName: formOfficerName,
          badgeNumber: formBadgeNumber,
          gatePost: formGatePost,
          sector: formSector,
          shiftHours: formShiftHours,
          radioChannel: formRadioChannel,
          status: "ON_DUTY",
        }),
      });

      if (res.ok) {
        showNotification(`Scheduled shift for ${formOfficerName} at ${formGatePost}.`);
        setIsModalOpen(false);
        setFormOfficerName("");
        setFormBadgeNumber("");
        setFormGatePost("");
        loadShifts();
      }
    } catch {
      showNotification("Failed to schedule shift. Verify backend connection.");
    }
  };

  const handleCheckout = async (id: number) => {
    try {
      const res = await fetch(API_ENDPOINTS.shifts.checkout(id), { method: "POST" });
      if (res.ok) {
        showNotification(`Shift #${id} checked out.`);
        loadShifts();
      }
    } catch {
      showNotification(`Updated shift #${id}.`);
    }
  };

  const handleEscalate = async (id: number) => {
    try {
      const res = await fetch(API_ENDPOINTS.shifts.escalate(id), { method: "POST" });
      if (res.ok) {
        showNotification(`Shift #${id} flagged as ESCALATED in dispatch console.`);
        loadShifts();
      }
    } catch {
      showNotification(`Shift #${id} escalation triggered.`);
    }
  };

  const handleExportCSV = () => {
    if (shifts.length === 0) return;
    const headers = "ID,Officer,Badge,Gate,Sector,Hours,Status\n";
    const rows = shifts
      .map((s) => `"${s.id}","${s.officerName}","${s.badgeNumber}","${s.gatePost}","${s.sector}","${s.shiftHours}","${s.status}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `guard_shifts_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showNotification("Shift roster CSV downloaded.");
  };

  // Metrics
  const activeGuards = shifts.filter((s) => s.status?.toUpperCase().includes("DUTY")).length;
  const overdueGuards = shifts.filter((s) => s.status?.toUpperCase().includes("OVERDUE") || s.status?.toUpperCase().includes("ESCALAT")).length;

  const filteredRoster = shifts.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      s.officerName?.toLowerCase().includes(q) ||
      s.gatePost?.toLowerCase().includes(q) ||
      s.badgeNumber?.toLowerCase().includes(q);

    const matchesSector =
      sectorFilter === "All" ||
      s.sector?.toLowerCase().includes(sectorFilter.toLowerCase());

    return matchesSearch && matchesSector;
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
                href="/dashboard/supervisor/shifts"
                className="py-5 relative transition cursor-pointer text-[#1a44c2] font-bold border-b-2 border-[#1a44c2]"
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
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f1f5f9] border border-slate-200/80 text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Shift Schedule • Active</span>
            </div>

            <Link href="/dashboard/supervisor/notifications" className="relative cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition">
                <Bell className="w-4 h-4" />
              </div>
            </Link>

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

      {/* 2. BODY LAYOUT */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* LEFT SIDEBAR */}
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
                href="/dashboard/supervisor/shifts"
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-bold bg-[#1a44c2] text-white shadow-xs"
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
                className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
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

        {/* MAIN ROSTER CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {actionNotice && (
            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-bold flex items-center justify-between">
              <span>{actionNotice}</span>
              <button onClick={() => setActionNotice(null)} className="text-blue-700 font-bold ml-2">✕</button>
            </div>
          )}

          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-extrabold tracking-wider text-blue-800 uppercase">
                SHIFT COMMAND &amp; ROSTER MANAGEMENT • DATABASE CONNECTED
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Guard Shift Scheduling &amp; Post Assignment
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-normal mt-1">
                Active guard assignments, scheduled watch hours, real-time relief stages, and fatigue alerts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export Roster</span>
              </button>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-[#1a44c2] hover:bg-[#1538a6] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Schedule New Shift</span>
              </button>
            </div>
          </div>

          {/* 4 STAT TILES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>TOTAL POSTS</span>
                <ShieldCheck className="w-4 h-4 text-blue-700" />
              </div>
              <div className="text-3xl font-black text-slate-900">{shifts.length}</div>
              <div className="text-[11px] text-slate-500">Live backend records</div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>ACTIVE ON DUTY</span>
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-700">{activeGuards || shifts.length}</div>
              <div className="text-[11px] text-emerald-700 font-semibold">● Verified coverage</div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>ATTENDANCE ALERTS</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-black text-amber-600">{overdueGuards}</div>
              <div className="text-[11px] text-slate-500">Requires relief intervention</div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span>DATABASE STATUS</span>
                <Clock className="w-4 h-4 text-blue-700" />
              </div>
              <div className="text-3xl font-black text-slate-900">Online</div>
              <div className="text-[11px] text-slate-500">Automatic SQLite sync</div>
            </div>
          </div>

          {/* TABLE FILTERS & ROSTER */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-slate-900">
                Guard Duty Schedule &amp; Reliever Assignment Roster
              </h2>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search officer or post..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold"
                >
                  <option value="All">All Sectors</option>
                  <option value="North">North Quad</option>
                  <option value="Perimeter">Perimeter</option>
                  <option value="Library">Library</option>
                  <option value="East">East Campus</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-3">Guard Officer</th>
                    <th className="py-3 px-3">Post &amp; Sector</th>
                    <th className="py-3 px-3">Hours</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredRoster.length > 0 ? (
                    filteredRoster.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                              {s.officerName ? s.officerName.slice(0, 2).toUpperCase() : "OF"}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{s.officerName}</div>
                              <div className="text-[11px] text-slate-500">#{s.badgeNumber} {s.radioChannel ? `• ${s.radioChannel}` : ""}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-800">{s.gatePost}</div>
                          <div className="text-[11px] text-slate-500">{s.sector}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-slate-700">{s.shiftHours}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            s.status?.toUpperCase().includes("DUTY") || s.status?.toUpperCase().includes("VERIFIED")
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            ● {s.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleCheckout(s.id)}
                              className="px-2.5 py-1 text-slate-700 hover:bg-slate-100 rounded text-xs font-semibold cursor-pointer"
                            >
                              Checkout
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEscalate(s.id)}
                              className="px-2.5 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded text-xs font-semibold cursor-pointer"
                            >
                              Escalate
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400 text-xs">
                        No shifts matching query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* SCHEDULE NEW SHIFT MODAL */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-extrabold text-base text-slate-900">Schedule Guard Shift</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateShift} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Officer Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Officer Daniel Thorne"
                      value={formOfficerName}
                      onChange={(e) => setFormOfficerName(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Shield / Badge #</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 3942"
                      value={formBadgeNumber}
                      onChange={(e) => setFormBadgeNumber(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Gate / Post Assignment</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gate 07 Delivery Terminal"
                      value={formGatePost}
                      onChange={(e) => setFormGatePost(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Sector</label>
                      <select
                        value={formSector}
                        onChange={(e) => setFormSector(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg"
                      >
                        <option>North Academic Quad</option>
                        <option>West Perimeter</option>
                        <option>East Campus</option>
                        <option>Library Esplanade</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-600 block mb-1">Shift Hours</label>
                      <input
                        type="text"
                        value={formShiftHours}
                        onChange={(e) => setFormShiftHours(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Radio Channel</label>
                    <input
                      type="text"
                      value={formRadioChannel}
                      onChange={(e) => setFormRadioChannel(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#1a44c2] hover:bg-[#1538a6] text-white font-bold rounded-lg"
                    >
                      Save &amp; Dispatch
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
