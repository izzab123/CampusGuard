package com.campusguard.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "shift_handoff_forms")
public class ShiftHandoffForm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String outgoingGuardId;

    private String outgoingGuardName;

    private String outgoingGuardEmail;

    private String postLocation;

    @Column(length = 4000, nullable = false)
    private String incidents;

    @Column(length = 4000, nullable = false)
    private String generalObservations;

    @Column(length = 4000, nullable = false)
    private String pendingIssues;

    @Column(length = 4000, nullable = false)
    private String itemsToWatch;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    private Long shiftLogId;

    public ShiftHandoffForm() {
        this.timestamp = LocalDateTime.now();
    }

    public ShiftHandoffForm(String outgoingGuardId, String outgoingGuardName, String postLocation,
                            String incidents, String generalObservations, String pendingIssues,
                            String itemsToWatch) {
        this();
        this.outgoingGuardId = outgoingGuardId;
        this.outgoingGuardName = outgoingGuardName;
        this.postLocation = postLocation;
        this.incidents = incidents;
        this.generalObservations = generalObservations;
        this.pendingIssues = pendingIssues;
        this.itemsToWatch = itemsToWatch;
    }

    @PrePersist
    public void onPrePersist() {
        if (this.timestamp == null) {
            this.timestamp = LocalDateTime.now();
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOutgoingGuardId() {
        return outgoingGuardId;
    }

    public void setOutgoingGuardId(String outgoingGuardId) {
        this.outgoingGuardId = outgoingGuardId;
    }

    public String getOutgoingGuardName() {
        return outgoingGuardName;
    }

    public void setOutgoingGuardName(String outgoingGuardName) {
        this.outgoingGuardName = outgoingGuardName;
    }

    public String getOutgoingGuardEmail() {
        return outgoingGuardEmail;
    }

    public void setOutgoingGuardEmail(String outgoingGuardEmail) {
        this.outgoingGuardEmail = outgoingGuardEmail;
    }

    public String getPostLocation() {
        return postLocation;
    }

    public void setPostLocation(String postLocation) {
        this.postLocation = postLocation;
    }

    public String getIncidents() {
        return incidents;
    }

    public void setIncidents(String incidents) {
        this.incidents = incidents;
    }

    public String getGeneralObservations() {
        return generalObservations;
    }

    public void setGeneralObservations(String generalObservations) {
        this.generalObservations = generalObservations;
    }

    public String getPendingIssues() {
        return pendingIssues;
    }

    public void setPendingIssues(String pendingIssues) {
        this.pendingIssues = pendingIssues;
    }

    public String getItemsToWatch() {
        return itemsToWatch;
    }

    public void setItemsToWatch(String itemsToWatch) {
        this.itemsToWatch = itemsToWatch;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Long getShiftLogId() {
        return shiftLogId;
    }

    public void setShiftLogId(Long shiftLogId) {
        this.shiftLogId = shiftLogId;
    }
}
