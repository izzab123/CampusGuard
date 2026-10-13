package com.campusguard.controller;

import com.campusguard.model.AttendanceConfig;
import com.campusguard.model.DutyRoster;
import com.campusguard.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @Autowired
    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    /**
     * Get the current attendance grace period configuration.
     */
    @GetMapping("/config")
    public ResponseEntity<AttendanceConfig> getConfig() {
        return ResponseEntity.ok(attendanceService.getConfig());
    }

    /**
     * Configure the grace period X in minutes.
     * Restricted: Security Guards are forbidden from modifying system policies.
     */
    @PutMapping("/config")
    public ResponseEntity<?> updateConfig(
            @RequestBody Map<String, Object> body,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader,
            @RequestHeader(value = "X-User-Name", required = false) String nameHeader
    ) {
        if ("Security Guard".equalsIgnoreCase(roleHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: Security guards cannot reconfigure attendance grace policies."));
        }

        Object val = body.get("gracePeriodMinutes");
        if (val == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "gracePeriodMinutes is required"));
        }

        int minutes;
        try {
            minutes = Integer.parseInt(val.toString());
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid numeric value for gracePeriodMinutes"));
        }

        if (minutes < 1) {
            return ResponseEntity.badRequest().body(Map.of("error", "Grace period must be at least 1 minute"));
        }

        String updatedBy = nameHeader != null && !nameHeader.isBlank() ? nameHeader : "Administrator";
        AttendanceConfig updated = attendanceService.updateConfig(minutes, updatedBy);
        return ResponseEntity.ok(updated);
    }

    /**
     * Retrieve all flagged No-Show records for display on supervisor attendance dashboard.
     */
    @GetMapping("/no-shows")
    public ResponseEntity<List<DutyRoster>> getNoShowRecords() {
        return ResponseEntity.ok(attendanceService.getNoShowRecords());
    }

    /**
     * Retrieve daily attendance records with optional filtering.
     */
    @GetMapping("/records")
    public ResponseEntity<List<DutyRoster>> getAttendanceRecords(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String status
    ) {
        return ResponseEntity.ok(attendanceService.getAttendanceRecords(date, status));
    }

    /**
     * Run real-time detection on demand.
     */
    @PostMapping("/evaluate")
    public ResponseEntity<List<DutyRoster>> triggerEvaluation() {
        return ResponseEntity.ok(attendanceService.evaluateAndMarkNoShows());
    }

    /**
     * Guard check-in endpoint. Guards who check in will never be flagged as no-show.
     */
    @PostMapping("/check-in/{id}")
    public ResponseEntity<?> checkIn(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body
    ) {
        try {
            String note = body != null ? body.get("note") : null;
            DutyRoster roster = attendanceService.checkInGuard(id, note);
            return ResponseEntity.ok(roster);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
        }
    }

    /**
     * Approve leave for a duty shift. Guards on approved leave will never be flagged as no-show.
     */
    @PostMapping("/approve-leave/{id}")
    public ResponseEntity<?> approveLeave(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader,
            @RequestHeader(value = "X-User-Name", required = false) String nameHeader
    ) {
        if ("Security Guard".equalsIgnoreCase(roleHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: Guards cannot approve their own leaves."));
        }

        try {
            String reason = body != null && body.containsKey("reason") ? body.get("reason") : "Supervisor Approved Leave";
            String approver = nameHeader != null && !nameHeader.isBlank() ? nameHeader : "Shift Supervisor";
            DutyRoster roster = attendanceService.approveGuardLeave(id, reason, approver);
            return ResponseEntity.ok(roster);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
        }
    }
}
