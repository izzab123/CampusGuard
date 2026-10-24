package com.campusguard.controller;

import com.campusguard.model.ShiftHandoff;
import com.campusguard.model.ShiftHandoffAcknowledgement;
import com.campusguard.repository.ShiftHandoffAcknowledgementRepository;
import com.campusguard.repository.ShiftHandoffRepository;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
public class SupervisorLogbookControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ShiftHandoffRepository handoffRepository;

    @Autowired
    private ShiftHandoffAcknowledgementRepository ackRepository;

    private MockMvc mockMvc;

    private ShiftHandoff entryTodayNorth;
    private ShiftHandoff entryYesterdaySouth;
    private ShiftHandoff entryOldLibrary;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        handoffRepository.deleteAll();
        ackRepository.deleteAll();

        LocalDate today = LocalDate.now();

        // Entry 1: Today, Morning, North Gate Checkpoint (Pending)
        entryTodayNorth = new ShiftHandoff(
                "North Gate Checkpoint",
                7L,
                "Officer Sarah Jenkins",
                "Shield #4120",
                "s.jenkins@campusguard.edu",
                "MORNING",
                today,
                "06:00",
                "14:00",
                "Barrier optical sensors nominal.",
                "Radios (2/2) OK",
                "North Gate Master Keyring"
        );
        entryTodayNorth.setStatus("PENDING_ACKNOWLEDGEMENT");
        entryTodayNorth = handoffRepository.save(entryTodayNorth);

        // Entry 2: Yesterday, Evening, South Gate Checkpoint (Acknowledged by David Chen)
        entryYesterdaySouth = new ShiftHandoff(
                "South Gate Checkpoint",
                3L,
                "Officer Marcus Vance",
                "Shield #4082",
                "guard@campusguard.edu",
                "EVENING",
                today.minusDays(1),
                "14:00",
                "22:00",
                "Commercial gate locked down at 21:00.",
                "Radios (2/2) OK, Gate Key 02",
                "South Gate Master Keyring"
        );
        entryYesterdaySouth.setStatus("ACKNOWLEDGED");
        entryYesterdaySouth.setAcknowledged(true);
        LocalDateTime yTime = LocalDateTime.now().minusDays(1).withHour(22).withMinute(5);
        entryYesterdaySouth.setAcknowledgedAt(yTime);
        entryYesterdaySouth.setAcknowledgedByGuardId(6L);
        entryYesterdaySouth.setAcknowledgedByGuardName("Officer David Chen");
        entryYesterdaySouth.setAcknowledgedByGuardBadge("Shield #3910");
        entryYesterdaySouth.setResponsibilityTransferred(true);
        entryYesterdaySouth.setAcknowledgementNotes("Night lockdown verified.");
        entryYesterdaySouth = handoffRepository.save(entryYesterdaySouth);

        ShiftHandoffAcknowledgement ack2 = new ShiftHandoffAcknowledgement(
                entryYesterdaySouth.getId(),
                entryYesterdaySouth.getGatePost(),
                6L,
                "Officer David Chen",
                "Shield #3910",
                "d.chen@campusguard.edu",
                yTime,
                "Night lockdown verified.",
                3L,
                "Officer Marcus Vance",
                "Shield #4082"
        );
        entryYesterdaySouth.setAcknowledgement(ackRepository.save(ack2));
        entryYesterdaySouth = handoffRepository.save(entryYesterdaySouth);

        // Entry 3: 5 days ago, Morning, Central Library Gate (Acknowledged by Marcus Vance)
        entryOldLibrary = new ShiftHandoff(
                "Central Library & Student Plaza",
                7L,
                "Officer Sarah Jenkins",
                "Shield #4120",
                "s.jenkins@campusguard.edu",
                "MORNING",
                today.minusDays(5),
                "08:00",
                "16:00",
                "Exam week security sweep completed.",
                "Radios (1/1)",
                "Library Key 01"
        );
        entryOldLibrary.setStatus("ACKNOWLEDGED");
        entryOldLibrary.setAcknowledged(true);
        LocalDateTime oldTime = LocalDateTime.now().minusDays(5).withHour(16).withMinute(0);
        entryOldLibrary.setAcknowledgedAt(oldTime);
        entryOldLibrary.setAcknowledgedByGuardId(3L);
        entryOldLibrary.setAcknowledgedByGuardName("Officer Marcus Vance");
        entryOldLibrary.setAcknowledgedByGuardBadge("Shield #4082");
        entryOldLibrary.setResponsibilityTransferred(true);
        entryOldLibrary = handoffRepository.save(entryOldLibrary);

        ShiftHandoffAcknowledgement ack3 = new ShiftHandoffAcknowledgement(
                entryOldLibrary.getId(),
                entryOldLibrary.getGatePost(),
                3L,
                "Officer Marcus Vance",
                "Shield #4082",
                "guard@campusguard.edu",
                oldTime,
                "Library shift taken over.",
                7L,
                "Officer Sarah Jenkins",
                "Shield #4120"
        );
        entryOldLibrary.setAcknowledgement(ackRepository.save(ack3));
        entryOldLibrary = handoffRepository.save(entryOldLibrary);
    }

    @Test
    void supervisorCanViewLogbookHistoryWithRequiredFields() throws Exception {
        mockMvc.perform(get("/api/supervisor/logbook")
                        .header("X-User-Role", "Shift Supervisor"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)))
                // Verify entry structure includes: date, shift, gate, outgoing guard, incoming guard, acknowledgement status, readOnly
                .andExpect(jsonPath("$[0].date").isNotEmpty())
                .andExpect(jsonPath("$[0].shift").isNotEmpty())
                .andExpect(jsonPath("$[0].gate").isNotEmpty())
                .andExpect(jsonPath("$[0].outgoingGuard").isNotEmpty())
                .andExpect(jsonPath("$[0].acknowledgementStatus").isNotEmpty())
                .andExpect(jsonPath("$[0].readOnly").value(true));
    }

    @Test
    void filterLogbookByDateRange() throws Exception {
        LocalDate today = LocalDate.now();

        // Query only for yesterday and today (excludes entry from 5 days ago)
        mockMvc.perform(get("/api/supervisor/logbook")
                        .header("X-User-Role", "Shift Supervisor")
                        .param("startDate", today.minusDays(1).toString())
                        .param("endDate", today.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[?(@.gate == 'Central Library & Student Plaza')]").doesNotExist());
    }

    @Test
    void filterLogbookByGuard_MatchesOutgoingOrIncoming() throws Exception {
        // Query guard="David Chen" -> matches entry where David Chen is incoming guard
        mockMvc.perform(get("/api/supervisor/logbook")
                        .header("X-User-Role", "Shift Supervisor")
                        .param("guard", "David Chen"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].gate").value("South Gate Checkpoint"))
                .andExpect(jsonPath("$[0].incomingGuard").value("Officer David Chen"));

        // Query guard="Sarah Jenkins" -> matches 2 entries where Sarah Jenkins is outgoing guard
        mockMvc.perform(get("/api/supervisor/logbook")
                        .header("X-User-Role", "Shift Supervisor")
                        .param("guard", "Jenkins"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].outgoingGuard").value("Officer Sarah Jenkins"))
                .andExpect(jsonPath("$[1].outgoingGuard").value("Officer Sarah Jenkins"));
    }

    @Test
    void filterLogbookByGate() throws Exception {
        // Query gate="South Gate"
        mockMvc.perform(get("/api/supervisor/logbook")
                        .header("X-User-Role", "Shift Supervisor")
                        .param("gate", "South Gate"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].gate").value("South Gate Checkpoint"))
                .andExpect(jsonPath("$[0].shift").value("EVENING"));
    }

    @Test
    void openLogbookEntry_ReturnsFullHandoffDetails() throws Exception {
        mockMvc.perform(get("/api/supervisor/logbook/" + entryYesterdaySouth.getId())
                        .header("X-User-Role", "Shift Supervisor"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(entryYesterdaySouth.getId()))
                .andExpect(jsonPath("$.gatePost").value("South Gate Checkpoint"))
                .andExpect(jsonPath("$.shiftType").value("EVENING"))
                .andExpect(jsonPath("$.outgoingGuardName").value("Officer Marcus Vance"))
                .andExpect(jsonPath("$.acknowledgedByGuardName").value("Officer David Chen"))
                .andExpect(jsonPath("$.handoffNotes").value("Commercial gate locked down at 21:00."))
                .andExpect(jsonPath("$.equipmentStatus").value("Radios (2/2) OK, Gate Key 02"))
                .andExpect(jsonPath("$.keyInventory").value("South Gate Master Keyring"))
                .andExpect(jsonPath("$.acknowledgementNotes").value("Night lockdown verified."))
                .andExpect(jsonPath("$.acknowledgement.guardId").value(6))
                .andExpect(jsonPath("$.responsibilityTransferred").value(true))
                .andExpect(jsonPath("$.readOnly").value(true));
    }

    @Test
    void strictlyReadOnlyForSupervisors_RejectsModifications() throws Exception {
        // Reject PUT modification
        mockMvc.perform(put("/api/supervisor/logbook/" + entryYesterdaySouth.getId())
                        .header("X-User-Role", "Shift Supervisor")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"notes\": \"Attempted modification\"}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error", containsString("strictly read-only")));

        // Reject PATCH modification
        mockMvc.perform(patch("/api/supervisor/logbook/" + entryYesterdaySouth.getId())
                        .header("X-User-Role", "Shift Supervisor")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\": \"CANCELLED\"}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error", containsString("strictly read-only")));

        // Reject DELETE modification
        mockMvc.perform(delete("/api/supervisor/logbook/" + entryYesterdaySouth.getId())
                        .header("X-User-Role", "Shift Supervisor"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error", containsString("strictly read-only")));

        // Reject POST update modification
        mockMvc.perform(post("/api/supervisor/logbook/" + entryYesterdaySouth.getId() + "/update")
                        .header("X-User-Role", "Shift Supervisor")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"notes\": \"Unauthorized edit\"}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error", containsString("strictly read-only")));
    }

    @Test
    void unauthorizedRoleCannotAccessSupervisorLogbook() throws Exception {
        mockMvc.perform(get("/api/supervisor/logbook")
                        .header("X-User-Role", "Student"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error", containsString("Access denied")));
    }

    @Test
    void authorizedShiftSupervisorEnumFormatAllowed() throws Exception {
        mockMvc.perform(get("/api/supervisor/logbook")
                        .header("X-User-Role", "SHIFT_SUPERVISOR"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)));
    }
}
