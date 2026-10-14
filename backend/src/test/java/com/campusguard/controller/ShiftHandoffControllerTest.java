package com.campusguard.controller;

import com.campusguard.model.ShiftHandoffForm;
import com.campusguard.repository.ShiftHandoffFormRepository;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

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
    private ShiftHandoffFormRepository handoffRepo;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        objectMapper = new ObjectMapper();
        handoffRepo.deleteAll();
    }

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

        assertEquals(1, handoffRepo.count());
        ShiftHandoffForm saved = handoffRepo.findAll().get(0);
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
        handoffRepo.save(earlyHandoff);

        ShiftHandoffForm latestHandoff = new ShiftHandoffForm(
                "SEC-4082",
                "Officer Marcus Vance",
                "North Perimeter & Gate 04",
                "Alarm tested and clear",
                "Evening lighting activated",
                "Maintenance crew working in Hall B",
                "High pedestrian traffic expected"
        );
        handoffRepo.save(latestHandoff);

        mockMvc.perform(get("/api/handoffs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].outgoingGuardId", is("SEC-4082")))
                .andExpect(jsonPath("$[0].postLocation", is("North Perimeter & Gate 04")))
                .andExpect(jsonPath("$[1].outgoingGuardId", is("SEC-101")));
    }
}
