package com.campusguard.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/features")
public class FeatureController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> getFeaturesData() {
        Map<String, Object> response = new HashMap<>();

        response.put("badge", "CAMPUSGUARD CAPABILITIES & PLATFORM ARCHITECTURE");
        response.put("heroTitle", "Everything You Need in One Place");
        response.put("heroDescription", "A unified, institutional safety ecosystem engineered for modern universities. Seamlessly connect students, patrol officers, shift supervisors, and campus security officers discharge under a single verified umbrella.");

        response.put("sectionTag", "COMPREHENSIVE DISPATCH MODULES");
        response.put("sectionTitle", "Engineered for High-Density Campus Environments");
        response.put("sectionSubtitle", "Every module integrates directly with existing legacy campus physical infrastructure, central PBX phone lines, and institutional active directory accounts.");

        List<Map<String, Object>> modules = List.of(
            Map.of(
                "id", "safe-walk-escort",
                "title", "Instant Safe Walk Escort Dispatch",
                "description", "On-demand vetted student safety escorts, officer telemetry, and estimated arrival times under 6 minutes across all campus quadrants and parking decks.",
                "badgeText", "14 Active Units on Patrol",
                "badgeType", "blue",
                "iconType", "escort"
            ),
            Map.of(
                "id", "incident-triage",
                "title", "Real-Time Incident Intake & Triage",
                "description", "Multi-category reporting pipeline for suspicious vehicles, facility hazards, and welfare checks with anonymous submission toggles and immediate Campus Police NOC routing.",
                "badgeText", "Priority 1 Callout Support",
                "badgeType", "red",
                "iconType", "alert"
            ),
            Map.of(
                "id", "shift-handoff",
                "title", "Security Guard Roster & Shift Handoff",
                "description", "End-to-end command logging, post assignments, tamper-evident digital shift logs, and instant incident escalation protocols for field security personnel.",
                "badgeText", "Immutable Security Audit Trail",
                "badgeType", "blue",
                "iconType", "roster"
            )
        );

        response.put("modules", modules);

        Map<String, Object> cta = Map.of(
            "title", "Ready to Secure Your Campus Community?",
            "description", "Join leading academic institutions utilizing CampusGuard for unified physical safety, rapid emergency dispatch, and credential management.",
            "buttonText", "Contact Security Office",
            "supportText", "24/7 dedicated support"
        );
        response.put("cta", cta);

        return ResponseEntity.ok(response);
    }
}
