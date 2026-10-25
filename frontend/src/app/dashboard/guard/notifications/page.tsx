"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Bell,
  Clock,
  LogOut,
  RotateCcw,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { performLogout, getStoredAuthUser } from "@/lib/auth";
import { API_ENDPOINTS } from "@/lib/api";
import IncidentDetailsModal from "@/components/incidents/IncidentDetailsModal";
import VehicleDetailsModal from "@/components/vehicles/VehicleDetailsModal";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  category: string;
  priority: string;
  incidentId?: number;
  vehicleRegistrationId?: number;
  isRead: boolean;
  createdAt: string;
}

export default function GuardNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [approvingVehicleId, setApprovingVehicleId] = useState<number | null>(null);
  const [denyingVehicleId, setDenyingVehicleId] = useState<number | null>(null);

  const fetchNotifications = async () => {
    try {
      const user = getStoredAuthUser();
      const res = await fetch(API_ENDPOINTS.notifications.byRole("Security Guard", user?.email || undefined));
      if (res.ok) {
        const data = await res.json();
        const normalized = (Array.isArray(data) ? data : []).map((n: any) => ({
          ...n,
          isRead: Boolean(n.isRead ?? n.read ?? false),
        }));
        setNotifications(normalized);
      }
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleOpenIncident = (notif: NotificationItem) => {
    if (notif.incidentId) {
      setSelectedIncidentId(notif.incidentId);
      setIsModalOpen(true);
      if (!notif.isRead) {
        handleMarkAsRead(notif.id);
      }
    }
  };

  const handleOpenVehicle = (notif: NotificationItem) => {
    if (notif.vehicleRegistrationId) {
      setSelectedVehicleId(notif.vehicleRegistrationId);
      setIsVehicleModalOpen(true);
      if (!notif.isRead) {
        handleMarkAsRead(notif.id);
      }
    }
  };

  const handleApproveVehicle = async (notif: NotificationItem) => {
    if (!notif.vehicleRegistrationId) return;
    setApprovingVehicleId(notif.vehicleRegistrationId);
    try {
      const user = getStoredAuthUser();
      const approverName = user?.fullName || user?.name || "Security Guard";
      const res = await fetch(API_ENDPOINTS.vehicles.approve(notif.vehicleRegistrationId), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvedBy: approverName }),
      });
      if (res.ok) {
        handleAction("Vehicle registration approved! Notifications sent to student, supervisor, and admin.");
        handleMarkAsRead(notif.id);
        fetchNotifications();
      } else {
        const err = await res.json();
        handleAction(err.message || "Failed to approve registration.");
      }
    } catch {
      handleAction("Network error approving vehicle registration.");
    } finally {
      setApprovingVehicleId(null);
    }
  };

  const handleDenyVehicle = async (notif: NotificationItem) => {
    if (!notif.vehicleRegistrationId) return;
    setDenyingVehicleId(notif.vehicleRegistrationId);
    try {
      const user = getStoredAuthUser();
      const approverName = user?.fullName || user?.name || "Security Guard";
      const res = await fetch(API_ENDPOINTS.vehicles.deny(notif.vehicleRegistrationId), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deniedBy: approverName,
          reason: "Clearance denied by on-duty security guard",
        }),
      });
      if (res.ok) {
        handleAction("Vehicle registration denied. Notification dispatched ONLY to the student.");
        handleMarkAsRead(notif.id);
        fetchNotifications();
      } else {
        const err = await res.json();
        handleAction(err.message || "Failed to deny registration.");
      }
    } catch {
      handleAction("Network error denying vehicle registration.");
    } finally {
      setDenyingVehicleId(null);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await fetch(API_ENDPOINTS.notifications.read(id), { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      handleAction("Notification acknowledged.");
    } catch {}
  };

  const handleAction = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === "Unread" && n.isRead) return false;
    if (activeTab === "Critical" && n.priority !== "CRITICAL" && n.priority !== "HIGH") return false;
    return true;
  });

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
              <Link href="/dashboard/guard/view-my-duty" className="py-5 hover:text-slate-900 transition">
                View My Duty
              </Link>
              <Link href="/dashboard/guard/handoff" className="py-5 hover:text-slate-900 transition">
                Handoff
              </Link>
              <Link href="/dashboard/guard/parking" className="py-5 hover:text-slate-900 transition">
                Parking
              </Link>
              <Link href="/dashboard/guard/incidents" className="py-5 hover:text-slate-900 transition">
                Incidents
              </Link>
              <Link href="/dashboard/guard/notifications" className="py-5 text-blue-700 font-bold border-b-2 border-blue-700">
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
            <h1 className="text-2xl font-extrabold text-slate-900">Field Dispatch Alerts &amp; Watch Bulletins</h1>
            <p className="text-xs text-slate-500">Live operational alerts routed to post terminal and guard mobile radios.</p>
          </div>

          <button
            type="button"
            onClick={fetchNotifications}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer self-start"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {["All", "Unread", "Critical"].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? "bg-[#0a2f77] text-white font-bold shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab} ({tab === "All" ? notifications.length : tab === "Unread" ? notifications.filter(n => !n.isRead).length : notifications.filter(n => n.priority === "HIGH" || n.priority === "CRITICAL").length})
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-slate-400 text-xs">
              No guard dispatch notifications available.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`bg-white border rounded-2xl p-5 shadow-xs transition flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                  !item.isRead ? "border-blue-300 bg-blue-50/20" : "border-slate-200"
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.priority === "HIGH" || item.priority === "CRITICAL"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {item.priority}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{item.title}</span>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    )}
                    {item.incidentId && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                        #INC-{item.incidentId}
                      </span>
                    )}
                    {item.vehicleRegistrationId && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        #VEH-{item.vehicleRegistrationId}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                    {item.message}
                  </p>
                  <div className="text-[11px] text-slate-400 font-medium">
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start shrink-0 flex-wrap">
                  {item.incidentId && (
                    <button
                      type="button"
                      onClick={() => handleOpenIncident(item)}
                      className="px-3 py-1.5 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>View Details</span>
                    </button>
                  )}

                  {item.vehicleRegistrationId && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOpenVehicle(item)}
                        className="px-3 py-1.5 bg-[#0a2f77] hover:bg-[#082660] text-white font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>View Details</span>
                      </button>
                      <button
                        type="button"
                        disabled={denyingVehicleId === item.vehicleRegistrationId || approvingVehicleId === item.vehicleRegistrationId}
                        onClick={() => handleDenyVehicle(item)}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                        <span>{denyingVehicleId === item.vehicleRegistrationId ? "Denying..." : "Deny"}</span>
                      </button>
                      <button
                        type="button"
                        disabled={approvingVehicleId === item.vehicleRegistrationId || denyingVehicleId === item.vehicleRegistrationId}
                        onClick={() => handleApproveVehicle(item)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{approvingVehicleId === item.vehicleRegistrationId ? "Approving..." : "Approve Registration"}</span>
                      </button>
                    </>
                  )}

                  {!item.isRead && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(item.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition cursor-pointer"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Incident Details Modal */}
      <IncidentDetailsModal
        isOpen={isModalOpen}
        incidentId={selectedIncidentId}
        canManageStatus={false}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedIncidentId(null);
        }}
      />

      {/* Vehicle Details Modal with Guard Approval option */}
      <VehicleDetailsModal
        isOpen={isVehicleModalOpen}
        vehicleId={selectedVehicleId}
        canApprove={true}
        onApproved={() => {
          fetchNotifications();
          handleAction("Vehicle registration approved! Notifications sent to student, supervisor, and admin.");
        }}
        onDenied={() => {
          fetchNotifications();
          handleAction("Vehicle registration denied. Notification dispatched ONLY to the student.");
        }}
        onClose={() => {
          setIsVehicleModalOpen(false);
          setSelectedVehicleId(null);
        }}
      />
    </div>
  );
}
