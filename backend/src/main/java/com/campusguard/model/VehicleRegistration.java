package com.campusguard.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_registrations")
public class VehicleRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String studentId;

    @Column(nullable = false)
    private String ownerName;

    @Column(nullable = false)
    private String contactNumber;

    @Column(nullable = false, unique = true)
    private String vehicleNumber;

    @Column(nullable = false)
    private String vehicleType;

    @Column(nullable = false)
    private String status; // "Pending approval", "Approved", "Rejected"

    private String submittedByEmail;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime approvedAt;

    private String approvedBy;

    private LocalDateTime deniedAt;

    private String deniedBy;

    private String rejectionReason;

    @Column(unique = true)
    private String qrCode;

    public VehicleRegistration() {
        this.createdAt = LocalDateTime.now();
        this.status = "Pending approval";
    }

    public VehicleRegistration(String studentId, String ownerName, String contactNumber, String vehicleNumber, String vehicleType, String submittedByEmail) {
        this();
        this.studentId = studentId;
        this.ownerName = ownerName;
        this.contactNumber = contactNumber;
        this.vehicleNumber = vehicleNumber;
        this.vehicleType = vehicleType;
        this.submittedByEmail = submittedByEmail;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSubmittedByEmail() { return submittedByEmail; }
    public void setSubmittedByEmail(String submittedByEmail) { this.submittedByEmail = submittedByEmail; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }

    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }

    public LocalDateTime getDeniedAt() { return deniedAt; }
    public void setDeniedAt(LocalDateTime deniedAt) { this.deniedAt = deniedAt; }

    public String getDeniedBy() { return deniedBy; }
    public void setDeniedBy(String deniedBy) { this.deniedBy = deniedBy; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public String getQrCode() { return qrCode; }
    public void setQrCode(String qrCode) { this.qrCode = qrCode; }
}
