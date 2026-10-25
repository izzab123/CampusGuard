package com.campusguard.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "occurrence_records")
public class OccurrenceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate occurrenceDate;

    @Column(nullable = false)
    private String guardName;

    private String guardBadgeNumber;

    private String guardEmail;

    @Column(nullable = false)
    private String shiftType; // MORNING, EVENING, NIGHT, or hours

    @Column(nullable = false)
    private String gatePost; // Post or gate location

    @Column(nullable = false)
    private String occurrenceType; // NO_SHOW, NOTABLE_EVENT, SECURITY_INCIDENT, etc.

    private String severity; // CRITICAL, HIGH, MEDIUM, LOW, INFO

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String source; // AUTOMATED_SENTINEL_RADAR, DISPATCH_NOC, SUPERVISOR_PATROL, etc.

    @Column(nullable = false)
    private boolean readOnly = true;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "occurrenceId")
    @OrderBy("createdAt ASC")
    private List<OccurrenceRemark> remarks = new ArrayList<>();

    public OccurrenceRecord() {
        this.occurrenceDate = LocalDate.now();
        this.createdAt = LocalDateTime.now();
        this.readOnly = true;
        this.severity = "MEDIUM";
        this.source = "OFFICIAL_REGISTER";
    }

    public OccurrenceRecord(
            LocalDate occurrenceDate,
            String guardName,
            String guardBadgeNumber,
            String shiftType,
            String gatePost,
            String occurrenceType,
            String severity,
            String title,
            String description
    ) {
        this();
        this.occurrenceDate = occurrenceDate != null ? occurrenceDate : LocalDate.now();
        this.guardName = guardName;
        this.guardBadgeNumber = guardBadgeNumber;
        this.shiftType = shiftType;
        this.gatePost = gatePost;
        this.occurrenceType = occurrenceType;
        this.severity = severity != null ? severity : "MEDIUM";
        this.title = title;
        this.description = description;
    }

    @PrePersist
    public void onPrePersist() {
        if (this.occurrenceDate == null) {
            this.occurrenceDate = LocalDate.now();
        }
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        this.readOnly = true;
    }

    // Convenience JSON getters matching user requirements: date, guard, shift, gate, and type
    @JsonProperty("date")
    public String getDate() {
        return occurrenceDate != null ? occurrenceDate.toString() : "";
    }

    @JsonProperty("guard")
    public String getGuard() {
        if (guardBadgeNumber != null && !guardBadgeNumber.isBlank()) {
            return guardName + " (" + guardBadgeNumber + ")";
        }
        return guardName;
    }

    @JsonProperty("shift")
    public String getShift() {
        return shiftType;
    }

    @JsonProperty("gate")
    public String getGate() {
        return gatePost;
    }

    @JsonProperty("type")
    public String getType() {
        return occurrenceType;
    }

    public void addRemark(OccurrenceRemark remark) {
        if (remarks == null) {
            remarks = new ArrayList<>();
        }
        remarks.add(remark);
        if (this.id != null) {
            remark.setOccurrenceId(this.id);
        }
    }

    // Standard Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getOccurrenceDate() {
        return occurrenceDate;
    }

    public void setOccurrenceDate(LocalDate occurrenceDate) {
        this.occurrenceDate = occurrenceDate;
    }

    public String getGuardName() {
        return guardName;
    }

    public void setGuardName(String guardName) {
        this.guardName = guardName;
    }

    public String getGuardBadgeNumber() {
        return guardBadgeNumber;
    }

    public void setGuardBadgeNumber(String guardBadgeNumber) {
        this.guardBadgeNumber = guardBadgeNumber;
    }

    public String getGuardEmail() {
        return guardEmail;
    }

    public void setGuardEmail(String guardEmail) {
        this.guardEmail = guardEmail;
    }

    public String getShiftType() {
        return shiftType;
    }

    public void setShiftType(String shiftType) {
        this.shiftType = shiftType;
    }

    public String getGatePost() {
        return gatePost;
    }

    public void setGatePost(String gatePost) {
        this.gatePost = gatePost;
    }

    public String getOccurrenceType() {
        return occurrenceType;
    }

    public void setOccurrenceType(String occurrenceType) {
        this.occurrenceType = occurrenceType;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public boolean isReadOnly() {
        return readOnly;
    }

    public void setReadOnly(boolean readOnly) {
        this.readOnly = readOnly;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<OccurrenceRemark> getRemarks() {
        return remarks;
    }

    public void setRemarks(List<OccurrenceRemark> remarks) {
        this.remarks = remarks;
    }
}
