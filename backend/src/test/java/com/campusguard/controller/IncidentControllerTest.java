package com.campusguard.controller;

import com.campusguard.model.IncidentReport;
import com.campusguard.model.IncidentSeverity;
import com.campusguard.model.Notification;
import com.campusguard.repository.IncidentReportRepository;
import com.campusguard.repository.NotificationRepository;
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
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
public class IncidentControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private IncidentReportRepository incidentRepo;

    @Autowired
    private NotificationRepository notificationRepo;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        objectMapper = new ObjectMapper();
        notificationRepo.deleteAll();
        incidentRepo.deleteAll();
    }

    @Test
    void testIncidentSeverityEnumClassification() {
        assertEquals(IncidentSeverity.MINOR, IncidentSeverity.fromString("LOW"));
        assertEquals(IncidentSeverity.MINOR, IncidentSeverity.fromString("minor"));
        assertEquals(IncidentSeverity.MEDIUM, IncidentSeverity.fromString("MEDIUM"));
        assertEquals(IncidentSeverity.MEDIUM, IncidentSeverity.fromString("moderate"));
        assertEquals(IncidentSeverity.MAJOR, IncidentSeverity.fromString("HIGH"));
        assertEquals(IncidentSeverity.MAJOR, IncidentSeverity.fromString("major"));
        assertEquals(IncidentSeverity.MAJOR, IncidentSeverity.fromString("CRITICAL"));

        // Check assigned roles
        assertEquals(Set.of("Shift Supervisor"), IncidentSeverity.MINOR.getNotificationRoles());
        assertEquals(Set.of("Shift Supervisor", "Admin"), IncidentSeverity.MEDIUM.getNotificationRoles());
        assertEquals(Set.of("Shift Supervisor", "Admin", "Proctor and DSW"), IncidentSeverity.MAJOR.getNotificationRoles());
    }

    @Test
    void shouldOnlyNotifySupervisorWhenReportIsMinor() throws Exception {
        Map<String, Object> payload = new HashMap<>();
        payload.put("title", "Broken Sprinkler Valve");
        payload.put("description", "Minor leak near science quad walkway.");
        payload.put("severity", "LOW");
        payload.put("location", "Science Quad");
        payload.put("reporterName", "John Student");
        payload.put("reporterRole", "Student");
        payload.put("reporterEmail", "student@campusguard.edu");

        mockMvc.perform(post("/api/incidents")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists());

        List<Notification> notifs = notificationRepo.findAll();
        assertFalse(notifs.isEmpty());

        Set<String> recipientRoles = notifs.stream()
                .map(Notification::getRecipientRole)
                .collect(Collectors.toSet());

        // Must notify Shift Supervisor and Submitter (Student)
        assertTrue(recipientRoles.contains("Shift Supervisor"), "Shift Supervisor must be notified for Minor");
        assertTrue(recipientRoles.contains("Student"), "Submitter must receive confirmation");

        // Must NOT notify Admin or Proctor and DSW
        assertFalse(recipientRoles.contains("Admin"), "Admin must NOT be notified for Minor");
        assertFalse(recipientRoles.contains("Proctor and DSW"), "Proctor must NOT be notified for Minor");
    }

    @Test
    void shouldOnlyNotifySupervisorWhenReportExplicitlyHasMinorSeverityString() throws Exception {
        Map<String, Object> payload = new HashMap<>();
        payload.put("title", "Flickering Path Light");
        payload.put("description", "Light 14 on north trail flickers occasionally.");
        payload.put("severity", "MINOR");
        payload.put("location", "North Trail");
        payload.put("reporterName", "Officer Marcus");
        payload.put("reporterRole", "Security Guard");
        payload.put("reporterEmail", "guard@campusguard.edu");

        mockMvc.perform(post("/api/incidents")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isCreated());

        List<Notification> notifs = notificationRepo.findAll();
        Set<String> recipientRoles = notifs.stream()
                .map(Notification::getRecipientRole)
                .collect(Collectors.toSet());

        assertTrue(recipientRoles.contains("Shift Supervisor"));
        assertFalse(recipientRoles.contains("Admin"));
        assertFalse(recipientRoles.contains("Proctor and DSW"));
    }

    @Test
    void shouldNotifySupervisorAndAdminWhenReportIsMedium() throws Exception {
        Map<String, Object> payload = new HashMap<>();
        payload.put("title", "Perimeter Door Ajar");
        payload.put("description", "Exterior door 3 propped open with a brick.");
        payload.put("severity", "MEDIUM");
        payload.put("location", "Residence Hall B");
        payload.put("reporterName", "Jane Student");
        payload.put("reporterRole", "Student");
        payload.put("reporterEmail", "jane@campusguard.edu");

        mockMvc.perform(post("/api/incidents")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isCreated());

        List<Notification> notifs = notificationRepo.findAll();
        Set<String> recipientRoles = notifs.stream()
                .map(Notification::getRecipientRole)
                .collect(Collectors.toSet());

        // Must notify Shift Supervisor and Admin
        assertTrue(recipientRoles.contains("Shift Supervisor"), "Shift Supervisor must be notified for Medium");
        assertTrue(recipientRoles.contains("Admin"), "Admin must be notified for Medium");
        assertTrue(recipientRoles.contains("Student"), "Submitter must receive confirmation");

        // Must NOT notify Proctor and DSW
        assertFalse(recipientRoles.contains("Proctor and DSW"), "Proctor must NOT be notified for Medium");
    }

    @Test
    void shouldNotifySupervisorAdminAndProctorWhenReportIsMajor() throws Exception {
        Map<String, Object> payload = new HashMap<>();
        payload.put("title", "Physical Altercation at Main Gate");
        payload.put("description", "Multiple individuals in dispute requiring immediate tactical response.");
        payload.put("severity", "HIGH");
        payload.put("location", "Main Gate");
        payload.put("reporterName", "Officer Dave");
        payload.put("reporterRole", "Security Guard");
        payload.put("reporterEmail", "guard@campusguard.edu");

        mockMvc.perform(post("/api/incidents")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isCreated());

        List<Notification> notifs = notificationRepo.findAll();
        Set<String> recipientRoles = notifs.stream()
                .map(Notification::getRecipientRole)
                .collect(Collectors.toSet());

        // Must notify Shift Supervisor, Admin, and Proctor & DSW
        assertTrue(recipientRoles.contains("Shift Supervisor"), "Shift Supervisor must be notified for Major");
        assertTrue(recipientRoles.contains("Admin"), "Admin must be notified for Major");
        assertTrue(recipientRoles.contains("Proctor and DSW"), "Proctor must be notified for Major");
        assertTrue(recipientRoles.contains("Security Guard"), "Submitter must receive confirmation");
    }

    @Test
    void shouldNotifySupervisorAdminAndProctorWhenReportExplicitlyHasMajorSeverityString() throws Exception {
        Map<String, Object> payload = new HashMap<>();
        payload.put("title", "Severe Chemical Spill");
        payload.put("description", "Hazardous material container overturned in lab corridor.");
        payload.put("severity", "MAJOR");
        payload.put("location", "Chem Lab Annex");
        payload.put("reporterName", "Lab Tech");
        payload.put("reporterRole", "Staff");
        payload.put("reporterEmail", "staff@campusguard.edu");

        mockMvc.perform(post("/api/incidents")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isCreated());

        List<Notification> notifs = notificationRepo.findAll();
        Set<String> recipientRoles = notifs.stream()
                .map(Notification::getRecipientRole)
                .collect(Collectors.toSet());

        assertTrue(recipientRoles.contains("Shift Supervisor"));
        assertTrue(recipientRoles.contains("Admin"));
        assertTrue(recipientRoles.contains("Proctor and DSW"));
    }
}
