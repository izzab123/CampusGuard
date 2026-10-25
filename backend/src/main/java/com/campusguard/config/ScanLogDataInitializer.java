package com.campusguard.config;

import com.campusguard.model.ScanLog;
import com.campusguard.repository.ScanLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class ScanLogDataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(ScanLogDataInitializer.class);

    private final ScanLogRepository scanLogRepo;

    public ScanLogDataInitializer(ScanLogRepository scanLogRepo) {
        this.scanLogRepo = scanLogRepo;
    }

    @Override
    public void run(String... args) {
        if (scanLogRepo.count() == 0) {
            logger.info("Seeding initial Gate, RFID, and Credential Scan Logs...");
            LocalDateTime now = LocalDateTime.now();

            ScanLog s1 = new ScanLog(
                    now.minusMinutes(14),
                    "RFID_GATE_BARRIER",
                    "North Gate Checkpoint - Barrier 04",
                    "Plate #7XYZ-42",
                    "Prof. Arthur Henderson",
                    "GRANTED",
                    "Automated Sentinel Radar",
                    "Faculty RFID tag auto-verified; hydraulic barrier actuated."
            );

            ScanLog s2 = new ScanLog(
                    now.minusHours(1).minusMinutes(22),
                    "QR_VISITOR_PASS",
                    "South Perimeter Station - Gate 03",
                    "Pass #CG-PASS-4F8B2",
                    "Visitor Marcus Vance",
                    "GRANTED",
                    "Officer David Chen",
                    "Visitor pass QR scanned & verified. Cleared for Science Quad."
            );

            ScanLog s3 = new ScanLog(
                    now.minusHours(3).minusMinutes(10),
                    "VEHICLE_LPR_SCANNER",
                    "North Gate Checkpoint - Barrier 04",
                    "Plate #UNREG-991",
                    "Commercial Delivery Van",
                    "DENIED",
                    "Officer Marcus Vance",
                    "Commercial delivery van without active RFID tag. Diverted to inspection bay."
            );

            ScanLog s4 = new ScanLog(
                    now.minusHours(5).minusMinutes(40),
                    "STUDENT_ID_SCANNER",
                    "Central Library Turnstile Lane 2",
                    "Student #ST-9021",
                    "Sarah Jenkins",
                    "GRANTED",
                    "Automated Turnstile",
                    "Active student semester card optical scan verified."
            );

            ScanLog s5 = new ScanLog(
                    now.minusDays(1).withHour(8).withMinute(15),
                    "BIOMETRIC_SENTRY_SCAN",
                    "South Perimeter Station - Gate 03",
                    "Badge #3910",
                    "Officer David Chen",
                    "GRANTED",
                    "Gate 03 Sentry Terminal",
                    "Morning watch sentry biometric watch authentication successful."
            );

            ScanLog s6 = new ScanLog(
                    now.minusDays(1).withHour(14).withMinute(30),
                    "QR_VISITOR_PASS",
                    "Science Quad Sentry Gate",
                    "Guest Token #GST-8812",
                    "Dr. Elena Rostova Guest",
                    "GRANTED",
                    "Officer Kevin Patel",
                    "Temporary research seminar attendee guest token scanned and cleared."
            );

            ScanLog s7 = new ScanLog(
                    now.minusDays(2).withHour(11).withMinute(5),
                    "VEHICLE_LPR_SCANNER",
                    "East Campus Loading Dock - Gate 06",
                    "Plate #COMM-410",
                    "Liquid Logistics Transport",
                    "FLAGGED_SECURITY",
                    "Officer Tariq Mansoor",
                    "Hazardous cargo placard identified; temporary dock lockdown initiated."
            );

            ScanLog s8 = new ScanLog(
                    now.minusDays(3).withHour(9).withMinute(45),
                    "STUDENT_ID_SCANNER",
                    "Residence Hall West Portal",
                    "Student #ST-4412",
                    "Michael Rodriguez",
                    "GRANTED",
                    "Automated Portal Scanner",
                    "Dormitory perimeter biometric/RFID tap authorized."
            );

            ScanLog s9 = new ScanLog(
                    now.minusDays(4).withHour(19).withMinute(20),
                    "RFID_GATE_BARRIER",
                    "South Perimeter Station - Gate 03",
                    "Plate #FAC-8123",
                    "Dean of Students Liaison",
                    "GRANTED",
                    "Automated Sentinel Radar",
                    "Executive faculty parking pass authorized; barrier raised."
            );

            ScanLog s10 = new ScanLog(
                    now.minusDays(5).withHour(22).withMinute(10),
                    "QR_VISITOR_PASS",
                    "North Gate Checkpoint - Barrier 04",
                    "Pass #CG-EXPIRED-01",
                    "Late Night Courier",
                    "DENIED",
                    "Officer Marcus Vance",
                    "Pass validity expired at 20:00; access denied by gate sentinel."
            );

            scanLogRepo.saveAll(List.of(s1, s2, s3, s4, s5, s6, s7, s8, s9, s10));
            logger.info("Successfully seeded 10 scan logs.");
        }
    }
}
