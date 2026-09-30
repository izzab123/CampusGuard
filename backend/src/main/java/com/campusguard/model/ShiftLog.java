package com.campusguard.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "shift_logs")
public class ShiftLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String officerName;

    @Column(nullable = false)
    private String badgeNumber;

    @Column(nullable = false)
    private String postLocation; // e.g., North Gate, Residence Quad, Science Hub

    private String status; // ON_DUTY, COMPLETED, NO_SHOW, ESCALATED

    private boolean biometricVerified;

    private LocalDateTime shiftStart;
    private LocalDateTime shiftEnd;

    private String notes;

    public ShiftLog() {
        this.shiftStart = LocalDateTime.now();
        this.status = "ON_DUTY";
        this.biometricVerified = true;
    }

    public ShiftLog(String officerName, String badgeNumber, String postLocation, boolean biometricVerified, String notes) {
        this();
        this.officerName = officerName;
        this.badgeNumber = badgeNumber;
        this.postLocation = postLocation;
        this.biometricVerified = biometricVerified;
        this.notes = notes;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOfficerName() { return officerName; }
    public void setOfficerName(String officerName) { this.officerName = officerName; }

    public String getBadgeNumber() { return badgeNumber; }
    public void setBadgeNumber(String badgeNumber) { this.badgeNumber = badgeNumber; }

    public String getPostLocation() { return postLocation; }
    public void setPostLocation(String postLocation) { this.postLocation = postLocation; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isBiometricVerified() { return biometricVerified; }
    public void setBiometricVerified(boolean biometricVerified) { this.biometricVerified = biometricVerified; }

    public LocalDateTime getShiftStart() { return shiftStart; }
    public void setShiftStart(LocalDateTime shiftStart) { this.shiftStart = shiftStart; }

    public LocalDateTime getShiftEnd() { return shiftEnd; }
    public void setShiftEnd(LocalDateTime shiftEnd) { this.shiftEnd = shiftEnd; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
