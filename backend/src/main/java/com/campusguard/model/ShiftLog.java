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

    private String gatePost;
    private String sector;
    private String shiftHours;
    private String radioChannel;

    private String status; // ON_DUTY, COMPLETED, NO_SHOW, ESCALATED, SCHEDULED

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
        this.gatePost = postLocation;
        this.biometricVerified = biometricVerified;
        this.notes = notes;
    }

    public ShiftLog(String officerName, String badgeNumber, String postLocation, String gatePost, String sector, String shiftHours, String radioChannel, boolean biometricVerified, String notes) {
        this(officerName, badgeNumber, postLocation != null ? postLocation : gatePost, biometricVerified, notes);
        this.gatePost = gatePost != null ? gatePost : postLocation;
        this.sector = sector;
        this.shiftHours = shiftHours;
        this.radioChannel = radioChannel;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOfficerName() { return officerName; }
    public void setOfficerName(String officerName) { this.officerName = officerName; }

    public String getBadgeNumber() { return badgeNumber; }
    public void setBadgeNumber(String badgeNumber) { this.badgeNumber = badgeNumber; }

    public String getPostLocation() {
        return postLocation != null ? postLocation : gatePost;
    }
    public void setPostLocation(String postLocation) {
        this.postLocation = postLocation;
        if (this.gatePost == null) this.gatePost = postLocation;
    }

    public String getGatePost() {
        return gatePost != null ? gatePost : postLocation;
    }
    public void setGatePost(String gatePost) {
        this.gatePost = gatePost;
        if (this.postLocation == null) this.postLocation = gatePost;
    }

    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }

    public String getShiftHours() { return shiftHours; }
    public void setShiftHours(String shiftHours) { this.shiftHours = shiftHours; }

    public String getRadioChannel() { return radioChannel; }
    public void setRadioChannel(String radioChannel) { this.radioChannel = radioChannel; }

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

