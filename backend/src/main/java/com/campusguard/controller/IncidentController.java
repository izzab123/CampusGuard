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
    public List<IncidentReport> getAllIncidents() {
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
            report.setStatus("IN_TRIAGE");
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
        return incidentRepo.findById(id).map(incident -> {
            incident.setStatus("RESOLVED");
            incident.setResolvedAt(LocalDateTime.now());
            return ResponseEntity.ok(incidentRepo.save(incident));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<IncidentReport> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newStatus = body.getOrDefault("status", "IN_TRIAGE");
        return incidentRepo.findById(id).map(incident -> {
            incident.setStatus(newStatus.toUpperCase());
            if ("RESOLVED".equalsIgnoreCase(newStatus)) {
                incident.setResolvedAt(LocalDateTime.now());
            }
            return ResponseEntity.ok(incidentRepo.save(incident));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/escalate")
    public ResponseEntity<IncidentReport> escalateIncident(@PathVariable Long id) {
        return incidentRepo.findById(id).map(incident -> {
            incident.setSeverity("CRITICAL");
            incident.setRoutedTo("PROCTOR_AND_DSW");
            incident.setStatus("DISPATCHED");
            return ResponseEntity.ok(incidentRepo.save(incident));
        }).orElse(ResponseEntity.notFound().build());
    }
}
