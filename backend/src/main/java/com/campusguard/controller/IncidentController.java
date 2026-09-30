package com.campusguard.controller;

import com.campusguard.model.IncidentReport;
import com.campusguard.repository.IncidentReportRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentReportRepository incidentRepo;

    public IncidentController(IncidentReportRepository incidentRepo) {
        this.incidentRepo = incidentRepo;
    }

    @GetMapping
    public List<IncidentReport> getAllIncidents() {
        return incidentRepo.findAll();
    }

    @PostMapping
    public ResponseEntity<IncidentReport> createIncident(@RequestBody IncidentReport report) {
        // Automatic escalation routing logic based on severity
        if ("CRITICAL".equalsIgnoreCase(report.getSeverity()) || "HIGH".equalsIgnoreCase(report.getSeverity())) {
            report.setRoutedTo("PROCTOR_AND_DSW");
        } else if (report.getRoutedTo() == null || report.getRoutedTo().isBlank()) {
            report.setRoutedTo("CENTRAL_DISPATCH");
        }
        report.setCreatedAt(LocalDateTime.now());
        report.setStatus("IN_TRIAGE");
        IncidentReport saved = incidentRepo.save(report);
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
}
