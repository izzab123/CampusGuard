package com.campusguard.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance_configs")
public class AttendanceConfig {

    @Id
    private Long id = 1L;

    @Column(nullable = false)
    private int gracePeriodMinutes = 15;

    private boolean autoDetectionEnabled = true;

    private String updatedBy = "System Administrator";

    private LocalDateTime updatedAt = LocalDateTime.now();

    public AttendanceConfig() {}

    public AttendanceConfig(Long id, int gracePeriodMinutes, boolean autoDetectionEnabled, String updatedBy) {
        this.id = id;
        this.gracePeriodMinutes = gracePeriodMinutes;
        this.autoDetectionEnabled = autoDetectionEnabled;
        this.updatedBy = updatedBy;
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getGracePeriodMinutes() { return gracePeriodMinutes; }
    public void setGracePeriodMinutes(int gracePeriodMinutes) { this.gracePeriodMinutes = gracePeriodMinutes; }

    public boolean isAutoDetectionEnabled() { return autoDetectionEnabled; }
    public void setAutoDetectionEnabled(boolean autoDetectionEnabled) { this.autoDetectionEnabled = autoDetectionEnabled; }

    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
