package com.campusguard.controller;

import com.campusguard.model.ParkingPass;
import com.campusguard.repository.ParkingPassRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/parking")
public class ParkingController {

    private final ParkingPassRepository passRepo;

    public ParkingController(ParkingPassRepository passRepo) {
        this.passRepo = passRepo;
    }

    @GetMapping("/passes")
    public List<ParkingPass> getAllPasses() {
        return passRepo.findAllByOrderByIssuedAtDesc();
    }

    @GetMapping("/passes/my")
    public ResponseEntity<ParkingPass> getMyPass(@RequestParam(value = "owner", required = false) String owner) {
        if (owner != null && !owner.isBlank()) {
            List<ParkingPass> passes = passRepo.findByOwnerNameIgnoreCase(owner.trim());
            if (!passes.isEmpty()) {
                return ResponseEntity.ok(passes.get(0));
            }
        }
        // Fallback to latest active pass
        List<ParkingPass> all = passRepo.findAllByOrderByIssuedAtDesc();
        return all.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(all.get(0));
    }

    @PostMapping("/passes")
    public ResponseEntity<ParkingPass> createPass(@RequestBody ParkingPass pass) {
        if (pass.getPassToken() == null || pass.getPassToken().isBlank()) {
            pass.setPassToken("CG-PASS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        pass.setIssuedAt(LocalDateTime.now());
        if (pass.getValidUntil() == null) {
            pass.setValidUntil(LocalDateTime.now().plusMonths(6));
        }
        if (pass.getStatus() == null) {
            pass.setStatus("ACTIVE");
        }
        ParkingPass saved = passRepo.save(pass);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPass(@RequestBody Map<String, String> request) {
        String query = request.getOrDefault("query", "").trim();
        if (query.isEmpty()) {
            query = request.getOrDefault("plate", "").trim();
        }
        if (query.isEmpty()) {
            query = request.getOrDefault("token", "").trim();
        }

        Optional<ParkingPass> byToken = passRepo.findByPassToken(query);
        if (byToken.isPresent()) {
            ParkingPass p = byToken.get();
            return ResponseEntity.ok(Map.of(
                    "verified", true,
                    "status", p.getStatus(),
                    "plateNumber", p.getPlateNumber(),
                    "ownerName", p.getOwnerName() != null ? p.getOwnerName() : "Unknown",
                    "zoneName", p.getZoneName() != null ? p.getZoneName() : "Lot C",
                    "validUntil", p.getValidUntil().toString()
            ));
        }

        Optional<ParkingPass> byPlate = passRepo.findByPlateNumber(query);
        if (byPlate.isPresent()) {
            ParkingPass p = byPlate.get();
            return ResponseEntity.ok(Map.of(
                    "verified", true,
                    "status", p.getStatus(),
                    "plateNumber", p.getPlateNumber(),
                    "ownerName", p.getOwnerName() != null ? p.getOwnerName() : "Unknown",
                    "zoneName", p.getZoneName() != null ? p.getZoneName() : "Lot C",
                    "validUntil", p.getValidUntil().toString()
            ));
        }

        return ResponseEntity.ok(Map.of(
                "verified", false,
                "status", "NOT_FOUND",
                "message", "No active clearance pass registered for " + query
        ));
    }
}
