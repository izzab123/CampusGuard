"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  RotateCcw,
  Download,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Car,
  ExternalLink,
  Smartphone,
  Sun,
  Shield,
  History,
  ArrowRight,
  BookOpen,
  Cpu,
  Dumbbell
} from "lucide-react";

export default function StudentQrView() {
  const [secondsLeft, setSecondsLeft] = useState(272); // 04:32
  const [maxBrightness, setMaxBrightness] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

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

      {/* TOP HEADER & ACTION BUTTONS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
            <span>OPERATIONAL CREDENTIAL V4.2</span>
            <span className="text-slate-300">•</span>
            <span className="text-blue-800">Tethered NetID: STU-88201</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight mt-1">
            Digital Campus Pass &amp; Parking QR
          </h1>
          <p className="text-xs text-slate-500 max-w-3xl mt-0.5 leading-relaxed">
            Dynamic encrypted credential for gate access, turnstiles, building entry, and assigned parking lot validation.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setSecondsLeft(300);
              handleAction("Token refreshed. New SHA-256 rolling key generated.");
            }}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Regenerate Token</span>
          </button>
          <button
            type="button"
            onClick={() => handleAction("Offline PDF pass downloaded with signed PKI payload.")}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Offline PDF Pass</span>
          </button>
          <button
            type="button"
            onClick={() => handleAction("Pass added to Apple Wallet / Google Pay.")}
            className="px-4 py-2 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Wallet className="w-4 h-4" />
            <span>Apple Wallet / Google Pay</span>
          </button>
        </div>
      </div>

      {/* TWO COLUMN GRID: LEFT QR & CHECKPOINTS (65%) + RIGHT PARKING & HISTORY (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-5">
          {/* 1. STUDENT QR PASS CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            {/* Top Subcard: Student Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-3.5">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-2 ring-blue-700/20 bg-slate-200 shrink-0">
                  <Image
                    src="/student-alex.jpg"
                    alt="Alex Morgan"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">Alex Morgan</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      SR-ENG
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Dept. of Computer Science &amp; Engineering
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                    NetID: <strong className="text-slate-800">STU-88201</strong> • RFID: 0x9F41EBC
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  VALID • ACTIVE ENROLLMENT
                </span>
                <div className="text-[11px] text-slate-500 font-medium">
                  Term: Fall 2024 - Spring 2025
                </div>
              </div>
            </div>

            {/* Center Dynamic QR Code */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50/70 border border-slate-200/80 rounded-2xl relative overflow-hidden">
              {/* QR Container */}
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200 relative">
                {/* SVG QR Code Simulation */}
                <svg
                  className="w-56 h-56 text-slate-900"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Top-Left Corner Locator */}
                  <rect x="10" y="10" width="50" height="50" rx="6" fill="#0a2f77" />
                  <rect x="18" y="18" width="34" height="34" rx="3" fill="white" />
                  <rect x="26" y="26" width="18" height="18" rx="2" fill="#0a2f77" />

                  {/* Top-Right Corner Locator */}
                  <rect x="140" y="10" width="50" height="50" rx="6" fill="#0a2f77" />
                  <rect x="148" y="18" width="34" height="34" rx="3" fill="white" />
                  <rect x="156" y="26" width="18" height="18" rx="2" fill="#0a2f77" />

                  {/* Bottom-Left Corner Locator */}
                  <rect x="10" y="140" width="50" height="50" rx="6" fill="#0a2f77" />
                  <rect x="18" y="148" width="34" height="34" rx="3" fill="white" />
                  <rect x="26" y="156" width="18" height="18" rx="2" fill="#0a2f77" />

                  {/* QR Matrix Elements */}
                  <rect x="70" y="15" width="10" height="20" fill="#0a2f77" />
                  <rect x="90" y="10" width="15" height="15" fill="#0a2f77" />
                  <rect x="115" y="20" width="15" height="10" fill="#0a2f77" />
                  <rect x="70" y="45" width="20" height="15" fill="#0a2f77" />
                  <rect x="100" y="40" width="25" height="10" fill="#0a2f77" />

                  <rect x="15" y="70" width="20" height="15" fill="#0a2f77" />
                  <rect x="45" y="75" width="15" height="15" fill="#0a2f77" />
                  <rect x="15" y="95" width="10" height="25" fill="#0a2f77" />
                  <rect x="35" y="100" width="25" height="15" fill="#0a2f77" />

                  <rect x="140" y="70" width="15" height="20" fill="#0a2f77" />
                  <rect x="165" y="75" width="25" height="15" fill="#0a2f77" />
                  <rect x="145" y="100" width="20" height="10" fill="#0a2f77" />
                  <rect x="175" y="100" width="15" height="25" fill="#0a2f77" />

                  <rect x="70" y="140" width="15" height="20" fill="#0a2f77" />
                  <rect x="95" y="145" width="30" height="15" fill="#0a2f77" />
                  <rect x="75" y="170" width="20" height="15" fill="#0a2f77" />
                  <rect x="105" y="170" width="15" height="20" fill="#0a2f77" />

                  <rect x="135" y="140" width="25" height="15" fill="#0a2f77" />
                  <rect x="170" y="145" width="20" height="20" fill="#0a2f77" />
                  <rect x="145" y="165" width="20" height="25" fill="#0a2f77" />
                  <rect x="175" y="175" width="15" height="15" fill="#0a2f77" />

                  {/* Center Shield Badge */}
                  <rect x="75" y="75" width="50" height="50" rx="10" fill="white" stroke="#0a2f77" strokeWidth="3" />
                  <path
                    d="M100 85L115 92V105C115 114 108 120 100 123C92 120 85 114 85 105V92L100 85Z"
                    fill="#0a2f77"
                  />
                  <path
                    d="M96 104L92 100L94 98L96 100L105 91L107 93L96 104Z"
                    fill="white"
                  />
                </svg>

                {/* Subtle scanning laser line effect */}
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-0.5 bg-blue-500/50 shadow-[0_0_8px_rgba(59,130,246,0.8)] pointer-events-none"></div>
              </div>

              {/* Security countdown notice */}
              <div className="mt-4 text-center space-y-1">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-700" />
                  <span>
                    Refreshes in <span className="font-mono text-blue-700">{formatTime(secondsLeft)}</span> • (Anti-screenshot SHA-256 rolling key)
                  </span>
                </div>
                <div className="font-mono text-[10px] text-slate-400">
                  SDS: 9a7f-44e2-888b-b1d96a99f872
                </div>
              </div>
            </div>

            {/* Bottom NFC & Brightness Toggles */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  NFC Tap Active
                </span>
                <span className="text-[11px] text-slate-500">
                  Hold phone to turnstile reader
                </span>
              </div>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 hover:text-slate-900">
                <input
                  type="checkbox"
                  checked={maxBrightness}
                  onChange={(e) => setMaxBrightness(e.target.checked)}
                  className="rounded border-slate-300 text-blue-700 focus:ring-blue-600 w-4 h-4 cursor-pointer"
                />
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Max Turnstile Brightness</span>
              </label>
            </div>
          </div>

          {/* 2. AUTHORIZED CHECKPOINTS & CLEARANCE ZONES */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                <h2 className="text-sm font-bold text-slate-900">
                  Authorized Checkpoints &amp; Clearance Zones
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800">
                6 ZONES ACTIVATED
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">FACILITY / ACCESS POINT</th>
                    <th className="py-2.5 px-3">MODE</th>
                    <th className="py-2.5 px-3">CLEARANCE SCOPE</th>
                    <th className="py-2.5 px-3 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {/* Row 1: Gate 04 */}
                  <tr className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3 align-top">
                      <div className="font-bold text-slate-900">Gate 04 North Perimeter</div>
                      <div className="text-[11px] text-slate-500">Vehicle Barrier &amp; Pedestrian Turnstile</div>
                    </td>
                    <td className="py-3 px-3 align-top text-slate-600">
                      Optical QR / RFID Plate
                    </td>
                    <td className="py-3 px-3 align-top font-semibold text-slate-800">
                      Full 24/7 Access
                    </td>
                    <td className="py-3 px-3 align-top text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        GRANTED
                      </span>
                    </td>
                  </tr>

                  {/* Row 2: Gate 07 */}
                  <tr className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3 align-top">
                      <div className="font-bold text-slate-900">Gate 07 South Quad Outer Ring</div>
                      <div className="text-[11px] text-slate-500">Vehicle Toll Access (Assigned Lot C)</div>
                    </td>
                    <td className="py-3 px-3 align-top text-slate-600">
                      ANPR Plate &amp; QR Scan
                    </td>
                    <td className="py-3 px-3 align-top font-semibold text-slate-800">
                      Lot C Tier Deck #314
                    </td>
                    <td className="py-3 px-3 align-top text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        GRANTED
                      </span>
                    </td>
                  </tr>

                  {/* Row 3: CS Engineering Labs */}
                  <tr className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3 align-top">
                      <div className="font-bold text-slate-900">Turing Hall CS Engineering Labs</div>
                      <div className="text-[11px] text-slate-500">Advanced Research &amp; Server Rooms</div>
                    </td>
                    <td className="py-3 px-3 align-top text-slate-600">
                      Biometric + Digital NFC
                    </td>
                    <td className="py-3 px-3 align-top font-semibold text-slate-800">
                      Level 1 Lab Clearance
                    </td>
                    <td className="py-3 px-3 align-top text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        GRANTED
                      </span>
                    </td>
                  </tr>

                  {/* Row 4: Library */}
                  <tr className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3 align-top">
                      <div className="font-bold text-slate-900">Central University Library</div>
                      <div className="text-[11px] text-slate-500">Main Concourse Turnstiles &amp; Study Cubicles</div>
                    </td>
                    <td className="py-3 px-3 align-top text-slate-600">
                      Turnstile Optical QR
                    </td>
                    <td className="py-3 px-3 align-top font-semibold text-slate-800">
                      All Hours (24/7 Final Exam Period)
                    </td>
                    <td className="py-3 px-3 align-top text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        GRANTED
                      </span>
                    </td>
                  </tr>

                  {/* Row 5: Recreation Center */}
                  <tr className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3 align-top">
                      <div className="font-bold text-slate-900">Student Wellness &amp; Recreation Center</div>
                      <div className="text-[11px] text-slate-500">Athletic Facility &amp; Aquatic Pavilion</div>
                    </td>
                    <td className="py-3 px-3 align-top text-slate-600">
                      Barcode / NFC Gate
                    </td>
                    <td className="py-3 px-3 align-top font-semibold text-slate-800">
                      Standard Hours (06:00 - 23:00)
                    </td>
                    <td className="py-3 px-3 align-top text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        GRANTED
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-5">
          {/* Card 1: Assigned Parking Bay */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-700" />
                <h2 className="text-sm font-bold text-slate-900">Assigned Parking Bay</h2>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800">
                ZONE N / LOT C
              </span>
            </div>

            {/* Designated Stall Highlight Box */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-800">
                  DESIGNATED STALL
                </div>
                <div className="text-base font-extrabold text-slate-900 mt-0.5">
                  Lot C • Multi-Tier Deck #314
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  North Campus Annex, Level 3 Elevator Access
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#0a2f77] text-white flex items-center justify-center font-extrabold text-lg shadow-xs">
                P
              </div>
            </div>

            {/* Registered Vehicle & Validity */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Registered Vehicle
                </div>
                <div className="font-bold font-mono text-slate-900 mt-0.5">7XYZ-42</div>
                <div className="text-[11px] text-slate-500">Gray Honda Civic (2022)</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Permit Validity
                </div>
                <div className="font-bold text-slate-900 mt-0.5">Active Semester Pass</div>
                <div className="text-[11px] text-slate-500">Expires May 31, 2025</div>
              </div>
            </div>

            {/* Optical Plate Status */}
            <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/70 flex items-center justify-between text-xs font-semibold text-emerald-800">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Optical Plate Sync: Gates 04 &amp; 07 Ready</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>

            {/* Button */}
            <button
              type="button"
              onClick={() => handleAction("Visitor parking request form initialized.")}
              className="w-full py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg transition shadow-xs cursor-pointer text-center"
            >
              Request Temporary Visitor Pass
            </button>
          </div>

          {/* Card 2: Recent Gate Scan Activity */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-blue-700" />
                <h2 className="text-sm font-bold text-slate-900">Recent Gate Scan Activity</h2>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                LIVE LOG
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Scan 1 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Gate 02 Library Portal</span>
                  <span className="text-[11px] text-slate-400 font-mono">Today, 13:10</span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Optical QR Validated • Turnstile East #1
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  ID: CHK-99821
                </div>
              </div>

              {/* Scan 2 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Gate 04 North Barrier</span>
                  <span className="text-[11px] text-slate-400 font-mono">Today, 09:42</span>
                </div>
                <div className="text-[11px] text-slate-600">
                  RFID &amp; Vehicle Plate Scan Validated
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  ID: CHK-98754
                </div>
              </div>

              {/* Scan 3 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Turing Lab Rm 302</span>
                  <span className="text-[11px] text-slate-400 font-mono">Yesterday, 19:45</span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Biometric NFC Card Tap Validated
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  ID: CHK-97819
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleAction("Loading complete access history log...")}
              className="w-full text-center text-xs font-bold text-blue-700 hover:text-blue-900 py-1 transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>View Full Access History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Credential Security & Policy */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Shield className="w-4 h-4 text-blue-700" />
              <span>CREDENTIAL SECURITY &amp; POLICY</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Do not screenshot or transfer this dynamic QR pass. Digital passes are tied to hardware security modules and device biometrics. Attempted dual-scans at perimeter turnstiles trigger an automatic administrative lock.
            </p>
            <div className="pt-1 text-[11px] flex items-center justify-between text-slate-500 border-t border-slate-200">
              <span>Need help or lost your device?</span>
              <a
                href="#hotline"
                onClick={(e) => {
                  e.preventDefault();
                  handleAction("Connecting to 24/7 Security Support (x9110)...");
                }}
                className="font-bold text-blue-700 hover:underline flex items-center gap-0.5"
              >
                <span>Support Hotline x9110</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
