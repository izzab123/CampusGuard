package com.campusguard.controller;

import com.campusguard.model.DutyRoster;
import com.campusguard.repository.DutyRosterRepository;
import com.campusguard.service.DutyRosterService;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
public class DutyRosterControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private DutyRosterRepository dutyRosterRepository;

    @Autowired
    private com.campusguard.repository.DutyReassignmentHistoryRepository reassignmentRepository;

    @Autowired
    private com.campusguard.repository.NotificationRepository notificationRepository;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        objectMapper = new ObjectMapper();
        dutyRosterRepository.deleteAll();
        if (reassignmentRepository != null) {
            reassignmentRepository.deleteAll();
        }
        if (notificationRepository != null) {
            notificationRepository.deleteAll();
        }
    }

    @Test
    void supervisorCanScheduleNewShiftSuccessfully() throws Exception {
        String newShiftJson = """
                {
                    "supervisorName": "Supervisor David Clark",
                    "supervisorBadgeNumber": "SUP-104",
                    "guardName": "Officer James Wilson",
                    "guardBadgeNumber": "GD-302",
                    "postLocation": "South Perimeter Gate",
                    "dutyDate": "%s",
                    "shiftType": "MORNING",
                    "startTime": "06:00",
                    "endTime": "14:00",
                    "relieverName": "Officer Sarah Jen",
                    "relieverBadgeNumber": "REL-501",
                    "relieverStatus": "ASSIGNED",
                    "relieverTimeSlot": "10:30 - 11:30 (Morning Break Cover)",
                    "notes": "High vehicle inspection focus."
                }
                """.formatted(LocalDate.now().plusDays(1).toString());

        mockMvc.perform(post("/api/duty-roster")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(newShiftJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.supervisorName").value("Supervisor David Clark"))
                .andExpect(jsonPath("$.guardName").value("Officer James Wilson"))
                .andExpect(jsonPath("$.guardBadgeNumber").value("GD-302"))
                .andExpect(jsonPath("$.postLocation").value("South Perimeter Gate"))
                .andExpect(jsonPath("$.relieverName").value("Officer Sarah Jen"))
                .andExpect(jsonPath("$.relieverBadgeNumber").value("REL-501"))
                .andExpect(jsonPath("$.relieverStatus").value("ASSIGNED"))
                .andExpect(jsonPath("$.status").value("SCHEDULED"));
    }

    @Test
    void scheduleShiftWithSupervisorHeaders() throws Exception {
        String shiftJson = """
                {
                    "guardName": "Officer Lucas Vance",
                    "guardBadgeNumber": "GD-411",
                    "postLocation": "Main Quadrangle",
                    "shiftType": "MORNING"
                }
                """;

        mockMvc.perform(post("/api/duty-roster")
                        .header("X-Supervisor-Name", "Supervisor Sarah Connor")
                        .header("X-Supervisor-Badge", "SUP-101")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(shiftJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.supervisorName").value("Supervisor Sarah Connor"))
                .andExpect(jsonPath("$.supervisorBadgeNumber").value("SUP-101"))
                .andExpect(jsonPath("$.guardName").value("Officer Lucas Vance"))
                .andExpect(jsonPath("$.postLocation").value("Main Quadrangle"))
                .andExpect(jsonPath("$.status").value("SCHEDULED"));
    }

    @Test
    void scheduleShiftFailsWhenRequiredFieldsMissing() throws Exception {
        String invalidShiftJson = """
                {
                    "notes": "Missing guard name and post location"
                }
                """;

        mockMvc.perform(post("/api/duty-roster")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidShiftJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value(containsString("guard name is required")));
    }

    @Test
    void getDutyRosterReturnsAllScheduledShifts() throws Exception {
        DutyRoster shift1 = new DutyRoster("Supervisor Clark", "Guard Alpha", "GD-01", "North Gate", LocalDate.now(), "MORNING", "08:00", "16:00");
        shift1.setRelieverName("Reliever Alpha");
        shift1.setRelieverBadgeNumber("REL-01");
        dutyRosterRepository.save(shift1);

        DutyRoster shift2 = new DutyRoster("Supervisor Clark", "Guard Beta", "GD-02", "South Gate", LocalDate.now(), "EVENING", "16:00", "00:00");
        dutyRosterRepository.save(shift2);

        mockMvc.perform(get("/api/duty-roster"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].guardName", notNullValue()))
                .andExpect(jsonPath("$[1].guardName", notNullValue()));
    }

    @Test
    void scheduleShiftViaShiftsEndpoint() throws Exception {
        String shiftJson = """
                {
                    "supervisorName": "Supervisor Clark",
                    "guardName": "Guard Gamma",
                    "guardBadgeNumber": "GD-03",
                    "postLocation": "Library Gate",
                    "shiftType": "NIGHT",
                    "startTime": "00:00",
                    "endTime": "08:00"
                }
                """;

        mockMvc.perform(post("/api/shifts/schedule")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(shiftJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.guardName").value("Guard Gamma"))
                .andExpect(jsonPath("$.postLocation").value("Library Gate"));

        mockMvc.perform(get("/api/shifts/roster"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].guardName").value("Guard Gamma"));
    }

    @Test
    void updateRelieverAssignment() throws Exception {
        DutyRoster shift = new DutyRoster("Supervisor Clark", "Guard Delta", "GD-04", "Science Hub", LocalDate.now(), "MORNING", "08:00", "16:00");
        DutyRoster saved = dutyRosterRepository.save(shift);

        String patchJson = """
                {
                    "relieverName": "Officer Marcus Relief",
                    "relieverBadgeNumber": "REL-999",
                    "relieverStatus": "ASSIGNED",
                    "relieverTimeSlot": "12:00 - 13:00"
                }
                """;

        mockMvc.perform(patch("/api/duty-roster/" + saved.getId() + "/reliever")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(patchJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.relieverName").value("Officer Marcus Relief"))
                .andExpect(jsonPath("$.relieverBadgeNumber").value("REL-999"))
                .andExpect(jsonPath("$.relieverStatus").value("ASSIGNED"))
                .andExpect(jsonPath("$.relieverTimeSlot").value("12:00 - 13:00"));
    }

    @Test
    void updateShiftStatus() throws Exception {
        DutyRoster shift = new DutyRoster("Supervisor Clark", "Guard Epsilon", "GD-05", "Residence Quad", LocalDate.now(), "MORNING", "08:00", "16:00");
        DutyRoster saved = dutyRosterRepository.save(shift);

        String patchJson = "{\"status\": \"CONFIRMED\"}";

        mockMvc.perform(patch("/api/duty-roster/" + saved.getId() + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(patchJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
    }

    @Test
    void getRosterSummaryStatistics() throws Exception {
        DutyRoster shift = new DutyRoster("Supervisor Clark", "Guard Zeta", "GD-06", "Sports Center", LocalDate.now(), "MORNING", "08:00", "16:00");
        shift.setRelieverName("Reliever Zeta");
        dutyRosterRepository.save(shift);

        mockMvc.perform(get("/api/duty-roster/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rosterTitle").value("Guard Duty Schedule & Reliever Assignment Roster"))
                .andExpect(jsonPath("$.totalShifts").value(1))
                .andExpect(jsonPath("$.scheduledShifts").value(1))
                .andExpect(jsonPath("$.relieversAssignedCount").value(1))
                .andExpect(jsonPath("$.uniquePostsCovered").value(1));
    }

    @Test
    void guardCanViewOwnUpcomingRosterWithTodayAtTop() throws Exception {
        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);
        LocalDate nextWeek = today.plusDays(5);

        // Duty for Guard Marcus Vance today
        DutyRoster todayDuty = new DutyRoster("Supervisor Elena", "Officer Marcus Vance", "Shield #4082", "Main North Gate & Barrier 04", today, "MORNING", "08:00", "16:00");
        todayDuty.setGuardEmail("guard@campusguard.edu");
        todayDuty.setStatus("ACTIVE");
        dutyRosterRepository.save(todayDuty);

        // Upcoming duty for Marcus Vance tomorrow
        DutyRoster upcomingDuty1 = new DutyRoster("Supervisor Elena", "Officer Marcus Vance", "Shield #4082", "West Quad Gate 02", tomorrow, "MORNING", "08:00", "16:00");
        upcomingDuty1.setGuardEmail("guard@campusguard.edu");
        dutyRosterRepository.save(upcomingDuty1);

        // Another upcoming duty for Marcus Vance next week
        DutyRoster upcomingDuty2 = new DutyRoster("Supervisor Elena", "Officer Marcus Vance", "Shield #4082", "Library Gate", nextWeek, "NIGHT", "00:00", "08:00");
        upcomingDuty2.setGuardEmail("guard@campusguard.edu");
        dutyRosterRepository.save(upcomingDuty2);

        // Duty for another guard (David Chen)
        DutyRoster otherGuardDuty = new DutyRoster("Supervisor Elena", "Officer David Chen", "Shield #3910", "South Gate", tomorrow, "EVENING", "16:00", "00:00");
        otherGuardDuty.setGuardEmail("d.chen@campusguard.edu");
        dutyRosterRepository.save(otherGuardDuty);

        // Call /api/duty-roster/my-roster
        mockMvc.perform(get("/api/duty-roster/my-roster")
                        .header("X-User-Role", "Security Guard")
                        .header("X-User-Email", "guard@campusguard.edu")
                        .header("X-Guard-Badge", "Shield #4082")
                        .header("X-Guard-Name", "Officer Marcus Vance"))
                .andExpect(status().isOk())
                .andExpect(header().string("Cache-Control", containsString("no-cache")))
                .andExpect(jsonPath("$.hasTodayDuty").value(true))
                .andExpect(jsonPath("$.todayDuty.postLocation").value("Main North Gate & Barrier 04"))
                .andExpect(jsonPath("$.todayDuty.startTime").value("08:00"))
                .andExpect(jsonPath("$.todayDuty.endTime").value("16:00"))
                .andExpect(jsonPath("$.upcomingDuties", hasSize(2)))
                .andExpect(jsonPath("$.upcomingDuties[0].postLocation").value("West Quad Gate 02"))
                .andExpect(jsonPath("$.upcomingDuties[0].dutyDate").value(tomorrow.toString()))
                .andExpect(jsonPath("$.upcomingDuties[0].startTime").value("08:00"))
                .andExpect(jsonPath("$.upcomingDuties[1].postLocation").value("Library Gate"))
                .andExpect(jsonPath("$.allDuties", hasSize(3)))
                .andExpect(jsonPath("$.allDuties[0].postLocation").value("Main North Gate & Barrier 04")); // Today's duty at the top!
    }

    @Test
    void guardsCanAccessOnlyTheirOwnRosters() throws Exception {
        LocalDate today = LocalDate.now();

        DutyRoster vanceShift = new DutyRoster("Supervisor Elena", "Officer Marcus Vance", "Shield #4082", "North Gate", today, "MORNING", "08:00", "16:00");
        vanceShift.setGuardEmail("guard@campusguard.edu");
        dutyRosterRepository.save(vanceShift);

        DutyRoster chenShift = new DutyRoster("Supervisor Elena", "Officer David Chen", "Shield #3910", "South Gate", today, "EVENING", "16:00", "00:00");
        chenShift.setGuardEmail("d.chen@campusguard.edu");
        chenShift = dutyRosterRepository.save(chenShift);

        // Guard Marcus Vance calling /api/duty-roster: only gets Marcus Vance's shifts
        mockMvc.perform(get("/api/duty-roster")
                        .header("X-User-Role", "Security Guard")
                        .header("X-User-Email", "guard@campusguard.edu")
                        .header("X-Guard-Badge", "Shield #4082")
                        .header("X-Guard-Name", "Officer Marcus Vance"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].guardName").value("Officer Marcus Vance"))
                .andExpect(jsonPath("$[0].postLocation").value("North Gate"));

        // Guard Marcus Vance trying to view David Chen's shift by ID: receives 403 FORBIDDEN
        mockMvc.perform(get("/api/duty-roster/" + chenShift.getId())
                        .header("X-User-Role", "Security Guard")
                        .header("X-User-Email", "guard@campusguard.edu")
                        .header("X-Guard-Badge", "Shield #4082")
                        .header("X-Guard-Name", "Officer Marcus Vance"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").value(containsString("Access denied")));

        // Guard cannot schedule shift: receives 403 FORBIDDEN
        String newShiftJson = """
                {
                    "guardName": "Officer Marcus Vance",
                    "guardBadgeNumber": "Shield #4082",
                    "postLocation": "Unauthorized Post",
                    "shiftType": "MORNING"
                }
                """;
        mockMvc.perform(post("/api/duty-roster")
                        .header("X-User-Role", "Security Guard")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(newShiftJson))
                .andExpect(status().isForbidden());
    }

    @Test
    void supervisorChangesAreReflectedInGuardRosterWithoutRelogin() throws Exception {
        LocalDate today = LocalDate.now();

        DutyRoster shift = new DutyRoster("Supervisor Elena", "Officer Marcus Vance", "Shield #4082", "North Gate 01", today, "MORNING", "08:00", "16:00");
        shift.setGuardEmail("guard@campusguard.edu");
        shift.setStatus("SCHEDULED");
        DutyRoster saved = dutyRosterRepository.save(shift);

        // Guard fetches initially
        mockMvc.perform(get("/api/duty-roster/my-roster")
                        .header("X-User-Role", "Security Guard")
                        .header("X-User-Email", "guard@campusguard.edu")
                        .header("X-Guard-Badge", "Shield #4082"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.todayDuty.postLocation").value("North Gate 01"))
                .andExpect(jsonPath("$.todayDuty.status").value("SCHEDULED"));

        // Supervisor updates gate and status to ACTIVE
        String updatePayload = """
                {
                    "postLocation": "Emergency East Perimeter Gate",
                    "status": "ACTIVE"
                }
                """;
        mockMvc.perform(put("/api/duty-roster/" + saved.getId())
                        .header("X-Supervisor-Name", "Supervisor Elena")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatePayload))
                .andExpect(status().isOk());

        // Guard requests their roster again (simulating automatic polling without re-login)
        mockMvc.perform(get("/api/duty-roster/my-roster")
                        .header("X-User-Role", "Security Guard")
                        .header("X-User-Email", "guard@campusguard.edu")
                        .header("X-Guard-Badge", "Shield #4082"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.todayDuty.postLocation").value("Emergency East Perimeter Gate"))
                .andExpect(jsonPath("$.todayDuty.status").value("ACTIVE"));
    }

    @Test
    void supervisorCanReassignAbsentGuardShiftToReplacementGuardWithExcusedAbsenceAndNotification() throws Exception {
        LocalDate today = LocalDate.now();

        // 1. Initial shift assigned to Officer Tariq Mansoor (who calls in sick/absent)
        DutyRoster originalShift = new DutyRoster(
                "Supervisor Sarah Connor",
                "Officer Tariq Mansoor",
                "GD-201",
                "North Gate Checkpoint",
                today,
                "MORNING",
                "08:00",
                "16:00"
        );
        originalShift.setGuardEmail("tariq@campusguard.edu");
        DutyRoster saved = dutyRosterRepository.save(originalShift);

        // 2. Supervisor reassigns shift to replacement guard Officer Marcus Vance due to Medical Leave
        String reassignPayload = """
                {
                    "replacementGuardName": "Officer Marcus Vance",
                    "replacementGuardBadgeNumber": "Shield #4082",
                    "replacementGuardEmail": "guard@campusguard.edu",
                    "reason": "Sudden Medical Illness / Emergency Leave",
                    "supervisorName": "Supervisor Sarah Connor",
                    "supervisorBadgeNumber": "SUP-101"
                }
                """;

        mockMvc.perform(post("/api/duty-roster/" + saved.getId() + "/reassign")
                        .header("X-Supervisor-Name", "Supervisor Sarah Connor")
                        .header("X-Supervisor-Badge", "SUP-101")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(reassignPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dutyRosterId").value(saved.getId()))
                .andExpect(jsonPath("$.originalGuardName").value("Officer Tariq Mansoor"))
                .andExpect(jsonPath("$.originalGuardBadgeNumber").value("GD-201"))
                .andExpect(jsonPath("$.replacementGuardName").value("Officer Marcus Vance"))
                .andExpect(jsonPath("$.replacementGuardBadgeNumber").value("Shield #4082"))
                .andExpect(jsonPath("$.replacementGuardEmail").value("guard@campusguard.edu"))
                .andExpect(jsonPath("$.reassignmentReason").value("Sudden Medical Illness / Emergency Leave"))
                .andExpect(jsonPath("$.originalGuardAttendanceStatus").value("EXCUSED_ABSENCE"))
                .andExpect(jsonPath("$.countsAsNoShow").value(false));

        // 3. Verify duty roster in database is updated with replacement guard and excused absence flags
        DutyRoster updated = dutyRosterRepository.findById(saved.getId()).orElseThrow();
        org.junit.jupiter.api.Assertions.assertEquals("Officer Marcus Vance", updated.getGuardName());
        org.junit.jupiter.api.Assertions.assertEquals("Shield #4082", updated.getGuardBadgeNumber());
        org.junit.jupiter.api.Assertions.assertEquals("Officer Tariq Mansoor", updated.getOriginalGuardName());
        org.junit.jupiter.api.Assertions.assertEquals("GD-201", updated.getOriginalGuardBadgeNumber());
        org.junit.jupiter.api.Assertions.assertEquals("EXCUSED_ABSENCE", updated.getAbsentGuardAttendanceStatus());
        org.junit.jupiter.api.Assertions.assertFalse(updated.isCountsAsNoShow(), "Reassigned absent guard shift must NOT count as a no-show");
        org.junit.jupiter.api.Assertions.assertTrue(updated.isReassigned());

        // 4. Verify notification was dispatched to replacement guard
        var notifications = notificationRepository.findAll();
        org.junit.jupiter.api.Assertions.assertFalse(notifications.isEmpty());
        var guardNotif = notifications.stream()
                .filter(n -> "guard@campusguard.edu".equalsIgnoreCase(n.getRecipientEmail()))
                .findFirst()
                .orElseThrow();
        org.junit.jupiter.api.Assertions.assertTrue(guardNotif.getMessage().contains("Officer Tariq Mansoor"));
        org.junit.jupiter.api.Assertions.assertTrue(guardNotif.getMessage().contains("Sudden Medical Illness / Emergency Leave"));

        // 5. Verify replacement guard can now view this reassigned shift in their roster
        mockMvc.perform(get("/api/duty-roster/my-roster")
                        .header("X-User-Role", "Security Guard")
                        .header("X-User-Email", "guard@campusguard.edu")
                        .header("X-Guard-Badge", "Shield #4082"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.todayDuty.postLocation").value("North Gate Checkpoint"))
                .andExpect(jsonPath("$.todayDuty.guardName").value("Officer Marcus Vance"))
                .andExpect(jsonPath("$.todayDuty.reassigned").value(true));
    }

    @Test
    void reassignmentHistoryAuditTrailIsRetrievable() throws Exception {
        LocalDate today = LocalDate.now();

        DutyRoster shift = new DutyRoster(
                "Supervisor Sarah Connor",
                "Officer David Chen",
                "Shield #3910",
                "Library Gate Checkpoint",
                today,
                "EVENING",
                "16:00",
                "00:00"
        );
        shift.setGuardEmail("d.chen@campusguard.edu");
        DutyRoster saved = dutyRosterRepository.save(shift);

        String reassignPayload = """
                {
                    "replacementGuardName": "Officer Marcus Vance",
                    "replacementGuardBadgeNumber": "Shield #4082",
                    "replacementGuardEmail": "guard@campusguard.edu",
                    "reason": "Family Emergency Leave"
                }
                """;

        mockMvc.perform(post("/api/duty-roster/" + saved.getId() + "/reassign")
                        .header("X-Supervisor-Name", "Supervisor Sarah Connor")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(reassignPayload))
                .andExpect(status().isOk());

        // Query all reassignments
        mockMvc.perform(get("/api/duty-roster/reassignments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].originalGuardName").value("Officer David Chen"))
                .andExpect(jsonPath("$[0].replacementGuardName").value("Officer Marcus Vance"))
                .andExpect(jsonPath("$[0].countsAsNoShow").value(false))
                .andExpect(jsonPath("$[0].originalGuardAttendanceStatus").value("EXCUSED_ABSENCE"));

        // Query reassignments for this specific roster ID
        mockMvc.perform(get("/api/duty-roster/" + saved.getId() + "/reassignments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].reassignmentReason").value("Family Emergency Leave"));
    }

    @Test
    void guardsCannotReassignShifts() throws Exception {
        LocalDate today = LocalDate.now();
        DutyRoster shift = new DutyRoster("Supervisor Elena", "Guard Alpha", "GD-01", "Gate 1", today, "MORNING", "08:00", "16:00");
        DutyRoster saved = dutyRosterRepository.save(shift);

        String reassignPayload = """
                {
                    "replacementGuardName": "Officer Marcus Vance",
                    "replacementGuardBadgeNumber": "Shield #4082",
                    "reason": "Unauthorized Attempt"
                }
                """;

        mockMvc.perform(post("/api/duty-roster/" + saved.getId() + "/reassign")
                        .header("X-User-Role", "Security Guard")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(reassignPayload))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").value(containsString("Access denied")));
    }
}
