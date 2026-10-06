"use client";

import React, { useState } from "react";
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
  CreditCard,
  Wrench,
  CheckCircle2,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

export default function StudentDashboardView() {
  const [selectedIncidentType, setSelectedIncidentType] = useState<string | null>(null);
  const [feedFilter, setFeedFilter] = useState("All");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleAction = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
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
              • FALL 2024 • ACTIVE ENROLLMENT
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
              • SAFETY STATUS: NORMAL
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Zone: North Academic Quad</p>
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight mt-1">
            Welcome back, Alex Morgan
          </h1>
          <p className="text-xs text-slate-500">
            • Undergrad Senior, Computer Science &amp; Engineering • Level-1 Building &amp; Laboratory Clearance
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
            onClick={() => handleAction("Emergency Dispatch ping sent to Campus NOC!")}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency Dispatch Ping</span>
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
                ● VALID PERMIT: LOT C &amp; ZONE N PERIMETER
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
                    Dynamic Pass Token
                  </span>
                  <span className="text-blue-700 font-semibold flex items-center justify-center gap-1 mt-0.5">
                    <RefreshCw className="w-3 h-3 text-blue-700 animate-spin" />
                    Refreshes in 14m 19s
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
                    <p className="font-extrabold text-slate-900">Lot C • Deck #314</p>
                    <p className="text-[11px] text-slate-500">Multi-tier shaded parking</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                      Registered Vehicle
                    </span>
                    <p className="font-extrabold text-slate-900">7XYZ-42</p>
                    <p className="text-[11px] text-slate-500">Gray Honda Civic (2022)</p>
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
                    <p className="font-extrabold text-slate-900">#STU-88201-ALX</p>
                    <p className="text-[11px] text-slate-500">Token: SHA-256 Validated</p>
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
                    onClick={() => handleAction("Pass synchronized to Apple Wallet / Google Pay.")}
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
              Select an incident category to immediately dispatch a report to Campus Security and Student Welfare.
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
                <span className="font-bold text-slate-800">CS Turing Labs 1 &amp; 2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Residence Hall</span>
                <span className="font-bold text-slate-800">West Quad Hall B, Rm 314</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Auto Plate Scan</span>
                <span className="font-bold text-emerald-700">Enabled (Lot C)</span>
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
