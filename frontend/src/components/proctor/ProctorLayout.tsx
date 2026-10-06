"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  AlertTriangle,
  Bell,
  UserCheck,
  PhoneCall,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { performLogout } from "@/lib/auth";

export type ProctorTab = "Dashboard" | "Incidents" | "Notifications" | "Profile";

interface ProctorLayoutProps {
  activeTab: ProctorTab;
  children: ReactNode;
  onTabChange?: (tab: ProctorTab) => void;
}

const NAV_ITEMS: { name: ProctorTab; path: string; icon: React.ElementType }[] = [
  { name: "Dashboard", path: "/dashboard/proctor", icon: LayoutDashboard },
  { name: "Incidents", path: "/dashboard/proctor/incidents", icon: AlertTriangle },
  { name: "Notifications", path: "/dashboard/proctor/notifications", icon: Bell },
  { name: "Profile", path: "/dashboard/proctor/profile", icon: UserCheck },
];

export default function ProctorLayout({
  activeTab,
  children,
  onTabChange,
}: ProctorLayoutProps) {
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
                <span className="text-[10px] font-bold tracking-wider text-[#0a2f77] uppercase leading-tight mt-0.5">
                  PROCTOR &amp; DSW
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
              <span className="tracking-wide">SYSTEM ONLINE</span>
            </div>

            {/* Notifications Button */}
            <Link
              href="/dashboard/proctor/notifications"
              onClick={() => onTabChange && onTabChange("Notifications")}
              aria-label="Notifications"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 relative transition cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white"></span>
            </Link>

            {/* Dr. Vance Profile Badge */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <Link
                href="/dashboard/proctor/profile"
                onClick={() => onTabChange && onTabChange("Profile")}
                className="flex items-center gap-2.5 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden bg-[#0a2f77] ring-1 ring-slate-200 relative flex items-center justify-center text-white font-bold text-xs">
                  <Image
                    src="/proctor-vance.jpg"
                    alt="Dr. Arthur Vance"
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <span className="absolute">AV</span>
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-800 transition leading-tight">
                    Dr. Arthur Vance
                  </span>
                  <span className="text-[11px] text-slate-500 leading-tight">
                    DSW Executive Dean #PR-109
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
        {/* LEFT SIDEBAR: EXECUTIVE CONTROLS */}
        <aside className="w-56 shrink-0 hidden md:flex flex-col justify-between">
          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
              Executive Controls
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

          {/* Bottom Card: DSW Status */}
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                DSW STATUS
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                LEVEL BRAVO
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-snug">
              Dean of Student Welfare Jurisdiction active campus-wide.
            </p>
            <div className="pt-1 text-xs font-bold text-slate-800 flex items-center justify-between border-t border-slate-100">
              <span className="flex items-center gap-1.5 text-slate-600">
                <PhoneCall className="w-3.5 h-3.5 text-blue-700" />
                <span>24/7 Hotline</span>
              </span>
              <span className="text-blue-700 font-mono font-bold">x9110</span>
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
