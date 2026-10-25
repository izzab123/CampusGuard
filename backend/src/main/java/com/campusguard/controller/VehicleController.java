package com.campusguard.controller;

import com.campusguard.dto.VehicleRegistrationRequest;
import com.campusguard.model.VehicleRegistration;
import com.campusguard.service.VehicleRegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleRegistrationService vehicleService;

    public VehicleController(VehicleRegistrationService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerVehicle(@Valid @RequestBody VehicleRegistrationRequest request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(err -> errors.put(err.getField(), err.getDefaultMessage()));
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Validation failed",
                    "details", errors,
                    "message", errors.values().iterator().next()
            ));
        }

        try {
            VehicleRegistration created = vehicleService.registerVehicle(request);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Registration error",
                    "message", ex.getMessage()
            ));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "error", "Internal error",
                    "message", "Unable to register vehicle: " + ex.getMessage()
            ));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<VehicleRegistration>> getMyVehicles(
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "studentId", required = false) String studentId) {
        return ResponseEntity.ok(vehicleService.getMyRegistrations(email, studentId));
    }

    @GetMapping
    public ResponseEntity<List<VehicleRegistration>> getAllVehicles(
            @RequestParam(value = "status", required = false) String status) {
        return ResponseEntity.ok(vehicleService.getAllRegistrations(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVehicleById(@PathVariable Long id) {
        return vehicleService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<?> approveVehiclePatch(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String approvedBy = body != null ? body.get("approvedBy") : null;
        try {
            VehicleRegistration approved = vehicleService.approveRegistration(id, approvedBy);
            return ResponseEntity.ok(approved);
        } catch (NoSuchElementException ex) {
            return ResponseEntity.notFound().build();
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Approval failed",
                    "message", ex.getMessage()
            ));
        }
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveVehiclePost(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        return approveVehiclePatch(id, body);
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkAvailability(@RequestParam("vehicleNumber") String vehicleNumber) {
        boolean available = vehicleService.isVehicleNumberAvailable(vehicleNumber);
        return ResponseEntity.ok(Map.of(
                "vehicleNumber", vehicleNumber,
                "available", available,
                "message", available ? "Vehicle number is available" : "The same vehicle number cannot be registered twice."
        ));
    }
}
