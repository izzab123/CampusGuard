package com.campusguard.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "parking_passes")
public class ParkingPass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String plateNumber;

    @Column(nullable = false, unique = true)
    private String passToken; // Dynamic QR hash token

    private String zoneName; // Zone A, Faculty Lot, Visitor Bay

    private String ownerName;

    private String ownerType; // STUDENT, FACULTY, VISITOR

    private LocalDateTime issuedAt;

    private LocalDateTime validUntil;

    private String status; // ACTIVE, EXPIRED, REVOKED

    public ParkingPass() {
        this.issuedAt = LocalDateTime.now();
        this.validUntil = LocalDateTime.now().plusHours(12);
        this.status = "ACTIVE";
    }

    public ParkingPass(String plateNumber, String passToken, String zoneName, String ownerName, String ownerType) {
        this();
        this.plateNumber = plateNumber;
        this.passToken = passToken;
        this.zoneName = zoneName;
        this.ownerName = ownerName;
        this.ownerType = ownerType;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPlateNumber() { return plateNumber; }
    public void setPlateNumber(String plateNumber) { this.plateNumber = plateNumber; }

    public String getPassToken() { return passToken; }
    public void setPassToken(String passToken) { this.passToken = passToken; }

    public String getZoneName() { return zoneName; }
    public void setZoneName(String zoneName) { this.zoneName = zoneName; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getOwnerType() { return ownerType; }
    public void setOwnerType(String ownerType) { this.ownerType = ownerType; }

    public LocalDateTime getIssuedAt() { return issuedAt; }
    public void setIssuedAt(LocalDateTime issuedAt) { this.issuedAt = issuedAt; }

    public LocalDateTime getValidUntil() { return validUntil; }
    public void setValidUntil(LocalDateTime validUntil) { this.validUntil = validUntil; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
