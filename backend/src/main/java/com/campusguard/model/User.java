package com.campusguard.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // Student, Proctor and DSW, Security Guard, Shift Supervisor, Admin

    private String fullName;

    private String badgeNumber;

    private String department;

    private String phoneNumber;

    private String status; // ACTIVE, SUSPENDED, PENDING

    @Column(columnDefinition = "TEXT")
    private String profilePicture;

    private String previousFullName;

    @Column(columnDefinition = "TEXT")
    private String previousProfilePicture;

    private String profileReviewStatus; // APPROVED, PENDING_APPROVAL, DENIED

    private LocalDateTime createdAt;

    public User() {
        this.createdAt = LocalDateTime.now();
        this.status = "ACTIVE";
        this.profileReviewStatus = "APPROVED";
    }

    public User(String email, String password, String role) {
        this();
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public User(String email, String password, String role, String fullName, String badgeNumber, String department) {
        this(email, password, role);
        this.fullName = fullName;
        this.badgeNumber = badgeNumber;
        this.department = department;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getName() {
        return fullName;
    }

    public void setName(String name) {
        this.fullName = name;
    }

    public String getBadgeNumber() {
        return badgeNumber;
    }

    public void setBadgeNumber(String badgeNumber) {
        this.badgeNumber = badgeNumber;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getStatus() {
        return status != null ? status : "ACTIVE";
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getPreviousFullName() {
        return previousFullName;
    }

    public void setPreviousFullName(String previousFullName) {
        this.previousFullName = previousFullName;
    }

    public String getPreviousProfilePicture() {
        return previousProfilePicture;
    }

    public void setPreviousProfilePicture(String previousProfilePicture) {
        this.previousProfilePicture = previousProfilePicture;
    }

    public String getProfileReviewStatus() {
        return profileReviewStatus != null ? profileReviewStatus : "APPROVED";
    }

    public void setProfileReviewStatus(String profileReviewStatus) {
        this.profileReviewStatus = profileReviewStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
