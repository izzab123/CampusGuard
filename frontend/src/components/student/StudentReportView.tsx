"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  PhoneCall,
  Clock,
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
  CheckCircle2,
  Lock,
  ExternalLink,
  Building,
  UserCheck
} from "lucide-react";

export default function StudentReportView() {
  const [category, setCategory] = useState("suspicious");
  const [location, setLocation] = useState("North Quad — Between Turing Hall & Library");
  const [specificSpot, setSpecificSpot] = useState("North Quad Walkway towards Turing Hall");
  const [timeOccurred, setTimeOccurred] = useState("Occurred Just Now");
  const [priority, setPriority] = useState("Medium (Patrol)");
  const [description, setDescription] = useState(
    "Unattended metallic mountain bike parked beside Turing Hall East entrance bike rack with sheared lock cables visible on pavement. Individual wearing dark navy hoodie and grey sweatpants was testing handlebars before walking rapidly towards Library plaza when approached."
  );
  const [hasFile, setHasFile] = useState(true);
  const [anonymous, setAnonymous] = useState(false);
  const [officerFollowUp, setOfficerFollowUp] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Safe Walk Escort Mini-Form State
  const [escortLocation, setEscortLocation] = useState("Main Library East Terrace");
  const [escortDestination, setEscortDestination] = useState("Spruce Residence Hall B");

  const handleAction = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const CATEGORIES = [
    {
      id: "suspicious",
      title: "Suspicious Person / Vehicle",
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
      subtitle: "Disturbance, wellness check checkup",
      icon: Volume2,
    },
    {
      id: "hazard",
      title: "Other Facility Hazard",
      subtitle: "Dark lighting, water leak, spill",
      icon: AlertTriangle,
    },
  ];

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

      {/* LIFE-THREATENING EMERGENCY RED BANNER */}
      <div className="bg-red-50/90 border border-red-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-red-900">
              Life-Threatening Emergency?
            </h2>
            <p className="text-xs text-red-700 mt-0.5">
              Call Campus Dispatch directly at <strong className="font-mono">x9110</strong> or <strong className="font-mono">911</strong> immediately for rapid armed emergency intervention.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <button
            type="button"
            onClick={() => handleAction("Initiating priority call to Campus Dispatch (x9110)...")}
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call Dispatch (x9110)</span>
          </button>
          <button
            type="button"
            onClick={() => handleAction("Direct SOS line connected to 911 Municipal.")}
            className="px-3.5 py-2 bg-white border border-red-300 hover:bg-red-50 text-red-700 font-bold text-xs rounded-lg shadow-xs transition cursor-pointer font-mono"
          >
            SOS 911
          </button>
        </div>
      </div>

      {/* HEADER & QUEUE STATUS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-wider text-blue-700 uppercase flex items-center gap-1.5">
            <span>DIRECT NOC RELAY</span>
            <span className="text-slate-300">•</span>
            <span>Telemetry Online</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight mt-1">
            Report an Incident or Request Assistance
          </h1>
          <p className="text-xs text-slate-500 max-w-3xl mt-0.5 leading-relaxed">
            Direct confidential dispatch to Campus Police NOC and Student Welfare Response Teams. Average response time currently under 4 minutes.
          </p>
        </div>

        {/* NOC Response Queue card */}
        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              NOC Response Queue
            </div>
            <div className="text-xs font-bold text-blue-700 font-mono">
              3 min 48 sec avg
            </div>
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID: INTAKE FORM (65%) + ESCORT & PAST TICKETS (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: LIVE INCIDENT INTAKE FORM */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            {/* Form Step Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  LIVE INCIDENT INTAKE
                </div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Incident Dispatch Form
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Step 1 of 2</span>
                <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#0a2f77] h-full rounded-full" style={{ width: "50%" }}></div>
                </div>
              </div>
            </div>

            {/* Section 1: Category Selector (3x2 Grid) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">
                Select Incident Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat.id;
                  const Icon = cat.icon;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer relative flex flex-col justify-between min-h-[92px] ${
                        isSelected
                          ? "bg-blue-50/70 border-blue-600 shadow-xs"
                          : "bg-slate-50/50 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isSelected ? "bg-[#0a2f77] text-white" : "bg-slate-200/80 text-slate-700"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? "border-[#0a2f77] bg-[#0a2f77]"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                        </div>
                      </div>

                      <div className="mt-2 space-y-0.5">
                        <div className="text-xs font-bold text-slate-900 leading-tight">
                          {cat.title}
                        </div>
                        <div className="text-[10px] text-slate-500 leading-tight">
                          {cat.subtitle}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Location Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-700" />
                  <span>Campus Sector / Primary Location</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. North Quad"
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-700" />
                  <span>Specific Room / Landmark / Gate</span>
                </label>
                <input
                  type="text"
                  value={specificSpot}
                  onChange={(e) => setSpecificSpot(e.target.value)}
                  placeholder="e.g. Walkway towards Turing Hall"
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Section 3: Incident Time & Urgency Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Incident Time</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Occurred Just Now", "Past Hour", "Earlier Today"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTimeOccurred(t)}
                      className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold transition cursor-pointer text-center ${
                        timeOccurred === t
                          ? "bg-[#0a2f77] text-white font-bold shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Urgency &amp; Dispatch Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Low (Log Only)", "Medium (Patrol)", "High (Immediate)"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold transition cursor-pointer text-center ${
                        priority === p
                          ? "bg-[#0a2f77] text-white font-bold shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 4: Detailed Description */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Detailed Description
                </label>
                <span className="text-[11px] text-slate-400">
                  Be as objective and detailed as possible
                </span>
              </div>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 leading-relaxed resize-none"
              />
            </div>

            {/* Section 5: Attach Evidence */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">
                Attach Evidence (Photo / Audio / Footage)
              </label>

              {/* Upload Dropzone */}
              <div
                onClick={() => handleAction("File selector opened for incident media.")}
                className="p-5 border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl text-center bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer space-y-1.5"
              >
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 mx-auto flex items-center justify-center">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-800">
                  Click to upload evidence or drag and drop files
                </div>
                <div className="text-[10px] text-slate-400">
                  Supports JPG, PNG, MP4, M4A up to 25MB
                </div>
              </div>

              {/* Attached file chip */}
              {hasFile && (
                <div className="flex items-center justify-between p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-700" />
                    <span className="font-semibold text-slate-800">
                      photo_turing_east_rack.jpg (2.4 MB)
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800">
                      UPLOADED
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHasFile(false)}
                    className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Section 6: Privacy & Response Preferences */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Privacy &amp; Response Preferences
              </div>

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
                      Hide your student ID from patrol officer notes
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
                    <div className="text-xs font-bold text-slate-800">Request Officer Follow-up</div>
                    <div className="text-[11px] text-slate-500">
                      Campus NOC will phone or meet you on site
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleAction("Draft saved securely to local cache.")}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition cursor-pointer"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => handleAction("Incident successfully dispatched to Campus Police NOC! Ref #INC-2025-085.")}
                className="px-5 py-2.5 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg flex items-center gap-2 shadow-xs transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Incident to Dispatch</span>
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
                24/7 Security Escort
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800">
                ETA ~6 MIN
              </span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                Need a Safe Walk Escort?
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Uniformed student safety ambassadors and police patrol will walk with you to your car, lab, or dorm room anytime.
              </p>
            </div>

            {/* Escort Form inputs */}
            <div className="space-y-2.5 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-500">Your Current Location</label>
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

            <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>14 Officers on Campus Patrol</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Complimentary
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleAction("Safe Walk Escort requested! Officer dispatched to Main Library.")}
              className="w-full py-2.5 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Footprints className="w-4 h-4" />
              <span>Request Instant Safe Walk Escort</span>
            </button>
          </div>

          {/* Card 2: My Past Reports & Tickets */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                My Past Reports &amp; Tickets
              </h3>
              <button
                type="button"
                onClick={() => handleAction("Viewing all 5 past tickets...")}
                className="text-xs font-bold text-blue-700 hover:underline cursor-pointer"
              >
                View All (5)
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Ticket 1 */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="flex items-center justify-between font-mono font-bold text-blue-700">
                  <span>#INC-2025-081</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 text-slate-700">
                    RESOLVED
                  </span>
                </div>
                <div className="font-bold text-slate-900">Broken exterior floodlight</div>
                <div className="text-[11px] text-slate-500">
                  Turing West Walkway • Resolved yesterday 18:20
                </div>
              </div>

              {/* Ticket 2 */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="flex items-center justify-between font-mono font-bold text-blue-700">
                  <span>#INC-2024-942</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 text-slate-700">
                    CLOSED
                  </span>
                </div>
                <div className="font-bold text-slate-900">Lost student building keycard</div>
                <div className="text-[11px] text-slate-500">
                  Union Dining Hall • Key replaced
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Need to talk confidentially? */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Lock className="w-4 h-4 text-blue-700" />
              <span>Need to talk confidentially?</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Access mental health counselors, peer crisis supporters, or student ombudspersons 24/7 with zero reporting obligations.
            </p>
            <div className="pt-1">
              <a
                href="#peer-support"
                onClick={(e) => {
                  e.preventDefault();
                  handleAction("Connecting to Peer Support Line: (555) 019-SAFE...");
                }}
                className="font-bold text-blue-700 hover:underline text-xs"
              >
                Peer Support Line: (555) 019-SAFE
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
