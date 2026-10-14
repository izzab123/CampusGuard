package com.campusguard.config;

import com.campusguard.model.DutyRoster;
import com.campusguard.repository.DutyRosterRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class DutyRosterDataInitializer implements CommandLineRunner {

    private final DutyRosterRepository dutyRosterRepository;

    public DutyRosterDataInitializer(DutyRosterRepository dutyRosterRepository) {
        this.dutyRosterRepository = dutyRosterRepository;
    }

    @Override
    public void run(String... args) {
        LocalDate today = LocalDate.now();

        // 1. Initial baseline seeding if empty
        if (dutyRosterRepository.count() == 0) {
            DutyRoster shift1 = new DutyRoster(
                    "Supervisor Sarah Connor",
                    "Officer Tariq Mansoor",
                    "GD-201",
                    "North Gate Checkpoint",
                    today,
                    "MORNING",
                    "06:00",
                    "14:00"
            );
            shift1.setSupervisorBadgeNumber("SUP-101");
            shift1.setRelieverName("Officer Ronald Cole");
            shift1.setRelieverBadgeNumber("REL-301");
            shift1.setRelieverStatus("ASSIGNED");
            shift1.setRelieverTimeSlot("11:30 - 12:30 (Lunch Break Relief)");
            shift1.setStatus("SCHEDULED");
            shift1.setPriority("NORMAL");
            shift1.setNotes("Verify vehicle RFID tags and visitor digital passes.");

            DutyRoster shift2 = new DutyRoster(
                    "Supervisor Sarah Connor",
                    "Officer Maya Lin",
                    "GD-204",
                    "Science & Engineering Quad",
                    today,
                    "MORNING",
                    "08:00",
                    "16:00"
            );
            shift2.setSupervisorBadgeNumber("SUP-101");
            shift2.setRelieverName("Officer Marcus Vance");
            shift2.setRelieverBadgeNumber("Shield #4082");
            shift2.setRelieverStatus("ASSIGNED");
            shift2.setRelieverTimeSlot("12:30 - 13:30 (Break Relief)");
            shift2.setStatus("ACTIVE");
            shift2.setPriority("HIGH");
            shift2.setNotes("Patrol research lab perimeter and monitor hazardous staging area.");

            DutyRoster shift3 = new DutyRoster(
                    "Supervisor David Clark",
                    "Officer Kevin Patel",
                    "GD-210",
                    "Central Library & Student Plaza",
                    today,
                    "EVENING",
                    "14:00",
                    "22:00"
            );
            shift3.setSupervisorBadgeNumber("SUP-104");
            shift3.setRelieverName("Officer Jasmine Brooks");
            shift3.setRelieverBadgeNumber("REL-308");
            shift3.setRelieverStatus("STANDBY");
            shift3.setRelieverTimeSlot("18:00 - 19:00 (Dinner Coverage)");
            shift3.setStatus("SCHEDULED");
            shift3.setPriority("NORMAL");
            shift3.setNotes("Monitor evening study room corridor and emergency blue-light poles.");

            DutyRoster shift4 = new DutyRoster(
                    "Supervisor David Clark",
                    "Officer Elena Rostova",
                    "GD-215",
                    "Residence Hall Quad B",
                    today,
                    "NIGHT",
                    "22:00",
                    "06:00"
            );
            shift4.setSupervisorBadgeNumber("SUP-104");
            shift4.setRelieverName("Officer Devonte Washington");
            shift4.setRelieverBadgeNumber("REL-312");
            shift4.setRelieverStatus("STANDBY");
            shift4.setRelieverTimeSlot("02:00 - 03:00 (Night Rest Relief)");
            shift4.setStatus("SCHEDULED");
            shift4.setPriority("NORMAL");
            shift4.setNotes("Dormitory exterior perimeter security and noise curfew compliance.");

            dutyRosterRepository.saveAll(List.of(shift1, shift2, shift3, shift4));
        }

        // 2. Ensure Officer Marcus Vance (default test guard account) has dedicated today duty and upcoming duties
        boolean hasMarcusDuties = dutyRosterRepository.findAll().stream()
                .anyMatch(r -> "guard@campusguard.edu".equalsIgnoreCase(r.getGuardEmail()) ||
                               (r.getGuardName() != null && r.getGuardName().contains("Marcus Vance")));

        if (!hasMarcusDuties) {
            List<DutyRoster> vanceShifts = new ArrayList<>();

            // Today's Duty - Main Gate
            DutyRoster todayVance = new DutyRoster(
                    "Supervisor Elena Rostova",
                    "Officer Marcus Vance",
                    "Shield #4082",
                    "Main North Gate & Barrier 04",
                    today,
                    "MORNING",
                    "08:00",
                    "16:00"
            );
            todayVance.setGuardEmail("guard@campusguard.edu");
            todayVance.setSupervisorBadgeNumber("Badge #SS-104");
            todayVance.setStatus("ACTIVE");
            todayVance.setPriority("HIGH");
            todayVance.setRelieverName("Officer David Chen");
            todayVance.setRelieverBadgeNumber("Shield #3910");
            todayVance.setRelieverStatus("ASSIGNED");
            todayVance.setRelieverTimeSlot("12:30 - 13:30 (Lunch Relief)");
            todayVance.setNotes("Lead gate checkpoint. Monitor RFID vehicle clearance, barrier sensors, and guest digital permits.");
            vanceShifts.add(todayVance);

            // Tomorrow - Gate 02
            DutyRoster tomorrowVance = new DutyRoster(
                    "Supervisor Elena Rostova",
                    "Officer Marcus Vance",
                    "Shield #4082",
                    "West Quad & Residence Gate 02",
                    today.plusDays(1),
                    "MORNING",
                    "08:00",
                    "16:00"
            );
            tomorrowVance.setGuardEmail("guard@campusguard.edu");
            tomorrowVance.setSupervisorBadgeNumber("Badge #SS-104");
            tomorrowVance.setStatus("CONFIRMED");
            tomorrowVance.setPriority("NORMAL");
            tomorrowVance.setRelieverName("Officer Sarah Jenkins");
            tomorrowVance.setRelieverBadgeNumber("Shield #4120");
            tomorrowVance.setRelieverStatus("ASSIGNED");
            tomorrowVance.setRelieverTimeSlot("12:00 - 13:00 (Break Coverage)");
            tomorrowVance.setNotes("West residential perimeter entrance. Verify student IDs and supervise delivery vehicle access.");
            vanceShifts.add(tomorrowVance);

            // Day after tomorrow (Today + 2) - Science & Engineering Gate
            DutyRoster day2Vance = new DutyRoster(
                    "Supervisor David Clark",
                    "Officer Marcus Vance",
                    "Shield #4082",
                    "Science & Engineering Complex Gate",
                    today.plusDays(2),
                    "EVENING",
                    "16:00",
                    "00:00"
            );
            day2Vance.setGuardEmail("guard@campusguard.edu");
            day2Vance.setSupervisorBadgeNumber("SUP-104");
            day2Vance.setStatus("SCHEDULED");
            day2Vance.setPriority("NORMAL");
            day2Vance.setNotes("Evening laboratory entrance control and hazardous materials staging bay security check.");
            vanceShifts.add(day2Vance);

            // In 4 days - Library Esplanade Gate
            DutyRoster day4Vance = new DutyRoster(
                    "Supervisor Elena Rostova",
                    "Officer Marcus Vance",
                    "Shield #4082",
                    "Central Library Esplanade Gate",
                    today.plusDays(4),
                    "NIGHT",
                    "00:00",
                    "08:00"
            );
            day4Vance.setGuardEmail("guard@campusguard.edu");
            day4Vance.setSupervisorBadgeNumber("Badge #SS-104");
            day4Vance.setStatus("SCHEDULED");
            day4Vance.setPriority("NORMAL");
            day4Vance.setNotes("Overnight perimeter patrol and emergency blue-light call station verification.");
            vanceShifts.add(day4Vance);

            // In 6 days - East Campus Logistics Gate
            DutyRoster day6Vance = new DutyRoster(
                    "Supervisor Elena Rostova",
                    "Officer Marcus Vance",
                    "Shield #4082",
                    "East Campus Delivery Gate 07",
                    today.plusDays(6),
                    "MORNING",
                    "08:00",
                    "16:00"
            );
            day6Vance.setGuardEmail("guard@campusguard.edu");
            day6Vance.setSupervisorBadgeNumber("Badge #SS-104");
            day6Vance.setStatus("SCHEDULED");
            day6Vance.setPriority("NORMAL");
            day6Vance.setNotes("Weekend logistics intake oversight, maintenance clearance verification, and perimeter fence walk.");
            vanceShifts.add(day6Vance);

            // Also seed upcoming duties for David Chen and Sarah Jenkins to confirm guard isolation
            DutyRoster chenDuty = new DutyRoster(
                    "Supervisor Elena Rostova",
                    "Officer David Chen",
                    "Shield #3910",
                    "South Perimeter Inspection Station",
                    today,
                    "EVENING",
                    "16:00",
                    "00:00"
            );
            chenDuty.setGuardEmail("d.chen@campusguard.edu");
            chenDuty.setSupervisorBadgeNumber("Badge #SS-104");
            chenDuty.setStatus("CONFIRMED");
            chenDuty.setNotes("Commercial transport inspection and RFID gate verification.");
            vanceShifts.add(chenDuty);

            DutyRoster jenkinsDuty = new DutyRoster(
                    "Supervisor Elena Rostova",
                    "Officer Sarah Jenkins",
                    "Shield #4120",
                    "Athletic Stadium West Gate",
                    today.plusDays(1),
                    "AFTERNOON",
                    "12:00",
                    "20:00"
            );
            jenkinsDuty.setGuardEmail("s.jenkins@campusguard.edu");
            jenkinsDuty.setSupervisorBadgeNumber("Badge #SS-104");
            jenkinsDuty.setStatus("SCHEDULED");
            jenkinsDuty.setNotes("Event setup credential checking and athletic gate access.");
            vanceShifts.add(jenkinsDuty);

            dutyRosterRepository.saveAll(vanceShifts);
        }
    }
}
