"use client";

import React, { useState } from "react";
import {
  Car,
  Wrench,
  ShieldCheck,
  Megaphone,
  Key,
  CheckCheck,
  Sliders,
  Search,
  CheckCircle2,
  Clock,
  PhoneCall,
  ShieldAlert,
  Building,
  Footprints,
  RotateCcw,
  ExternalLink,
  ThumbsUp,
  FileText
} from "lucide-react";

export default function StudentNotificationsView() {
  const [activeTab, setActiveTab] = useState("All Notifications (12)");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Delivery channels state
  const [channels, setChannels] = useState({
    sms: true,
    push: true,
    email: false,
    arrival: true,
  });

  const toggleChannel = (key: keyof typeof channels) => {
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }));
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
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>REAL-TIME TELEMETRY FEED</span>
            <span className="text-slate-300">•</span>
            <span>Updated 3m ago</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight mt-1">
            Notifications &amp; Safety Broadcasts
          </h1>
          <p className="text-xs text-slate-500 max-w-3xl mt-0.5 leading-relaxed">
            Real-time institutional security alerts, facility notices, parking updates, and personal pass telemetry.
          </p>
        </div>

        {/* Right Search & Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search notices, gates, passes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <button
            type="button"
            onClick={() => handleAction("All notifications marked as read.")}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Mark all as read</span>
          </button>

          <button
            type="button"
            onClick={() => handleAction("Broadcast preferences opened.")}
            className="px-3.5 py-2 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Preferences</span>
          </button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { label: "All Notifications (12)", dot: null },
          { label: "Campus Safety & Alerts (3)", dot: "bg-red-500" },
          { label: "Parking & Gate Access (4)", dot: "bg-blue-600" },
          { label: "Facilities & Maintenance (3)", dot: "bg-amber-500" },
          { label: "Personal Pass & Access (2)", dot: "bg-emerald-500" },
        ].map((tab) => {
          const isActive = activeTab === tab.label;
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveTab(tab.label)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? "bg-[#0a2f77] text-white font-bold shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {tab.dot && <span className={`w-2 h-2 rounded-full ${tab.dot}`}></span>}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TWO COLUMN GRID: FEED (65%) + CHANNELS & HOTLINES (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: NOTIFICATION CARDS */}
        <div className="lg:col-span-2 space-y-4">
          {/* Card 1: Parking Permit Lot C Validated */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 relative overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-base shrink-0">
                  P
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      Parking Permit Lot C Validated
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      NEW ENTRY
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Gate 04 RFID Automated Checkpoint • 2 hours ago
                  </div>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Your vehicle <strong className="font-mono text-slate-800">7XYZ-42</strong> was automatically scanned and cleared at Gate 04 North Perimeter RFID sensor. Bay <strong className="text-blue-700 font-bold">#314</strong> reserved until 23:59 tonight.
            </p>

            {/* Subbox */}
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Car className="w-4 h-4 text-blue-700 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Lot C • Bay #314 (Tier 2 North)</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    RFID Token #RTF-9821-X4 • Ingress time 14:18 EST
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleAction("Displaying digital parking credential...")}
                className="px-3 py-1.5 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg shadow-xs transition cursor-pointer whitespace-nowrap self-start sm:self-center"
              >
                View Parking Pass
              </button>
            </div>
          </div>

          {/* Card 2: Gate 04 Turnstile Calibration Notice */}
          <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-xs space-y-3 relative overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      Gate 04 Turnstile Calibration Notice
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      SCHEDULED WORK
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Department of Physical Plant • 25m ago
                  </div>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Turnstile lane #2 undergoing routine sensor maintenance between <strong className="text-slate-800">16:00 and 17:00</strong>. Optical badge readers will be briefly offline. Please use adjacent Gate 02 Library Portal during this window.
            </p>

            <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="font-semibold text-amber-900">
                  Suggested detour: Gate 02 Library Portal (180m East)
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleAction("Showing alternate campus entrance map...")}
                className="px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-50 text-amber-900 font-bold text-xs rounded-lg transition cursor-pointer whitespace-nowrap self-start sm:self-center"
              >
                View Alternate Entrances
              </button>
            </div>
          </div>

          {/* Card 3: Safe Walk Escort Completed */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      Safe Walk Escort Completed
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      RESOLVED
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Campus Safety Patrol Unit • Yesterday, 22:15
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 font-semibold">Read</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Officer Lin (Badge #409) safely concluded your campus walk from <strong className="text-slate-800">Computer Science Turing Hall</strong> to <strong className="text-slate-800">West Quad Residence Hall B</strong>. Incident log #ESC-8910 has been archived. Thank you for using CampusGuard.
            </p>

            <div className="flex items-center gap-3 pt-1 text-xs">
              <button
                type="button"
                onClick={() => handleAction("Feedback submitted for Officer Lin. Thank you!")}
                className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 cursor-pointer"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Leave Feedback</span>
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={() => handleAction("Receipt #ESC-8910 displayed.")}
                className="text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
              >
                View Escort Receipt
              </button>
            </div>
          </div>

          {/* Card 4: Robotics Symposium Parking Redistribution */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      Robotics Symposium Parking Redistribution
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      INSTITUTIONAL
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Dean of Student Welfare • Yesterday, 10:15
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 font-semibold">Read</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Dean of Student Welfare notice: Inbound visitor volume for the Annual Engineering Robotics Symposium in East Perimeter will restrict Lot A. Student parking overflow is permanently directed to Lot C upper tier throughout the weekend.
            </p>
          </div>

          {/* Card 5: Biometric Pass Token Refreshed */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      Biometric Pass Token Refreshed
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      SECURITY CREDENTIAL
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Identity &amp; Access Management (IAM) • 2 days ago
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 font-semibold">Read</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              New SHA-256 mobile credential generated for fall term building clearance. Validated across CS Turing Lab, Main Library Stacks, and Student Center Recreation after hours.
            </p>
          </div>

          {/* Bottom Button */}
          <button
            type="button"
            onClick={() => handleAction("30-day archive loaded successfully.")}
            className="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Load 30-Day Notification History</span>
          </button>
        </div>

        {/* RIGHT COLUMN: DELIVERY CHANNELS, PERIMETER HEALTH & HOTLINES */}
        <div className="space-y-5">
          {/* Card 1: Delivery Channels */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-700" />
                <h2 className="text-sm font-bold text-slate-900">Delivery Channels</h2>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400">ALEX MORGAN</span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Channel 1: SMS */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-bold text-slate-900">SMS Emergency Alerts</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    +1 (555) 019-8820 • Priority 1
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleChannel("sms")}
                  className={`w-11 h-6 rounded-full p-1 transition cursor-pointer ${
                    channels.sms ? "bg-[#0a2f77]" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      channels.sms ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></div>
                </button>
              </div>

              {/* Channel 2: Push */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-bold text-slate-900">Push Notifications</div>
                  <div className="text-[11px] text-slate-500">iOS CampusGuard App • Active</div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleChannel("push")}
                  className={`w-11 h-6 rounded-full p-1 transition cursor-pointer ${
                    channels.push ? "bg-[#0a2f77]" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      channels.push ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></div>
                </button>
              </div>

              {/* Channel 3: Email */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-bold text-slate-900">Email Daily Digest</div>
                  <div className="text-[11px] text-slate-500">a.morgan@campusguard.edu</div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleChannel("email")}
                  className={`w-11 h-6 rounded-full p-1 transition cursor-pointer ${
                    channels.email ? "bg-[#0a2f77]" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      channels.email ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></div>
                </button>
              </div>

              {/* Channel 4: Gate & Parking Arrival */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-bold text-slate-900">Gate &amp; Parking Arrival</div>
                  <div className="text-[11px] text-slate-500">Sensor beep &amp; pass timestamp</div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleChannel("arrival")}
                  className={`w-11 h-6 rounded-full p-1 transition cursor-pointer ${
                    channels.arrival ? "bg-[#0a2f77]" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      channels.arrival ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></div>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
              <span>Sync status: Fully Encrypted</span>
              <button
                type="button"
                onClick={() => handleAction("Opening full delivery channels modal...")}
                className="text-blue-700 font-bold hover:underline cursor-pointer"
              >
                Manage All
              </button>
            </div>
          </div>

          {/* Card 2: Perimeter Health */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Perimeter Health</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                SECURE
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">North Gates (01 - 04)</span>
                <span className="font-bold text-emerald-700">100% Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">South Gates (05 - 08)</span>
                <span className="font-bold text-amber-600">92% (Gate 07 Speed Cap)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Parking Lot C Capacity</span>
                <span className="font-bold text-blue-700">76% Allocated</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-200/60 text-[11px] text-blue-900 leading-snug">
              All perimeter sensors sync with the Central Security Operations Center (SOC).
            </div>
          </div>

          {/* Card 3: Quick Hotlines */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <PhoneCall className="w-4 h-4 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900">Quick Hotlines</h3>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* NOC */}
              <div
                onClick={() => handleAction("Calling Campus Police NOC (Ext 9110)...")}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/50 hover:border-blue-200 transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900">Campus Police NOC</div>
                    <div className="text-[11px] text-slate-500">24/7 Dispatch Desk</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-mono font-bold text-xs border border-blue-100">
                  Ext 9110
                </span>
              </div>

              {/* DSW */}
              <div
                onClick={() => handleAction("Calling DSW Student Welfare (Ext 4402)...")}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/50 hover:border-blue-200 transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Building className="w-4 h-4 text-blue-700 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900">DSW Student Welfare</div>
                    <div className="text-[11px] text-slate-500">Counseling &amp; Crisis Response</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-mono font-bold text-xs border border-blue-100">
                  Ext 4402
                </span>
              </div>

              {/* Safe Walk */}
              <div
                onClick={() => handleAction("Calling Safe Walk Escort Service (Ext 4099)...")}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/50 hover:border-blue-200 transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Footprints className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900">Safe Walk Escort Service</div>
                    <div className="text-[11px] text-slate-500">Dusk to Dawn Campus Mobility</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-mono font-bold text-xs border border-blue-100">
                  Ext 4099
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
