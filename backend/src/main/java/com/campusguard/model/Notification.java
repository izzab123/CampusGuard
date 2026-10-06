package com.campusguard.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String recipientRole; // ALL, Student, Proctor and DSW, Security Guard, Shift Supervisor, Admin

    private String recipientEmail;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    private String category; // DISPATCH, INCIDENT, SYSTEM, CLEARANCE

    private String priority; // LOW, MEDIUM, HIGH, CRITICAL

    private boolean isRead;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Notification() {
        this.createdAt = LocalDateTime.now();
        this.isRead = false;
        this.priority = "MEDIUM";
        this.category = "SYSTEM";
    }

    public Notification(String recipientRole, String recipientEmail, String title, String message, String category, String priority) {
        this();
        this.recipientRole = recipientRole;
        this.recipientEmail = recipientEmail;
        this.title = title;
        this.message = message;
        this.category = category != null ? category : "SYSTEM";
        this.priority = priority != null ? priority : "MEDIUM";
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRecipientRole() { return recipientRole; }
    public void setRecipientRole(String recipientRole) { this.recipientRole = recipientRole; }

    public String getRecipientEmail() { return recipientEmail; }
    public void setRecipientEmail(String recipientEmail) { this.recipientEmail = recipientEmail; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
