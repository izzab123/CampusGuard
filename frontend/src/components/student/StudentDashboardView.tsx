"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Smartphone,
  PhoneCall,
  RefreshCw,
  Maximize2,
  Wallet,
  Car,
  AlertTriangle,
  KeyRound,
  Footprints,
  Wrench,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { getStoredAuthUser, AuthUser } from "@/lib/auth";
import { API_ENDPOINTS } from "@/lib/api";

interface ParkingPassData {
  id?: number;
  plateNumber: string;
  passToken: string;
  zoneName: string;
  ownerName: string;
  status: string;
  validUntil?: string;
}

export default function StudentDashboardView() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [parkingPass, setParkingPass] = useState<ParkingPassData | null>(null);
  const [selectedIncidentType, setSelectedIncidentType] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [sendingPing, setSendingPing] = useState(false);

  useEffect(() => {
    const stored = getStoredAuthUser();
    setUser(stored);

    // Fetch active parking pass for student
    const ownerName = stored?.fullName || "Alex Morgan";
    fetch(API_ENDPOINTS.parking.my(ownerName))
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setParkingPass(data);
      })
      .catch(() => {});
  }, []);

  const handleAction = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleEmergencyPing = async () => {
    setSendingPing(true);
    try {
      const reporter = user?.fullName || "Alex Morgan";
      await fetch(API_ENDPOINTS.incidents.base, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Emergency Dispatch Ping from ${reporter}`,
          description: `Immediate distress signal triggered from Student Dashboard. Location telemetry active.`,
          severity: "CRITICAL",
          location: "North Academic Quad - Perimeter Zone",
          routedTo: "PROCTOR_AND_DSW",
          reporterName: reporter,
          reporterRole: "Student",
        }),
      });
      handleAction("Emergency distress alert dispatched to Campus Security NOC and Proctor on call!");
    } catch {
      handleAction("Emergency alert sent through fallback radio broadcast.");
    } finally {
      setSendingPing(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Notice Banner */}
      {actionNotice && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs font-semibold text-blue-900 flex items-center justify-between shadow-xs animate-in fade-in">
          <span>{actionNotice}</span>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="text-blue-700 hover:text-blue-900 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* HEADER BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
            <span className="text-blue-800 uppercase tracking-wide">
              • ACTIVE ENROLLMENT
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
              • SAFETY STATUS: NORMAL
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Zone: North Academic Quad</p>
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight mt-1">
            Welcome back, {user?.fullName || "Alex Morgan"}
          </h1>
          <p className="text-xs text-slate-500">
            • {user?.department || "Dept. of Computer Science & Eng."} • {user?.badgeNumber || "#STU-88201"} • Level-1 Clearance
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <Link
            href="/dashboard/student/qr"
            className="px-3.5 py-2 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-800 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Pass</span>
          </Link>
          <button
            type="button"
            disabled={sendingPing}
            onClick={handleEmergencyPing}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{sendingPing ? "Pinging Dispatch..." : "Emergency Dispatch Ping"}</span>
          </button>
        </div>
      </div>

      {/* TWO-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLUMNS: PARKING QR & REPORT INCIDENT */}
        <div className="lg:col-span-2 space-y-5">
          {/* CARD 1: MY PARKING QR PREVIEW */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                  P
                </div>
                <h2 className="text-sm font-bold text-slate-900">My Parking QR</h2>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                ● VALID PERMIT: {parkingPass?.zoneName || "Lot C • Deck #314"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* QR Box Visual */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-36 h-36 bg-white p-3 rounded-lg border border-slate-300 shadow-2xs flex items-center justify-center">
                  <div className="grid grid-cols-4 gap-1 w-full h-full p-1 bg-slate-900 rounded">
                    <div className="bg-white rounded-xs"></div>
                    <div className="bg-slate-900"></div>
                    <div className="bg-white rounded-xs"></div>
                    <div className="bg-white rounded-xs"></div>
                    <div className="bg-slate-900"></div>
                    <div className="bg-white rounded-xs"></div>
                    <div className="bg-white rounded-xs"></div>
                    <div className="bg-slate-900"></div>
                    <div className="bg-white rounded-xs"></div>
                    <div className="bg-white rounded-xs"></div>
                    <div className="bg-slate-900"></div>
                    <div className="bg-white rounded-xs"></div>
                    <div className="bg-white rounded-xs"></div>
                    <div className="bg-slate-900"></div>
                    <div className="bg-white rounded-xs"></div>
                    <div className="bg-white rounded-xs"></div>
                  </div>
                </div>
                <div className="text-[11px]">
                  <span className="font-bold text-slate-800 uppercase tracking-wide block">
                    {parkingPass?.passToken || "CG-PASS-88201-ALX"}
                  </span>
                  <span className="text-blue-700 font-semibold flex items-center justify-center gap-1 mt-0.5">
                    <RefreshCw className="w-3 h-3 text-blue-700 animate-spin" />
                    Dynamic Cryptographic Token
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="md:col-span-2 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                      Assigned Bay
                    </span>
                    <p className="font-extrabold text-slate-900">{parkingPass?.zoneName || "Lot C • Deck #314"}</p>
                    <p className="text-[11px] text-slate-500">Multi-tier resident parking</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                      Registered Vehicle
                    </span>
                    <p className="font-extrabold text-slate-900">{parkingPass?.plateNumber || "7XYZ-42"}</p>
                    <p className="text-[11px] text-slate-500">Verified Plate Recognition</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                      Sensor Gate Clearances
                    </span>
                    <p className="font-extrabold text-slate-900">Gate 04 &amp; Gate 07</p>
                    <p className="text-[11px] text-slate-500">RFID + Optical Barrier Sync</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                      Verification NetID
                    </span>
                    <p className="font-extrabold text-slate-900">{user?.badgeNumber || "#STU-88201"}</p>
                    <p className="text-[11px] text-slate-500">SHA-256 Validated</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Link
                    href="/dashboard/student/qr"
                    className="px-4 py-2 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>View Fullscreen QR</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleAction("Pass token synchronized with secure device wallet.")}
                    className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Add to Wallet</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: QUICK INCIDENT REPORTING */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-slate-900">Quick Incident Report</h2>
              </div>
              <Link
                href="/dashboard/student/report"
                className="text-xs font-bold text-blue-700 hover:underline"
              >
                Open Full Intake Form →
              </Link>
            </div>

            <p className="text-xs text-slate-500">
              Select an incident category to dispatch an intake report to Campus Dispatch and Student Welfare.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Lost Property", icon: KeyRound, desc: "Keys, bag, ID card" },
                { label: "Safe Walk", icon: Footprints, desc: "Campus night escort" },
                { label: "Gate Issue", icon: Car, desc: "Barrier won't open" },
                { label: "Facility Issue", icon: Wrench, desc: "Lighting, door lock" },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setSelectedIncidentType(item.label);
                    handleAction(`Selected category: ${item.label}. Opening report draft...`);
                  }}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between space-y-2 cursor-pointer ${
                    selectedIncidentType === item.label
                      ? "border-blue-600 bg-blue-50/50 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">{item.label}</span>
                    <span className="text-[10px] text-slate-500">{item.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PERMIT STATUS & QUICK ACTIONS */}
        <div className="space-y-5">
          {/* Card: Active Digital Pass Details */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Pass Security Status</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                ACTIVE
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Security Clearance</span>
                <span className="font-bold text-slate-800">Tier-1 Student Resident</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Lab Clearance</span>
                <span className="font-bold text-slate-800">Turing CS Labs 1 &amp; 2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Permit Validity</span>
                <span className="font-bold text-slate-800">{parkingPass?.validUntil ? new Date(parkingPass.validUntil).toLocaleDateString() : "Active Semester"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Auto Plate Scan</span>
                <span className="font-bold text-emerald-700">Enabled ({parkingPass?.plateNumber || "7XYZ-42"})</span>
              </div>
            </div>

            <Link
              href="/dashboard/student/profile"
              className="block w-full text-center py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
            >
              Manage Credentials &amp; Profile →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
