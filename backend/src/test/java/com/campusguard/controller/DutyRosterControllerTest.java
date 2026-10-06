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

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        objectMapper = new ObjectMapper();
        dutyRosterRepository.deleteAll();
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
}
