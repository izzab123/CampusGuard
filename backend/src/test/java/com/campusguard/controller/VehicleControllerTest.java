package com.campusguard.controller;

import com.campusguard.dto.VehicleRegistrationRequest;
import com.campusguard.model.Notification;
import com.campusguard.model.VehicleRegistration;
import com.campusguard.repository.NotificationRepository;
import com.campusguard.repository.VehicleRegistrationRepository;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
public class VehicleControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private VehicleRegistrationRepository vehicleRepo;

    @Autowired
    private NotificationRepository notificationRepo;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        this.objectMapper = new ObjectMapper();
    }

    @Test
    void testRegisterVehicleSuccess() throws Exception {
        String uniquePlate = "TEST-PLATE-" + System.currentTimeMillis();
        VehicleRegistrationRequest req = new VehicleRegistrationRequest(
                "STU-9901",
                "Jane Doe",
                "+1-555-0199",
                uniquePlate,
                "Car",
                "jane@campus.edu"
        );

        int initialGuardNotifCount = notificationRepo.findByRecipientRoleIgnoreCaseOrRecipientRoleIgnoreCaseOrderByCreatedAtDesc("Security Guard", "ALL").size();

        mockMvc.perform(post("/api/vehicles/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.status").value("Pending approval"))
                .andExpect(jsonPath("$.vehicleNumber").value(uniquePlate))
                .andExpect(jsonPath("$.ownerName").value("Jane Doe"))
                .andExpect(jsonPath("$.studentId").value("STU-9901"));

        // Verify notification sent to Security Guard
        List<Notification> guardNotifs = notificationRepo.findByRecipientRoleIgnoreCaseOrRecipientRoleIgnoreCaseOrderByCreatedAtDesc("Security Guard", "ALL");
        assertTrue(guardNotifs.size() > initialGuardNotifCount);

        Notification latestGuardNotif = guardNotifs.get(0);
        assertEquals("Security Guard", latestGuardNotif.getRecipientRole());
        assertEquals("New Vehicle Registration Submitted", latestGuardNotif.getTitle());
        assertTrue(latestGuardNotif.getMessage().contains(uniquePlate));
    }

    @Test
    void testRegisterDuplicateVehicleFails() throws Exception {
        String uniquePlate = "DUP-PLATE-" + System.currentTimeMillis();
        VehicleRegistrationRequest req1 = new VehicleRegistrationRequest(
                "STU-9902",
                "Bob Smith",
                "+1-555-0200",
                uniquePlate,
                "Motorcycle",
                "bob@campus.edu"
        );

        mockMvc.perform(post("/api/vehicles/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req1)))
                .andExpect(status().isCreated());

        // Attempt to register same plate again
        VehicleRegistrationRequest req2 = new VehicleRegistrationRequest(
                "STU-9903",
                "Alice Wonder",
                "+1-555-0201",
                uniquePlate,
                "Car",
                "alice@campus.edu"
        );

        mockMvc.perform(post("/api/vehicles/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req2)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("cannot be registered twice")));
    }

    @Test
    void testValidationRequiredFields() throws Exception {
        VehicleRegistrationRequest invalidReq = new VehicleRegistrationRequest(
                "",
                "",
                "",
                "",
                "",
                "test@campus.edu"
        );

        mockMvc.perform(post("/api/vehicles/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation failed"));
    }

    @Test
    void testApproveVehicleNotifiesSupervisorAndAdminOnly() throws Exception {
        String uniquePlate = "APPR-PLATE-" + System.currentTimeMillis();
        VehicleRegistrationRequest req = new VehicleRegistrationRequest(
                "STU-9904",
                "Carlos Ray",
                "+1-555-0400",
                uniquePlate,
                "SUV",
                "carlos@campus.edu"
        );

        String responseStr = mockMvc.perform(post("/api/vehicles/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        VehicleRegistration created = objectMapper.readValue(responseStr, VehicleRegistration.class);
        Long regId = created.getId();

        // Count existing notifications for supervisor and admin
        int initSupervisorCount = notificationRepo.findByRecipientRoleIgnoreCaseOrRecipientRoleIgnoreCaseOrderByCreatedAtDesc("Shift Supervisor", "ALL").size();
        int initAdminCount = notificationRepo.findByRecipientRoleIgnoreCaseOrRecipientRoleIgnoreCaseOrderByCreatedAtDesc("Admin", "ALL").size();
        int initProctorCount = notificationRepo.findByRecipientRoleIgnoreCaseOrRecipientRoleIgnoreCaseOrderByCreatedAtDesc("Proctor and DSW", "ALL").size();

        // Guard approves registration
        mockMvc.perform(patch("/api/vehicles/" + regId + "/approve")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"approvedBy\": \"Officer John\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("Approved"))
                .andExpect(jsonPath("$.approvedBy").value("Officer John"));

        // Verify notifications for Supervisor and Admin
        List<Notification> supervisorNotifs = notificationRepo.findByRecipientRoleIgnoreCaseOrRecipientRoleIgnoreCaseOrderByCreatedAtDesc("Shift Supervisor", "ALL");
        List<Notification> adminNotifs = notificationRepo.findByRecipientRoleIgnoreCaseOrRecipientRoleIgnoreCaseOrderByCreatedAtDesc("Admin", "ALL");
        List<Notification> proctorNotifs = notificationRepo.findByRecipientRoleIgnoreCaseOrRecipientRoleIgnoreCaseOrderByCreatedAtDesc("Proctor and DSW", "ALL");

        assertTrue(supervisorNotifs.size() > initSupervisorCount);
        assertTrue(adminNotifs.size() > initAdminCount);

        Notification latestSup = supervisorNotifs.get(0);
        assertEquals("New Vehicle Registered", latestSup.getTitle());
        assertTrue(latestSup.getMessage().contains(uniquePlate));
        assertEquals(regId, latestSup.getVehicleRegistrationId());

        Notification latestAdm = adminNotifs.get(0);
        assertEquals("New Vehicle Registered", latestAdm.getTitle());
        assertTrue(latestAdm.getMessage().contains(uniquePlate));
        assertEquals(regId, latestAdm.getVehicleRegistrationId());

        // Ensure Proctor got NO new vehicle registration notification
        List<Notification> proctorVehicleNotifs = proctorNotifs.stream()
                .filter(n -> "VEHICLE_REGISTRATION".equals(n.getCategory()) && "New Vehicle Registered".equals(n.getTitle()))
                .collect(Collectors.toList());
        assertTrue(proctorVehicleNotifs.isEmpty(), "Proctor should not receive New Vehicle Registered notification");
    }
}
