/**
 * Centralized API configuration and utility helpers
 */

export const getApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
};

export const API_ENDPOINTS = {
  auth: {
    login: `${getApiUrl()}/api/auth/login`,
    logout: `${getApiUrl()}/api/auth/logout`,
    forgotPassword: `${getApiUrl()}/api/auth/forgot-password`,
    resetPassword: `${getApiUrl()}/api/auth/reset-password`,
    validateToken: `${getApiUrl()}/api/auth/validate-token`,
    roles: `${getApiUrl()}/api/auth/roles`,
    users: `${getApiUrl()}/api/auth/users`,
    profile: `${getApiUrl()}/api/auth/profile`,
    toggleStatus: (id: number | string) => `${getApiUrl()}/api/auth/users/${id}/status`,
  },
  incidents: {
    base: `${getApiUrl()}/api/incidents`,
    list: `${getApiUrl()}/api/incidents`,
    resolve: (id: number | string) => `${getApiUrl()}/api/incidents/${id}/resolve`,
    status: (id: number | string) => `${getApiUrl()}/api/incidents/${id}/status`,
    escalate: (id: number | string) => `${getApiUrl()}/api/incidents/${id}/escalate`,
  },
  shifts: {
    base: `${getApiUrl()}/api/shifts`,
    list: `${getApiUrl()}/api/shifts`,
    checkIn: `${getApiUrl()}/api/shifts/check-in`,
    checkout: (id: number | string) => `${getApiUrl()}/api/shifts/${id}/checkout`,
    escalate: (id: number | string) => `${getApiUrl()}/api/shifts/${id}/escalate`,
    reportAbsence: (id: number | string, reason?: string) => `${getApiUrl()}/api/shifts/${id}/report-absence${reason ? `?reason=${encodeURIComponent(reason)}` : ""}`,
    checkAbsences: `${getApiUrl()}/api/shifts/check-absences`,
  },
  handoffs: {
    base: `${getApiUrl()}/api/handoffs`,
    list: `${getApiUrl()}/api/handoffs`,
    latest: `${getApiUrl()}/api/handoffs/latest`,
    byId: (id: number | string) => `${getApiUrl()}/api/handoffs/${id}`,
  },
  dutyRoster: {
    base: `${getApiUrl()}/api/duty-roster`,
    list: `${getApiUrl()}/api/duty-roster`,
    myRoster: `${getApiUrl()}/api/duty-roster/my-roster`,
    summary: `${getApiUrl()}/api/duty-roster/summary`,
    byId: (id: number | string) => `${getApiUrl()}/api/duty-roster/${id}`,
    reliever: (id: number | string) => `${getApiUrl()}/api/duty-roster/${id}/reliever`,
    status: (id: number | string) => `${getApiUrl()}/api/duty-roster/${id}/status`,
    reassign: (id: number | string) => `${getApiUrl()}/api/duty-roster/${id}/reassign`,
    reassignments: `${getApiUrl()}/api/duty-roster/reassignments`,
    reassignmentsByRoster: (id: number | string) => `${getApiUrl()}/api/duty-roster/${id}/reassignments`,
  },
  parking: {
    passes: `${getApiUrl()}/api/parking/passes`,
    my: (owner?: string) => `${getApiUrl()}/api/parking/passes/my${owner ? `?owner=${encodeURIComponent(owner)}` : ""}`,
    verify: `${getApiUrl()}/api/parking/verify`,
  },
  auditLogs: {
    base: `${getApiUrl()}/api/audit-logs`,
    list: `${getApiUrl()}/api/audit-logs`,
    create: `${getApiUrl()}/api/audit-logs`,
  },
  notifications: {
    base: `${getApiUrl()}/api/notifications`,
    list: (role?: string) => role ? `${getApiUrl()}/api/notifications?role=${encodeURIComponent(role)}` : `${getApiUrl()}/api/notifications`,
    byRole: (role: string) => `${getApiUrl()}/api/notifications?role=${encodeURIComponent(role)}`,
    read: (id: number | string) => `${getApiUrl()}/api/notifications/${id}/read`,
    markRead: (id: number | string) => `${getApiUrl()}/api/notifications/${id}/read`,
    markUnread: (id: number | string) => `${getApiUrl()}/api/notifications/${id}/unread`,
    toggleRead: (id: number | string) => `${getApiUrl()}/api/notifications/${id}/toggle-read`,
    markAllRead: (role?: string) => role ? `${getApiUrl()}/api/notifications/mark-all-read?role=${encodeURIComponent(role)}` : `${getApiUrl()}/api/notifications/mark-all-read`,
    guardAbsence: `${getApiUrl()}/api/notifications/guard-absence`,
  },
  attendance: {
    config: `${getApiUrl()}/api/attendance/config`,
    noShows: `${getApiUrl()}/api/attendance/no-shows`,
    records: `${getApiUrl()}/api/attendance/records`,
    evaluate: `${getApiUrl()}/api/attendance/evaluate`,
    checkIn: (id: number | string) => `${getApiUrl()}/api/attendance/check-in/${id}`,
    approveLeave: (id: number | string) => `${getApiUrl()}/api/attendance/approve-leave/${id}`,
  },
  features: `${getApiUrl()}/api/features`,
  status: `${getApiUrl()}/api/status`,
};
