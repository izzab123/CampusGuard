"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Shield,
  KeyRound,
  Server,
  Download,
  Search,
  ChevronRight,
  RefreshCw,
  PlusCircle,
  FileText,
  AlertTriangle,
  Database,
  Clock,
  Sliders,
  CheckCircle2
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api";

interface UserItem {
  id: number;
  name: string;
  email: string;
  role: string;
  badgeNumber: string;
  department: string;
  enabled?: boolean;
}

export default function AdminDashboardView() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [incidentCount, setIncidentCount] = useState(0);
  const [auditCount, setAuditCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [isLoading, setIsLoading] = useState(false);

  // No-Show Grace Period Configuration
  const [gracePeriod, setGracePeriod] = useState<number>(15);
  const [inputGracePeriod, setInputGracePeriod] = useState<number>(15);
  const [configUpdatedBy, setConfigUpdatedBy] = useState<string>("System Administrator");
  const [configUpdatedAt, setConfigUpdatedAt] = useState<string>("");
  const [isSavingConfig, setIsSavingConfig] = useState<boolean>(false);
  const [configNotice, setConfigNotice] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [uRes, iRes, aRes, cfgRes] = await Promise.all([
        fetch(API_ENDPOINTS.auth.users),
        fetch(API_ENDPOINTS.incidents.list),
        fetch(API_ENDPOINTS.auditLogs.list),
        fetch(API_ENDPOINTS.attendance.config),
      ]);

      if (uRes.ok) {
        const uData = await uRes.json();
        setUsers(Array.isArray(uData) ? uData : []);
      }
      if (iRes.ok) {
        const iData = await iRes.json();
        setIncidentCount(Array.isArray(iData) ? iData.length : 0);
      }
      if (aRes.ok) {
        const aData = await aRes.json();
        setAuditCount(Array.isArray(aData) ? aData.length : 0);
      }
      if (cfgRes.ok) {
        const cfgData = await cfgRes.json();
        if (cfgData.gracePeriodMinutes) {
          setGracePeriod(cfgData.gracePeriodMinutes);
          setInputGracePeriod(cfgData.gracePeriodMinutes);
          if (cfgData.updatedBy) setConfigUpdatedBy(cfgData.updatedBy);
          if (cfgData.updatedAt) setConfigUpdatedAt(cfgData.updatedAt);
        }
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGracePeriod = async () => {
    if (!inputGracePeriod || inputGracePeriod < 1) {
      alert("Grace period must be at least 1 minute.");
      return;
    }
    setIsSavingConfig(true);
    setConfigNotice(null);
    try {
      const res = await fetch(API_ENDPOINTS.attendance.config, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-User-Role": "Security Admin",
          "X-User-Name": "System Administrator",
        },
        body: JSON.stringify({ gracePeriodMinutes: inputGracePeriod }),
      });
      if (res.ok) {
        const data = await res.json();
        setGracePeriod(data.gracePeriodMinutes);
        if (data.updatedBy) setConfigUpdatedBy(data.updatedBy);
        if (data.updatedAt) setConfigUpdatedAt(data.updatedAt);
        setConfigNotice(`Successfully updated No-Show Grace Period to ${data.gracePeriodMinutes} minutes.`);
        setTimeout(() => setConfigNotice(null), 5000);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update configuration.");
      }
    } catch {
      alert("Network error connecting to backend.");
    } finally {
      setIsSavingConfig(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.badgeNumber?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q);

    const matchesRole = selectedRole === "All" || u.role?.toLowerCase() === selectedRole.toLowerCase();

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-rose-800 uppercase">
            <span>• CAMPUSGUARD INSTITUTIONAL GOVERNANCE • ROOT ACCESS • LIVE DATABASE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            System Administration &amp; Access Control
          </h1>
          <p className="text-xs text-slate-500">
            Manage user credentials, institutional role permissions, active session tokens, and security telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadDashboardData}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{isLoading ? "Syncing..." : "Database Sync"}</span>
            <RefreshCw className={`w-3 h-3 text-slate-400 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* 4 STAT KPI TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Provisioned Users</span>
            <Users className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 leading-none">{users.length}</div>
          <p className="text-[11px] text-slate-500">Active credentials stored</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Recorded Incidents</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-700 leading-none">{incidentCount}</div>
          <p className="text-[11px] text-slate-500">Campus incident reports</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Security Audit Logs</span>
            <FileText className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-extrabold text-rose-700 leading-none">{auditCount}</div>
          <p className="text-[11px] text-slate-500">Immutable ledger events</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Database Persistence</span>
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 leading-none">Online</div>
          <p className="text-[11px] text-slate-500">SQLite backend / JPA Active</p>
        </div>
      </div>

      {/* ADMIN CONFIGURATION: ATTENDANCE & NO-SHOW GRACE PERIOD */}
      <div className="bg-gradient-to-br from-white via-slate-50/50 to-blue-50/20 border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Guard Attendance &amp; No-Show Detection Policy</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 tracking-wider">
                  Active Rule
                </span>
              </h2>
              <p className="text-[11px] text-slate-500">
                Configure shift grace period (X minutes). Automatically marks unstaffed duties as No-Show.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Current Grace Period:</span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 font-mono font-extrabold text-sm">
              {gracePeriod} min
            </span>
          </div>
        </div>

        {configNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{configNotice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Shift Start Grace Period (X in minutes)</span>
            </label>
            <p className="text-[11px] text-slate-500">
              If a guard has no check-in record <strong className="text-slate-800">{inputGracePeriod} minutes</strong> after their scheduled shift start, the system automatically flags the duty as <strong className="text-rose-700">No-show</strong>.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1.5">
              {[5, 10, 15, 20, 30, 45].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setInputGracePeriod(preset)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    inputGracePeriod === preset
                      ? "bg-blue-700 text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {preset}m
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:justify-end">
            <div className="relative">
              <input
                type="number"
                min={1}
                max={180}
                value={inputGracePeriod}
                onChange={(e) => setInputGracePeriod(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 px-3 py-2 text-sm font-mono font-bold bg-white border border-slate-300 rounded-xl text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium pointer-events-none">
                min
              </span>
            </div>

            <button
              type="button"
              onClick={handleSaveGracePeriod}
              disabled={isSavingConfig}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isSavingConfig ? "Saving..." : "Save Policy"}</span>
            </button>
          </div>
        </div>

        {/* Protection Exclusions Summary */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
            <span>
              <strong>Guaranteed Protections:</strong> Guards who have <em>checked in</em>, duties that have been <em>reassigned</em>, or guards on <em>approved leave</em> are permanently protected and will never be marked as no-show.
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono shrink-0">
            Enforced by Sentinel • Author: {configUpdatedBy}
          </div>
        </div>
      </div>

      {/* RECENT ACCOUNTS ROSTER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Live Accounts Directory ({filteredUsers.length} Users)
            </h2>
            <p className="text-[11px] text-slate-500">All registered institutional user accounts.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-semibold"
            >
              <option value="All">All Roles</option>
              <option value="Student">Student</option>
              <option value="Proctor and DSW">Proctor and DSW</option>
              <option value="Security Guard">Security Guard</option>
              <option value="Shift Supervisor">Shift Supervisor</option>
              <option value="Admin">Admin</option>
            </select>
            <Link
              href="/dashboard/admin/users"
              className="px-3 py-1.5 bg-[#0a2f77] text-white rounded-lg text-xs font-bold hover:bg-[#082660] transition"
            >
              Manage Users
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-3">User</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Identifier</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-3">
                      <div>
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{u.department || "Campus"}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">#{u.badgeNumber || "NA"}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold ${
                        u.enabled !== false ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.enabled !== false ? "bg-emerald-600" : "bg-red-600"}`}></span>
                        {u.enabled !== false ? "Active" : "Suspended"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No users matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
