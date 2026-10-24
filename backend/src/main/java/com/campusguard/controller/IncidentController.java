package com.campusguard.controller;

import com.campusguard.model.IncidentReport;
import com.campusguard.model.Notification;
import com.campusguard.repository.IncidentReportRepository;
import com.campusguard.repository.NotificationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentReportRepository incidentRepo;
    private final NotificationRepository notificationRepo;

    public IncidentController(IncidentReportRepository incidentRepo, NotificationRepository notificationRepo) {
        this.incidentRepo = incidentRepo;
        this.notificationRepo = notificationRepo;
    }

    @GetMapping
    public List<IncidentReport> getAllIncidents(
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "role", required = false) String role) {
        if (email != null && !email.isBlank()) {
            return incidentRepo.findByReporterEmailIgnoreCaseOrderByCreatedAtDesc(email.trim());
        }
        if (role != null && !role.isBlank()) {
            return incidentRepo.findByReporterRoleIgnoreCaseOrderByCreatedAtDesc(role.trim());
        }
        return incidentRepo.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/my-reports")
    public List<IncidentReport> getMyReports(
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "role", required = false) String role) {
        if (email != null && !email.isBlank()) {
            return incidentRepo.findByReporterEmailIgnoreCaseOrderByCreatedAtDesc(email.trim());
        }
        if (role != null && !role.isBlank()) {
            return incidentRepo.findByReporterRoleIgnoreCaseOrderByCreatedAtDesc(role.trim());
        }
        return incidentRepo.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentReport> getIncidentById(@PathVariable Long id) {
        return incidentRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<IncidentReport> createIncident(@RequestBody IncidentReport report) {
        if (report.getTitle() == null || report.getTitle().isBlank()) {
            report.setTitle("General Safety Incident Log");
        }
        if (report.getSeverity() == null || report.getSeverity().isBlank()) {
            report.setSeverity("MEDIUM");
        }
        if (report.getDescription() == null) {
            report.setDescription("");
        }
        if (report.getLocation() == null || report.getLocation().isBlank()) {
            report.setLocation("Campus Grounds");
        }
        // Automatic escalation routing logic based on severity and role
        if ("CRITICAL".equalsIgnoreCase(report.getSeverity()) || "HIGH".equalsIgnoreCase(report.getSeverity())) {
            report.setRoutedTo("PROCTOR_AND_DSW");
        } else if (report.getRoutedTo() == null || report.getRoutedTo().isBlank()) {
            if ("Proctor and DSW".equalsIgnoreCase(report.getReporterRole())) {
                report.setRoutedTo("PROCTOR_AND_DSW");
            } else {
                report.setRoutedTo("CENTRAL_DISPATCH");
            }
        }
        if (report.getCreatedAt() == null) {
            report.setCreatedAt(LocalDateTime.now());
        }
        if (report.getStatus() == null || report.getStatus().isBlank()) {
            report.setStatus("OPEN");
        }
        IncidentReport saved = incidentRepo.save(report);

        // Automatically dispatch notifications to Shift Supervisor, Proctor, Admin, and the Submitter
        try {
            List<Notification> notificationsToSave = new ArrayList<>();

            String reporterDesc = (saved.getReporterName() != null ? saved.getReporterName() : "Reporter") +
                    (saved.getReporterRole() != null ? " (" + saved.getReporterRole() + ")" : "");
            String authorityMessage = String.format("Incident #%d reported at %s by %s. %s",
                    saved.getId(), saved.getLocation(), reporterDesc, saved.getDescription());

            // 1. Shift Supervisor Notification
            Notification supNotif = new Notification(
                    "Shift Supervisor",
                    null,
                    "New Incident Reported: " + saved.getTitle(),
                    authorityMessage,
                    "INCIDENT",
                    saved.getSeverity()
            );
            supNotif.setIncidentId(saved.getId());
            supNotif.setCreatedAt(LocalDateTime.now());
            notificationsToSave.add(supNotif);

            // 2. Proctor and DSW Notification
            Notification proctorNotif = new Notification(
                    "Proctor and DSW",
                    null,
                    "New Incident Reported: " + saved.getTitle(),
                    authorityMessage,
                    "INCIDENT",
                    saved.getSeverity()
            );
            proctorNotif.setIncidentId(saved.getId());
            proctorNotif.setCreatedAt(LocalDateTime.now());
            notificationsToSave.add(proctorNotif);

            // 3. Admin Notification
            Notification adminNotif = new Notification(
                    "Admin",
                    null,
                    "New Incident Reported: " + saved.getTitle(),
                    authorityMessage,
                    "INCIDENT",
                    saved.getSeverity()
            );
            adminNotif.setIncidentId(saved.getId());
            adminNotif.setCreatedAt(LocalDateTime.now());
            notificationsToSave.add(adminNotif);

            // 4. Submitter Confirmation Notification
            String submitterRole = saved.getReporterRole() != null && !saved.getReporterRole().isBlank()
                    ? saved.getReporterRole()
                    : "Student";
            Notification submitterNotif = new Notification(
                    submitterRole,
                    saved.getReporterEmail(),
                    "Report submitted",
                    String.format("Your incident report #%d ('%s') has been submitted successfully to dispatch and campus authorities. Click to view your incident report.",
                            saved.getId(), saved.getTitle()),
                    "INCIDENT",
                    saved.getSeverity()
            );
            submitterNotif.setIncidentId(saved.getId());
            submitterNotif.setCreatedAt(LocalDateTime.now());
            notificationsToSave.add(submitterNotif);

            notificationRepo.saveAll(notificationsToSave);
        } catch (Exception e) {
            // Log notification error without failing the incident submission
            System.err.println("Failed to dispatch automated notifications for incident #" + saved.getId() + ": " + e.getMessage());
        }

        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<IncidentReport> resolveIncident(@PathVariable Long id) {
        return updateStatus(id, Map.of("status", "RESOLVED"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<IncidentReport> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String rawStatus = body.getOrDefault("status", "OPEN");
        String normalizedStatus = normalizeStatus(rawStatus);

        return incidentRepo.findById(id).map(incident -> {
            String oldStatus = incident.getStatus() != null ? incident.getStatus() : "OPEN";

            // Only perform update and notify when status actually differs
            if (!normalizedStatus.equalsIgnoreCase(oldStatus)) {
                incident.setStatus(normalizedStatus);
                if ("RESOLVED".equalsIgnoreCase(normalizedStatus)) {
                    incident.setResolvedAt(LocalDateTime.now());
                } else {
                    incident.setResolvedAt(null);
                }
                IncidentReport saved = incidentRepo.save(incident);

                // Dispatch status change notifications
                try {
                    List<Notification> statusNotifs = new ArrayList<>();

                    // 1. Notification to the person who submitted the report
                    String submitterRole = saved.getReporterRole() != null && !saved.getReporterRole().isBlank()
                            ? saved.getReporterRole()
                            : "Student";
                    Notification submitterNotif = new Notification(
                            submitterRole,
                            saved.getReporterEmail(),
                            "Incident Report Status Updated",
                            String.format("Your incident report #%d ('%s') status has been updated to %s. Click to view details.",
                                    saved.getId(), saved.getTitle(), formatStatusLabel(normalizedStatus)),
                            "INCIDENT",
                            saved.getSeverity()
                    );
                    submitterNotif.setIncidentId(saved.getId());
                    submitterNotif.setCreatedAt(LocalDateTime.now());
                    statusNotifs.add(submitterNotif);

                    // 2. Notification to Shift Supervisor
                    Notification supNotif = new Notification(
                            "Shift Supervisor",
                            null,
                            "Incident #" + saved.getId() + " Status: " + formatStatusLabel(normalizedStatus),
                            String.format("Incident #%d ('%s') status updated from %s to %s.",
                                    saved.getId(), saved.getTitle(), formatStatusLabel(oldStatus), formatStatusLabel(normalizedStatus)),
                            "INCIDENT",
                            saved.getSeverity()
                    );
                    supNotif.setIncidentId(saved.getId());
                    supNotif.setCreatedAt(LocalDateTime.now());
                    statusNotifs.add(supNotif);

                    // 3. Notification to Proctor and DSW
                    Notification proctorNotif = new Notification(
                            "Proctor and DSW",
                            null,
                            "Incident #" + saved.getId() + " Status: " + formatStatusLabel(normalizedStatus),
                            String.format("Incident #%d ('%s') status updated from %s to %s.",
                                    saved.getId(), saved.getTitle(), formatStatusLabel(oldStatus), formatStatusLabel(normalizedStatus)),
                            "INCIDENT",
                            saved.getSeverity()
                    );
                    proctorNotif.setIncidentId(saved.getId());
                    proctorNotif.setCreatedAt(LocalDateTime.now());
                    statusNotifs.add(proctorNotif);

                    // 4. Notification to Admin
                    Notification adminNotif = new Notification(
                            "Admin",
                            null,
                            "Incident #" + saved.getId() + " Status: " + formatStatusLabel(normalizedStatus),
                            String.format("Incident #%d ('%s') status updated from %s to %s.",
                                    saved.getId(), saved.getTitle(), formatStatusLabel(oldStatus), formatStatusLabel(normalizedStatus)),
                            "INCIDENT",
                            saved.getSeverity()
                    );
                    adminNotif.setIncidentId(saved.getId());
                    adminNotif.setCreatedAt(LocalDateTime.now());
                    statusNotifs.add(adminNotif);

                    notificationRepo.saveAll(statusNotifs);
                } catch (Exception e) {
                    System.err.println("Failed to dispatch status update notifications for incident #" + saved.getId() + ": " + e.getMessage());
                }

                return ResponseEntity.ok(saved);
            }

            return ResponseEntity.ok(incident);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/escalate")
    public ResponseEntity<IncidentReport> escalateIncident(@PathVariable Long id) {
        return incidentRepo.findById(id).map(incident -> {
            incident.setSeverity("CRITICAL");
            incident.setRoutedTo("PROCTOR_AND_DSW");
            return updateStatus(id, Map.of("status", "DISPATCHED"));
        }).orElse(ResponseEntity.notFound().build());
    }

    private String normalizeStatus(String status) {
        if (status == null || status.isBlank()) return "OPEN";
        String s = status.trim().toUpperCase().replace(" ", "_");
        switch (s) {
            case "IN_PROGRESS":
            case "INPROGRESS":
                return "IN_PROGRESS";
            case "DISPATCHED":
                return "DISPATCHED";
            case "RESOLVED":
                return "RESOLVED";
            case "OPEN":
            default:
                return "OPEN";
        }
    }

    private String formatStatusLabel(String status) {
        if (status == null) return "Open";
        switch (status.toUpperCase().replace(" ", "_")) {
            case "IN_PROGRESS": return "In Progress";
            case "DISPATCHED": return "Dispatched";
            case "RESOLVED": return "Resolved";
            case "OPEN":
            default: return "Open";
        }
    }
}
