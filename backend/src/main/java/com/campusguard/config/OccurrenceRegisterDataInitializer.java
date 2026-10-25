package com.campusguard.config;

import com.campusguard.model.OccurrenceRecord;
import com.campusguard.model.OccurrenceRemark;
import com.campusguard.repository.OccurrenceRecordRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class OccurrenceRegisterDataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(OccurrenceRegisterDataInitializer.class);

    private final OccurrenceRecordRepository recordRepository;

    public OccurrenceRegisterDataInitializer(OccurrenceRecordRepository recordRepository) {
        this.recordRepository = recordRepository;
    }

    @Override
    public void run(String... args) {
        if (recordRepository.count() < 6) {
            logger.info("Seeding Official Occurrence Register records...");
            recordRepository.deleteAll();

            LocalDate today = LocalDate.now();

            // Entry 1: No-Show Today (David Chen)
            OccurrenceRecord rec1 = new OccurrenceRecord(
                    today,
                    "Officer David Chen",
                    "Shield #3910",
                    "EVENING",
                    "South Perimeter Station - Gate 03",
                    "NO_SHOW",
                    "HIGH",
                    "Unreported Duty Absence - Gate 03 Evening Watch",
                    "Officer David Chen failed to report on time for assigned watch duty at South Perimeter Station. Station unstaffed for 30 minutes with zero biometric check-in recorded. Grace period exceeded. Automated surveillance triggered sentinel alert."
            );
            rec1.setGuardEmail("d.chen@campusguard.edu");
            rec1.setSource("AUTOMATED_SENTINEL_RADAR");
            rec1.setCreatedAt(LocalDateTime.now().minusHours(2));

            OccurrenceRemark rem1 = new OccurrenceRemark(
                    null,
                    "Supervisor Elena Rostova",
                    "SS-104",
                    "Shift Supervisor",
                    "supervisor@campusguard.edu",
                    "Contacted officer by cellular phone; officer cited mechanical vehicle breakdown on transit corridor. Standby relief officer Brooks dispatched for station coverage."
            );
            rem1.setCreatedAt(LocalDateTime.now().minusHours(1).minusMinutes(30));
            rec1.addRemark(rem1);

            // Entry 2: Notable Event Today (Marcus Vance)
            OccurrenceRecord rec2 = new OccurrenceRecord(
                    today,
                    "Officer Marcus Vance",
                    "Shield #4082",
                    "MORNING",
                    "North Gate Checkpoint - Barrier 04",
                    "NOTABLE_EVENT",
                    "CRITICAL",
                    "Unauthorized Barrier Breach Attempt",
                    "Commercial delivery van attempted to bypass vehicle barrier without scanned RFID tag or digital guest credential. Hydraulic barrier obstacle deployed. Officer Marcus Vance intercepted the vehicle and directed it to the secondary inspection bay."
            );
            rec2.setGuardEmail("guard@campusguard.edu");
            rec2.setSource("FIELD_SENTINEL_INTERCEPTION");
            rec2.setCreatedAt(LocalDateTime.now().minusHours(4));

            OccurrenceRemark rem2 = new OccurrenceRemark(
                    null,
                    "Supervisor Elena Rostova",
                    "SS-104",
                    "Shift Supervisor",
                    "supervisor@campusguard.edu",
                    "Driver verified as third-party contractor without active registration. Facilities liaison notified to update authorized fleet database."
            );
            rem2.setCreatedAt(LocalDateTime.now().minusHours(3));
            rec2.addRemark(rem2);

            // Entry 3: No-Show Yesterday (Robert Hayes)
            OccurrenceRecord rec3 = new OccurrenceRecord(
                    today.minusDays(1),
                    "Officer Robert Hayes",
                    "Shield #4105",
                    "MORNING",
                    "North Gate Barrier 04 - Vehicle Sentry",
                    "NO_SHOW",
                    "HIGH",
                    "Morning Watch Sentry No-Show",
                    "Officer Robert Hayes failed to report for 08:00 morning shift at Barrier 04. Automated surveillance flagged delay exceeding 15 minutes grace period. Absence recorded as unexcused."
            );
            rec3.setGuardEmail("r.hayes@campusguard.edu");
            rec3.setSource("AUTOMATED_SENTINEL_RADAR");
            rec3.setCreatedAt(LocalDateTime.now().minusDays(1).withHour(8).withMinute(20));

            // Entry 4: Notable Event Yesterday (Sarah Jenkins)
            OccurrenceRecord rec4 = new OccurrenceRecord(
                    today.minusDays(1),
                    "Officer Sarah Jenkins",
                    "Shield #4120",
                    "EVENING",
                    "Central Library & Student Plaza",
                    "NOTABLE_EVENT",
                    "MEDIUM",
                    "Power Surge & Optical Turnstile Sensor Trip",
                    "Localized electrical surge temporarily disabled optical sensors on Library turnstile lane 2. Officer Jenkins implemented manual credential check protocol until facilities electricians reset the breaker."
            );
            rec4.setGuardEmail("s.jenkins@campusguard.edu");
            rec4.setSource("STATION_LOG_ENTRY");
            rec4.setCreatedAt(LocalDateTime.now().minusDays(1).withHour(18).withMinute(45));

            OccurrenceRemark rem4 = new OccurrenceRemark(
                    null,
                    "Supervisor Elena Rostova",
                    "SS-104",
                    "Shift Supervisor",
                    "supervisor@campusguard.edu",
                    "Facilities confirmed sensor calibration nominal at 19:30. No security breaches occurred during manual screening."
            );
            rem4.setCreatedAt(LocalDateTime.now().minusDays(1).withHour(19).withMinute(40));
            rec4.addRemark(rem4);

            // Entry 5: Notable Event 3 days ago (Tariq Mansoor)
            OccurrenceRecord rec5 = new OccurrenceRecord(
                    today.minusDays(3),
                    "Officer Tariq Mansoor",
                    "Shield #GD-201",
                    "NIGHT",
                    "East Campus Loading Dock",
                    "NOTABLE_EVENT",
                    "CRITICAL",
                    "Hazardous Material Transport Inspection Lockdown",
                    "Unscheduled liquid chemical transport arrived after dock closure. Gate 06 placed on temporary security lockdown while officer cross-checked transport bill of lading with Environmental Health & Safety."
            );
            rec5.setGuardEmail("t.mansoor@campusguard.edu");
            rec5.setSource("CENTRAL_DISPATCH_NOC");
            rec5.setCreatedAt(LocalDateTime.now().minusDays(3).withHour(23).withMinute(15));

            OccurrenceRemark rem5 = new OccurrenceRemark(
                    null,
                    "Supervisor Elena Rostova",
                    "SS-104",
                    "Shift Supervisor",
                    "supervisor@campusguard.edu",
                    "EHS On-Call Officer Dr. Chen cleared the transport after inspecting containment seals. Entry logged in master hazardous delivery ledger."
            );
            rem5.setCreatedAt(LocalDateTime.now().minusDays(3).withHour(23).withMinute(55));
            rec5.addRemark(rem5);

            // Entry 6: No-Show 5 days ago (Kevin Patel)
            OccurrenceRecord rec6 = new OccurrenceRecord(
                    today.minusDays(5),
                    "Officer Kevin Patel",
                    "Shield #GD-210",
                    "EVENING",
                    "Science & Engineering Quad",
                    "NO_SHOW",
                    "HIGH",
                    "Unattended Post Alert - Science Quad",
                    "Scheduled sentinel Kevin Patel failed to log biometric check-in by 14:30. Sentry post unstaffed during peak student class transition. Radar triggered immediate supervisor alert."
            );
            rec6.setGuardEmail("k.patel@campusguard.edu");
            rec6.setSource("AUTOMATED_SENTINEL_RADAR");
            rec6.setCreatedAt(LocalDateTime.now().minusDays(5).withHour(14).withMinute(30));

            recordRepository.saveAll(List.of(rec1, rec2, rec3, rec4, rec5, rec6));
            logger.info("Official Occurrence Register initialized with 6 records.");
        }
    }
}
