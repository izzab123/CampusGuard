package com.campusguard.controller;

import com.campusguard.model.Notification;
import com.campusguard.model.ShiftLog;
import com.campusguard.repository.NotificationRepository;
import com.campusguard.repository.ShiftLogRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/shifts")
public class ShiftController {

    private final ShiftLogRepository shiftRepo;
    private final NotificationRepository notificationRepo;
    private final com.campusguard.service.DutyRosterService dutyRosterService;

    public ShiftController(ShiftLogRepository shiftRepo,
                           NotificationRepository notificationRepo,
                           com.campusguard.service.DutyRosterService dutyRosterService) {
        this.shiftRepo = shiftRepo;
        this.notificationRepo = notificationRepo;
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
        if (shift.getGatePost() != null && shift.getPostLocation() == null) {
            shift.setPostLocation(shift.getGatePost());
        } else if (shift.getPostLocation() != null && shift.getGatePost() == null) {
            shift.setGatePost(shift.getPostLocation());
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
        if (shift.getGatePost() != null && shift.getPostLocation() == null) {
            shift.setPostLocation(shift.getGatePost());
        }
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
            ShiftLog saved = shiftRepo.save(shift);

            // Dynamically post a critical notification to Shift Supervisor
            String post = shift.getGatePost() != null ? shift.getGatePost() : shift.getPostLocation();
            String hours = shift.getShiftHours() != null ? shift.getShiftHours() : "Scheduled Watch";
            Notification alert = new Notification(
                    "Shift Supervisor",
                    "supervisor@campusguard.edu",
                    "Guard Absence Alert: " + shift.getOfficerName() + " Unreported",
                    "URGENT: Guard " + shift.getOfficerName() + " (" + shift.getBadgeNumber() + ") failed to report for scheduled watch duty at " + post + ". Post is unstaffed. Immediate relief dispatch required.",
                    "DUTY_ABSENCE",
                    "CRITICAL",
                    shift.getOfficerName(),
                    shift.getBadgeNumber(),
                    post,
                    hours,
                    "NO_SHOW",
                    shift.getId()
            );
            notificationRepo.save(alert);

            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/report-absence")
    public ResponseEntity<Notification> reportAbsence(@PathVariable Long id, @RequestParam(value = "reason", required = false) String reason) {
        return shiftRepo.findById(id).map(shift -> {
            shift.setStatus("NO_SHOW");
            String noteReason = (reason != null && !reason.isBlank()) ? reason : "Guard unverified at shift commencement.";
            shift.setNotes((shift.getNotes() != null ? shift.getNotes() + " | " : "") + "Reported Absent: " + noteReason);
            shiftRepo.save(shift);

            String post = shift.getGatePost() != null ? shift.getGatePost() : shift.getPostLocation();
            String hours = shift.getShiftHours() != null ? shift.getShiftHours() : "Scheduled Watch";

            Notification alert = new Notification(
                    "Shift Supervisor",
                    "supervisor@campusguard.edu",
                    "Guard Absence Alert: " + shift.getOfficerName() + " Missing on Duty",
                    "Officer " + shift.getOfficerName() + " (" + shift.getBadgeNumber() + ") did not show up on time for duty at " + post + ". Reason noted: " + noteReason,
                    "DUTY_ABSENCE",
                    "CRITICAL",
                    shift.getOfficerName(),
                    shift.getBadgeNumber(),
                    post,
                    hours,
                    "NO_SHOW",
                    shift.getId()
            );
            Notification savedAlert = notificationRepo.save(alert);
            return ResponseEntity.ok(savedAlert);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/check-absences")
    public ResponseEntity<List<Notification>> checkAbsences() {
        List<ShiftLog> allShifts = shiftRepo.findAll();
        List<Notification> createdAlerts = new ArrayList<>();
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(15);

        for (ShiftLog s : allShifts) {
            boolean isOverdueOrMissing = "NO_SHOW".equalsIgnoreCase(s.getStatus())
                    || "ESCALATED".equalsIgnoreCase(s.getStatus())
                    || ("SCHEDULED".equalsIgnoreCase(s.getStatus()) && !s.isBiometricVerified() && s.getShiftStart() != null && s.getShiftStart().isBefore(threshold));

            if (isOverdueOrMissing) {
                // Ensure no duplicate notification already exists for this shift
                boolean alreadyNotified = notificationRepo.findAll().stream().anyMatch(n ->
                        s.getId() != null && s.getId().equals(n.getShiftId()) && "DUTY_ABSENCE".equalsIgnoreCase(n.getCategory())
                );

                if (!alreadyNotified) {
                    s.setStatus("NO_SHOW");
                    s.setNotes((s.getNotes() != null ? s.getNotes() + " | " : "") + "Identified as absent by automated attendance scan.");
                    shiftRepo.save(s);

                    String post = s.getGatePost() != null ? s.getGatePost() : s.getPostLocation();
                    String hours = s.getShiftHours() != null ? s.getShiftHours() : "Scheduled Watch";

                    Notification alert = new Notification(
                            "Shift Supervisor",
                            "supervisor@campusguard.edu",
                            "Guard Absence Alert: " + s.getOfficerName() + " Unreported Post",
                            "SURVEILLANCE SCAN: Officer " + s.getOfficerName() + " (" + s.getBadgeNumber() + ") did not show up on time for duty at " + post + ". Station is unmanned.",
                            "DUTY_ABSENCE",
                            "CRITICAL",
                            s.getOfficerName(),
                            s.getBadgeNumber(),
                            post,
                            hours,
                            "NO_SHOW",
                            s.getId()
                    );
                    createdAlerts.add(notificationRepo.save(alert));
                }
            }
        }
        return ResponseEntity.ok(createdAlerts);
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

