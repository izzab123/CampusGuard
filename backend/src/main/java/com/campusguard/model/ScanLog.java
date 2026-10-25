package com.campusguard.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "scan_logs")
public class ScanLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime scanTimestamp;

    @Column(nullable = false)
    private String scannerType; // RFID_GATE_BARRIER, QR_VISITOR_PASS, STUDENT_ID_SCANNER, VEHICLE_LPR_SCANNER, BIOMETRIC_SENTRY_SCAN

    @Column(nullable = false)
    private String gateLocation; // e.g. North Gate Checkpoint - Barrier 04

    @Column(nullable = false)
    private String subjectIdentifier; // Plate #7XYZ-42, Pass #CG-PASS-4F8B2, Student #ST-9021

    private String subjectName; // Prof. Arthur Henderson, Visitor Marcus Vance

    @Column(nullable = false)
    private String accessStatus; // GRANTED, DENIED, MANUAL_OVERRIDE, FLAGGED_SECURITY

    private String operatorGuard; // Officer Marcus Vance, Automated Sentinel Radar

    @Column(columnDefinition = "TEXT")
    private String notes;

    public ScanLog() {
        this.scanTimestamp = LocalDateTime.now();
        this.accessStatus = "GRANTED";
        this.scannerType = "RFID_GATE_BARRIER";
    }

    public ScanLog(LocalDateTime scanTimestamp, String scannerType, String gateLocation,
                   String subjectIdentifier, String subjectName, String accessStatus,
                   String operatorGuard, String notes) {
        this.scanTimestamp = scanTimestamp != null ? scanTimestamp : LocalDateTime.now();
        this.scannerType = scannerType;
        this.gateLocation = gateLocation;
        this.subjectIdentifier = subjectIdentifier;
        this.subjectName = subjectName;
        this.accessStatus = accessStatus;
        this.operatorGuard = operatorGuard;
        this.notes = notes;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getScanTimestamp() { return scanTimestamp; }
    public void setScanTimestamp(LocalDateTime scanTimestamp) { this.scanTimestamp = scanTimestamp; }

    public String getScannerType() { return scannerType; }
    public void setScannerType(String scannerType) { this.scannerType = scannerType; }

    public String getGateLocation() { return gateLocation; }
    public void setGateLocation(String gateLocation) { this.gateLocation = gateLocation; }

    public String getSubjectIdentifier() { return subjectIdentifier; }
    public void setSubjectIdentifier(String subjectIdentifier) { this.subjectIdentifier = subjectIdentifier; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getAccessStatus() { return accessStatus; }
    public void setAccessStatus(String accessStatus) { this.accessStatus = accessStatus; }

    public String getOperatorGuard() { return operatorGuard; }
    public void setOperatorGuard(String operatorGuard) { this.operatorGuard = operatorGuard; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
