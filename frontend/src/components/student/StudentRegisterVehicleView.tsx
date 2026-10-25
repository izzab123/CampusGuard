"use client";

import React, { useState, useEffect } from "react";
import {
  Car,
  User,
  Hash,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  PlusCircle,
  Eye,
  Loader2,
  Sparkles
} from "lucide-react";
import { getStoredAuthUser, AuthUser } from "@/lib/auth";
import { API_ENDPOINTS } from "@/lib/api";
import VehicleDetailsModal, { VehicleRegistrationDetail } from "@/components/vehicles/VehicleDetailsModal";

export default function StudentRegisterVehicleView() {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Form State
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("Car");

  // Touched state for validation
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successRegistration, setSuccessRegistration] = useState<VehicleRegistrationDetail | null>(null);

  // Registered Vehicles List for this student
  const [myVehicles, setMyVehicles] = useState<VehicleRegistrationDetail[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  // Modal State
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const stored = getStoredAuthUser();
    setUser(stored);
    if (stored) {
      if (stored.badgeNumber) setStudentId(stored.badgeNumber);
      if (stored.fullName || stored.name) setName(stored.fullName || stored.name || "");
      if (stored.phoneNumber) setContactNumber(stored.phoneNumber);
    }
    fetchMyVehicles(stored);
  }, []);

  const fetchMyVehicles = async (currentUser?: AuthUser | null) => {
    setLoadingList(true);
    try {
      const u = currentUser || user || getStoredAuthUser();
      const res = await fetch(API_ENDPOINTS.vehicles.my(u?.email, u?.badgeNumber));
      if (res.ok) {
        const data = await res.json();
        setMyVehicles(Array.isArray(data) ? data : []);
      }
    } catch {
      // fallback
    } finally {
      setLoadingList(false);
    }
  };

  // Validations
  const validateStudentId = (val: string) => {
    if (!val.trim()) return "Student ID is required";
    if (val.trim().length < 2) return "Student ID must be at least 2 characters";
    return "";
  };

  const validateName = (val: string) => {
    if (!val.trim()) return "Full name is required";
    if (val.trim().length < 2) return "Name must be at least 2 characters";
    return "";
  };

  const validateContact = (val: string) => {
    if (!val.trim()) return "Contact number is required";
    const phoneRegex = /^[+0-9\s\-().]{7,25}$/;
    if (!phoneRegex.test(val.trim())) return "Please enter a valid phone number (at least 7 digits)";
    return "";
  };

  const validateVehicleNumber = (val: string) => {
    if (!val.trim()) return "Vehicle number / plate is required";
    if (val.trim().length < 2) return "Vehicle number must be at least 2 characters";
    return "";
  };

  const validateVehicleType = (val: string) => {
    if (!val.trim()) return "Vehicle type is required";
    return "";
  };

  const studentIdError = touched.studentId ? validateStudentId(studentId) : "";
  const nameError = touched.name ? validateName(name) : "";
  const contactError = touched.contactNumber ? validateContact(contactNumber) : "";
  const vehicleNumberError = touched.vehicleNumber ? validateVehicleNumber(vehicleNumber) : "";
  const vehicleTypeError = touched.vehicleType ? validateVehicleType(vehicleType) : "";

  const isFormValid =
    !validateStudentId(studentId) &&
    !validateName(name) &&
    !validateContact(contactNumber) &&
    !validateVehicleNumber(vehicleNumber) &&
    !validateVehicleType(vehicleType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({
      studentId: true,
      name: true,
      contactNumber: true,
      vehicleNumber: true,
      vehicleType: true,
    });

    if (!isFormValid) {
      setErrorMessage("Please fill all required fields correctly before submitting.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        studentId: studentId.trim(),
        name: name.trim(),
        contactNumber: contactNumber.trim(),
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
        vehicleType: vehicleType.trim(),
        email: user?.email || undefined,
      };

      const res = await fetch(API_ENDPOINTS.vehicles.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to register vehicle");
      }

      // Owner sees the status "Pending approval"
      setSuccessRegistration(data);
      setVehicleNumber(""); // Clear vehicle plate input for next entry
      fetchMyVehicles();
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while submitting registration.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-blue-800 uppercase tracking-wide">
            <Car className="w-3.5 h-3.5" />
            <span>Campus Parking Clearance Portal</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight mt-1">
            Register Vehicle
          </h1>
          <p className="text-xs text-slate-500">
            Submit your vehicle information for campus clearance and parking pass authorization.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchMyVehicles()}
          className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Success Notification Banner when Owner submits and sees "Pending approval" */}
      {successRegistration && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl shadow-xs space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <h2 className="text-sm font-bold text-amber-900">
                Registration Submitted Successfully
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-600" />
              <span>Status: {successRegistration.status}</span>
            </span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            Your vehicle <strong>{successRegistration.vehicleNumber}</strong> ({successRegistration.vehicleType}) has been logged. The on-duty Security Guard has been notified for clearance approval.
          </p>
          <div className="pt-1 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedVehicleId(successRegistration.id);
                setIsModalOpen(true);
              }}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer"
            >
              View Full Registration Receipt →
            </button>
            <button
              type="button"
              onClick={() => setSuccessRegistration(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-700 ml-auto cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-900 flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-700 hover:text-red-900 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* TWO-COLUMN GRID: REGISTRATION FORM + OWNER'S REGISTERED VEHICLES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: VEHICLE REGISTRATION FORM (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                <PlusCircle className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">New Vehicle Intake Form</h2>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">All fields required</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student ID & Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  <span>Student ID *</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. STU-88201"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, studentId: true }))}
                  className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-blue-600 ${
                    studentIdError ? "border-red-400 bg-red-50/20" : "border-slate-200"
                  }`}
                />
                {studentIdError && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">{studentIdError}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                  className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-blue-600 ${
                    nameError ? "border-red-400 bg-red-50/20" : "border-slate-200"
                  }`}
                />
                {nameError && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">{nameError}</p>
                )}
              </div>
            </div>

            {/* Contact Number & Vehicle Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Contact Number *</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +1 (555) 019-2831"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, contactNumber: true }))}
                  className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-blue-600 ${
                    contactError ? "border-red-400 bg-red-50/20" : "border-slate-200"
                  }`}
                />
                {contactError && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">{contactError}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-slate-400" />
                  <span>Vehicle Type *</span>
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, vehicleType: true }))}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="Car">Car / Sedan</option>
                  <option value="SUV / Van">SUV / Van</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Scooter">Electric Scooter / Moped</option>
                  <option value="Bicycle">Bicycle</option>
                </select>
                {vehicleTypeError && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">{vehicleTypeError}</p>
                )}
              </div>
            </div>

            {/* Vehicle Number (License Plate) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Vehicle Plate Number *</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Must be unique</span>
              </label>
              <input
                type="text"
                placeholder="e.g. DHAKA-METRO-GA-11-2233 or 7XYZ-42"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                onBlur={() => setTouched((prev) => ({ ...prev, vehicleNumber: true }))}
                className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl font-mono font-bold tracking-wider text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 ${
                  vehicleNumberError ? "border-red-400 bg-red-50/20" : "border-slate-200"
                }`}
              />
              {vehicleNumberError && (
                <p className="text-[11px] text-red-600 mt-1 font-medium">{vehicleNumberError}</p>
              )}
              <p className="text-[11px] text-slate-400 mt-1">
                Enter your exact license plate as shown on your state/regional registration.
              </p>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                Status upon submitting: <strong className="text-amber-700 font-semibold">Pending approval</strong>
              </span>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting Registration...</span>
                  </>
                ) : (
                  <>
                    <Car className="w-3.5 h-3.5" />
                    <span>Submit Vehicle Registration</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: MY REGISTERED VEHICLES (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-700" />
                <h2 className="text-sm font-bold text-slate-900">
                  My Registered Vehicles ({myVehicles.length})
                </h2>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Live Records</span>
            </div>

            {loadingList && (
              <div className="py-8 flex flex-col items-center justify-center text-slate-400 text-xs gap-1">
                <Loader2 className="w-4 h-4 animate-spin text-[#0a2f77]" />
                <span>Syncing vehicles...</span>
              </div>
            )}

            {!loadingList && myVehicles.length === 0 && (
              <div className="py-8 text-center text-slate-400 text-xs">
                No vehicles registered yet. Fill the form to register your first vehicle.
              </div>
            )}

            {!loadingList && myVehicles.length > 0 && (
              <div className="space-y-2.5">
                {myVehicles.map((item) => {
                  const isPending = item.status?.toLowerCase().includes("pending");
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-slate-900">
                            {item.vehicleNumber}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isPending
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {item.vehicleType} • ID: {item.studentId}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Submitted: {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedVehicleId(item.id);
                          setIsModalOpen(true);
                        }}
                        className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <Eye className="w-3 h-3 text-slate-500" />
                        <span>Details</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Verification Protocol Notice */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>Campus Security Approval Flow</span>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              Upon submitting, on-duty campus guards receive a review alert in their operational terminal. Once approved, the vehicle is cleared for automated gate access and a notification is dispatched to Supervisor and Admin.
            </p>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <VehicleDetailsModal
        isOpen={isModalOpen}
        vehicleId={selectedVehicleId}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVehicleId(null);
        }}
      />
    </div>
  );
}
