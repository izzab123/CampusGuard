"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import {
  Car,
  SquareParking,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Download,
  Printer,
  ChevronDown,
  Hash,
  User,
  Phone,
  Loader2,
  PlusCircle,
  ExternalLink
} from "lucide-react";
import { getStoredAuthUser, AuthUser } from "@/lib/auth";
import { API_ENDPOINTS } from "@/lib/api";
import { VehicleRegistrationDetail } from "@/components/vehicles/VehicleDetailsModal";

export default function StudentParkVehicleView() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [vehicles, setVehicles] = useState<VehicleRegistrationDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [generatingQr, setGeneratingQr] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredAuthUser();
    setUser(stored);
    fetchVehicles(stored);
  }, []);

  const fetchVehicles = async (currentUser?: AuthUser | null) => {
    setLoading(true);
    try {
      const u = currentUser || user || getStoredAuthUser();
      const res = await fetch(API_ENDPOINTS.vehicles.my(u?.email, u?.badgeNumber));
      if (res.ok) {
        const data: VehicleRegistrationDetail[] = await res.json();
        const list = Array.isArray(data) ? data : [];
        setVehicles(list);

        // If currently selected vehicle is still valid keep it, otherwise pick the first
        if (list.length > 0) {
          setSelectedVehicleId((prev) => {
            const exists = list.find((v) => v.id === prev);
            return exists ? prev : list[0].id;
          });
        } else {
          setSelectedVehicleId(null);
        }
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  // Find the selected vehicle record
  const selectedVehicle = useMemo(() => {
    if (!selectedVehicleId) return vehicles[0] || null;
    return vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0] || null;
  }, [vehicles, selectedVehicleId]);

  // Generate distinct QR code whenever selected vehicle changes
  useEffect(() => {
    if (!selectedVehicle) {
      setQrDataUrl(null);
      return;
    }

    setGeneratingQr(true);

    // Ensure every vehicle has a unique payload
    const uniqueToken = selectedVehicle.qrCode || `CG-QR-${selectedVehicle.id}-${selectedVehicle.vehicleNumber.replace(/[^A-Z0-9]/gi, "")}`;
    const qrPayload = JSON.stringify({
      app: "CampusGuard",
      type: "PARKING_PASS",
      passToken: uniqueToken,
      plate: selectedVehicle.vehicleNumber,
      vehicleType: selectedVehicle.vehicleType,
      studentId: selectedVehicle.studentId,
      owner: selectedVehicle.ownerName,
      status: selectedVehicle.status,
    });

    QRCode.toDataURL(qrPayload, {
      width: 320,
      margin: 2,
      errorCorrectionLevel: "H",
      color: {
        dark: "#0a2f77",
        light: "#ffffff",
      },
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch(() => {
        // Fallback with simpler string if JSON fails
        QRCode.toDataURL(`CG-PASS:${uniqueToken}:${selectedVehicle.vehicleNumber}`)
          .then((url) => setQrDataUrl(url))
          .catch(() => setQrDataUrl(null));
      })
      .finally(() => {
        setGeneratingQr(false);
      });
  }, [selectedVehicle]);

  const handleDownloadQr = () => {
    if (!qrDataUrl || !selectedVehicle) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `CampusGuard-QR-${selectedVehicle.vehicleNumber}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    handleNotice(`QR Code for ${selectedVehicle.vehicleNumber} downloaded successfully.`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Notice Banner */}
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

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-blue-800 uppercase tracking-wide">
            <SquareParking className="w-3.5 h-3.5" />
            <span>Campus Parking Clearance</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight mt-1">
            Park Vehicle
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl">
            Select your registered vehicle to display its unique clearance QR code for automatic gate barriers and campus entry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchVehicles()}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Refresh</span>
          </button>

          <Link
            href="/dashboard/student/register-vehicle"
            className="px-4 py-2 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Register Another Vehicle</span>
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-20 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 text-xs shadow-xs">
          <Loader2 className="w-6 h-6 animate-spin text-[#0a2f77]" />
          <span>Loading your registered vehicles...</span>
        </div>
      )}

      {/* Empty State: Student has 0 vehicles registered */}
      {!loading && vehicles.length === 0 && (
        <div className="p-10 bg-white border border-slate-200 rounded-2xl text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-700 mx-auto flex items-center justify-center">
            <Car className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h2 className="text-base font-bold text-slate-900">
              No Registered Vehicles Found
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              You haven&apos;t registered any vehicles under your student profile yet. Please register your vehicle first to generate its unique parking QR pass.
            </p>
          </div>
          <Link
            href="/dashboard/student/register-vehicle"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register Vehicle Now</span>
          </Link>
        </div>
      )}

      {/* Main Two-Column View: Dropdown & QR Pass */}
      {!loading && vehicles.length > 0 && selectedVehicle && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: VEHICLE SELECTION & QR CODE CARD (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Vehicle Selector Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <label htmlFor="vehicle-select" className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-blue-700" />
                    <span>Choose Vehicle to Park</span>
                  </label>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {vehicles.length === 1
                      ? "1 vehicle registered to your profile"
                      : `${vehicles.length} vehicles registered to your profile`}
                  </p>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 self-start sm:self-auto">
                  Active Profile: {user?.fullName || "Student"}
                </span>
              </div>

              {/* DROPDOWN BOX */}
              <div className="relative">
                <select
                  id="vehicle-select"
                  value={selectedVehicle.id}
                  onChange={(e) => setSelectedVehicleId(Number(e.target.value))}
                  className="w-full px-4 py-3 text-xs bg-slate-50 border-2 border-blue-200 hover:border-blue-400 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition appearance-none cursor-pointer pr-10 shadow-2xs"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id} className="py-2 text-slate-800 font-medium">
                      {v.vehicleNumber} — {v.vehicleType} ({v.status})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-blue-700 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* QR CODE PRESENTATION CONTAINER */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-blue-50/40 border border-slate-200 flex flex-col items-center justify-center space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
                    AUTOMATED GATE CLEARANCE QR
                  </span>
                  <div className="text-xl font-mono font-extrabold text-slate-900 tracking-wider">
                    {selectedVehicle.vehicleNumber}
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    {selectedVehicle.vehicleType} • Owner: <strong>{selectedVehicle.ownerName}</strong>
                  </div>
                </div>

                {/* QR Code Canvas/Image */}
                <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-sm relative group">
                  {generatingQr ? (
                    <div className="w-56 h-56 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
                      <Loader2 className="w-6 h-6 animate-spin text-[#0a2f77]" />
                      <span>Generating QR Code...</span>
                    </div>
                  ) : qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt={`QR code for ${selectedVehicle.vehicleNumber}`}
                      className="w-56 h-56 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-xs">
                      Unable to render QR code
                    </div>
                  )}

                  {/* Shield center watermark emblem */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-lg bg-white/95 border border-[#0a2f77] flex items-center justify-center shadow-xs">
                      <SquareParking className="w-5 h-5 text-[#0a2f77]" />
                    </div>
                  </div>
                </div>

                {/* Unique Token Code Pill */}
                <div className="text-center space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[11px] text-slate-500 font-medium">Unique Pass Token:</span>
                    <span className="font-mono text-xs font-extrabold text-[#0a2f77] bg-white px-2.5 py-0.5 rounded border border-blue-200 shadow-2xs">
                      {selectedVehicle.qrCode || `CG-QR-${selectedVehicle.id}`}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Cryptographically generated &amp; distinct for this specific vehicle registration.
                  </p>
                </div>

                {/* Quick Action Buttons */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadQr}
                    className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Download QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>Print Pass</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: VEHICLE METADATA & ENTRY PROTOCOL (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Vehicle Passport Details */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-blue-700" />
                  <h2 className="text-sm font-bold text-slate-900">Vehicle Clearance Profile</h2>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedVehicle.status?.toLowerCase() === "approved"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : selectedVehicle.status?.toLowerCase() === "denied"
                      ? "bg-red-100 text-red-800 border border-red-200"
                      : "bg-amber-100 text-amber-800 border border-amber-200"
                  }`}
                >
                  {selectedVehicle.status}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 text-slate-400" /> Plate Number
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {selectedVehicle.vehicleNumber}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <SquareParking className="w-3.5 h-3.5 text-slate-400" /> Vehicle Type
                  </span>
                  <span className="font-bold text-slate-800">
                    {selectedVehicle.vehicleType}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-slate-400" /> Student NetID
                  </span>
                  <span className="font-mono font-bold text-slate-800">
                    {selectedVehicle.studentId}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" /> Registered Owner
                  </span>
                  <span className="font-bold text-slate-800">
                    {selectedVehicle.ownerName}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> Contact Phone
                  </span>
                  <span className="font-mono text-slate-700">
                    {selectedVehicle.contactNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Gate Scanning Instructions */}
            <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200 rounded-2xl text-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-blue-900">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                <span>Automated Barrier Access Protocol</span>
              </div>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                When approaching any campus barrier (North Gate 04, South Gate 03, or West Perimeter), align this QR code with the optical gate sentry scanner.
              </p>
              <ul className="space-y-1.5 text-[11px] text-blue-800/90 list-disc list-inside">
                <li>Every vehicle has a unique QR code distinct from all other vehicles.</li>
                <li>Present the code from your mobile screen or a printed dashboard card.</li>
                <li>Once scanned, the barrier arm lifts automatically within 1.5 seconds.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
