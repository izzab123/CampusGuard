package com.campusguard.controller;

import com.campusguard.service.SupervisorReportExportService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/supervisor/reports")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class SupervisorReportExportController {

    private final SupervisorReportExportService exportService;

    public SupervisorReportExportController(SupervisorReportExportService exportService) {
        this.exportService = exportService;
    }

    private String resolveCallerRole(HttpServletRequest request, String headerRole) {
        if (headerRole != null && !headerRole.isBlank()) {
            return headerRole.trim();
        }
        if (request != null) {
            HttpSession session = request.getSession(false);
            if (session != null && session.getAttribute("USER_ROLE") != null) {
                return (String) session.getAttribute("USER_ROLE");
            }
        }
        return null;
    }

    private boolean isAuthorizedSupervisor(String role) {
        if (role == null || role.isBlank()) {
            return true; // permit for internal testing unless non-supervisor role is passed
        }
        String normalized = role.trim().toUpperCase().replace("ROLE_", "").replace("_", " ");
        return normalized.equals("SHIFT SUPERVISOR") ||
               normalized.equals("SUPERVISOR") ||
               normalized.equals("ADMIN") ||
               normalized.equals("ADMINISTRATOR");
    }

    private String resolveCallerName(HttpServletRequest request, String headerName) {
        if (headerName != null && !headerName.isBlank()) return headerName.trim();
        if (request != null) {
            HttpSession session = request.getSession(false);
            if (session != null && session.getAttribute("USER_NAME") != null) {
                return (String) session.getAttribute("USER_NAME");
            }
        }
        return "Supervisor Elena Rostova";
    }

    private String resolveCallerBadge(HttpServletRequest request, String headerBadge, String headerId) {
        if (headerBadge != null && !headerBadge.isBlank()) return headerBadge.trim();
        if (headerId != null && !headerId.isBlank()) return headerId.trim();
        if (request != null) {
            HttpSession session = request.getSession(false);
            if (session != null && session.getAttribute("USER_BADGE") != null) {
                return (String) session.getAttribute("USER_BADGE");
            }
        }
        return "SS-104";
    }

    /**
     * Preview report summary and records prior to downloading.
     */
    @GetMapping("/summary")
    public ResponseEntity<?> getReportSummary(
            @RequestParam(defaultValue = "incidents") String reportType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader,
            @RequestHeader(value = "X-User-Name", required = false) String nameHeader,
            @RequestHeader(value = "X-User-Badge", required = false) String badgeHeader,
            @RequestHeader(value = "X-User-Id", required = false) String idHeader,
            HttpServletRequest request
    ) {
        String role = resolveCallerRole(request, roleHeader);
        if (role != null && !isAuthorizedSupervisor(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: Shift Supervisor or Administrator credentials required to generate administration summary exports."));
        }

        LocalDate end = endDate != null ? endDate : LocalDate.now();
        LocalDate start = startDate != null ? startDate : end.minusDays(7);
        if (start.isAfter(end)) {
            LocalDate tmp = start;
            start = end;
            end = tmp;
        }

        String callerName = resolveCallerName(request, nameHeader);
        String callerBadge = resolveCallerBadge(request, badgeHeader, idHeader);
        String callerRole = (role != null && !role.isBlank()) ? role : "Shift Supervisor";

        Map<String, Object> summary = exportService.getReportSummary(reportType, start, end, callerName, callerBadge, callerRole);
        return ResponseEntity.ok(summary);
    }

    /**
     * Download summary report in CSV spreadsheet format.
     */
    @GetMapping("/export/csv")
    public ResponseEntity<?> exportCsv(
            @RequestParam(defaultValue = "incidents") String reportType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader,
            @RequestHeader(value = "X-User-Name", required = false) String nameHeader,
            @RequestHeader(value = "X-User-Badge", required = false) String badgeHeader,
            @RequestHeader(value = "X-User-Id", required = false) String idHeader,
            HttpServletRequest request
    ) {
        String role = resolveCallerRole(request, roleHeader);
        if (role != null && !isAuthorizedSupervisor(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: Shift Supervisor or Administrator credentials required to generate administration summary exports."));
        }

        LocalDate end = endDate != null ? endDate : LocalDate.now();
        LocalDate start = startDate != null ? startDate : end.minusDays(7);
        if (start.isAfter(end)) {
            LocalDate tmp = start;
            start = end;
            end = tmp;
        }

        String callerName = resolveCallerName(request, nameHeader);
        String callerBadge = resolveCallerBadge(request, badgeHeader, idHeader);
        String callerRole = (role != null && !role.isBlank()) ? role : "Shift Supervisor";

        byte[] csvBytes = exportService.exportCsv(reportType, start, end, callerName, callerBadge, callerRole);
        String normType = exportService.normalizeReportType(reportType);
        String filename = String.format("CampusGuard_%s_%s_to_%s.csv", normType, start, end);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csvBytes);
    }

    /**
     * Download summary report in PDF executive document format.
     */
    @GetMapping("/export/pdf")
    public ResponseEntity<?> exportPdf(
            @RequestParam(defaultValue = "incidents") String reportType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader,
            @RequestHeader(value = "X-User-Name", required = false) String nameHeader,
            @RequestHeader(value = "X-User-Badge", required = false) String badgeHeader,
            @RequestHeader(value = "X-User-Id", required = false) String idHeader,
            HttpServletRequest request
    ) {
        String role = resolveCallerRole(request, roleHeader);
        if (role != null && !isAuthorizedSupervisor(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: Shift Supervisor or Administrator credentials required to generate administration summary exports."));
        }

        LocalDate end = endDate != null ? endDate : LocalDate.now();
        LocalDate start = startDate != null ? startDate : end.minusDays(7);
        if (start.isAfter(end)) {
            LocalDate tmp = start;
            start = end;
            end = tmp;
        }

        String callerName = resolveCallerName(request, nameHeader);
        String callerBadge = resolveCallerBadge(request, badgeHeader, idHeader);
        String callerRole = (role != null && !role.isBlank()) ? role : "Shift Supervisor";

        try {
            byte[] pdfBytes = exportService.exportPdf(reportType, start, end, callerName, callerBadge, callerRole);
            String normType = exportService.normalizeReportType(reportType);
            String filename = String.format("CampusGuard_%s_%s_to_%s.pdf", normType, start, end);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to compile PDF export: " + e.getMessage()));
        }
    }
}
