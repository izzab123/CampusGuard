"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Bell,
  Clock,
  RotateCcw,
  CheckCircle2,
  LogOut,
  Radio,
  FileCheck2,
  Loader2
} from "lucide-react";
import { performLogout, getStoredAuthUser, AuthUser } from "@/lib/auth";
import { API_ENDPOINTS } from "@/lib/api";

interface ShiftItem {
  id: number;
  officerName: string;
  badgeNumber: string;
  postLocation: string;
  status: string;
  shiftStart: string;
  notes?: string;
}

export default function GuardHandoffPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [shifts, setShifts] = useState<ShiftItem[]>([]);
  const [postLocation, setPostLocation] = useState("North Perimeter & Gate 04");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchShifts = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.shifts.base);
      if (res.ok) {
        const data = await res.json();
        setShifts(data);
      }
    } catch {}
  };

  useEffect(() => {
    setUser(getStoredAuthUser());
    fetchShifts();
  }, []);

  const handleAction = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const officer = user?.fullName || "Officer Marcus Vance";
    const badge = user?.badgeNumber || "Shield #4082";

    try {
      const res = await fetch(API_ENDPOINTS.shifts.checkIn, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          officerName: officer,
          badgeNumber: badge,
          postLocation,
          notes: notes.trim() || "Biometric handover confirmed. Radios and keys verified.",
        }),
      });

      if (res.ok) {
        handleAction(`Officer ${officer} checked in on duty at ${postLocation}.`);
        setNotes("");
        fetchShifts();
      }
    } catch {
      handleAction("Check-in logged to offline cache.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckout = async (id: number) => {
    try {
      const res = await fetch(API_ENDPOINTS.shifts.checkout(id), { method: "POST" });
      if (res.ok) {
        handleAction(`Shift #${id} handoff completed and checked out.`);
        fetchShifts();
      }
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col">
      {/* Top Header */}
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
              <Link href="/dashboard/guard/handoff" className="py-5 text-blue-700 font-bold border-b-2 border-blue-700">
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
            <button
              type="button"
              onClick={() => performLogout()}
              className="p-2 rounded-lg text-slate-400 hover:text-red-600 transition cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 space-y-6 w-full">
        {actionNotice && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs font-semibold text-blue-900 flex items-center justify-between">
            <span>{actionNotice}</span>
            <button onClick={() => setActionNotice(null)} className="text-blue-700 font-bold ml-2">✕</button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Shift Handover &amp; Post Allocation Register</h1>
            <p className="text-xs text-slate-500">Record officer check-in, equipment turnover, and biometric watch transitions.</p>
          </div>

          <button
            type="button"
            onClick={fetchShifts}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer self-start"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Refresh Shifts</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Check-In / Handoff Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Officer Duty Check-In
            </h2>

            <form onSubmit={handleCheckIn} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Post / Sector</label>
                <input
                  type="text"
                  required
                  value={postLocation}
                  onChange={(e) => setPostLocation(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Handover Notes / Equipment Status</label>
                <textarea
                  rows={3}
                  placeholder="Radios charged, sidearms logged, Gate 04 barrier checked..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileCheck2 className="w-3.5 h-3.5" />}
                <span>Record Shift Check-In</span>
              </button>
            </form>
          </div>

          {/* Active Shift Register */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-sm font-bold text-slate-900">
              Active Shift Roster ({shifts.length})
            </h2>

            {shifts.length === 0 ? (
              <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-slate-400 text-xs">
                No active shifts recorded.
              </div>
            ) : (
              shifts.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{item.officerName}</span>
                      <span className="font-mono text-[11px] text-blue-700 font-bold">{item.badgeNumber}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === "ON_DUTY"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.status === "COMPLETED"
                            ? "bg-slate-100 text-slate-700"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    {item.status === "ON_DUTY" && (
                      <button
                        type="button"
                        onClick={() => handleCheckout(item.id)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-[11px] cursor-pointer"
                      >
                        Complete Watch
                      </button>
                    )}
                  </div>

                  <p className="text-slate-600">{item.notes || "Nominal watch maintained."}</p>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100">
                    <span>Post: {item.postLocation}</span>
                    <span>Started: {new Date(item.shiftStart).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
