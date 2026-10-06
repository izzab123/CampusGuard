package com.campusguard.controller;

import com.campusguard.model.AuditLog;
import com.campusguard.repository.AuditLogRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    private final AuditLogRepository auditLogRepo;

    public AuditLogController(AuditLogRepository auditLogRepo) {
        this.auditLogRepo = auditLogRepo;
    }

    @GetMapping
    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepo.findAllByOrderByTimestampDesc();
    }

    @PostMapping
    public ResponseEntity<AuditLog> createAuditLog(@RequestBody AuditLog log) {
        if (log.getTimestamp() == null) {
            log.setTimestamp(LocalDateTime.now());
        }
        if (log.getSeverity() == null) {
            log.setSeverity("INFO");
        }
        AuditLog saved = auditLogRepo.save(log);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
}
