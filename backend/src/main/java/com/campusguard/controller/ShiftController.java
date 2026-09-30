package com.campusguard.controller;

import com.campusguard.model.ShiftLog;
import com.campusguard.repository.ShiftLogRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/shifts")
public class ShiftController {

    private final ShiftLogRepository shiftRepo;

    public ShiftController(ShiftLogRepository shiftRepo) {
        this.shiftRepo = shiftRepo;
    }

    @GetMapping
    public List<ShiftLog> getShifts() {
        return shiftRepo.findAll();
    }

    @PostMapping("/check-in")
    public ResponseEntity<ShiftLog> checkIn(@RequestBody ShiftLog shift) {
        shift.setShiftStart(LocalDateTime.now());
        shift.setStatus("ON_DUTY");
        shift.setBiometricVerified(true);
        ShiftLog saved = shiftRepo.save(shift);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PostMapping("/{id}/escalate")
    public ResponseEntity<ShiftLog> escalateNoShow(@PathVariable Long id) {
        return shiftRepo.findById(id).map(shift -> {
            shift.setStatus("ESCALATED");
            shift.setNotes((shift.getNotes() != null ? shift.getNotes() + " | " : "") + "Automatic no-show escalation triggered after 15 min unstaffed.");
            return ResponseEntity.ok(shiftRepo.save(shift));
        }).orElse(ResponseEntity.notFound().build());
    }
}
