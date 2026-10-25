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
    myReports: (email?: string, role?: string) => {
      const params = new URLSearchParams();
      if (email) params.set("email", email);
      if (role) params.set("role", role);
      const q = params.toString();
      return q ? `${getApiUrl()}/api/incidents/my-reports?${q}` : `${getApiUrl()}/api/incidents/my-reports`;
    },
    byId: (id: number | string) => `${getApiUrl()}/api/incidents/${id}`,
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
  vehicles: {
    base: `${getApiUrl()}/api/vehicles`,
    register: `${getApiUrl()}/api/vehicles/register`,
    my: (email?: string, studentId?: string) => {
      const params = new URLSearchParams();
      if (email) params.set("email", email);
      if (studentId) params.set("studentId", studentId);
      const q = params.toString();
      return q ? `${getApiUrl()}/api/vehicles/my?${q}` : `${getApiUrl()}/api/vehicles/my`;
    },
    byId: (id: number | string) => `${getApiUrl()}/api/vehicles/${id}`,
    approve: (id: number | string) => `${getApiUrl()}/api/vehicles/${id}/approve`,
    deny: (id: number | string) => `${getApiUrl()}/api/vehicles/${id}/deny`,
    checkNumber: (vehicleNumber: string) => `${getApiUrl()}/api/vehicles/check?vehicleNumber=${encodeURIComponent(vehicleNumber)}`,
    list: (status?: string) => status ? `${getApiUrl()}/api/vehicles?status=${encodeURIComponent(status)}` : `${getApiUrl()}/api/vehicles`,
  },
  auditLogs: {
    base: `${getApiUrl()}/api/audit-logs`,
    list: `${getApiUrl()}/api/audit-logs`,
    create: `${getApiUrl()}/api/audit-logs`,
  },
  notifications: {
    base: `${getApiUrl()}/api/notifications`,
    list: (role?: string, email?: string) => {
      const params = new URLSearchParams();
      if (role) params.set("role", role);
      if (email) params.set("email", email);
      const q = params.toString();
      return q ? `${getApiUrl()}/api/notifications?${q}` : `${getApiUrl()}/api/notifications`;
    },
    byRole: (role: string, email?: string) => {
      const params = new URLSearchParams();
      params.set("role", role);
      if (email) params.set("email", email);
      return `${getApiUrl()}/api/notifications?${params.toString()}`;
    },
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
  occurrenceRegister: {
    base: `${getApiUrl()}/api/supervisor/occurrence-register`,
    list: (params?: { startDate?: string; endDate?: string; guard?: string; type?: string }) => {
      const sp = new URLSearchParams();
      if (params?.startDate) sp.set("startDate", params.startDate);
      if (params?.endDate) sp.set("endDate", params.endDate);
      if (params?.guard) sp.set("guard", params.guard);
      if (params?.type && params.type !== "ALL") sp.set("type", params.type);
      const q = sp.toString();
      return q ? `${getApiUrl()}/api/supervisor/occurrence-register?${q}` : `${getApiUrl()}/api/supervisor/occurrence-register`;
    },
    byId: (id: number | string) => `${getApiUrl()}/api/supervisor/occurrence-register/${id}`,
    addRemark: (id: number | string) => `${getApiUrl()}/api/supervisor/occurrence-register/${id}/remarks`,
  },
  supervisorReports: {
    summary: (params: { reportType: string; startDate?: string; endDate?: string }) => {
      const sp = new URLSearchParams();
      if (params.reportType) sp.set("reportType", params.reportType);
      if (params.startDate) sp.set("startDate", params.startDate);
      if (params.endDate) sp.set("endDate", params.endDate);
      return `${getApiUrl()}/api/supervisor/reports/summary?${sp.toString()}`;
    },
    exportCsv: (params: { reportType: string; startDate?: string; endDate?: string }) => {
      const sp = new URLSearchParams();
      if (params.reportType) sp.set("reportType", params.reportType);
      if (params.startDate) sp.set("startDate", params.startDate);
      if (params.endDate) sp.set("endDate", params.endDate);
      return `${getApiUrl()}/api/supervisor/reports/export/csv?${sp.toString()}`;
    },
    exportPdf: (params: { reportType: string; startDate?: string; endDate?: string }) => {
      const sp = new URLSearchParams();
      if (params.reportType) sp.set("reportType", params.reportType);
      if (params.startDate) sp.set("startDate", params.startDate);
      if (params.endDate) sp.set("endDate", params.endDate);
      return `${getApiUrl()}/api/supervisor/reports/export/pdf?${sp.toString()}`;
    },
  },
  features: `${getApiUrl()}/api/features`,
  status: `${getApiUrl()}/api/status`,
};
