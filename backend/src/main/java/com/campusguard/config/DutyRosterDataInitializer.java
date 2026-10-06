package com.campusguard.config;

import com.campusguard.model.DutyRoster;
import com.campusguard.repository.DutyRosterRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

@Configuration
public class DutyRosterDataInitializer implements CommandLineRunner {

    private final DutyRosterRepository dutyRosterRepository;

    public DutyRosterDataInitializer(DutyRosterRepository dutyRosterRepository) {
        this.dutyRosterRepository = dutyRosterRepository;
    }

    @Override
    public void run(String... args) {
        if (dutyRosterRepository.count() == 0) {
            LocalDate today = LocalDate.now();

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
            shift2.setRelieverBadgeNumber("REL-304");
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
    }
}
