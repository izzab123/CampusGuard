"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  MapPin,
  Calendar,
  User,
  Mail,
  AlertTriangle,
  CheckCircle2,
  X,
  Loader2,
  Clock,
  Radio,
  FileText,
  Building
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api";

export interface IncidentDetails {
  id: number;
  title: string;
  description: string;
  severity: string;
  location: string;
  status: string;
  category?: string;
  routedTo?: string;
  reporterName?: string;
  reporterRole?: string;
  reporterEmail?: string;
  createdAt: string;
  resolvedAt?: string;
}

interface IncidentDetailsModalProps {
  incidentId?: number | null;
  initialData?: IncidentDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated?: (updated: IncidentDetails) => void;
  canManageStatus?: boolean;
}

export default function IncidentDetailsModal({
  incidentId,
  initialData,
  isOpen,
  onClose,
  onStatusUpdated,
  canManageStatus = false,
}: IncidentDetailsModalProps) {
  const [incident, setIncident] = useState<IncidentDetails | null>(initialData || null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setActionSuccess(null);
      return;
    }

    if (initialData && initialData.id === incidentId) {
      setIncident(initialData);
      return;
    }

    if (incidentId) {
      setLoading(true);
      setError(null);
      fetch(API_ENDPOINTS.incidents.byId(incidentId))
        .then((res) => {
          if (!res.ok) throw new Error("Could not retrieve incident details.");
          return res.json();
        })
        .then((data) => {
          setIncident(data);
        })
        .catch((err) => {
          setError(err.message || "Failed to load incident record.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, incidentId, initialData]);

  if (!isOpen) return null;

  const handleUpdateStatus = async (newStatus: string) => {
    if (!incident) return;
    setUpdating(true);
    setActionSuccess(null);

    try {
      const res = await fetch(API_ENDPOINTS.incidents.status(incident.id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status.");
      const updated = await res.json();
      setIncident(updated);
      setActionSuccess(`Status updated to ${newStatus}.`);
      if (onStatusUpdated) onStatusUpdated(updated);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Could not update incident status.");
    } finally {
      setUpdating(false);
    }
  };

  const getSeverityBadge = (sev: string) => {
    const s = sev?.toUpperCase();
    if (s === "CRITICAL" || s === "HIGH" || s === "MAJOR") {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
          <span>{s === "MAJOR" ? "MAJOR" : (s || "HIGH")}</span>
        </span>
      );
    }
    if (s === "MEDIUM" || s === "MODERATE") {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>MEDIUM</span>
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1.5">
        <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
        <span>{s === "MINOR" ? "MINOR" : (s || "LOW")}</span>
      </span>
    );
  };

  const getStatusBadge = (st: string) => {
    const s = st?.toUpperCase().replace(" ", "_");
    if (s === "RESOLVED") {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>RESOLVED</span>
        </span>
      );
    }
    if (s === "DISPATCHED") {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200 flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-sky-600" />
          <span>DISPATCHED</span>
        </span>
      );
    }
    if (s === "IN_PROGRESS") {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1.5">
          <Loader2 className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
          <span>IN PROGRESS</span>
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        <span>OPEN</span>
      </span>
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0a2f77] flex items-center justify-center text-white shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  #INC-{incident?.id || incidentId || "..."}
                </span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Campus Incident Dossier
                </span>
              </div>
              <h2 className="text-base font-extrabold text-slate-900 mt-0.5">
                Incident Report Details
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-500 text-xs">
              <Loader2 className="w-6 h-6 animate-spin text-blue-700" />
              <span>Retrieving live incident record...</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {actionSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {!loading && incident && (
            <>
              {/* Title & Badges */}
              <div className="space-y-3 pb-4 border-b border-slate-100">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(incident.severity)}
                    {getStatusBadge(incident.status)}
                  </div>
                  {incident.createdAt && (
                    <div className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(incident.createdAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {incident.title}
                </h3>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-700" />
                    <span>Location</span>
                  </div>
                  <div className="font-bold text-slate-900">{incident.location || "Campus Grounds"}</div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-blue-700" />
                    <span>Dispatched Routing</span>
                  </div>
                  <div className="font-bold text-slate-900">{incident.routedTo || "Central Dispatch & NOC"}</div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-700" />
                    <span>Submitted By</span>
                  </div>
                  <div className="font-bold text-slate-900">
                    {incident.reporterName || "Anonymous Reporter"}{" "}
                    <span className="font-normal text-slate-500">
                      ({incident.reporterRole || "Student"})
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-700" />
                    <span>Reporter Contact</span>
                  </div>
                  <div className="font-bold text-slate-900 truncate">
                    {incident.reporterEmail || "Confidential / Handled via Dispatch"}
                  </div>
                </div>
              </div>

              {/* Description / Field Narrative */}
              <div className="space-y-1.5 pt-1">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Incident Description &amp; Field Notes</span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed font-normal whitespace-pre-wrap">
                  {incident.description || "No narrative details provided for this entry."}
                </div>
              </div>

              {/* Resolution details if resolved */}
              {incident.resolvedAt && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Resolved at {new Date(incident.resolvedAt).toLocaleString()}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
          {canManageStatus && incident ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Update Status:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { value: "OPEN", label: "Open", color: "hover:bg-amber-100 text-amber-800 border-amber-300", activeBg: "bg-amber-500 text-white border-amber-600 font-bold" },
                  { value: "IN_PROGRESS", label: "In Progress", color: "hover:bg-indigo-100 text-indigo-800 border-indigo-300", activeBg: "bg-indigo-600 text-white border-indigo-700 font-bold" },
                  { value: "DISPATCHED", label: "Dispatched", color: "hover:bg-sky-100 text-sky-800 border-sky-300", activeBg: "bg-sky-600 text-white border-sky-700 font-bold" },
                  { value: "RESOLVED", label: "Resolved", color: "hover:bg-emerald-100 text-emerald-800 border-emerald-300", activeBg: "bg-emerald-600 text-white border-emerald-700 font-bold" },
                ].map((st) => {
                  const isActive = incident.status?.toUpperCase().replace(" ", "_") === st.value;
                  return (
                    <button
                      key={st.value}
                      type="button"
                      disabled={updating || isActive}
                      onClick={() => handleUpdateStatus(st.value)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition cursor-pointer disabled:opacity-50 ${
                        isActive
                          ? st.activeBg
                          : `bg-white ${st.color}`
                      }`}
                    >
                      {updating && !isActive ? null : null}
                      {st.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-slate-400">
              CampusGuard Real-Time Incident Telemetry
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg transition cursor-pointer ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
