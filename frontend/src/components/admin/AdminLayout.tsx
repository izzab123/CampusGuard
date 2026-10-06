"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  LayoutGrid,
  Users,
  Shield,
  User,
  Bell,
  LogOut,
  Power
} from "lucide-react";
import { performLogout } from "@/lib/auth";

export type AdminTab = "Dashboard" | "Users & Roles" | "Security Audit Logs" | "Profile";

interface AdminLayoutProps {
  activeTab: AdminTab;
  children: ReactNode;
  onTabChange?: (tab: AdminTab) => void;
}

const NAV_ITEMS: { name: AdminTab; path: string; icon: React.ElementType; badge?: string; badgeColor?: string }[] = [
  { name: "Dashboard", path: "/dashboard/admin", icon: LayoutGrid },
  { name: "Users & Roles", path: "/dashboard/admin/users", icon: Users, badge: "5 Seed", badgeColor: "bg-slate-100 text-slate-700" },
  { name: "Security Audit Logs", path: "/dashboard/admin/audit-logs", icon: Shield, badge: "Live", badgeColor: "bg-blue-100 text-blue-700" },
  { name: "Profile", path: "/dashboard/admin/profile", icon: User },
];

export default function AdminLayout({
  activeTab,
  children,
  onTabChange,
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col antialiased">
      {/* 1. TOP APP HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Portal Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#0a2f77] flex items-center justify-center text-white shadow-xs group-hover:bg-[#082660] transition">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-slate-900 leading-none">
                  CampusGuard
                </span>
                <span className="text-[10px] font-bold tracking-wider text-rose-700 uppercase leading-tight mt-0.5">
                  SYSTEM ADMINISTRATION
                </span>
              </div>
            </Link>

            {/* Top Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 pl-4 text-xs font-semibold text-slate-600">
              {[
                { name: "Dashboard" as AdminTab, label: "Dashboard", path: "/dashboard/admin" },
                { name: "Users & Roles" as AdminTab, label: "Users & Roles", path: "/dashboard/admin/users" },
                { name: "Security Audit Logs" as AdminTab, label: "Audit Logs", path: "/dashboard/admin/audit-logs" },
                { name: "Profile" as AdminTab, label: "Profile", path: "/dashboard/admin/profile" },
              ].map((item) => {
                const isActive = activeTab === item.name;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={() => onTabChange && onTabChange(item.name)}
                    className={`py-5 relative transition cursor-pointer ${
                      isActive
                        ? "text-blue-700 font-bold border-b-2 border-blue-700"
                        : "hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Status & Profile Controls */}
          <div className="flex items-center gap-3">
            {/* Status Indicator Badge (Audit Level or Root Clearance) */}
            {activeTab === "Security Audit Logs" ? (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                <span>ROOT CLEARANCE • AUDIT LEVEL 4</span>
              </div>
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse hidden sm:inline-block"></span>
            )}

            {/* Bell Icon */}
            <Link
              href="/dashboard/admin/audit-logs"
              aria-label="Audit Alerts"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 relative transition cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white"></span>
            </Link>

            {/* System Admin Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <Link
                href="/dashboard/admin/profile"
                onClick={() => onTabChange && onTabChange("Profile")}
                className="w-9 h-9 rounded-full bg-[#0a2f77] text-white flex items-center justify-center font-bold text-xs shadow-xs hover:bg-[#082660] transition cursor-pointer"
                title="System Administrator Profile"
              >
                SA
              </Link>
              <Link
                href="/dashboard/admin/profile"
                onClick={() => onTabChange && onTabChange("Profile")}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
                title="System Administrator Details"
              >
                <User className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => performLogout()}
                title="Log out"
                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. BODY LAYOUT: SIDEBAR + MAIN */}
      <div className="flex-1 max-w-[1520px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* LEFT SIDEBAR: ONLY DASHBOARD, USERS & ROLES, SECURITY AUDIT LOGS, PROFILE */}
        <aside className="w-60 shrink-0 hidden md:flex flex-col justify-between">
          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
              ADMIN CONTROL CENTER
            </div>
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeTab === item.name;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={() => onTabChange && onTabChange(item.name)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      isActive
                        ? "bg-[#0a2f77] text-white font-bold shadow-xs"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          isActive ? "bg-white/20 text-white" : item.badgeColor
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 space-y-5">
          {children}
        </main>
      </div>
    </div>
  );
}
