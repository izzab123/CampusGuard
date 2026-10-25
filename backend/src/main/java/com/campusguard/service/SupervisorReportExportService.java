package com.campusguard.service;

import com.campusguard.model.DutyRoster;
import com.campusguard.model.IncidentReport;
import com.campusguard.model.ScanLog;
import com.campusguard.repository.DutyRosterRepository;
import com.campusguard.repository.IncidentReportRepository;
import com.campusguard.repository.ScanLogRepository;
import com.campusguard.util.PdfDocument;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class SupervisorReportExportService {

    private final IncidentReportRepository incidentRepo;
    private final DutyRosterRepository rosterRepo;
    private final ScanLogRepository scanLogRepo;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATETIME_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final DateTimeFormatter DISPLAY_DT_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public SupervisorReportExportService(IncidentReportRepository incidentRepo,
                                         DutyRosterRepository rosterRepo,
                                         ScanLogRepository scanLogRepo) {
        this.incidentRepo = incidentRepo;
        this.rosterRepo = rosterRepo;
        this.scanLogRepo = scanLogRepo;
    }

    public String normalizeReportType(String type) {
        if (type == null) return "incidents";
        String lower = type.trim().toLowerCase();
        if (lower.contains("attend") || lower.contains("no-show") || lower.contains("noshow")) {
            return "attendance";
        }
        if (lower.contains("scan") || lower.contains("gate") || lower.contains("access")) {
            return "scan-logs";
        }
        return "incidents";
    }

    public String getReportTitle(String reportType) {
        return switch (normalizeReportType(reportType)) {
            case "attendance" -> "Guard Attendance & No-Show Operations Summary";
            case "scan-logs" -> "Perimeter Gate & Access Credential Scan Logs";
            default -> "Campus Security & Incident Tracking Summary";
        };
    }

    // =========================================================================
    // 1. DATA RETRIEVAL (Role-Filtered by Date Range)
    // =========================================================================

    public List<IncidentReport> getIncidentRecords(LocalDate start, LocalDate end) {
        LocalDateTime startDt = start.atStartOfDay();
        LocalDateTime endDt = end.atTime(23, 59, 59, 999999999);
        return incidentRepo.findByCreatedAtBetweenOrderByCreatedAtDesc(startDt, endDt);
    }

    public List<DutyRoster> getAttendanceRecords(LocalDate start, LocalDate end) {
        return rosterRepo.findByDutyDateBetweenOrderByDutyDateDescStartTimeAsc(start, end);
    }

    public List<ScanLog> getScanRecords(LocalDate start, LocalDate end) {
        LocalDateTime startDt = start.atStartOfDay();
        LocalDateTime endDt = end.atTime(23, 59, 59, 999999999);
        return scanLogRepo.findByTimestampBetween(startDt, endDt);
    }

    // =========================================================================
    // 2. SUMMARY PREVIEW DTO (for Frontend Live Preview)
    // =========================================================================

    public Map<String, Object> getReportSummary(String rawType, LocalDate start, LocalDate end,
                                                String callerName, String callerBadge, String callerRole) {
        String type = normalizeReportType(rawType);
        String title = getReportTitle(type);
        LocalDateTime now = LocalDateTime.now();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("reportType", type);
        result.put("title", title);
        result.put("startDate", start.format(DATE_FMT));
        result.put("endDate", end.format(DATE_FMT));
        result.put("generatedAt", now.format(DATETIME_FMT));
        result.put("generatedBy", callerName);
        result.put("generatedByBadge", callerBadge);
        result.put("generatedByRole", callerRole);
        result.put("targetAudience", "University Administration & Senior Leadership");
        result.put("classification", "OFFICIAL REPORT - SHIFT SUPERVISOR CLEARANCE");

        switch (type) {
            case "attendance" -> {
                List<DutyRoster> list = getAttendanceRecords(start, end);
                long total = list.size();
                long present = list.stream().filter(r -> "PRESENT".equalsIgnoreCase(r.getAttendanceStatus()) || r.isCheckedIn()).count();
                long noShows = list.stream().filter(r -> "NO_SHOW".equalsIgnoreCase(r.getAttendanceStatus()) || r.isCountsAsNoShow()).count();
                long scheduled = list.stream().filter(r -> "SCHEDULED".equalsIgnoreCase(r.getAttendanceStatus())).count();

                result.put("totalRecords", total);
                result.put("metrics", Map.of(
                        "totalShifts", total,
                        "presentCount", present,
                        "noShowCount", noShows,
                        "scheduledCount", scheduled
                ));
                result.put("records", list);
            }
            case "scan-logs" -> {
                List<ScanLog> list = getScanRecords(start, end);
                long total = list.size();
                long granted = list.stream().filter(s -> "GRANTED".equalsIgnoreCase(s.getAccessStatus())).count();
                long denied = list.stream().filter(s -> "DENIED".equalsIgnoreCase(s.getAccessStatus())).count();
                long flagged = list.stream().filter(s -> "FLAGGED_SECURITY".equalsIgnoreCase(s.getAccessStatus()) || "MANUAL_OVERRIDE".equalsIgnoreCase(s.getAccessStatus())).count();

                result.put("totalRecords", total);
                result.put("metrics", Map.of(
                        "totalScans", total,
                        "grantedCount", granted,
                        "deniedCount", denied,
                        "flaggedCount", flagged
                ));
                result.put("records", list);
            }
            default -> {
                List<IncidentReport> list = getIncidentRecords(start, end);
                long total = list.size();
                long critical = list.stream().filter(i -> "CRITICAL".equalsIgnoreCase(i.getSeverity())).count();
                long high = list.stream().filter(i -> "HIGH".equalsIgnoreCase(i.getSeverity())).count();
                long medium = list.stream().filter(i -> "MEDIUM".equalsIgnoreCase(i.getSeverity())).count();
                long low = list.stream().filter(i -> "LOW".equalsIgnoreCase(i.getSeverity())).count();
                long open = list.stream().filter(i -> !"RESOLVED".equalsIgnoreCase(i.getStatus())).count();
                long resolved = list.stream().filter(i -> "RESOLVED".equalsIgnoreCase(i.getStatus())).count();

                result.put("totalRecords", total);
                result.put("metrics", Map.of(
                        "totalIncidents", total,
                        "criticalCount", critical,
                        "highCount", high,
                        "mediumCount", medium,
                        "lowCount", low,
                        "openCount", open,
                        "resolvedCount", resolved
                ));
                result.put("records", list);
            }
        }

        return result;
    }

    // =========================================================================
    // 3. CSV EXPORT GENERATOR (RFC 4180 with UTF-8 BOM and Header Metadata)
    // =========================================================================

    public byte[] exportCsv(String rawType, LocalDate start, LocalDate end,
                            String callerName, String callerBadge, String callerRole) {
        String type = normalizeReportType(rawType);
        String title = getReportTitle(type);
        LocalDateTime now = LocalDateTime.now();

        StringBuilder sb = new StringBuilder();
        // UTF-8 BOM for Microsoft Excel / Google Sheets compatibility
        sb.append("\uFEFF");

        // Header Metadata
        sb.append("# ==============================================================================\n");
        sb.append("# CAMPUSGUARD SECURITY & SAFETY OPERATIONS - OFFICIAL ADMINISTRATION REPORT\n");
        sb.append("# ==============================================================================\n");
        sb.append("# Report Type: ").append(title).append("\n");
        sb.append("# Target Organization: University Administration & Senior Leadership\n");
        sb.append("# Selected Date Range: ").append(start.format(DATE_FMT)).append(" to ").append(end.format(DATE_FMT)).append("\n");
        sb.append("# Timestamp of Generation: ").append(now.format(DATETIME_FMT)).append(" (Local Server Time)\n");
        sb.append("# Generated By: ").append(callerName).append("\n");
        sb.append("# Staff ID / Badge: ").append(callerBadge != null ? callerBadge : "N/A").append("\n");
        sb.append("# Official Role: ").append(callerRole).append("\n");
        sb.append("# Security Clearance: ROLE_SHIFT_SUPERVISOR (Official Security Clearance)\n");

        switch (type) {
            case "attendance" -> {
                List<DutyRoster> list = getAttendanceRecords(start, end);
                long present = list.stream().filter(r -> "PRESENT".equalsIgnoreCase(r.getAttendanceStatus()) || r.isCheckedIn()).count();
                long noShows = list.stream().filter(r -> "NO_SHOW".equalsIgnoreCase(r.getAttendanceStatus()) || r.isCountsAsNoShow()).count();
                sb.append("# Total Records: ").append(list.size()).append(" shifts\n");
                sb.append("# Summary: Present: ").append(present).append(" | Flagged No-Shows: ").append(noShows).append(" | Total Monitored: ").append(list.size()).append("\n");
                sb.append("# ==============================================================================\n\n");

                sb.append("Roster ID,Duty Date,Guard Name,Guard Badge,Post Location,Shift Type,Shift Hours,Attendance Status,Checked In,Check-In Time,No-Show Flagged At,No-Show Reason,Reliever Guard,Notes\n");
                for (DutyRoster r : list) {
                    sb.append(escapeCsv(r.getId())).append(",");
                    sb.append(escapeCsv(r.getDutyDate() != null ? r.getDutyDate().toString() : "")).append(",");
                    sb.append(escapeCsv(r.getGuardName())).append(",");
                    sb.append(escapeCsv(r.getGuardBadgeNumber())).append(",");
                    sb.append(escapeCsv(r.getPostLocation())).append(",");
                    sb.append(escapeCsv(r.getShiftType())).append(",");
                    sb.append(escapeCsv((r.getStartTime() != null ? r.getStartTime() : "") + " - " + (r.getEndTime() != null ? r.getEndTime() : ""))).append(",");
                    sb.append(escapeCsv(r.getAttendanceStatus())).append(",");
                    sb.append(escapeCsv(r.isCheckedIn() ? "YES" : "NO")).append(",");
                    sb.append(escapeCsv(r.getCheckInTime() != null ? r.getCheckInTime().format(DISPLAY_DT_FMT) : "")).append(",");
                    sb.append(escapeCsv(r.getNoShowFlaggedAt() != null ? r.getNoShowFlaggedAt().format(DISPLAY_DT_FMT) : "")).append(",");
                    sb.append(escapeCsv(r.getNoShowReason())).append(",");
                    sb.append(escapeCsv(r.getRelieverName())).append(",");
                    sb.append(escapeCsv(r.getNotes())).append("\n");
                }
            }
            case "scan-logs" -> {
                List<ScanLog> list = getScanRecords(start, end);
                long granted = list.stream().filter(s -> "GRANTED".equalsIgnoreCase(s.getAccessStatus())).count();
                long denied = list.stream().filter(s -> "DENIED".equalsIgnoreCase(s.getAccessStatus())).count();
                sb.append("# Total Records: ").append(list.size()).append(" scans\n");
                sb.append("# Summary: Granted: ").append(granted).append(" | Denied: ").append(denied).append(" | Total Telemetry: ").append(list.size()).append("\n");
                sb.append("# ==============================================================================\n\n");

                sb.append("Scan ID,Timestamp,Scanner Type,Gate Location,Subject Identifier,Subject Name,Access Status,Operator Guard / Radar,Operational Notes\n");
                for (ScanLog s : list) {
                    sb.append(escapeCsv(s.getId())).append(",");
                    sb.append(escapeCsv(s.getScanTimestamp() != null ? s.getScanTimestamp().format(DISPLAY_DT_FMT) : "")).append(",");
                    sb.append(escapeCsv(s.getScannerType())).append(",");
                    sb.append(escapeCsv(s.getGateLocation())).append(",");
                    sb.append(escapeCsv(s.getSubjectIdentifier())).append(",");
                    sb.append(escapeCsv(s.getSubjectName())).append(",");
                    sb.append(escapeCsv(s.getAccessStatus())).append(",");
                    sb.append(escapeCsv(s.getOperatorGuard())).append(",");
                    sb.append(escapeCsv(s.getNotes())).append("\n");
                }
            }
            default -> {
                List<IncidentReport> list = getIncidentRecords(start, end);
                long crit = list.stream().filter(i -> "CRITICAL".equalsIgnoreCase(i.getSeverity())).count();
                long high = list.stream().filter(i -> "HIGH".equalsIgnoreCase(i.getSeverity())).count();
                long open = list.stream().filter(i -> !"RESOLVED".equalsIgnoreCase(i.getStatus())).count();
                sb.append("# Total Records: ").append(list.size()).append(" incidents\n");
                sb.append("# Summary: Critical: ").append(crit).append(" | High: ").append(high).append(" | Active/Open: ").append(open).append(" | Resolved: ").append(list.size() - open).append("\n");
                sb.append("# ==============================================================================\n\n");

                sb.append("Incident ID,Reported Timestamp,Title,Severity,Status,Location,Reporter Name,Reporter Role,Routed Office,Description\n");
                for (IncidentReport i : list) {
                    sb.append(escapeCsv(i.getId())).append(",");
                    sb.append(escapeCsv(i.getCreatedAt() != null ? i.getCreatedAt().format(DISPLAY_DT_FMT) : "")).append(",");
                    sb.append(escapeCsv(i.getTitle())).append(",");
                    sb.append(escapeCsv(i.getSeverity())).append(",");
                    sb.append(escapeCsv(i.getStatus())).append(",");
                    sb.append(escapeCsv(i.getLocation())).append(",");
                    sb.append(escapeCsv(i.getReporterName())).append(",");
                    sb.append(escapeCsv(i.getReporterRole())).append(",");
                    sb.append(escapeCsv(i.getRoutedTo())).append(",");
                    sb.append(escapeCsv(i.getDescription())).append("\n");
                }
            }
        }

        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String escapeCsv(Object value) {
        if (value == null) return "\"\"";
        String str = String.valueOf(value).replace("\r\n", " ").replace("\n", " ").replace("\r", " ");
        return "\"" + str.replace("\"", "\"\"") + "\"";
    }

    // =========================================================================
    // 4. PDF EXPORT GENERATOR (Executive Summary Document)
    // =========================================================================

    public byte[] exportPdf(String rawType, LocalDate start, LocalDate end,
                            String callerName, String callerBadge, String callerRole) throws IOException {
        String type = normalizeReportType(rawType);
        String title = getReportTitle(type);
        LocalDateTime now = LocalDateTime.now();

        PdfDocument doc = new PdfDocument();

        // Coordinates: origin is bottom-left (0,0), top is 792 pt.
        // We will maintain a cursor `y` from top (756 pt) down to bottom (40 pt).
        float y = 756f;

        // Draw Cover / Page 1 Header Banner
        y = renderPdfHeader(doc, y, title, start, end, callerName, callerBadge, callerRole, now);

        switch (type) {
            case "attendance" -> {
                List<DutyRoster> list = getAttendanceRecords(start, end);
                renderAttendancePdfTable(doc, list, y, start, end, callerName, callerBadge, callerRole, now);
            }
            case "scan-logs" -> {
                List<ScanLog> list = getScanRecords(start, end);
                renderScanLogsPdfTable(doc, list, y, start, end, callerName, callerBadge, callerRole, now);
            }
            default -> {
                List<IncidentReport> list = getIncidentRecords(start, end);
                renderIncidentsPdfTable(doc, list, y, start, end, callerName, callerBadge, callerRole, now);
            }
        }

        return doc.buildPdf();
    }

    private float renderPdfHeader(PdfDocument doc, float y, String reportTitle,
                                  LocalDate start, LocalDate end,
                                  String callerName, String callerBadge, String callerRole,
                                  LocalDateTime now) {
        // Top dark navy banner bar (height = 48 pt)
        doc.fillRect(PdfDocument.MARGIN_LEFT, y - 48, PdfDocument.CONTENT_WIDTH, 48, 0.082f, 0.200f, 0.400f); // #153366
        doc.drawText("F2", 14, PdfDocument.MARGIN_LEFT + 14, y - 20, "CAMPUSGUARD SECURITY & SAFETY OPERATIONS", 1.0f, 1.0f, 1.0f);
        doc.drawText("F1", 9, PdfDocument.MARGIN_LEFT + 14, y - 36, "OFFICIAL UNIVERSITY ADMINISTRATION SUMMARY REPORT", 0.85f, 0.90f, 1.0f);
        doc.drawText("F2", 9, PdfDocument.MARGIN_RIGHT - 160, y - 28, "CONFIDENTIAL / EXECUTIVE", 1.0f, 0.85f, 0.30f);

        y -= 62;

        // Subtitle Report Name
        doc.drawText("F2", 13, PdfDocument.MARGIN_LEFT, y, reportTitle, 0.09f, 0.15f, 0.25f);
        y -= 16;

        // Metadata Card Box (Height = 68 pt)
        float metaBoxH = 68f;
        doc.fillRect(PdfDocument.MARGIN_LEFT, y - metaBoxH, PdfDocument.CONTENT_WIDTH, metaBoxH, 0.96f, 0.97f, 0.98f);
        doc.strokeRect(PdfDocument.MARGIN_LEFT, y - metaBoxH, PdfDocument.CONTENT_WIDTH, metaBoxH, 0.85f, 0.88f, 0.92f, 1f);

        // Metadata grid (Row 1)
        float row1Y = y - 18;
        doc.drawText("F2", 8, PdfDocument.MARGIN_LEFT + 12, row1Y, "DATE RANGE:", 0.35f, 0.40f, 0.48f);
        doc.drawText("F2", 9, PdfDocument.MARGIN_LEFT + 75, row1Y, start.format(DATE_FMT) + " to " + end.format(DATE_FMT), 0.08f, 0.20f, 0.50f);

        doc.drawText("F2", 8, PdfDocument.MARGIN_LEFT + 280, row1Y, "GENERATED AT:", 0.35f, 0.40f, 0.48f);
        doc.drawText("F1", 9, PdfDocument.MARGIN_LEFT + 360, row1Y, now.format(DATETIME_FMT) + " (Local)", 0.15f, 0.20f, 0.25f);

        // Metadata grid (Row 2)
        float row2Y = y - 38;
        doc.drawText("F2", 8, PdfDocument.MARGIN_LEFT + 12, row2Y, "GENERATED BY:", 0.35f, 0.40f, 0.48f);
        String byStr = callerName + (callerBadge != null ? " (Badge #" + callerBadge + ")" : "");
        doc.drawText("F2", 9, PdfDocument.MARGIN_LEFT + 85, row2Y, byStr, 0.10f, 0.15f, 0.25f);

        doc.drawText("F2", 8, PdfDocument.MARGIN_LEFT + 280, row2Y, "ROLE & CLEARANCE:", 0.35f, 0.40f, 0.48f);
        doc.drawText("F1", 9, PdfDocument.MARGIN_LEFT + 380, row2Y, callerRole + " (Supervisor Cleared)", 0.15f, 0.20f, 0.25f);

        // Metadata grid (Row 3 - Footer within box)
        float row3Y = y - 56;
        doc.drawText("F3", 7.5f, PdfDocument.MARGIN_LEFT + 12, row3Y,
                "* This official report contains verified sentinel records retrieved directly from the live CampusGuard security database.",
                0.40f, 0.45f, 0.50f);

        y -= (metaBoxH + 16);
        return y;
    }

    // =========================================================================
    // PDF TABLE: INCIDENTS
    // =========================================================================

    private void renderIncidentsPdfTable(PdfDocument doc, List<IncidentReport> list, float y,
                                         LocalDate start, LocalDate end, String callerName, String callerBadge,
                                         String callerRole, LocalDateTime now) {
        // KPI summary bar (height = 28 pt)
        long total = list.size();
        long crit = list.stream().filter(i -> "CRITICAL".equalsIgnoreCase(i.getSeverity())).count();
        long high = list.stream().filter(i -> "HIGH".equalsIgnoreCase(i.getSeverity())).count();
        long open = list.stream().filter(i -> !"RESOLVED".equalsIgnoreCase(i.getStatus())).count();
        long resolved = total - open;

        doc.fillRect(PdfDocument.MARGIN_LEFT, y - 28, PdfDocument.CONTENT_WIDTH, 28, 0.92f, 0.94f, 0.98f);
        doc.strokeRect(PdfDocument.MARGIN_LEFT, y - 28, PdfDocument.CONTENT_WIDTH, 28, 0.80f, 0.85f, 0.92f, 0.8f);

        doc.drawText("F2", 9, PdfDocument.MARGIN_LEFT + 12, y - 18, "TOTAL INCIDENTS: " + total, 0.08f, 0.20f, 0.45f);
        doc.drawText("F2", 9, PdfDocument.MARGIN_LEFT + 150, y - 18, "CRITICAL: " + crit, 0.70f, 0.10f, 0.10f);
        doc.drawText("F2", 9, PdfDocument.MARGIN_LEFT + 250, y - 18, "HIGH: " + high, 0.80f, 0.40f, 0.05f);
        doc.drawText("F2", 9, PdfDocument.MARGIN_LEFT + 340, y - 18, "ACTIVE/OPEN: " + open, 0.10f, 0.35f, 0.75f);
        doc.drawText("F2", 9, PdfDocument.MARGIN_LEFT + 445, y - 18, "RESOLVED: " + resolved, 0.05f, 0.55f, 0.25f);

        y -= 38;

        // Table Header
        y = drawIncidentsTableHeader(doc, y);

        if (list.isEmpty()) {
            doc.drawText("F3", 10, PdfDocument.MARGIN_LEFT + 150, y - 20, "No incident records found matching selected date range.", 0.5f, 0.5f, 0.5f);
            drawPdfFooter(doc, 1, 1);
            return;
        }

        int rowIdx = 0;
        int currentPage = 1;

        for (IncidentReport item : list) {
            // Check if page overflow
            if (y < 65) {
                drawPdfFooter(doc, currentPage, currentPage); // will patch if needed or draw standard
                doc.newPage();
                currentPage++;
                y = 756f;
                doc.drawText("F2", 10, PdfDocument.MARGIN_LEFT, y, "Campus Security & Incident Summary (Continued)", 0.2f, 0.2f, 0.2f);
                y -= 18;
                y = drawIncidentsTableHeader(doc, y);
            }

            float rowH = 22f;
            if (rowIdx % 2 == 1) {
                doc.fillRect(PdfDocument.MARGIN_LEFT, y - rowH, PdfDocument.CONTENT_WIDTH, rowH, 0.97f, 0.98f, 0.99f);
            }
            doc.drawLine(PdfDocument.MARGIN_LEFT, y - rowH, PdfDocument.MARGIN_RIGHT, y - rowH, 0.90f, 0.92f, 0.94f, 0.5f);

            // Columns:
            // ID (35) | Date/Time (75) | Title (150) | Severity (55) | Status (55) | Location (100) | Office (70)
            float textY = y - 15;
            doc.drawText("F2", 8f, PdfDocument.MARGIN_LEFT + 4, textY, "#" + item.getId(), 0.2f, 0.2f, 0.2f);
            doc.drawText("F1", 7.5f, PdfDocument.MARGIN_LEFT + 32, textY, item.getCreatedAt() != null ? item.getCreatedAt().format(DISPLAY_DT_FMT) : "", 0.3f, 0.3f, 0.3f);
            doc.drawText("F2", 8f, PdfDocument.MARGIN_LEFT + 112, textY, truncate(item.getTitle(), 28), 0.1f, 0.15f, 0.25f);

            // Severity color
            float[] sevColor = getSeverityColor(item.getSeverity());
            doc.drawText("F2", 7.5f, PdfDocument.MARGIN_LEFT + 258, textY, item.getSeverity(), sevColor[0], sevColor[1], sevColor[2]);

            // Status color
            float[] statColor = getStatusColor(item.getStatus());
            doc.drawText("F2", 7.5f, PdfDocument.MARGIN_LEFT + 315, textY, item.getStatus(), statColor[0], statColor[1], statColor[2]);

            doc.drawText("F1", 7.5f, PdfDocument.MARGIN_LEFT + 372, textY, truncate(item.getLocation(), 18), 0.25f, 0.25f, 0.25f);
            doc.drawText("F1", 7.5f, PdfDocument.MARGIN_LEFT + 475, textY, truncate(item.getRoutedTo() != null ? item.getRoutedTo() : "GENERAL", 12), 0.35f, 0.35f, 0.40f);

            y -= rowH;
            rowIdx++;
        }

        drawPdfFooter(doc, currentPage, currentPage);
    }

    private float drawIncidentsTableHeader(PdfDocument doc, float y) {
        float h = 18f;
        doc.fillRect(PdfDocument.MARGIN_LEFT, y - h, PdfDocument.CONTENT_WIDTH, h, 0.12f, 0.18f, 0.26f);
        float textY = y - 13;
        doc.drawText("F2", 8f, PdfDocument.MARGIN_LEFT + 4, textY, "ID", 1f, 1f, 1f);
        doc.drawText("F2", 8f, PdfDocument.MARGIN_LEFT + 32, textY, "DATE / TIME", 1f, 1f, 1f);
        doc.drawText("F2", 8f, PdfDocument.MARGIN_LEFT + 112, textY, "INCIDENT TITLE", 1f, 1f, 1f);
        doc.drawText("F2", 8f, PdfDocument.MARGIN_LEFT + 258, textY, "SEVERITY", 1f, 1f, 1f);
        doc.drawText("F2", 8f, PdfDocument.MARGIN_LEFT + 315, textY, "STATUS", 1f, 1f, 1f);
        doc.drawText("F2", 8f, PdfDocument.MARGIN_LEFT + 372, textY, "LOCATION", 1f, 1f, 1f);
        doc.drawText("F2", 8f, PdfDocument.MARGIN_LEFT + 475, textY, "ROUTED OFFICE", 1f, 1f, 1f);
        return y - h;
    }

    // =========================================================================
    // PDF TABLE: ATTENDANCE & NO-SHOWS
    // =========================================================================

    private void renderAttendancePdfTable(PdfDocument doc, List<DutyRoster> list, float y,
                                          LocalDate start, LocalDate end, String callerName, String callerBadge,
                                          String callerRole, LocalDateTime now) {
        long total = list.size();
        long present = list.stream().filter(r -> "PRESENT".equalsIgnoreCase(r.getAttendanceStatus()) || r.isCheckedIn()).count();
        long noShows = list.stream().filter(r -> "NO_SHOW".equalsIgnoreCase(r.getAttendanceStatus()) || r.isCountsAsNoShow()).count();
        long scheduled = list.stream().filter(r -> "SCHEDULED".equalsIgnoreCase(r.getAttendanceStatus())).count();

        doc.fillRect(PdfDocument.MARGIN_LEFT, y - 28, PdfDocument.CONTENT_WIDTH, 28, 0.92f, 0.94f, 0.98f);
        doc.strokeRect(PdfDocument.MARGIN_LEFT, y - 28, PdfDocument.CONTENT_WIDTH, 28, 0.80f, 0.85f, 0.92f, 0.8f);

        doc.drawText("F2", 9, PdfDocument.MARGIN_LEFT + 12, y - 18, "TOTAL ROSTERS: " + total, 0.08f, 0.20f, 0.45f);
        doc.drawText("F2", 9, PdfDocument.MARGIN_LEFT + 150, y - 18, "CHECKED-IN / PRESENT: " + present, 0.05f, 0.55f, 0.25f);
        doc.drawText("F2", 9, PdfDocument.MARGIN_LEFT + 320, y - 18, "FLAGGED NO-SHOWS: " + noShows, 0.75f, 0.10f, 0.10f);
        doc.drawText("F2", 9, PdfDocument.MARGIN_LEFT + 460, y - 18, "SCHEDULED: " + scheduled, 0.35f, 0.40f, 0.45f);

        y -= 38;

        y = drawAttendanceTableHeader(doc, y);

        if (list.isEmpty()) {
            doc.drawText("F3", 10, PdfDocument.MARGIN_LEFT + 150, y - 20, "No attendance or no-show records found in selected range.", 0.5f, 0.5f, 0.5f);
            drawPdfFooter(doc, 1, 1);
            return;
        }

        int rowIdx = 0;
        int currentPage = 1;

        for (DutyRoster item : list) {
            if (y < 65) {
                drawPdfFooter(doc, currentPage, currentPage);
                doc.newPage();
                currentPage++;
                y = 756f;
                doc.drawText("F2", 10, PdfDocument.MARGIN_LEFT, y, "Guard Attendance & No-Show Summary (Continued)", 0.2f, 0.2f, 0.2f);
                y -= 18;
                y = drawAttendanceTableHeader(doc, y);
            }

            float rowH = 22f;
            if (rowIdx % 2 == 1) {
                doc.fillRect(PdfDocument.MARGIN_LEFT, y - rowH, PdfDocument.CONTENT_WIDTH, rowH, 0.97f, 0.98f, 0.99f);
            }
            doc.drawLine(PdfDocument.MARGIN_LEFT, y - rowH, PdfDocument.MARGIN_RIGHT, y - rowH, 0.90f, 0.92f, 0.94f, 0.5f);

            float textY = y - 15;
            doc.drawText("F2", 8f, PdfDocument.MARGIN_LEFT + 4, textY, item.getDutyDate() != null ? item.getDutyDate().toString() : "", 0.2f, 0.2f, 0.2f);
            doc.drawText("F2", 8f, PdfDocument.MARGIN_LEFT + 65, textY, truncate(item.getGuardName(), 18), 0.1f, 0.15f, 0.25f);
            doc.drawText("F1", 7.5f, PdfDocument.MARGIN_LEFT + 170, textY, item.getGuardBadgeNumber() != null ? item.getGuardBadgeNumber() : "", 0.3f, 0.3f, 0.3f);
            doc.drawText("F1", 7.5f, PdfDocument.MARGIN_LEFT + 225, textY, truncate(item.getPostLocation(), 18), 0.25f, 0.25f, 0.25f);
            doc.drawText("F1", 7.5f, PdfDocument.MARGIN_LEFT + 325, textY, (item.getShiftType() != null ? item.getShiftType() : "DUTY"), 0.35f, 0.35f, 0.40f);

            // Attendance status tag
            String attStatus = item.getAttendanceStatus() != null ? item.getAttendanceStatus() : (item.isCheckedIn() ? "PRESENT" : "SCHEDULED");
            float[] attColor = getAttendanceStatusColor(attStatus);
            doc.drawText("F2", 7.5f, PdfDocument.MARGIN_LEFT + 380, textY, attStatus, attColor[0], attColor[1], attColor[2]);

            // Check-in or Flagged details
            String detailStr = item.isCheckedIn() && item.getCheckInTime() != null
                    ? "In: " + item.getCheckInTime().format(DISPLAY_DT_FMT)
                    : (item.isCountsAsNoShow() ? "Flagged No-Show" : (item.getRelieverName() != null ? "Relief: " + truncate(item.getRelieverName(), 10) : "Normal Watch"));
            doc.drawText("F1", 7.5f, PdfDocument.MARGIN_LEFT + 450, textY, truncate(detailStr, 18), 0.3f, 0.3f, 0.35f);

            y -= rowH;
            rowIdx++;
        }

        drawPdfFooter(doc, currentPage, currentPage);
    }

    private float drawAttendanceTableHeader(PdfDocument doc, float y) {
        float h = 18f;
        doc.fillRect(PdfDocument.MARGIN_LEFT, y - h, PdfDocument.CONTENT_WIDTH, h, 0.12f, 0.18f, 0.26f);
        float textY = y - 13;
        doc.drawText("F2", 8f, PdfDocument.MARGIN_LEFT + 4, textY, "DATE", 1f, 1f, 1f);
        doc.drawText("F2", 8f, PdfDocument.MARGIN_LEFT + 65, textY, "OFFICER NAME", 1f, 1f, 1f);
        doc.drawText("F2", 8f, PdfDocument.MARGIN_LEFT + 170, textY, "SHIELD #", 1f, 1f, 1f);
        doc.drawText("F2", 8f, PdfDocument.MARGIN_LEFT + 225, textY, "GATE / POST", 1f, 1f, 1f);
        doc.drawText("F2", 8f, PdfDocument.MARGIN_LEFT + 325, textY, "SHIFT", 1f, 1f, 1f);
        doc.drawText("F2", 8f, PdfDocument.MARGIN_LEFT + 380, textY, "ATTENDANCE", 1f, 1f, 1f);
        doc.drawText("F2", 8f, PdfDocument.MARGIN_LEFT + 450, textY, "CHECK-IN / COVERAGE", 1f, 1f, 1f);
        return y - h;
    }

    // =========================================================================
    // PDF TABLE: SCAN LOGS
    // =========================================================================

    private void renderScanLogsPdfTable(PdfDocument doc, List<ScanLog> list, float y,
                                        LocalDate start, LocalDate end, String callerName, String callerBadge,
                                        String callerRole, LocalDateTime now) {
        long total = list.size();
        long granted = list.stream().filter(s -> "GRANTED".equalsIgnoreCase(s.getAccessStatus())).count();
        long denied = list.stream().filter(s -> "DENIED".equalsIgnoreCase(s.getAccessStatus())).count();
        long flagged = total - (granted + denied);

        doc.fillRect(PdfDocument.MARGIN_LEFT, y - 28, PdfDocument.CONTENT_WIDTH, 28, 0.92f, 0.94f, 0.98f);
        doc.strokeRect(PdfDocument.MARGIN_LEFT, y - 28, PdfDocument.CONTENT_WIDTH, 28, 0.80f, 0.85f, 0.92f, 0.8f);

        doc.drawText("F2", 9, PdfDocument.MARGIN_LEFT + 12, y - 18, "TOTAL SCANS: " + total, 0.08f, 0.20f, 0.45f);
        doc.drawText("F2", 9, PdfDocument.MARGIN_LEFT + 160, y - 18, "ACCESS GRANTED: " + granted, 0.05f, 0.55f, 0.25f);
        doc.drawText("F2", 9, PdfDocument.MARGIN_LEFT + 330, y - 18, "ACCESS DENIED: " + denied, 0.75f, 0.10f, 0.10f);
        doc.drawText("F2", 9, PdfDocument.MARGIN_LEFT + 460, y - 18, "FLAGGED/OVERRIDE: " + flagged, 0.80f, 0.40f, 0.05f);

        y -= 38;

        y = drawScanLogsTableHeader(doc, y);

        if (list.isEmpty()) {
            doc.drawText("F3", 10, PdfDocument.MARGIN_LEFT + 150, y - 20, "No gate or access scan records found in selected range.", 0.5f, 0.5f, 0.5f);
            drawPdfFooter(doc, 1, 1);
            return;
        }

        int rowIdx = 0;
        int currentPage = 1;

        for (ScanLog item : list) {
            if (y < 65) {
                drawPdfFooter(doc, currentPage, currentPage);
                doc.newPage();
                currentPage++;
                y = 756f;
                doc.drawText("F2", 10, PdfDocument.MARGIN_LEFT, y, "Gate & Access Scan Logs (Continued)", 0.2f, 0.2f, 0.2f);
                y -= 18;
                y = drawScanLogsTableHeader(doc, y);
            }

            float rowH = 22f;
            if (rowIdx % 2 == 1) {
                doc.fillRect(PdfDocument.MARGIN_LEFT, y - rowH, PdfDocument.CONTENT_WIDTH, rowH, 0.97f, 0.98f, 0.99f);
            }
            doc.drawLine(PdfDocument.MARGIN_LEFT, y - rowH, PdfDocument.MARGIN_RIGHT, y - rowH, 0.90f, 0.92f, 0.94f, 0.5f);

            float textY = y - 15;
            doc.drawText("F1", 7.5f, PdfDocument.MARGIN_LEFT + 4, textY, item.getScanTimestamp() != null ? item.getScanTimestamp().format(DISPLAY_DT_FMT) : "", 0.2f, 0.2f, 0.2f);
            doc.drawText("F2", 7.5f, PdfDocument.MARGIN_LEFT + 85, textY, truncate(formatScannerType(item.getScannerType()), 15), 0.1f, 0.2f, 0.4f);
            doc.drawText("F1", 7.5f, PdfDocument.MARGIN_LEFT + 175, textY, truncate(item.getGateLocation(), 16), 0.25f, 0.25f, 0.25f);
            doc.drawText("F2", 8f, PdfDocument.MARGIN_LEFT + 270, textY, truncate(item.getSubjectIdentifier(), 14), 0.1f, 0.15f, 0.25f);
            doc.drawText("F1", 7.5f, PdfDocument.MARGIN_LEFT + 355, textY, truncate(item.getSubjectName() != null ? item.getSubjectName() : "Visitor", 15), 0.2f, 0.2f, 0.25f);

            // Access Status
            float[] statusCol = getScanStatusColor(item.getAccessStatus());
            doc.drawText("F2", 7.5f, PdfDocument.MARGIN_LEFT + 445, textY, item.getAccessStatus(), statusCol[0], statusCol[1], statusCol[2]);

            y -= rowH;
            rowIdx++;
        }

        drawPdfFooter(doc, currentPage, currentPage);
    }

    private float drawScanLogsTableHeader(PdfDocument doc, float y) {
        float h = 18f;
        doc.fillRect(PdfDocument.MARGIN_LEFT, y - h, PdfDocument.CONTENT_WIDTH, h, 0.12f, 0.18f, 0.26f);
        float textY = y - 13;
        doc.drawText("F2", 8f, PdfDocument.MARGIN_LEFT + 4, textY, "TIMESTAMP", 1f, 1f, 1f);
        doc.drawText("F2", 8f, PdfDocument.MARGIN_LEFT + 85, textY, "SCANNER TYPE", 1f, 1f, 1f);
        doc.drawText("F2", 8f, PdfDocument.MARGIN_LEFT + 175, textY, "GATE LOCATION", 1f, 1f, 1f);
        doc.drawText("F2", 8f, PdfDocument.MARGIN_LEFT + 270, textY, "SUBJECT / ID", 1f, 1f, 1f);
        doc.drawText("F2", 8f, PdfDocument.MARGIN_LEFT + 355, textY, "NAME / ENTITY", 1f, 1f, 1f);
        doc.drawText("F2", 8f, PdfDocument.MARGIN_LEFT + 445, textY, "ACCESS STATUS", 1f, 1f, 1f);
        return y - h;
    }

    private void drawPdfFooter(PdfDocument doc, int pageNumber, int totalPages) {
        float y = 28f;
        doc.drawLine(PdfDocument.MARGIN_LEFT, y + 10, PdfDocument.MARGIN_RIGHT, y + 10, 0.85f, 0.88f, 0.92f, 0.5f);
        doc.drawText("F3", 7.5f, PdfDocument.MARGIN_LEFT, y, "CampusGuard Security Operations System - Official University Administration Report", 0.45f, 0.50f, 0.55f);
        doc.drawText("F2", 7.5f, PdfDocument.MARGIN_RIGHT - 80, y, "Page " + pageNumber + " of " + Math.max(pageNumber, doc.getPageCount()), 0.35f, 0.40f, 0.45f);
    }

    // =========================================================================
    // COLOR & FORMATTING HELPERS
    // =========================================================================

    private float[] getSeverityColor(String severity) {
        if (severity == null) return new float[]{0.3f, 0.3f, 0.3f};
        return switch (severity.toUpperCase()) {
            case "CRITICAL" -> new float[]{0.78f, 0.12f, 0.12f};
            case "HIGH" -> new float[]{0.85f, 0.45f, 0.05f};
            case "MEDIUM" -> new float[]{0.80f, 0.65f, 0.10f};
            default -> new float[]{0.15f, 0.55f, 0.25f};
        };
    }

    private float[] getStatusColor(String status) {
        if (status == null) return new float[]{0.3f, 0.3f, 0.3f};
        return switch (status.toUpperCase()) {
            case "RESOLVED" -> new float[]{0.10f, 0.60f, 0.25f};
            case "IN_TRIAGE", "IN PROGRESS" -> new float[]{0.10f, 0.40f, 0.80f};
            default -> new float[]{0.85f, 0.35f, 0.05f};
        };
    }

    private float[] getAttendanceStatusColor(String status) {
        if (status == null) return new float[]{0.3f, 0.3f, 0.3f};
        return switch (status.toUpperCase()) {
            case "PRESENT" -> new float[]{0.10f, 0.60f, 0.25f};
            case "NO_SHOW" -> new float[]{0.80f, 0.10f, 0.10f};
            case "EXCUSED_ABSENCE" -> new float[]{0.60f, 0.40f, 0.10f};
            default -> new float[]{0.20f, 0.40f, 0.70f};
        };
    }

    private float[] getScanStatusColor(String status) {
        if (status == null) return new float[]{0.3f, 0.3f, 0.3f};
        return switch (status.toUpperCase()) {
            case "GRANTED" -> new float[]{0.10f, 0.60f, 0.25f};
            case "DENIED" -> new float[]{0.80f, 0.10f, 0.10f};
            default -> new float[]{0.85f, 0.50f, 0.05f};
        };
    }

    private String formatScannerType(String type) {
        if (type == null) return "Scanner";
        return switch (type.toUpperCase()) {
            case "RFID_GATE_BARRIER" -> "RFID Gate Barrier";
            case "QR_VISITOR_PASS" -> "QR Visitor Pass";
            case "STUDENT_ID_SCANNER" -> "Student ID Turnstile";
            case "VEHICLE_LPR_SCANNER" -> "Vehicle LPR Camera";
            case "BIOMETRIC_SENTRY_SCAN" -> "Biometric Station";
            default -> type.replace('_', ' ');
        };
    }

    private String truncate(String text, int maxLen) {
        if (text == null) return "";
        if (text.length() <= maxLen) return text;
        return text.substring(0, maxLen - 2) + "..";
    }
}
