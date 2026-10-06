"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  QrCode,
  AlertTriangle,
  Bell,
  UserCheck,
  LayoutDashboard,
  LogOut,
  PhoneCall
} from "lucide-react";
import { performLogout } from "@/lib/auth";

export type StudentTab = "Dashboard" | "My QR code" | "Report incident" | "Notifications" | "Profile";

interface StudentLayoutProps {
  activeTab: StudentTab;
  children: ReactNode;
  onTabChange?: (tab: StudentTab) => void;
}

const NAV_ITEMS: { name: StudentTab; path: string; icon: React.ElementType }[] = [
  { name: "Dashboard", path: "/dashboard/student", icon: LayoutDashboard },
  { name: "My QR code", path: "/dashboard/student/qr", icon: QrCode },
  { name: "Report incident", path: "/dashboard/student/report", icon: AlertTriangle },
  { name: "Notifications", path: "/dashboard/student/notifications", icon: Bell },
  { name: "Profile", path: "/dashboard/student/profile", icon: UserCheck },
];

export default function StudentLayout({
  activeTab,
  children,
  onTabChange,
}: StudentLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col antialiased">
      {/* 1. TOP APP HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Student Portal Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#0a2f77] flex items-center justify-center text-white shadow-xs group-hover:bg-[#082660] transition">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-slate-900 leading-none">
                  CampusGuard
                </span>
                <span className="text-[10px] font-bold tracking-wider text-[#0a2f77] uppercase leading-tight mt-0.5">
                  STUDENT &amp; STAFF
                </span>
              </div>
            </Link>

            {/* Top Navigation Links - Styled like the screenshot pills */}
            <nav className="hidden md:flex items-center gap-1.5 pl-4">
              {NAV_ITEMS.map((item) => {
                const isActive = activeTab === item.name;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={() => onTabChange && onTabChange(item.name)}
                    className={`px-4 py-1.5 rounded-md text-xs transition font-semibold cursor-pointer ${
                      isActive
                        ? "bg-[#0a2f77] text-white font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Status & Profile */}
          <div className="flex items-center gap-3">
            {/* System Online Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="tracking-wide">System Online</span>
            </div>

            {/* Notifications Button */}
            <Link
              href="/dashboard/student/notifications"
              onClick={() => onTabChange && onTabChange("Notifications")}
              aria-label="Notifications"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 relative transition cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white"></span>
            </Link>

            {/* Alex Morgan Profile Badge */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <Link
                href="/dashboard/student/profile"
                onClick={() => onTabChange && onTabChange("Profile")}
                className="flex items-center gap-2.5 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden bg-[#0a2f77] ring-1 ring-slate-200 relative flex items-center justify-center text-white font-bold text-xs">
                  <Image
                    src="/student-alex.jpg"
                    alt="Alex Morgan"
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <span className="absolute">AM</span>
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-800 transition leading-tight">
                    Alex Morgan <span className="text-slate-500 font-normal">#STU-88201</span>
                  </span>
                  <span className="text-[11px] text-slate-500 leading-tight">
                    Dept. of Computer Science
                  </span>
                </div>
              </Link>
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
        {/* LEFT SIDEBAR: STUDENT ACCESS */}
        <aside className="w-56 shrink-0 hidden md:flex flex-col justify-between">
          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
              Student / Staff Portal
            </div>
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeTab === item.name;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={() => onTabChange && onTabChange(item.name)}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      isActive
                        ? "bg-[#0a2f77] text-white font-bold shadow-xs"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Card: Identity Pass */}
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                IDENTITY PASS
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>CAMPUS SECURE</span>
            </div>
            <div className="pt-1 text-xs font-bold text-slate-800 flex items-center justify-between border-t border-slate-100">
              <span className="text-slate-500 font-medium">Hotline</span>
              <span className="text-blue-700 font-mono font-bold">x9110 (24/7)</span>
            </div>
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
