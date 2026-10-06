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
  Database
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

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [uRes, iRes, aRes] = await Promise.all([
        fetch(API_ENDPOINTS.auth.users),
        fetch(API_ENDPOINTS.incidents.list),
        fetch(API_ENDPOINTS.auditLogs.list),
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
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
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
