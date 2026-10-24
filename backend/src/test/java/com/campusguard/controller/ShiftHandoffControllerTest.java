package com.campusguard.controller;

import com.campusguard.model.ShiftHandoff;
import com.campusguard.model.ShiftHandoffAcknowledgement;
import com.campusguard.repository.ShiftHandoffAcknowledgementRepository;
import com.campusguard.repository.ShiftHandoffRepository;
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
import java.time.LocalDateTime;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
public class ShiftHandoffControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ShiftHandoffRepository handoffRepository;

    @Autowired
    private ShiftHandoffAcknowledgementRepository ackRepository;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        objectMapper = new ObjectMapper();
        handoffRepository.deleteAll();
        ackRepository.deleteAll();
    }

    @Test
    void incomingGuardViewsLatestShiftHandoff_ViewingDoesNotCountAsAcknowledged() throws Exception {
        // Outgoing guard leaves a handoff for North Gate Checkpoint
        ShiftHandoff handoff = new ShiftHandoff(
                "North Gate Checkpoint",
                7L,
                "Officer Sarah Jenkins",
                "Shield #4120",
                "s.jenkins@campusguard.edu",
                "MORNING",
                LocalDate.now(),
                "06:00",
                "14:00",
                "Barrier optical sensors nominal. Heavy delivery flow expected.",
                "Radios (2/2) OK, Barrier Key handed over",
                "North Gate Master Keyring"
        );
        ShiftHandoff saved = handoffRepository.save(handoff);

        // Incoming guard logs in and views latest shift handoff for his assigned gate
        mockMvc.perform(get("/api/shift-handoffs/latest")
                        .param("gatePost", "North Gate Checkpoint")
                        .header("X-Guard-Id", 3L)
                        .header("X-Guard-Name", "Officer Marcus Vance"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(saved.getId()))
                .andExpect(jsonPath("$.gatePost").value("North Gate Checkpoint"))
                .andExpect(jsonPath("$.outgoingGuardName").value("Officer Sarah Jenkins"))
                .andExpect(jsonPath("$.status").value("PENDING_ACKNOWLEDGEMENT"))
                .andExpect(jsonPath("$.acknowledged").value(false))
                .andExpect(jsonPath("$.acknowledgedAt").doesNotExist())
                .andExpect(jsonPath("$.responsibilityTransferred").value(false));

        // CRITICAL CHECK: Simply viewing MUST NOT count as acknowledgement
        ShiftHandoff reloaded = handoffRepository.findById(saved.getId()).orElseThrow();
        assertFalse(reloaded.isAcknowledged(), "Viewing the shift handoff must NOT acknowledge it");
        assertFalse(reloaded.isResponsibilityTransferred(), "Responsibility must not be transferred simply by viewing");
        assertEquals("PENDING_ACKNOWLEDGEMENT", reloaded.getStatus());
        assertEquals(0, ackRepository.count(), "No acknowledgement record should exist after just viewing");
    }

    @Test
    void incomingGuardExplicitlyAcknowledgesHandoff_SavesRecordWithGuardIdAndExactTimestamp_TransfersResponsibility() throws Exception {
        ShiftHandoff handoff = new ShiftHandoff(
                "Main Gate Barrier 01",
                7L,
                "Officer Sarah Jenkins",
                "Shield #4120",
                "s.jenkins@campusguard.edu",
                "MORNING",
                LocalDate.now(),
                "06:00",
                "14:00",
                "Keys and radio in post lockbox.",
                "Radios OK",
                "Master Key 01"
        );
        ShiftHandoff saved = handoffRepository.save(handoff);

        LocalDateTime beforeAck = LocalDateTime.now().minusSeconds(1);

        String ackPayload = """
                {
                    "guardId": 3,
                    "guardBadgeNumber": "Shield #4082",
                    "guardName": "Officer Marcus Vance",
                    "guardEmail": "guard@campusguard.edu",
                    "notes": "Post keys, radio unit, and barrier clearance verified. Full post control assumed."
                }
                """;

        // Incoming guard explicitly clicks "Acknowledge" button to accept it
        mockMvc.perform(post("/api/shift-handoffs/" + saved.getId() + "/acknowledge")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(ackPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(saved.getId()))
                .andExpect(jsonPath("$.status").value("ACKNOWLEDGED"))
                .andExpect(jsonPath("$.acknowledged").value(true))
                .andExpect(jsonPath("$.acknowledgedByGuardId").value(3))
                .andExpect(jsonPath("$.acknowledgedByGuardName").value("Officer Marcus Vance"))
                .andExpect(jsonPath("$.acknowledgedByGuardBadge").value("Shield #4082"))
                .andExpect(jsonPath("$.responsibilityTransferred").value(true))
                .andExpect(jsonPath("$.acknowledgedAt").isNotEmpty());

        LocalDateTime afterAck = LocalDateTime.now().plusSeconds(1);

        // Verify entity updated in DB
        ShiftHandoff reloaded = handoffRepository.findById(saved.getId()).orElseThrow();
        assertTrue(reloaded.isAcknowledged());
        assertTrue(reloaded.isResponsibilityTransferred());
        assertEquals(3L, reloaded.getAcknowledgedByGuardId());
        assertEquals("ACKNOWLEDGED", reloaded.getStatus());
        assertNotNull(reloaded.getAcknowledgedAt());
        assertTrue(reloaded.getAcknowledgedAt().isAfter(beforeAck) && reloaded.getAcknowledgedAt().isBefore(afterAck));

        // Verify explicit immutable ShiftHandoffAcknowledgement record in repository
        assertEquals(1, ackRepository.count());
        ShiftHandoffAcknowledgement ack = ackRepository.findByShiftHandoffId(saved.getId()).orElseThrow();
        assertEquals(3L, ack.getGuardId(), "Guard ID must match incoming guard who acknowledged");
        assertEquals("Officer Marcus Vance", ack.getGuardName());
        assertEquals("Shield #4082", ack.getGuardBadgeNumber());
        assertTrue(ack.isResponsibilityTransferred(), "Responsibility must be formally transferred");
        assertNotNull(ack.getAcknowledgedAt(), "Exact timestamp must be saved");
    }

    @Test
    void cannotAcknowledgeShiftHandoffTwice_ReturnsConflict() throws Exception {
        ShiftHandoff handoff = new ShiftHandoff(
                "South Gate Checkpoint",
                7L,
                "Officer Sarah Jenkins",
                "Shield #4120",
                "s.jenkins@campusguard.edu",
                "MORNING",
                LocalDate.now(),
                "06:00",
                "14:00",
                "All secure.",
                "Radios OK",
                "Key A"
        );
        ShiftHandoff saved = handoffRepository.save(handoff);

        String ackPayload = """
                {
                    "guardId": 3,
                    "guardBadgeNumber": "Shield #4082",
                    "guardName": "Officer Marcus Vance"
                }
                """;

        // First acknowledgement succeeds
        mockMvc.perform(post("/api/shift-handoffs/" + saved.getId() + "/acknowledge")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(ackPayload))
                .andExpect(status().isOk());

        // Second acknowledgement attempt must return 409 Conflict
        mockMvc.perform(post("/api/shift-handoffs/" + saved.getId() + "/acknowledge")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(ackPayload))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error", containsString("already been acknowledged")));
    }

    @Test
    void outgoingGuardCanFetchAndAuditAcknowledgedHandoffWithDetails() throws Exception {
        // Create handoff with outgoing guard ID = 7
        ShiftHandoff handoff = new ShiftHandoff(
                "North Perimeter Post",
                7L,
                "Officer Sarah Jenkins",
                "Shield #4120",
                "s.jenkins@campusguard.edu",
                "MORNING",
                LocalDate.now(),
                "06:00",
                "14:00",
                "Shift handover notes.",
                "Equipment checked",
                "Key set #1"
        );
        ShiftHandoff saved = handoffRepository.save(handoff);

        // Incoming guard acknowledges
        String ackPayload = """
                {
                    "guardId": 3,
                    "guardBadgeNumber": "Shield #4082",
                    "guardName": "Officer Marcus Vance"
                }
                """;
        mockMvc.perform(post("/api/shift-handoffs/" + saved.getId() + "/acknowledge")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(ackPayload))
                .andExpect(status().isOk());

        // Outgoing guard fetches his handoffs
        mockMvc.perform(get("/api/shift-handoffs/outgoing")
                        .param("guardId", "7"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(saved.getId()))
                .andExpect(jsonPath("$[0].status").value("ACKNOWLEDGED"))
                .andExpect(jsonPath("$[0].acknowledged").value(true))
                .andExpect(jsonPath("$[0].acknowledgedByGuardId").value(3))
                .andExpect(jsonPath("$[0].acknowledgedByGuardName").value("Officer Marcus Vance"))
                .andExpect(jsonPath("$[0].acknowledgedAt").isNotEmpty())
                .andExpect(jsonPath("$[0].responsibilityTransferred").value(true));
    }

    @Test
    void shiftSupervisorCanFetchAllHandoffsAndDetailedAcknowledgements() throws Exception {
        ShiftHandoff handoff = new ShiftHandoff(
                "West Quad Hub",
                7L,
                "Officer Sarah Jenkins",
                "Shield #4120",
                "s.jenkins@campusguard.edu",
                "MORNING",
                LocalDate.now(),
                "06:00",
                "14:00",
                "All gates inspected.",
                "Radios (2/2)",
                "Keys 1-4"
        );
        ShiftHandoff saved = handoffRepository.save(handoff);

        String ackPayload = """
                {
                    "guardId": 3,
                    "guardBadgeNumber": "Shield #4082",
                    "guardName": "Officer Marcus Vance",
                    "notes": "Formal takeover complete."
                }
                """;
        mockMvc.perform(post("/api/shift-handoffs/" + saved.getId() + "/acknowledge")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(ackPayload))
                .andExpect(status().isOk());

        // Supervisor fetches all handoffs
        mockMvc.perform(get("/api/shift-handoffs")
                        .param("gatePost", "West Quad Hub"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].acknowledged").value(true))
                .andExpect(jsonPath("$[0].acknowledgedByGuardId").value(3))
                .andExpect(jsonPath("$[0].acknowledgedAt").isNotEmpty())
                .andExpect(jsonPath("$[0].responsibilityTransferred").value(true));

        // Supervisor fetches list of formal acknowledgement records
        mockMvc.perform(get("/api/shift-handoffs/acknowledgements"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].shiftHandoffId").value(saved.getId()))
                .andExpect(jsonPath("$[0].guardId").value(3))
                .andExpect(jsonPath("$[0].guardName").value("Officer Marcus Vance"))
                .andExpect(jsonPath("$[0].acknowledgedAt").isNotEmpty())
                .andExpect(jsonPath("$[0].responsibilityTransferred").value(true));

        // Supervisor fetches direct acknowledgement endpoint by handoff ID
        mockMvc.perform(get("/api/shift-handoffs/" + saved.getId() + "/acknowledgement"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.guardId").value(3))
                .andExpect(jsonPath("$.responsibilityTransferred").value(true))
                .andExpect(jsonPath("$.acknowledgedAt").isNotEmpty());
    }
}
