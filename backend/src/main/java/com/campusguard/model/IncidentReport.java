package com.campusguard.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "incident_reports")
public class IncidentReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String severity; // LOW, MEDIUM, HIGH, CRITICAL

    private String location;

    @Column(nullable = false)
    private String status; // REPORTED, IN_TRIAGE, DISPATCHED, RESOLVED

    private String routedTo; // PROCTOR, DSW, CENTRAL_DISPATCH

    private String reporterName;
    private String reporterRole; // GUARD, STUDENT, SUPERVISOR, STAFF

    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;

    public IncidentReport() {
        this.createdAt = LocalDateTime.now();
        this.status = "REPORTED";
    }

    public IncidentReport(String title, String description, String severity, String location, String routedTo, String reporterName, String reporterRole) {
        this();
        this.title = title;
        this.description = description;
        this.severity = severity;
        this.location = location;
        this.routedTo = routedTo;
        this.reporterName = reporterName;
        this.reporterRole = reporterRole;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRoutedTo() { return routedTo; }
    public void setRoutedTo(String routedTo) { this.routedTo = routedTo; }

    public String getReporterName() { return reporterName; }
    public void setReporterName(String reporterName) { this.reporterName = reporterName; }

    public String getReporterRole() { return reporterRole; }
    public void setReporterRole(String reporterRole) { this.reporterRole = reporterRole; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
}
