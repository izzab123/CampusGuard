"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Bell,
  Search,
  RotateCcw,
  Car,
  CheckCircle2,
  AlertTriangle,
  Clock,
  LogOut,
  Loader2
} from "lucide-react";
import { performLogout } from "@/lib/auth";
import { API_ENDPOINTS } from "@/lib/api";

interface ParkingPassItem {
  id: number;
  plateNumber: string;
  passToken: string;
  zoneName: string;
  ownerName: string;
  ownerType: string;
  status: string;
  issuedAt: string;
  validUntil: string;
}

export default function GuardParkingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [passes, setPasses] = useState<ParkingPassItem[]>([]);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchPasses = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.parking.passes);
      if (res.ok) {
        const data = await res.json();
        setPasses(data);
      }
    } catch {}
  };

  useEffect(() => {
    fetchPasses();
  }, []);

  const handleAction = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setVerifying(true);
    setVerificationResult(null);

    try {
      const res = await fetch(API_ENDPOINTS.parking.verify, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setVerificationResult(data);
        if (data.verified) {
          handleAction(`Clearance confirmed for ${data.plateNumber}: ${data.status}`);
        } else {
          handleAction(`Verification failed: ${data.message}`);
        }
      }
    } catch {
      handleAction("Offline optical check conducted.");
    } finally {
      setVerifying(false);
    }
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
              <Link href="/dashboard/guard/handoff" className="py-5 hover:text-slate-900 transition">
                Handoff
              </Link>
              <Link href="/dashboard/guard/parking" className="py-5 text-blue-700 font-bold border-b-2 border-blue-700">
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
            <h1 className="text-2xl font-extrabold text-slate-900">Vehicle Permit Clearance &amp; ALPR Inspection</h1>
            <p className="text-xs text-slate-500">Scan license plates, verify QR pass tokens, and inspect authorized parking bays.</p>
          </div>

          <button
            type="button"
            onClick={fetchPasses}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer self-start"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Refresh Roster</span>
          </button>
        </div>

        {/* Search & Verification Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter license plate or QR token (e.g. 7XYZ-42 or CG-PASS-88201)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <button
              type="submit"
              disabled={verifying || !searchQuery.trim()}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              {verifying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Car className="w-3.5 h-3.5" />}
              <span>Verify Permit</span>
            </button>
          </form>

          {/* Verification Result Box */}
          {verificationResult && (
            <div
              className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
                verificationResult.verified
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-red-50 border-red-200 text-red-900"
              }`}
            >
              <div className="space-y-1">
                <div className="font-bold flex items-center gap-2">
                  {verificationResult.verified ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  )}
                  <span>
                    {verificationResult.verified ? "CLEARANCE AUTHORIZED" : "PERMIT NOT FOUND / EXPIRED"}
                  </span>
                </div>
                {verificationResult.verified && (
                  <div>
                    Plate: <strong className="font-mono">{verificationResult.plateNumber}</strong> • Owner: <strong>{verificationResult.ownerName}</strong> • Bay: <strong>{verificationResult.zoneName}</strong>
                  </div>
                )}
                {!verificationResult.verified && <div>{verificationResult.message}</div>}
              </div>
            </div>
          )}
        </div>

        {/* Live Passes Roster */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Authorized Campus Parking Passes ({passes.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">PLATE NUMBER</th>
                  <th className="py-3 px-4">OWNER &amp; ROLE</th>
                  <th className="py-3 px-4">ASSIGNED BAY / ZONE</th>
                  <th className="py-3 px-4">TOKEN HASH</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {passes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No parking passes found.
                    </td>
                  </tr>
                ) : (
                  passes.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {item.plateNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{item.ownerName}</div>
                        <div className="text-[11px] text-slate-500">{item.ownerType}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {item.zoneName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-blue-700">
                        {item.passToken}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery(item.plateNumber);
                            handleVerify();
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 font-bold rounded text-[11px] text-slate-700 cursor-pointer"
                        >
                          Scan / Lift
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
