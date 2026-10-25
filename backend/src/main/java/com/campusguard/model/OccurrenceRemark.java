package com.campusguard.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "occurrence_remarks")
public class OccurrenceRemark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long occurrenceId;

    @Column(nullable = false)
    private String authorName;

    private String authorBadge;

    private String authorRole;

    private String authorEmail;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String remarkText;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    public OccurrenceRemark() {
        this.createdAt = LocalDateTime.now();
    }

    public OccurrenceRemark(Long occurrenceId, String authorName, String authorBadge, String authorRole, String authorEmail, String remarkText) {
        this();
        this.occurrenceId = occurrenceId;
        this.authorName = authorName;
        this.authorBadge = authorBadge;
        this.authorRole = authorRole != null ? authorRole : "Shift Supervisor";
        this.authorEmail = authorEmail;
        this.remarkText = remarkText;
    }

    @PrePersist
    public void onPrePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOccurrenceId() {
        return occurrenceId;
    }

    public void setOccurrenceId(Long occurrenceId) {
        this.occurrenceId = occurrenceId;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getAuthorBadge() {
        return authorBadge;
    }

    public void setAuthorBadge(String authorBadge) {
        this.authorBadge = authorBadge;
    }

    public String getAuthorRole() {
        return authorRole;
    }

    public void setAuthorRole(String authorRole) {
        this.authorRole = authorRole;
    }

    public String getAuthorEmail() {
        return authorEmail;
    }

    public void setAuthorEmail(String authorEmail) {
        this.authorEmail = authorEmail;
    }

    public String getRemarkText() {
        return remarkText;
    }

    public void setRemarkText(String remarkText) {
        this.remarkText = remarkText;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
