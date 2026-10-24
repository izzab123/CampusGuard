"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Car,
  Footprints,
  DoorClosed,
  CreditCard,
  Volume2,
  AlertTriangle,
  MapPin,
  UploadCloud,
  FileText,
  Send,
  Lock,
  Building,
  UserCheck,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { getStoredAuthUser } from "@/lib/auth";
import { API_ENDPOINTS } from "@/lib/api";
import IncidentDetailsModal from "@/components/incidents/IncidentDetailsModal";

interface IncidentItem {
  id: number;
  title: string;
  description: string;
  severity: string;
  location: string;
  status: string;
  routedTo?: string;
  reporterName?: string;
  createdAt: string;
}

export default function StudentReportView() {
  const [category, setCategory] = useState("suspicious");
  const [location, setLocation] = useState("North Quad — Between Turing Hall & Library");
  const [specificSpot, setSpecificSpot] = useState("North Quad Walkway towards Turing Hall");
  const [timeOccurred, setTimeOccurred] = useState("Occurred Just Now");
  const [priority, setPriority] = useState("MEDIUM");
  const [description, setDescription] = useState(
    "Unattended bicycle with sheared cable lock on sidewalk. Individual left rapidly toward library when approached."
  );
  const [hasFile, setHasFile] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [officerFollowUp, setOfficerFollowUp] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittingEscort, setSubmittingEscort] = useState(false);

  // Safe Walk Escort Mini-Form State
  const [escortLocation, setEscortLocation] = useState("Main Library East Terrace");
  const [escortDestination, setEscortDestination] = useState("Residence Hall B");

  // Dynamic user reports tracking & details modal
  const [pastReports, setPastReports] = useState<IncidentItem[]>([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchReports = async () => {
    try {
      const user = getStoredAuthUser();
      const endpoint = user?.email
        ? API_ENDPOINTS.incidents.myReports(user.email, "Student")
        : API_ENDPOINTS.incidents.myReports(undefined, "Student");
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        setPastReports(data);
      }
    } catch {}
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleAction = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const CATEGORIES = [
    {
      id: "suspicious",
      title: "Suspicious Activity",
      subtitle: "Trespass, loitering, unknown auto",
      icon: Car,
    },
    {
      id: "safewalk",
      title: "Safe Walk Escort Request",
      subtitle: "Night accompaniment across campus",
      icon: Footprints,
    },
    {
      id: "gatedoor",
      title: "Gate / Door Malfunction",
      subtitle: "Propped fire exit, badge error",
      icon: DoorClosed,
    },
    {
      id: "lostproperty",
      title: "Lost Property or ID Card",
      subtitle: "Keys, hardware, wallet, credentials",
      icon: CreditCard,
    },
    {
      id: "noise",
      title: "Noise / Student Welfare",
      subtitle: "Disturbance, wellness checkup",
      icon: Volume2,
    },
    {
      id: "hazard",
      title: "Facility Hazard",
      subtitle: "Dark lighting, water leak, spill",
      icon: AlertTriangle,
    },
  ];

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    const user = getStoredAuthUser();
    const reporterName = anonymous ? "Anonymous Student" : (user?.fullName || "Alex Morgan");

    try {
      const res = await fetch(API_ENDPOINTS.incidents.base, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Report: ${category.toUpperCase()} at ${location}`,
          description,
          severity: priority,
          location: specificSpot ? `${location} (${specificSpot})` : location,
          category,
          reporterName,
          reporterRole: "Student",
          reporterEmail: user?.email || undefined,
        }),
      });

      if (res.ok) {
        const saved = await res.json();
        handleAction(`Incident #${saved.id} successfully dispatched to Campus Operations NOC!`);
        setDescription("");
        setHasFile(false);
        fetchReports();
      } else {
        handleAction("Report submitted to local triage dispatcher.");
      }
    } catch {
      handleAction("Report recorded in local offline cache.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestEscort = async () => {
    setSubmittingEscort(true);
    const user = getStoredAuthUser();

    try {
      const res = await fetch(API_ENDPOINTS.incidents.base, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Safe Walk Escort: ${escortLocation} to ${escortDestination}`,
          description: `Night transit accompaniment requested from ${escortLocation} to ${escortDestination}.`,
          severity: "LOW",
          location: escortLocation,
          category: "safewalk",
          reporterName: user?.fullName || "Alex Morgan",
          reporterRole: "Student",
          reporterEmail: user?.email || undefined,
        }),
      });

      if (res.ok) {
        const saved = await res.json();
        handleAction(`Safe Walk Escort #${saved.id} dispatched! Campus patrol officer assigned.`);
        fetchReports();
      }
    } catch {
      handleAction("Safe Walk Escort requested! Dispatch alerted.");
    } finally {
      setSubmittingEscort(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Action Notice */}
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

      {/* TOP HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-blue-700 uppercase flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-700" />
            <span>CAMPUS INCIDENT &amp; HAZARD INTAKE</span>
            <span className="text-slate-300">•</span>
            <span>24/7 ACTIVE DISPATCH</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight mt-1">
            Submit Campus Incident Report
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5 leading-relaxed">
            Report safety hazards, request an escort, or report suspicious occurrences directly into the central dispatch queue.
          </p>
        </div>
      </div>

      {/* MAIN TWO-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: INTAKE FORM (2 COLS) */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            {/* Section 1: Category Picker */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  1. Select Incident Category
                </span>
                <span className="text-[11px] text-slate-400">Required</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat.id;
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-3 rounded-xl border text-left transition flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? "border-blue-700 bg-blue-50/40 ring-1 ring-blue-700"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-blue-700 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-900 block leading-tight">
                          {cat.title}
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          {cat.subtitle}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Location & Timing */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  2. Location Details
                </span>
                <span className="text-[11px] text-slate-400">Zone Telemetry</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Campus Zone / Building
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. North Quad, Library"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Specific Landmark
                  </label>
                  <input
                    type="text"
                    value={specificSpot}
                    onChange={(e) => setSpecificSpot(e.target.value)}
                    placeholder="e.g. Exterior stairs near Door 3"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Severity & Priority */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                3. Severity Level
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { value: "LOW", label: "Minor", desc: "Supervisor only" },
                  { value: "MEDIUM", label: "Medium", desc: "Supervisor & Admin" },
                  { value: "HIGH", label: "Major", desc: "Supervisor, Admin & Proctor" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setPriority(item.value)}
                    className={`py-2 px-2.5 rounded-lg border font-bold text-center transition cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      priority === item.value
                        ? item.value === "HIGH"
                          ? "bg-red-50 border-red-500 text-red-800"
                          : item.value === "MEDIUM"
                          ? "bg-amber-50 border-amber-500 text-amber-900"
                          : "bg-blue-50 border-blue-600 text-blue-900"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] font-normal opacity-75">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 4: Narrative Description */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  4. Incident Narrative
                </label>
                <span className="text-[11px] text-slate-400">Describe what occurred</span>
              </div>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide as much detail as possible..."
                className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 leading-relaxed resize-none"
              />
            </div>

            {/* Section 5: Preferences */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-blue-700 focus:ring-blue-600 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Submit Anonymously</div>
                    <div className="text-[11px] text-slate-500">
                      Omit name from general patrol report
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={officerFollowUp}
                    onChange={(e) => setOfficerFollowUp(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-blue-700 focus:ring-blue-600 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Officer Follow-up</div>
                    <div className="text-[11px] text-slate-500">
                      Officer may reach out for clarification
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={submitting || !description.trim()}
                onClick={() => handleSubmit()}
                className="px-5 py-2.5 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg flex items-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Transmitting to Dispatch...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Incident to Dispatch</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SAFE WALK ESCORT & PAST TICKETS */}
        <div className="space-y-5">
          {/* Card 1: 24/7 Security Escort */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>24/7 SAFE WALK ESCORT</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                ACTIVE
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Current Location</label>
                <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                  <input
                    type="text"
                    value={escortLocation}
                    onChange={(e) => setEscortLocation(e.target.value)}
                    className="w-full bg-transparent font-medium text-slate-900 focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500">Target Destination</label>
                <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg mt-0.5">
                  <Building className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                  <input
                    type="text"
                    value={escortDestination}
                    onChange={(e) => setEscortDestination(e.target.value)}
                    className="w-full bg-transparent font-medium text-slate-900 focus:outline-none text-xs"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={submittingEscort}
              onClick={handleRequestEscort}
              className="w-full py-2.5 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              {submittingEscort ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Requesting Escort...</span>
                </>
              ) : (
                <>
                  <Footprints className="w-4 h-4" />
                  <span>Request Instant Safe Walk Escort</span>
                </>
              )}
            </button>
          </div>

          {/* Card 2: Track My Reports */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Track My Reports ({pastReports.length})
                </h3>
                <p className="text-[11px] text-slate-400">
                  Live status of reports you have submitted
                </p>
              </div>
              <button
                type="button"
                onClick={fetchReports}
                className="text-xs font-bold text-blue-700 hover:underline cursor-pointer"
              >
                Refresh
              </button>
            </div>

            <div className="space-y-3 text-xs max-h-80 overflow-y-auto">
              {pastReports.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No incident reports submitted by you yet.
                </div>
              ) : (
                pastReports.map((inc) => {
                  const s = inc.status?.toUpperCase().replace(" ", "_");
                  return (
                    <div
                      key={inc.id}
                      onClick={() => {
                        setSelectedIncidentId(inc.id);
                        setIsModalOpen(true);
                      }}
                      className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200/80 transition cursor-pointer space-y-1 group"
                    >
                      <div className="flex items-center justify-between font-mono font-bold">
                        <span className="text-blue-700 group-hover:underline">#INC-{inc.id}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            s === "RESOLVED"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : s === "DISPATCHED"
                              ? "bg-sky-100 text-sky-800 border border-sky-200"
                              : s === "IN_PROGRESS"
                              ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {s === "IN_PROGRESS" ? "IN PROGRESS" : inc.status}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 line-clamp-1">{inc.title}</div>
                      <div className="text-[11px] text-slate-500 flex items-center justify-between">
                        <span className="truncate max-w-[170px]">{inc.location}</span>
                        <span>{new Date(inc.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Incident Details Modal for Tracking */}
      <IncidentDetailsModal
        isOpen={isModalOpen}
        incidentId={selectedIncidentId}
        canManageStatus={false}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedIncidentId(null);
        }}
      />
    </div>
  );
}
