package com.campusguard.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "shift_handoff_acknowledgements")
public class ShiftHandoffAcknowledgement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long shiftHandoffId;

    @Column(nullable = false)
    private String gatePost;

    // Incoming Guard Details who accepted the shift handoff
    @Column(nullable = false)
    private Long guardId;

    private String guardName;

    private String guardBadgeNumber;

    private String guardEmail;

    // Exact timestamp when explicit acknowledgement occurred
    @Column(nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime acknowledgedAt;

    // Formal transfer of responsibility flag
    @Column(nullable = false)
    private boolean responsibilityTransferred = true;

    @Column(columnDefinition = "TEXT")
    private String notes;

    // Outgoing Guard Reference
    private Long outgoingGuardId;

    private String outgoingGuardName;

    private String outgoingGuardBadgeNumber;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    public ShiftHandoffAcknowledgement() {
        this.acknowledgedAt = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
        this.responsibilityTransferred = true;
    }

    public ShiftHandoffAcknowledgement(
            Long shiftHandoffId,
            String gatePost,
            Long guardId,
            String guardName,
            String guardBadgeNumber,
            String guardEmail,
            LocalDateTime acknowledgedAt,
            String notes,
            Long outgoingGuardId,
            String outgoingGuardName,
            String outgoingGuardBadgeNumber
    ) {
        this();
        this.shiftHandoffId = shiftHandoffId;
        this.gatePost = gatePost;
        this.guardId = guardId;
        this.guardName = guardName;
        this.guardBadgeNumber = guardBadgeNumber;
        this.guardEmail = guardEmail;
        this.acknowledgedAt = acknowledgedAt != null ? acknowledgedAt : LocalDateTime.now();
        this.notes = notes;
        this.outgoingGuardId = outgoingGuardId;
        this.outgoingGuardName = outgoingGuardName;
        this.outgoingGuardBadgeNumber = outgoingGuardBadgeNumber;
        this.responsibilityTransferred = true;
    }

    @PrePersist
    public void onPrePersist() {
        if (this.acknowledgedAt == null) {
            this.acknowledgedAt = LocalDateTime.now();
        }
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        this.responsibilityTransferred = true;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getShiftHandoffId() { return shiftHandoffId; }
    public void setShiftHandoffId(Long shiftHandoffId) { this.shiftHandoffId = shiftHandoffId; }

    public String getGatePost() { return gatePost; }
    public void setGatePost(String gatePost) { this.gatePost = gatePost; }

    public Long getGuardId() { return guardId; }
    public void setGuardId(Long guardId) { this.guardId = guardId; }

    public String getGuardName() { return guardName; }
    public void setGuardName(String guardName) { this.guardName = guardName; }

    public String getGuardBadgeNumber() { return guardBadgeNumber; }
    public void setGuardBadgeNumber(String guardBadgeNumber) { this.guardBadgeNumber = guardBadgeNumber; }

    public String getGuardEmail() { return guardEmail; }
    public void setGuardEmail(String guardEmail) { this.guardEmail = guardEmail; }

    public LocalDateTime getAcknowledgedAt() { return acknowledgedAt; }
    public void setAcknowledgedAt(LocalDateTime acknowledgedAt) { this.acknowledgedAt = acknowledgedAt; }

    public boolean isResponsibilityTransferred() { return responsibilityTransferred; }
    public void setResponsibilityTransferred(boolean responsibilityTransferred) { this.responsibilityTransferred = responsibilityTransferred; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Long getOutgoingGuardId() { return outgoingGuardId; }
    public void setOutgoingGuardId(Long outgoingGuardId) { this.outgoingGuardId = outgoingGuardId; }

    public String getOutgoingGuardName() { return outgoingGuardName; }
    public void setOutgoingGuardName(String outgoingGuardName) { this.outgoingGuardName = outgoingGuardName; }

    public String getOutgoingGuardBadgeNumber() { return outgoingGuardBadgeNumber; }
    public void setOutgoingGuardBadgeNumber(String outgoingGuardBadgeNumber) { this.outgoingGuardBadgeNumber = outgoingGuardBadgeNumber; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
