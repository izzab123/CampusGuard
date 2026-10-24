package com.campusguard.controller;

import com.campusguard.model.ShiftHandoff;
import com.campusguard.model.ShiftHandoffAcknowledgement;
import com.campusguard.model.ShiftHandoffForm;
import com.campusguard.repository.ShiftHandoffAcknowledgementRepository;
import com.campusguard.repository.ShiftHandoffFormRepository;
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
import java.util.HashMap;
import java.util.Map;

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

    @Autowired
    private ShiftHandoffFormRepository handoffFormRepo;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        objectMapper = new ObjectMapper();
        handoffRepository.deleteAll();
        ackRepository.deleteAll();
        handoffFormRepo.deleteAll();
    }

    // =========================================================================
    // Tests for Shift Handoff Acknowledgement (/api/shift-handoffs)
    // =========================================================================

    @Test
    void incomingGuardViewsLatestShiftHandoff_ViewingDoesNotCountAsAcknowledged() throws Exception {
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

        ShiftHandoff reloaded = handoffRepository.findById(saved.getId()).orElseThrow();
        assertTrue(reloaded.isAcknowledged());
        assertTrue(reloaded.isResponsibilityTransferred());
        assertEquals(3L, reloaded.getAcknowledgedByGuardId());
        assertEquals("ACKNOWLEDGED", reloaded.getStatus());
        assertNotNull(reloaded.getAcknowledgedAt());
        assertTrue(reloaded.getAcknowledgedAt().isAfter(beforeAck) && reloaded.getAcknowledgedAt().isBefore(afterAck));

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

        mockMvc.perform(post("/api/shift-handoffs/" + saved.getId() + "/acknowledge")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(ackPayload))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/shift-handoffs/" + saved.getId() + "/acknowledge")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(ackPayload))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error", containsString("already been acknowledged")));
    }

    @Test
    void outgoingGuardCanFetchAndAuditAcknowledgedHandoffWithDetails() throws Exception {
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

        mockMvc.perform(get("/api/shift-handoffs")
                        .param("gatePost", "West Quad Hub"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].acknowledged").value(true))
                .andExpect(jsonPath("$[0].acknowledgedByGuardId").value(3))
                .andExpect(jsonPath("$[0].acknowledgedAt").isNotEmpty())
                .andExpect(jsonPath("$[0].responsibilityTransferred").value(true));

        mockMvc.perform(get("/api/shift-handoffs/acknowledgements"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].shiftHandoffId").value(saved.getId()))
                .andExpect(jsonPath("$[0].guardId").value(3))
                .andExpect(jsonPath("$[0].guardName").value("Officer Marcus Vance"))
                .andExpect(jsonPath("$[0].acknowledgedAt").isNotEmpty())
                .andExpect(jsonPath("$[0].responsibilityTransferred").value(true));

        mockMvc.perform(get("/api/shift-handoffs/" + saved.getId() + "/acknowledgement"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.guardId").value(3))
                .andExpect(jsonPath("$.responsibilityTransferred").value(true))
                .andExpect(jsonPath("$.acknowledgedAt").isNotEmpty());
    }

    // =========================================================================
    // Tests for Shift Handoff Digital Form (/api/handoffs) from origin/main
    // =========================================================================

    @Test
    void shouldRejectWhenRequiredIncidentsSectionIsMissing() throws Exception {
        Map<String, Object> payload = new HashMap<>();
        payload.put("outgoingGuardId", "SEC-4082");
        payload.put("outgoingGuardName", "Officer Marcus Vance");
        payload.put("postLocation", "North Perimeter & Gate 04");
        payload.put("incidents", ""); // Empty required section
        payload.put("generalObservations", "Campus perimeter quiet and verified secure.");
        payload.put("pendingIssues", "Lock maintenance ticket pending on East gate.");
        payload.put("itemsToWatch", "Watch for unauthorized delivery van.");

        mockMvc.perform(post("/api/handoffs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", containsString("Incidents section is required")));
    }

    @Test
    void shouldRejectWhenRequiredGeneralObservationsSectionIsMissing() throws Exception {
        Map<String, Object> payload = new HashMap<>();
        payload.put("outgoingGuardId", "SEC-4082");
        payload.put("outgoingGuardName", "Officer Marcus Vance");
        payload.put("postLocation", "North Perimeter & Gate 04");
        payload.put("incidents", "Zero incidents reported.");
        payload.put("generalObservations", "   "); // Blank whitespace
        payload.put("pendingIssues", "None.");
        payload.put("itemsToWatch", "None.");

        mockMvc.perform(post("/api/handoffs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", containsString("General observations section is required")));
    }

    @Test
    void shouldRejectWhenRequiredPendingIssuesSectionIsMissing() throws Exception {
        Map<String, Object> payload = new HashMap<>();
        payload.put("outgoingGuardId", "SEC-4082");
        payload.put("outgoingGuardName", "Officer Marcus Vance");
        payload.put("postLocation", "North Perimeter & Gate 04");
        payload.put("incidents", "Zero incidents reported.");
        payload.put("generalObservations", "Routine shift completed.");
        payload.put("pendingIssues", ""); // Missing required pending issues
        payload.put("itemsToWatch", "None.");

        mockMvc.perform(post("/api/handoffs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", containsString("Pending issues section is required")));
    }

    @Test
    void shouldRejectWhenRequiredItemsToWatchSectionIsMissing() throws Exception {
        Map<String, Object> payload = new HashMap<>();
        payload.put("outgoingGuardId", "SEC-4082");
        payload.put("outgoingGuardName", "Officer Marcus Vance");
        payload.put("postLocation", "North Perimeter & Gate 04");
        payload.put("incidents", "Zero incidents reported.");
        payload.put("generalObservations", "Routine shift completed.");
        payload.put("pendingIssues", "None pending.");
        payload.put("itemsToWatch", "  "); // Blank whitespace

        mockMvc.perform(post("/api/handoffs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", containsString("Items to watch section is required")));
    }

    @Test
    void shouldRejectWhenOutgoingGuardIdIsMissing() throws Exception {
        Map<String, Object> payload = new HashMap<>();
        payload.put("outgoingGuardId", ""); // Missing guard ID
        payload.put("incidents", "Zero incidents reported.");
        payload.put("generalObservations", "Routine shift completed.");
        payload.put("pendingIssues", "None pending.");
        payload.put("itemsToWatch", "Keep watch on student hall.");

        mockMvc.perform(post("/api/handoffs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", containsString("Outgoing guard ID is required")));
    }

    @Test
    void shouldSuccessfullySaveHandoffFormWithTimestampAndGuardId() throws Exception {
        Map<String, Object> payload = new HashMap<>();
        payload.put("outgoingGuardId", "SEC-4082");
        payload.put("outgoingGuardName", "Officer Marcus Vance");
        payload.put("outgoingGuardEmail", "guard@campusguard.edu");
        payload.put("postLocation", "North Perimeter & Gate 04");
        payload.put("incidents", "15:30 - Minor parking dispute resolved amicably without escalation.");
        payload.put("generalObservations", "Clear skies, normal pedestrian flow, all barrier sensors operational.");
        payload.put("pendingIssues", "Barrier arm Lane 2 scheduled for hydraulic fluid top-up tomorrow at 08:00.");
        payload.put("itemsToWatch", "Auditorium event ends at 21:00; expect heavy outgoing vehicle traffic.");

        mockMvc.perform(post("/api/handoffs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.outgoingGuardId", is("SEC-4082")))
                .andExpect(jsonPath("$.outgoingGuardName", is("Officer Marcus Vance")))
                .andExpect(jsonPath("$.postLocation", is("North Perimeter & Gate 04")))
                .andExpect(jsonPath("$.incidents", containsString("Minor parking dispute")))
                .andExpect(jsonPath("$.generalObservations", containsString("Clear skies")))
                .andExpect(jsonPath("$.pendingIssues", containsString("Barrier arm Lane 2")))
                .andExpect(jsonPath("$.itemsToWatch", containsString("Auditorium event")))
                .andExpect(jsonPath("$.timestamp", notNullValue()));

        assertEquals(1, handoffFormRepo.count());
        ShiftHandoffForm saved = handoffFormRepo.findAll().get(0);
        assertNotNull(saved.getTimestamp());
        assertEquals("SEC-4082", saved.getOutgoingGuardId());
    }

    @Test
    void shouldRetrieveHandoffsInDescendingOrderForIncomingGuard() throws Exception {
        ShiftHandoffForm earlyHandoff = new ShiftHandoffForm(
                "SEC-101",
                "Officer John Doe",
                "South Gate",
                "No incidents",
                "Normal afternoon",
                "No pending tickets",
                "Check perimeter fence"
        );
        handoffFormRepo.save(earlyHandoff);

        ShiftHandoffForm latestHandoff = new ShiftHandoffForm(
                "SEC-4082",
                "Officer Marcus Vance",
                "North Perimeter & Gate 04",
                "Alarm tested and clear",
                "Evening lighting activated",
                "Maintenance crew working in Hall B",
                "High pedestrian traffic expected"
        );
        handoffFormRepo.save(latestHandoff);

        mockMvc.perform(get("/api/handoffs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].outgoingGuardId", is("SEC-4082")))
                .andExpect(jsonPath("$[0].postLocation", is("North Perimeter & Gate 04")))
                .andExpect(jsonPath("$[1].outgoingGuardId", is("SEC-101")));
    }
}
