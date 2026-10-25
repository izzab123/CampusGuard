package com.campusguard.controller;

import com.campusguard.model.OccurrenceRecord;
import com.campusguard.model.OccurrenceRemark;
import com.campusguard.repository.OccurrenceRecordRepository;
import com.campusguard.repository.OccurrenceRemarkRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
public class OccurrenceRegisterControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private OccurrenceRecordRepository recordRepository;

    @Autowired
    private OccurrenceRemarkRepository remarkRepository;

    private MockMvc mockMvc;

    private OccurrenceRecord noShowToday;
    private OccurrenceRecord notableYesterday;
    private OccurrenceRecord notableOld;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        recordRepository.deleteAll();
        remarkRepository.deleteAll();

        LocalDate today = LocalDate.now();

        // 1. No-Show Today (David Chen)
        noShowToday = new OccurrenceRecord(
                today,
                "Officer David Chen",
                "Shield #3910",
                "EVENING",
                "South Perimeter Station - Gate 03",
                "NO_SHOW",
                "HIGH",
                "Unreported Duty Absence - Gate 03 Evening Watch",
                "Officer David Chen failed to report on time for assigned watch duty at South Perimeter Station."
        );
        noShowToday.setGuardEmail("d.chen@campusguard.edu");
        noShowToday = recordRepository.save(noShowToday);

        // 2. Notable Event Yesterday (Marcus Vance)
        notableYesterday = new OccurrenceRecord(
                today.minusDays(1),
                "Officer Marcus Vance",
                "Shield #4082",
                "MORNING",
                "North Gate Checkpoint - Barrier 04",
                "NOTABLE_EVENT",
                "CRITICAL",
                "Unauthorized Barrier Breach Attempt",
                "Commercial delivery van attempted to bypass vehicle barrier without scanned RFID tag."
        );
        notableYesterday.setGuardEmail("guard@campusguard.edu");
        notableYesterday = recordRepository.save(notableYesterday);

        OccurrenceRemark rem2 = new OccurrenceRemark(
                notableYesterday.getId(),
                "Supervisor Elena Rostova",
                "SS-104",
                "Shift Supervisor",
                "supervisor@campusguard.edu",
                "Driver identification verified with facilities; escorted off-site."
        );
        rem2 = remarkRepository.save(rem2);
        notableYesterday.addRemark(rem2);
        notableYesterday = recordRepository.save(notableYesterday);

        // 3. Notable Event 6 days ago (Tariq Mansoor)
        notableOld = new OccurrenceRecord(
                today.minusDays(6),
                "Officer Tariq Mansoor",
                "Shield #GD-201",
                "NIGHT",
                "East Campus Loading Dock",
                "NOTABLE_EVENT",
                "CRITICAL",
                "Chemical Delivery Sentry Lockdown",
                "Unscheduled liquid chemical transport arrived after dock closure."
        );
        notableOld.setGuardEmail("t.mansoor@campusguard.edu");
        notableOld = recordRepository.save(notableOld);
    }

    @Test
    void supervisorCanViewOfficialOccurrenceRegisterWithRequiredFields() throws Exception {
        mockMvc.perform(get("/api/supervisor/occurrence-register")
                        .header("X-User-Role", "Shift Supervisor"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)))
                // Verify all required list fields: date, guard, shift, gate, and type of occurrence
                .andExpect(jsonPath("$[0].date").isNotEmpty())
                .andExpect(jsonPath("$[0].guard").isNotEmpty())
                .andExpect(jsonPath("$[0].shift").isNotEmpty())
                .andExpect(jsonPath("$[0].gate").isNotEmpty())
                .andExpect(jsonPath("$[0].type").isNotEmpty())
                .andExpect(jsonPath("$[0].readOnly").value(true));
    }

    @Test
    void filterRegisterByDateRange() throws Exception {
        LocalDate today = LocalDate.now();

        // Query only for yesterday and today (excludes entry from 6 days ago)
        mockMvc.perform(get("/api/supervisor/occurrence-register")
                        .header("X-User-Role", "Shift Supervisor")
                        .param("startDate", today.minusDays(1).toString())
                        .param("endDate", today.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[?(@.gate == 'East Campus Loading Dock')]").doesNotExist());
    }

    @Test
    void filterRegisterByGuard() throws Exception {
        // Query for "David Chen"
        mockMvc.perform(get("/api/supervisor/occurrence-register")
                        .header("X-User-Role", "Shift Supervisor")
                        .param("guard", "David Chen"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].gate").value("South Perimeter Station - Gate 03"))
                .andExpect(jsonPath("$[0].type").value("NO_SHOW"));

        // Query for badge "4082" (Marcus Vance)
        mockMvc.perform(get("/api/supervisor/occurrence-register")
                        .header("X-User-Role", "Shift Supervisor")
                        .param("guard", "4082"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].gate").value("North Gate Checkpoint - Barrier 04"))
                .andExpect(jsonPath("$[0].type").value("NOTABLE_EVENT"));
    }

    @Test
    void filterRegisterByType() throws Exception {
        // Filter by NO_SHOW
        mockMvc.perform(get("/api/supervisor/occurrence-register")
                        .header("X-User-Role", "Shift Supervisor")
                        .param("type", "NO_SHOW"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].type").value("NO_SHOW"))
                .andExpect(jsonPath("$[0].guardName").value("Officer David Chen"));

        // Filter by NOTABLE_EVENT
        mockMvc.perform(get("/api/supervisor/occurrence-register")
                        .header("X-User-Role", "Shift Supervisor")
                        .param("type", "NOTABLE_EVENT"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void openRegisterEntry_ReturnsFullDetailsAndRemarks() throws Exception {
        mockMvc.perform(get("/api/supervisor/occurrence-register/" + notableYesterday.getId())
                        .header("X-User-Role", "Shift Supervisor"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(notableYesterday.getId()))
                .andExpect(jsonPath("$.gatePost").value("North Gate Checkpoint - Barrier 04"))
                .andExpect(jsonPath("$.shiftType").value("MORNING"))
                .andExpect(jsonPath("$.occurrenceType").value("NOTABLE_EVENT"))
                .andExpect(jsonPath("$.title").value("Unauthorized Barrier Breach Attempt"))
                .andExpect(jsonPath("$.description").isNotEmpty())
                .andExpect(jsonPath("$.remarks", hasSize(1)))
                .andExpect(jsonPath("$.remarks[0].remarkText").value("Driver identification verified with facilities; escorted off-site."))
                .andExpect(jsonPath("$.remarks[0].authorName").value("Supervisor Elena Rostova"))
                .andExpect(jsonPath("$.readOnly").value(true));
    }

    @Test
    void appendSeparateFollowUpRemark_SuccessfullyAddsRemark() throws Exception {
        String payload = "{\"remark\": \"Supervisor conducted secondary security audit of Gate 03; perimeter secured.\"}";

        mockMvc.perform(post("/api/supervisor/occurrence-register/" + noShowToday.getId() + "/remarks")
                        .header("X-User-Role", "Shift Supervisor")
                        .header("X-User-Name", "Supervisor Elena Rostova")
                        .header("X-User-Badge", "SS-104")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(noShowToday.getId()))
                .andExpect(jsonPath("$.remarks", hasSize(1)))
                .andExpect(jsonPath("$.remarks[0].remarkText").value("Supervisor conducted secondary security audit of Gate 03; perimeter secured."))
                .andExpect(jsonPath("$.remarks[0].authorName").value("Supervisor Elena Rostova"))
                .andExpect(jsonPath("$.remarks[0].authorBadge").value("SS-104"));

        // Verify in database that original entry fields remain unchanged and remark was appended
        OccurrenceRecord updated = recordRepository.findById(noShowToday.getId()).orElseThrow();
        assertEquals("Officer David Chen", updated.getGuardName());
        assertEquals("NO_SHOW", updated.getOccurrenceType());
        assertEquals(1, updated.getRemarks().size());
        assertEquals("Supervisor conducted secondary security audit of Gate 03; perimeter secured.", updated.getRemarks().get(0).getRemarkText());
    }

    @Test
    void strictlyReadOnlyForOriginalRegisterEntries_RejectsModifications() throws Exception {
        // Reject PUT modification
        mockMvc.perform(put("/api/supervisor/occurrence-register/" + noShowToday.getId())
                        .header("X-User-Role", "Shift Supervisor")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"description\": \"Unauthorized modification\"}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error", containsString("strictly read-only")));

        // Reject PATCH modification
        mockMvc.perform(patch("/api/supervisor/occurrence-register/" + noShowToday.getId())
                        .header("X-User-Role", "Shift Supervisor")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"occurrenceType\": \"RESOLVED\"}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error", containsString("strictly read-only")));

        // Reject DELETE modification
        mockMvc.perform(delete("/api/supervisor/occurrence-register/" + noShowToday.getId())
                        .header("X-User-Role", "Shift Supervisor"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error", containsString("strictly read-only")));

        // Reject POST modification to update endpoint
        mockMvc.perform(post("/api/supervisor/occurrence-register/" + noShowToday.getId() + "/update")
                        .header("X-User-Role", "Shift Supervisor")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"notes\": \"Unauthorized edit\"}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error", containsString("strictly read-only")));
    }

    @Test
    void unauthorizedRoleCannotAccessOccurrenceRegister() throws Exception {
        mockMvc.perform(get("/api/supervisor/occurrence-register")
                        .header("X-User-Role", "Student"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error", containsString("Access denied")));
    }
}
