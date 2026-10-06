package com.campusguard.controller;

import com.campusguard.model.DutyRoster;
import com.campusguard.service.DutyRosterService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/duty-roster")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class DutyRosterController {

    private final DutyRosterService dutyRosterService;

    public DutyRosterController(DutyRosterService dutyRosterService) {
        this.dutyRosterService = dutyRosterService;
    }

    /**
     * Schedule a new guard shift.
     * Accessible by Shift Supervisor from the Shifts Portal.
     */
    @PostMapping
    public ResponseEntity<?> scheduleShift(
            @RequestBody DutyRoster roster,
            @RequestHeader(value = "X-Supervisor-Name", required = false) String supervisorNameHeader,
            @RequestHeader(value = "X-Supervisor-Badge", required = false) String supervisorBadgeHeader
    ) {
        try {
            DutyRoster created = dutyRosterService.createShiftSchedule(roster, supervisorNameHeader, supervisorBadgeHeader);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    /**
     * Batch schedule multiple shifts at once.
     */
    @PostMapping("/batch")
    public ResponseEntity<?> scheduleBatchShifts(
            @RequestBody List<DutyRoster> rosters,
            @RequestHeader(value = "X-Supervisor-Name", required = false) String supervisorNameHeader,
            @RequestHeader(value = "X-Supervisor-Badge", required = false) String supervisorBadgeHeader
    ) {
        try {
            List<DutyRoster> createdList = dutyRosterService.createBatchShiftSchedule(rosters, supervisorNameHeader, supervisorBadgeHeader);
            return new ResponseEntity<>(createdList, HttpStatus.CREATED);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    /**
     * View Guard Duty Schedule & Reliever Assignment Roster.
     * Supports filtering by date, status, postLocation, supervisor, guard.
     */
    @GetMapping
    public ResponseEntity<List<DutyRoster>> getDutyRoster(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String postLocation,
            @RequestParam(required = false) String supervisor,
            @RequestParam(required = false) String guard
    ) {
        List<DutyRoster> roster = dutyRosterService.searchDutyRoster(date, status, postLocation, supervisor, guard);
        return ResponseEntity.ok(roster);
    }

    /**
     * Get a specific shift schedule by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getShiftById(@PathVariable Long id) {
        return dutyRosterService.getDutyRosterById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Full update of a scheduled shift.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateShift(@PathVariable Long id, @RequestBody DutyRoster updatedData) {
        try {
            DutyRoster updated = dutyRosterService.updateShiftSchedule(id, updatedData);
            return ResponseEntity.ok(updated);
        } catch (NoSuchElementException ex) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    /**
     * Assign or update reliever guard for a scheduled shift.
     */
    @PatchMapping("/{id}/reliever")
    public ResponseEntity<?> updateReliever(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {
        try {
            String relieverName = payload.get("relieverName");
            String relieverBadge = payload.get("relieverBadgeNumber");
            String relieverStatus = payload.get("relieverStatus");
            String relieverTimeSlot = payload.get("relieverTimeSlot");

            DutyRoster updated = dutyRosterService.updateRelieverAssignment(id, relieverName, relieverBadge, relieverStatus, relieverTimeSlot);
            return ResponseEntity.ok(updated);
        } catch (NoSuchElementException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Update status of a scheduled shift (e.g. CONFIRMED, ACTIVE, COMPLETED, CANCELLED).
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {
        try {
            String newStatus = payload.get("status");
            if (newStatus == null || newStatus.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Status field is required"));
            }
            DutyRoster updated = dutyRosterService.updateStatus(id, newStatus);
            return ResponseEntity.ok(updated);
        } catch (NoSuchElementException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Cancel / Delete a shift schedule.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShift(@PathVariable Long id) {
        boolean deleted = dutyRosterService.deleteShiftSchedule(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get operational roster summary statistics for Shift Supervisor Dashboard.
     */
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getRosterSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        Map<String, Object> summary = dutyRosterService.getRosterSummary(date);
        return ResponseEntity.ok(summary);
    }
}
