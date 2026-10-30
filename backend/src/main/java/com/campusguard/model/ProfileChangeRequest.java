package com.campusguard.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "profile_change_requests")
public class ProfileChangeRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String studentEmail;

    private String studentName;

    private String studentBadgeNumber;

    private String previousFullName;

    private String newFullName;

    @Column(columnDefinition = "TEXT")
    private String previousProfilePicture;

    @Column(columnDefinition = "TEXT")
    private String newProfilePicture;

    private String status; // PENDING, APPROVED, DENIED

    @Column(columnDefinition = "TEXT")
    private String denialReason;

    private String reviewedBy;

    private LocalDateTime createdAt;

    private LocalDateTime reviewedAt;

    public ProfileChangeRequest() {
        this.createdAt = LocalDateTime.now();
        this.status = "PENDING";
    }

    public ProfileChangeRequest(Long userId, String studentEmail, String studentName, String studentBadgeNumber,
                                String previousFullName, String newFullName,
                                String previousProfilePicture, String newProfilePicture) {
        this();
        this.userId = userId;
        this.studentEmail = studentEmail;
        this.studentName = studentName;
        this.studentBadgeNumber = studentBadgeNumber;
        this.previousFullName = previousFullName;
        this.newFullName = newFullName;
        this.previousProfilePicture = previousProfilePicture;
        this.newProfilePicture = newProfilePicture;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentBadgeNumber() {
        return studentBadgeNumber;
    }

    public void setStudentBadgeNumber(String studentBadgeNumber) {
        this.studentBadgeNumber = studentBadgeNumber;
    }

    public String getPreviousFullName() {
        return previousFullName;
    }

    public void setPreviousFullName(String previousFullName) {
        this.previousFullName = previousFullName;
    }

    public String getNewFullName() {
        return newFullName;
    }

    public void setNewFullName(String newFullName) {
        this.newFullName = newFullName;
    }

    public String getPreviousProfilePicture() {
        return previousProfilePicture;
    }

    public void setPreviousProfilePicture(String previousProfilePicture) {
        this.previousProfilePicture = previousProfilePicture;
    }

    public String getNewProfilePicture() {
        return newProfilePicture;
    }

    public void setNewProfilePicture(String newProfilePicture) {
        this.newProfilePicture = newProfilePicture;
    }

    public String getStatus() {
        return status != null ? status : "PENDING";
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDenialReason() {
        return denialReason;
    }

    public void setDenialReason(String denialReason) {
        this.denialReason = denialReason;
    }

    public String getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(String reviewedBy) {
        this.reviewedBy = reviewedBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }
}
