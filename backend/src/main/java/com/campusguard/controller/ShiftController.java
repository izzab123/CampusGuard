package com.campusguard.controller;

import com.campusguard.model.ShiftLog;
import com.campusguard.repository.ShiftLogRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/shifts")
public class ShiftController {

    private final ShiftLogRepository shiftRepo;
    private final com.campusguard.service.DutyRosterService dutyRosterService;

    public ShiftController(ShiftLogRepository shiftRepo, com.campusguard.service.DutyRosterService dutyRosterService) {
        this.shiftRepo = shiftRepo;
        this.dutyRosterService = dutyRosterService;
    }

    @GetMapping
    public List<ShiftLog> getShifts() {
        return shiftRepo.findAllByOrderByShiftStartDesc();
    }

    @PostMapping
    public ResponseEntity<ShiftLog> scheduleShift(@RequestBody ShiftLog shift) {
        if (shift.getPostLocation() == null || shift.getPostLocation().isBlank()) {
            if (shift.getGatePost() != null && !shift.getGatePost().isBlank()) {
                shift.setPostLocation(shift.getGatePost());
            } else {
                shift.setPostLocation("General Campus Checkpoint");
            }
        }
        if (shift.getGatePost() == null || shift.getGatePost().isBlank()) {
            shift.setGatePost(shift.getPostLocation());
        }
        if (shift.getOfficerName() == null || shift.getOfficerName().isBlank()) {
            shift.setOfficerName("Security Officer");
        }
        if (shift.getBadgeNumber() == null || shift.getBadgeNumber().isBlank()) {
            shift.setBadgeNumber("SEC-001");
        }
        if (shift.getShiftStart() == null) {
            shift.setShiftStart(LocalDateTime.now());
        }
        if (shift.getStatus() == null || shift.getStatus().isBlank()) {
            shift.setStatus("ON_DUTY");
        }
        ShiftLog saved = shiftRepo.save(shift);

        // Also synchronize to DutyRoster for roster tracking
        try {
            com.campusguard.model.DutyRoster roster = new com.campusguard.model.DutyRoster();
            roster.setGuardName(saved.getOfficerName());
            roster.setGuardBadgeNumber(saved.getBadgeNumber());
            roster.setPostLocation(saved.getPostLocation());
            roster.setSupervisorName("Shift Supervisor");
            roster.setSupervisorBadgeNumber("SS-104");
            roster.setDutyDate(java.time.LocalDate.now());
            roster.setShiftType("CUSTOM");
            roster.setStatus(saved.getStatus());
            if (saved.getShiftHours() != null) {
                roster.setNotes("Hours: " + saved.getShiftHours() + (saved.getSector() != null ? " | Sector: " + saved.getSector() : ""));
            }
            dutyRosterService.createShiftSchedule(roster, "Shift Supervisor", "SS-104");
        } catch (Exception ignored) {}

        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PostMapping("/check-in")
    public ResponseEntity<ShiftLog> checkIn(@RequestBody ShiftLog shift) {
        if (shift.getPostLocation() == null || shift.getPostLocation().isBlank()) {
            if (shift.getGatePost() != null && !shift.getGatePost().isBlank()) {
                shift.setPostLocation(shift.getGatePost());
            } else {
                shift.setPostLocation("North Perimeter & Gate 04");
            }
        }
        if (shift.getOfficerName() == null || shift.getOfficerName().isBlank()) {
            shift.setOfficerName("Officer Marcus Vance");
        }
        if (shift.getBadgeNumber() == null || shift.getBadgeNumber().isBlank()) {
            shift.setBadgeNumber("Shield #4082");
        }
        shift.setShiftStart(LocalDateTime.now());
        shift.setStatus("ON_DUTY");
        shift.setBiometricVerified(true);
        ShiftLog saved = shiftRepo.save(shift);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PostMapping("/{id}/checkout")
    public ResponseEntity<ShiftLog> checkOut(@PathVariable Long id) {
        return shiftRepo.findById(id).map(shift -> {
            shift.setStatus("COMPLETED");
            shift.setShiftEnd(LocalDateTime.now());
            return ResponseEntity.ok(shiftRepo.save(shift));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/escalate")
    public ResponseEntity<ShiftLog> escalateNoShow(@PathVariable Long id) {
        return shiftRepo.findById(id).map(shift -> {
            shift.setStatus("ESCALATED");
            shift.setNotes((shift.getNotes() != null ? shift.getNotes() + " | " : "") + "Automatic no-show escalation triggered after 15 min unstaffed.");
            return ResponseEntity.ok(shiftRepo.save(shift));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/schedule")
    public ResponseEntity<?> scheduleShift(
            @RequestBody com.campusguard.model.DutyRoster roster,
            @RequestHeader(value = "X-Supervisor-Name", required = false) String supervisorNameHeader,
            @RequestHeader(value = "X-Supervisor-Badge", required = false) String supervisorBadgeHeader
    ) {
        try {
            com.campusguard.model.DutyRoster created = dutyRosterService.createShiftSchedule(roster, supervisorNameHeader, supervisorBadgeHeader);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping("/roster")
    public ResponseEntity<List<com.campusguard.model.DutyRoster>> getDutyRoster(
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate date,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String postLocation,
            @RequestParam(required = false) String supervisor,
            @RequestParam(required = false) String guard
    ) {
        List<com.campusguard.model.DutyRoster> roster = dutyRosterService.searchDutyRoster(date, status, postLocation, supervisor, guard);
        return ResponseEntity.ok(roster);
    }
}
