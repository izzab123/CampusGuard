package com.campusguard.config;

import com.campusguard.model.*;
import com.campusguard.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class UserDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(UserDataSeeder.class);

    @Bean
    public CommandLineRunner seedData(
            UserRepository userRepository,
            ParkingPassRepository parkingRepo,
            IncidentReportRepository incidentRepo,
            ShiftLogRepository shiftRepo,
            AuditLogRepository auditRepo,
            NotificationRepository notificationRepo) {
        return args -> {
            logger.info("Initializing CampusGuard Database Records...");

            // 1. SEED USERS
            List<User> seedUsers = List.of(
                new User("student@campusguard.edu", "12345678", "Student", "Alex Morgan", "#STU-88201", "Dept. of Computer Science & Eng."),
                new User("proctor@campusguard.edu", "12345678", "Proctor and DSW", "Dr. Arthur Vance", "DSW Executive Dean #PR-109", "Dean of Student Welfare"),
                new User("guard@campusguard.edu", "12345678", "Security Guard", "Officer Marcus Vance", "Shield #4082", "Campus Security Division"),
                new User("supervisor@campusguard.edu", "12345678", "Shift Supervisor", "Supervisor Elena Rostova", "Badge #SS-104", "Operations Dispatch Control"),
                new User("admin@campusguard.edu", "12345678", "Admin", "System Administrator", "Root Admin #ADM-001", "Institutional Security IT"),
                new User("d.chen@campusguard.edu", "12345678", "Security Guard", "Officer David Chen", "Shield #3910", "Campus Security Division"),
                new User("s.jenkins@campusguard.edu", "12345678", "Security Guard", "Officer Sarah Jenkins", "Shield #4120", "Perimeter Response Squad")
            );

            for (User user : seedUsers) {
                userRepository.findByEmailIgnoreCase(user.getEmail()).ifPresentOrElse(
                    existing -> {
                        existing.setPassword(user.getPassword());
                        existing.setRole(user.getRole());
                        existing.setFullName(user.getFullName());
                        existing.setBadgeNumber(user.getBadgeNumber());
                        existing.setDepartment(user.getDepartment());
                        existing.setStatus("ACTIVE");
                        userRepository.save(existing);
                    },
                    () -> {
                        user.setStatus("ACTIVE");
                        userRepository.save(user);
                    }
                );
            }

            // 2. SEED PARKING PASSES
            if (parkingRepo.count() == 0) {
                ParkingPass pass1 = new ParkingPass(
                        "7XYZ-42",
                        "CG-PASS-88201-ALX",
                        "Lot C • Deck #314",
                        "Alex Morgan",
                        "STUDENT"
                );
                pass1.setStatus("ACTIVE");

                ParkingPass pass2 = new ParkingPass(
                        "FAC-9912",
                        "CG-PASS-109-VANCE",
                        "Faculty Lot A • Bay 12",
                        "Dr. Arthur Vance",
                        "FACULTY"
                );
                pass2.setStatus("ACTIVE");

                ParkingPass pass3 = new ParkingPass(
                        "PATROL-04",
                        "CG-PASS-4082-GUARD",
                        "Service Dock & Patrol Bay 2",
                        "Officer Marcus Vance",
                        "STAFF"
                );
                pass3.setStatus("ACTIVE");

                parkingRepo.saveAll(List.of(pass1, pass2, pass3));
                logger.info("Seeded initial parking passes.");
            }

            // 3. SEED INCIDENTS
            if (incidentRepo.count() == 0) {
                IncidentReport inc1 = new IncidentReport(
                        "Suspicious Package Reported Near West Quad Library",
                        "Unattended black rucksack placed on exterior bench near East portico stairs.",
                        "HIGH",
                        "West Quad Library - Exterior Portico",
                        "PROCTOR_AND_DSW",
                        "Alex Morgan",
                        "Student"
                );
                inc1.setStatus("IN_TRIAGE");
                inc1.setCreatedAt(LocalDateTime.now().minusMinutes(42));

                IncidentReport inc2 = new IncidentReport(
                        "Barrier Gate 04 Sensor Calibration Warning",
                        "Optical beam obstacle sensor intermittently registering false obstructions during peak flow.",
                        "MEDIUM",
                        "North Gate Barrier 04",
                        "CENTRAL_DISPATCH",
                        "Officer Marcus Vance",
                        "Security Guard"
                );
                inc2.setStatus("DISPATCHED");
                inc2.setCreatedAt(LocalDateTime.now().minusHours(2));

                IncidentReport inc3 = new IncidentReport(
                        "Safe Walk Campus Night Escort Completed",
                        "Officer Jenkins safely escorted student from Science Library to West Residence Hall B.",
                        "LOW",
                        "Science Library to Hall B",
                        "CENTRAL_DISPATCH",
                        "Officer Sarah Jenkins",
                        "Security Guard"
                );
                inc3.setStatus("RESOLVED");
                inc3.setCreatedAt(LocalDateTime.now().minusHours(5));
                inc3.setResolvedAt(LocalDateTime.now().minusHours(4));

                incidentRepo.saveAll(List.of(inc1, inc2, inc3));
                logger.info("Seeded initial incident reports.");
            }

            // 4. SEED SHIFTS
            if (shiftRepo.count() == 0) {
                ShiftLog s1 = new ShiftLog(
                        "Officer Marcus Vance",
                        "Shield #4082",
                        "North Perimeter & Main Gate",
                        true,
                        "Radio check cleared. Barrier automation operational."
                );
                s1.setStatus("ON_DUTY");
                s1.setShiftStart(LocalDateTime.now().minusHours(3));

                ShiftLog s2 = new ShiftLog(
                        "Officer Sarah Jenkins",
                        "Shield #4120",
                        "West Quad Residence & Library Patrol",
                        true,
                        "Conducting foot patrol across residence walkways."
                );
                s2.setStatus("ON_DUTY");
                s2.setShiftStart(LocalDateTime.now().minusHours(2));

                ShiftLog s3 = new ShiftLog(
                        "Officer David Chen",
                        "Shield #3910",
                        "South Perimeter Inspection Station",
                        false,
                        "Shift handover pending biometric swipe."
                );
                s3.setStatus("SCHEDULED");
                s3.setShiftStart(LocalDateTime.now().plusHours(1));

                shiftRepo.saveAll(List.of(s1, s2, s3));
                logger.info("Seeded initial shift logs.");
            }

            // 5. SEED AUDIT LOGS
            if (auditRepo.count() == 0) {
                AuditLog log1 = new AuditLog(
                        "ROOT_AUTHENTICATION_SUCCESS",
                        "Administrator established MFA-enforced governance session from subnet 10.14.0.12",
                        "System Administrator",
                        "Admin",
                        "10.14.0.12",
                        "INFO"
                );
                log1.setTimestamp(LocalDateTime.now().minusMinutes(12));

                AuditLog log2 = new AuditLog(
                        "PERMIT_SCAN_AUTOMATED",
                        "Plate 7XYZ-42 auto-verified at Gate 04 RFID scanner. Barrier lifted.",
                        "North Gate Telemetry",
                        "Security System",
                        "10.14.2.1",
                        "INFO"
                );
                log2.setTimestamp(LocalDateTime.now().minusMinutes(35));

                AuditLog log3 = new AuditLog(
                        "HIGH_SEVERITY_INCIDENT_ESCALATION",
                        "Incident #1 routed automatically to Proctor & DSW Dean's triage queue.",
                        "Dispatch Automated Rules",
                        "System Dispatch",
                        "10.14.0.1",
                        "WARNING"
                );
                log3.setTimestamp(LocalDateTime.now().minusMinutes(42));

                auditRepo.saveAll(List.of(log1, log2, log3));
                logger.info("Seeded initial audit logs.");
            }

            // 6. SEED NOTIFICATIONS
            if (notificationRepo.count() == 0) {
                Notification n1 = new Notification(
                        "ALL",
                        null,
                        "Campus Safety Advisory",
                        "Perimeter security systems operating nominally across North and West zones.",
                        "SYSTEM",
                        "LOW"
                );
                Notification n2 = new Notification(
                        "Proctor and DSW",
                        "proctor@campusguard.edu",
                        "New High-Severity Incident In Triage Queue",
                        "Suspicious package report requires review and administrative routing.",
                        "DISPATCH",
                        "HIGH"
                );
                Notification n3 = new Notification(
                        "Security Guard",
                        "guard@campusguard.edu",
                        "Shift Protocol Notice: Gate 04 Check",
                        "Please verify optical sensors at Barrier 04 during regular patrol loop.",
                        "NOTICE",
                        "MEDIUM"
                );
                Notification n4 = new Notification(
                        "Student",
                        "student@campusguard.edu",
                        "Active Parking Pass Validated",
                        "Your pass for Lot C is active and synchronized with mobile QR pass.",
                        "CLEARANCE",
                        "LOW"
                );
                notificationRepo.saveAll(List.of(n1, n2, n3, n4));
                logger.info("Seeded initial notifications.");
            }

            logger.info("CampusGuard Database initialization complete.");
        };
    }
}
