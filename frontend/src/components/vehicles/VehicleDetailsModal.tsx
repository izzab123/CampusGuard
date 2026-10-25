"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Car,
  User,
  Phone,
  Hash,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api";
import { getStoredAuthUser } from "@/lib/auth";

export interface VehicleRegistrationDetail {
  id: number;
  studentId: string;
  ownerName: string;
  contactNumber: string;
  vehicleNumber: string;
  vehicleType: string;
  status: string; // "Pending approval" | "Approved" | "Denied"
  submittedByEmail?: string;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  deniedAt?: string;
  deniedBy?: string;
  rejectionReason?: string;
  qrCode?: string;
}

interface VehicleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: number | null;
  initialData?: VehicleRegistrationDetail | null;
  canApprove?: boolean;
  onApproved?: (updated: VehicleRegistrationDetail) => void;
  onDenied?: (updated: VehicleRegistrationDetail) => void;
}

export default function VehicleDetailsModal({
  isOpen,
  onClose,
  vehicleId,
  initialData,
  canApprove = false,
  onApproved,
  onDenied,
}: VehicleDetailsModalProps) {
  const [vehicle, setVehicle] = useState<VehicleRegistrationDetail | null>(initialData || null);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [denying, setDenying] = useState(false);
  const [showDenyPrompt, setShowDenyPrompt] = useState(false);
  const [denyReason, setDenyReason] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setErrorMsg(null);
      setSuccessMsg(null);
      return;
    }

    if (initialData) {
      setVehicle(initialData);
    } else if (vehicleId) {
      setLoading(true);
      fetch(API_ENDPOINTS.vehicles.byId(vehicleId))
        .then((res) => {
          if (!res.ok) throw new Error("Could not load vehicle details");
          return res.json();
        })
        .then((data) => {
          setVehicle(data);
          setErrorMsg(null);
        })
        .catch((err) => {
          setErrorMsg(err.message || "Failed to load vehicle details");
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, vehicleId, initialData]);

  if (!isOpen) return null;

  const handleApprove = async () => {
    if (!vehicle?.id) return;
    setApproving(true);
    setErrorMsg(null);
    try {
      const authUser = getStoredAuthUser();
      const approverName = authUser?.fullName || authUser?.name || "Security Guard";

      const res = await fetch(API_ENDPOINTS.vehicles.approve(vehicle.id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvedBy: approverName }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Approval failed");
      }

      const updated = await res.json();
      setVehicle(updated);
      setSuccessMsg("Vehicle registration approved! Notifications dispatched to student, supervisor, and admin.");
      if (onApproved) {
        onApproved(updated);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Error approving registration");
    } finally {
      setApproving(false);
    }
  };

  const handleDeny = async () => {
    if (!vehicle?.id) return;
    setDenying(true);
    setErrorMsg(null);
    try {
      const authUser = getStoredAuthUser();
      const approverName = authUser?.fullName || authUser?.name || "Security Guard";

      const res = await fetch(API_ENDPOINTS.vehicles.deny(vehicle.id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deniedBy: approverName,
          reason: denyReason.trim() || "Denied by campus security",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Denial failed");
      }

      const updated = await res.json();
      setVehicle(updated);
      setShowDenyPrompt(false);
      setSuccessMsg("Vehicle registration denied. Notification dispatched ONLY to the student.");
      if (onDenied) {
        onDenied(updated);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Error denying registration");
    } finally {
      setDenying(false);
    }
  };

  const isPending = vehicle?.status?.toLowerCase().includes("pending");
  const isApproved = vehicle?.status?.toLowerCase() === "approved";
  const isDenied = vehicle?.status?.toLowerCase() === "denied";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0a2f77] text-white flex items-center justify-center shadow-xs">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">
                Vehicle Registration Details
              </h2>
              <p className="text-[11px] text-slate-500">
                Official Campus Clearance &amp; Permit Record
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-[#0a2f77]" />
              <span>Loading registration telemetry...</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {!loading && vehicle && (
            <>
              {/* Vehicle Number & Status Header Card */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    VEHICLE PLATE NUMBER
                  </span>
                  <div className="text-xl font-mono font-extrabold text-slate-900 tracking-wide mt-0.5">
                    {vehicle.vehicleNumber}
                  </div>
                  <span className="text-xs text-slate-600 font-medium">
                    Type: <strong className="text-slate-800">{vehicle.vehicleType}</strong>
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    STATUS
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      isApproved
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : isDenied
                        ? "bg-red-100 text-red-800 border border-red-200"
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {isApproved ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : isDenied ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    <span>{vehicle.status}</span>
                  </span>
                </div>
              </div>

              {/* Owner Information */}
              <div className="space-y-2.5">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Student Owner Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      <User className="w-3 h-3" /> Name
                    </span>
                    <p className="font-bold text-slate-900">{vehicle.ownerName}</p>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      <Hash className="w-3 h-3" /> Student ID
                    </span>
                    <p className="font-bold text-slate-900 font-mono">{vehicle.studentId}</p>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Contact Number
                    </span>
                    <p className="font-bold text-slate-900 font-mono">{vehicle.contactNumber}</p>
                  </div>

                  {vehicle.submittedByEmail && (
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-semibold text-slate-400">Email</span>
                      <p className="font-semibold text-slate-700 truncate">{vehicle.submittedByEmail}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Audit Timestamps */}
              <div className="space-y-2.5">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Clearance Audit Trail
                </h3>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Submission Date
                    </span>
                    <span className="font-medium text-slate-800">
                      {vehicle.createdAt ? new Date(vehicle.createdAt).toLocaleString() : "N/A"}
                    </span>
                  </div>

                  {vehicle.approvedAt && (
                    <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Approved Date
                      </span>
                      <span className="font-medium text-emerald-800">
                        {new Date(vehicle.approvedAt).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {vehicle.approvedBy && (
                    <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                      <span className="text-slate-500">Approved By</span>
                      <span className="font-bold text-slate-800">{vehicle.approvedBy}</span>
                    </div>
                  )}

                  {vehicle.deniedAt && (
                    <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                      <span className="text-red-700 font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Denied Date
                      </span>
                      <span className="font-medium text-red-800">
                        {new Date(vehicle.deniedAt).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {vehicle.deniedBy && (
                    <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                      <span className="text-slate-500">Denied By</span>
                      <span className="font-bold text-slate-800">{vehicle.deniedBy}</span>
                    </div>
                  )}

                  {vehicle.rejectionReason && (
                    <div className="flex items-start justify-between border-t border-slate-100 pt-2">
                      <span className="text-slate-500">Denial Reason</span>
                      <span className="font-semibold text-red-700 max-w-[240px] text-right">
                        {vehicle.rejectionReason}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Deny Reason Prompt Box */}
              {showDenyPrompt && canApprove && isPending && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-900 text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      <span>Deny Vehicle Registration Request</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowDenyPrompt(false)}
                      className="text-xs text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                  <p className="text-[11px] text-red-800">
                    A notification will be sent ONLY to the student informing them that their vehicle registration has been denied.
                  </p>
                  <input
                    type="text"
                    placeholder="Reason for denial (e.g. Unverified plate, missing documents)"
                    value={denyReason}
                    onChange={(e) => setDenyReason(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-red-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowDenyPrompt(false)}
                      className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={denying}
                      onClick={handleDeny}
                      className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
                    >
                      {denying ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Denying...</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Confirm Denial</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Close
          </button>

          {canApprove && isPending && !showDenyPrompt && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={approving || denying}
                onClick={() => setShowDenyPrompt(true)}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                <span>Deny Request</span>
              </button>

              <button
                type="button"
                disabled={approving || denying}
                onClick={handleApprove}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                {approving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Approving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Registration</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
