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
  issuedAt?: string;
}

export default function StudentQrView() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [parkingPass, setParkingPass] = useState<ParkingPassData | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(272); // 04:32
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredAuthUser();
    setUser(stored);

    // Fetch live parking pass
    fetch(API_ENDPOINTS.parking.my(stored?.fullName || "Alex Morgan"))
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setParkingPass(data);
      })
      .catch(() => {});

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
            <span>OPERATIONAL CREDENTIAL PASS</span>
            <span className="text-slate-300">•</span>
            <span className="text-blue-800">NetID: {user?.badgeNumber || "#STU-88201"}</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight mt-1">
            Digital Campus Pass &amp; Parking QR
          </h1>
          <p className="text-xs text-slate-500 max-w-3xl mt-0.5 leading-relaxed">
            Dynamic cryptographic credential for gate clearance, laboratory access, and assigned parking bay validation.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setSecondsLeft(300);
              handleAction("Token refreshed. New rotating cryptographic key generated.");
            }}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Regenerate Token</span>
          </button>
          <button
            type="button"
            onClick={() => handleAction("Offline PDF pass generated with digital signature.")}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Offline PDF Pass</span>
          </button>
          <button
            type="button"
            onClick={() => handleAction("Pass synchronized to mobile device wallet.")}
            className="px-4 py-2 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Wallet className="w-4 h-4" />
            <span>Add to Wallet</span>
          </button>
        </div>
      </div>

      {/* TWO COLUMN GRID */}
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
                    alt="Student Alex"
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
                    <span className="font-bold text-slate-900 text-sm">{user?.fullName || "Alex Morgan"}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      SR-PASS
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    {user?.department || "Dept. of Computer Science & Eng."}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                    NetID: <strong className="text-slate-800">{user?.badgeNumber || "#STU-88201"}</strong>
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  VALID • ACTIVE ENROLLMENT
                </span>
                <div className="text-[11px] text-slate-500 font-medium">
                  {parkingPass?.status || "ACTIVE"} PERMIT
                </div>
              </div>
            </div>

            {/* Center Dynamic QR Code */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50/70 border border-slate-200/80 rounded-2xl relative overflow-hidden">
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200 relative">
                <svg
                  className="w-56 h-56 text-slate-900"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="10" y="10" width="50" height="50" rx="6" fill="#0a2f77" />
                  <rect x="18" y="18" width="34" height="34" rx="3" fill="white" />
                  <rect x="26" y="26" width="18" height="18" rx="2" fill="#0a2f77" />

                  <rect x="140" y="10" width="50" height="50" rx="6" fill="#0a2f77" />
                  <rect x="148" y="18" width="34" height="34" rx="3" fill="white" />
                  <rect x="156" y="26" width="18" height="18" rx="2" fill="#0a2f77" />

                  <rect x="10" y="140" width="50" height="50" rx="6" fill="#0a2f77" />
                  <rect x="18" y="148" width="34" height="34" rx="3" fill="white" />
                  <rect x="26" y="156" width="18" height="18" rx="2" fill="#0a2f77" />

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
              </div>

              <div className="mt-4 text-center space-y-1">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-700" />
                  <span>
                    Refreshes in <span className="font-mono text-blue-700">{formatTime(secondsLeft)}</span> • Dynamic Token
                  </span>
                </div>
                <div className="font-mono text-[11px] font-bold text-blue-800">
                  {parkingPass?.passToken || "CG-PASS-88201-ALX"}
                </div>
              </div>
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
                {parkingPass?.status || "ACTIVE"}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-800">
                  DESIGNATED STALL
                </div>
                <div className="text-base font-extrabold text-slate-900 mt-0.5">
                  {parkingPass?.zoneName || "Lot C • Multi-Tier Deck #314"}
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  North Campus Annex, Level 3 Access
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#0a2f77] text-white flex items-center justify-center font-extrabold text-lg shadow-xs">
                P
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Registered Vehicle
                </div>
                <div className="font-bold font-mono text-slate-900 mt-0.5">{parkingPass?.plateNumber || "7XYZ-42"}</div>
                <div className="text-[11px] text-slate-500">Optical Recognition Sync</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Permit Validity
                </div>
                <div className="font-bold text-slate-900 mt-0.5">
                  {parkingPass?.validUntil ? new Date(parkingPass.validUntil).toLocaleDateString() : "Active Semester"}
                </div>
                <div className="text-[11px] text-slate-500">Tier-1 Annual Resident</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
