"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Loader2,
  ArrowRight,
  Maximize2
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api";
import { getStoredAuthUser } from "@/lib/auth";

export interface ProfileChangeDetail {
  id: number;
  userId: number;
  studentEmail: string;
  studentName: string;
  studentBadgeNumber: string;
  previousFullName: string;
  newFullName: string;
  previousProfilePicture?: string;
  newProfilePicture?: string;
  status: string; // PENDING, APPROVED, DENIED
  denialReason?: string;
  reviewedBy?: string;
  createdAt: string;
  reviewedAt?: string;
}

interface ProfileChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: number | null;
  onApproved?: (updated: ProfileChangeDetail) => void;
  onDenied?: (updated: ProfileChangeDetail) => void;
}

export default function ProfileChangeModal({
  isOpen,
  onClose,
  requestId,
  onApproved,
  onDenied,
}: ProfileChangeModalProps) {
  const [request, setRequest] = useState<ProfileChangeDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [denying, setDenying] = useState(false);
  const [showDenyPrompt, setShowDenyPrompt] = useState(false);
  const [denyReason, setDenyReason] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [enlargedPhoto, setEnlargedPhoto] = useState<string | null>(null);

  const authUser = getStoredAuthUser();
  const isAdmin = authUser?.role?.toLowerCase() === "admin";

  useEffect(() => {
    if (!isOpen) {
      setErrorMsg(null);
      setSuccessMsg(null);
      setShowDenyPrompt(false);
      setDenyReason("");
      setEnlargedPhoto(null);
      return;
    }

    if (requestId) {
      setLoading(true);
      fetch(API_ENDPOINTS.profileRequests.byId(requestId))
        .then((res) => {
          if (!res.ok) throw new Error("Could not load profile request details.");
          return res.json();
        })
        .then((data) => {
          setRequest(data);
          setErrorMsg(null);
        })
        .catch((err) => {
          setErrorMsg(err.message || "Failed to load request data.");
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, requestId]);

  if (!isOpen) return null;

  const handleApprove = async () => {
    if (!request?.id) return;
    if (!isAdmin) {
      setErrorMsg("Only administrators have authority to approve student profile updates.");
      return;
    }

    setApproving(true);
    setErrorMsg(null);
    try {
      const adminName = authUser?.fullName || authUser?.name || "System Administrator";
      const res = await fetch(API_ENDPOINTS.profileRequests.approve(request.id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvedBy: adminName }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Approval failed.");
      }

      const resData = await res.json();
      setRequest(resData.request);
      setSuccessMsg("Student profile update approved! Notification sent to student.");
      if (onApproved) {
        onApproved(resData.request);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Error approving profile update.");
    } finally {
      setApproving(false);
    }
  };

  const handleDeny = async () => {
    if (!request?.id) return;
    if (!isAdmin) {
      setErrorMsg("Only administrators have authority to deny student profile updates.");
      return;
    }

    if (!denyReason.trim()) {
      setErrorMsg("Please write the reason for denying this student profile change request.");
      return;
    }

    setDenying(true);
    setErrorMsg(null);
    try {
      const adminName = authUser?.fullName || authUser?.name || "System Administrator";
      const res = await fetch(API_ENDPOINTS.profileRequests.deny(request.id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: denyReason.trim(),
          deniedBy: adminName,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Denial failed.");
      }

      const resData = await res.json();
      setRequest(resData.request);
      setShowDenyPrompt(false);
      setSuccessMsg("Profile update denied. Changes have been reverted and notification with denial reason was dispatched to the student.");
      if (onDenied) {
        onDenied(resData.request);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Error denying profile update.");
    } finally {
      setDenying(false);
    }
  };

  const isPending = request?.status === "PENDING";
  const isApproved = request?.status === "APPROVED";
  const isDenied = request?.status === "DENIED";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0a2f77] text-white flex items-center justify-center shadow-xs">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">
                Review Student Profile Modification
              </h2>
              <p className="text-[11px] text-slate-500">
                Institutional Directory Clearance &amp; Verification Authority
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
              <span>Loading profile request telemetry...</span>
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

          {!loading && request && (
            <>
              {/* Status Header Tile */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    STUDENT IDENTITY
                  </span>
                  <div className="text-base font-extrabold text-slate-900 tracking-tight mt-0.5">
                    {request.newFullName || request.studentName}
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    Badge: <strong className="text-blue-800 font-bold">{request.studentBadgeNumber || "N/A"}</strong> • {request.studentEmail}
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
                    <span>{request.status}</span>
                  </span>
                </div>
              </div>

              {/* Name Comparison */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Name Modification Comparison
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">Previous Name</span>
                    <span className="text-xs font-bold text-slate-600">
                      {request.previousFullName || "Alex Morgan"}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
                    <span className="text-[10px] text-blue-700 block font-semibold flex items-center gap-1">
                      <ArrowRight className="w-3 h-3" /> Requested New Name
                    </span>
                    <span className="text-xs font-extrabold text-blue-900">
                      {request.newFullName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Photo Comparison */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Profile Photo Comparison (Click photo to enlarge)
                </span>
                <div className="grid grid-cols-2 gap-4">
                  {/* Previous Photo */}
                  <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-semibold">Previous Photo</span>
                    <div
                      onClick={() => setEnlargedPhoto(request.previousProfilePicture || "/student-alex.jpg")}
                      className="w-20 h-20 rounded-xl overflow-hidden ring-1 ring-slate-200 cursor-pointer hover:opacity-90 transition relative group"
                    >
                      {request.previousProfilePicture ? (
                        <img
                          src={request.previousProfilePicture}
                          alt="Previous"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src="/student-alex.jpg"
                          alt="Previous"
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* New Photo */}
                  <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-blue-50 border border-blue-200">
                    <span className="text-[10px] text-blue-700 font-bold">New Requested Photo</span>
                    <div
                      onClick={() => setEnlargedPhoto(request.newProfilePicture || "/student-alex.jpg")}
                      className="w-20 h-20 rounded-xl overflow-hidden ring-2 ring-blue-500 cursor-pointer hover:opacity-90 transition relative group"
                    >
                      {request.newProfilePicture ? (
                        <img
                          src={request.newProfilePicture}
                          alt="New"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src="/student-alex.jpg"
                          alt="New"
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Audit Info */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 text-xs shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Submitted At
                  </span>
                  <span className="font-medium text-slate-800">
                    {request.createdAt ? new Date(request.createdAt).toLocaleString() : "N/A"}
                  </span>
                </div>

                {request.reviewedAt && (
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                    <span className="text-slate-500">Reviewed Date</span>
                    <span className="font-medium text-slate-800">
                      {new Date(request.reviewedAt).toLocaleString()}
                    </span>
                  </div>
                )}

                {request.reviewedBy && (
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                    <span className="text-slate-500">Reviewed By</span>
                    <span className="font-bold text-slate-800">{request.reviewedBy}</span>
                  </div>
                )}

                {request.denialReason && (
                  <div className="border-t border-slate-100 pt-2 space-y-0.5">
                    <span className="text-red-700 font-bold block">Denial Reason Stated</span>
                    <p className="text-xs text-red-800 bg-red-50 p-2.5 rounded-lg border border-red-200 font-medium">
                      {request.denialReason}
                    </p>
                  </div>
                )}
              </div>

              {/* Deny Reason Prompt Box */}
              {showDenyPrompt && isPending && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-900 text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      <span>Deny Student Profile Update</span>
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
                    When denying, you must provide a reason. A notification will be dispatched to the student with this reason, and their profile name and photo will be immediately restored to the previous values.
                  </p>
                  <div>
                    <label className="text-[11px] font-bold text-red-900 block mb-1">
                      Reason for Denial <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Unverified nickname, inappropriate picture, name mismatch with legal student registry"
                      value={denyReason}
                      onChange={(e) => setDenyReason(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-red-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 font-medium"
                    />
                  </div>
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
                          <span>Denying &amp; Reverting...</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Confirm Denial &amp; Revert Profile</span>
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

          {isPending && !showDenyPrompt && (
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
                    <span>Approve Profile Update</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Enlarged Photo Lightbox */}
      {enlargedPhoto && (
        <div
          onClick={() => setEnlargedPhoto(null)}
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-sm w-full bg-white rounded-2xl overflow-hidden p-3 shadow-2xl">
            <button
              onClick={() => setEnlargedPhoto(null)}
              className="absolute top-4 right-4 bg-black/60 text-white p-1 rounded-full hover:bg-black"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={enlargedPhoto}
              alt="Enlarged"
              className="w-full h-72 object-cover rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
