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
        int initialAdminCount = notificationRepo.findByRecipientRoleIgnoreCaseOrRecipientRoleIgnoreCaseOrderByCreatedAtDesc("Admin", "ALL").size();
        int initialSupervisorCount = notificationRepo.findByRecipientRoleIgnoreCaseOrRecipientRoleIgnoreCaseOrderByCreatedAtDesc("Shift Supervisor", "ALL").size();

        mockMvc.perform(post("/api/vehicles/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.status").value("Pending approval"))
                .andExpect(jsonPath("$.vehicleNumber").value(uniquePlate))
                .andExpect(jsonPath("$.ownerName").value("Jane Doe"))
                .andExpect(jsonPath("$.studentId").value("STU-9901"));

        // Verify notification sent to Admin ONLY (not to Security Guard or Supervisor upon submission)
        List<Notification> adminNotifs = notificationRepo.findByRecipientRoleIgnoreCaseOrRecipientRoleIgnoreCaseOrderByCreatedAtDesc("Admin", "ALL");
        assertTrue(adminNotifs.size() > initialAdminCount, "Admin must receive notification upon registration submission");

        Notification latestAdminNotif = adminNotifs.get(0);
        assertEquals("Admin", latestAdminNotif.getRecipientRole());
        assertEquals("New Vehicle Registration Submitted", latestAdminNotif.getTitle());
        assertTrue(latestAdminNotif.getMessage().contains(uniquePlate));

        // Ensure Guard and Supervisor were NOT notified upon submission (notification sent only to Admin)
        int postRegGuardCount = notificationRepo.findByRecipientRoleIgnoreCaseOrRecipientRoleIgnoreCaseOrderByCreatedAtDesc("Security Guard", "ALL").size();
        int postRegSupervisorCount = notificationRepo.findByRecipientRoleIgnoreCaseOrRecipientRoleIgnoreCaseOrderByCreatedAtDesc("Shift Supervisor", "ALL").size();
        assertEquals(initialGuardNotifCount, postRegGuardCount, "Guard should not receive notification upon submission");
        assertEquals(initialSupervisorCount, postRegSupervisorCount, "Supervisor should not receive notification upon submission");
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
    void testApproveVehicleNotifiesGuardSupervisorAndStudent() throws Exception {
        String uniquePlate = "APPR-PLATE-" + System.currentTimeMillis();
        String studentEmail = "carlos@campus.edu";
        VehicleRegistrationRequest req = new VehicleRegistrationRequest(
                "STU-9904",
                "Carlos Ray",
                "+1-555-0400",
                uniquePlate,
                "SUV",
                studentEmail
        );

        String responseStr = mockMvc.perform(post("/api/vehicles/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        VehicleRegistration created = objectMapper.readValue(responseStr, VehicleRegistration.class);
        Long regId = created.getId();

        // Count existing notifications for student, guard, and supervisor
        int initStudentCount = notificationRepo.findForRecipient("Student", studentEmail).size();
        int initGuardCount = notificationRepo.findByRecipientRoleIgnoreCaseOrRecipientRoleIgnoreCaseOrderByCreatedAtDesc("Security Guard", "ALL").size();
        int initSupervisorCount = notificationRepo.findByRecipientRoleIgnoreCaseOrRecipientRoleIgnoreCaseOrderByCreatedAtDesc("Shift Supervisor", "ALL").size();

        // Admin approves registration
        mockMvc.perform(patch("/api/vehicles/" + regId + "/approve")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"approvedBy\": \"Admin Eleanor\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("Approved"))
                .andExpect(jsonPath("$.approvedBy").value("Admin Eleanor"));

        // 1. Verify notification sent to Student
        List<Notification> studentNotifs = notificationRepo.findForRecipient("Student", studentEmail);
        assertTrue(studentNotifs.size() > initStudentCount, "Student must receive approval notification");
        Notification latestStudent = studentNotifs.get(0);
        assertEquals("Vehicle Registration Approved", latestStudent.getTitle());
        assertTrue(latestStudent.getMessage().contains(uniquePlate));
        assertEquals(regId, latestStudent.getVehicleRegistrationId());

        // 2. Verify notification sent to Security Guard
        List<Notification> guardNotifs = notificationRepo.findByRecipientRoleIgnoreCaseOrRecipientRoleIgnoreCaseOrderByCreatedAtDesc("Security Guard", "ALL");
        assertTrue(guardNotifs.size() > initGuardCount, "Guard must receive approval notification");
        Notification latestGuard = guardNotifs.get(0);
        assertEquals("Vehicle Registration Approved", latestGuard.getTitle());
        assertTrue(latestGuard.getMessage().contains(uniquePlate));
        assertEquals(regId, latestGuard.getVehicleRegistrationId());

        // 3. Verify notification sent to Shift Supervisor
        List<Notification> supervisorNotifs = notificationRepo.findByRecipientRoleIgnoreCaseOrRecipientRoleIgnoreCaseOrderByCreatedAtDesc("Shift Supervisor", "ALL");
        assertTrue(supervisorNotifs.size() > initSupervisorCount, "Supervisor must receive approval notification");
        Notification latestSup = supervisorNotifs.get(0);
        assertEquals("Vehicle Registration Approved", latestSup.getTitle());
        assertTrue(latestSup.getMessage().contains(uniquePlate));
        assertEquals(regId, latestSup.getVehicleRegistrationId());
    }

    @Test
    void testDenyVehicleWithoutReasonFails() throws Exception {
        String uniquePlate = "NOREASON-PLATE-" + System.currentTimeMillis();
        String studentEmail = "noreason@campus.edu";
        VehicleRegistrationRequest req = new VehicleRegistrationRequest(
                "STU-9906",
                "No Reason Candidate",
                "+1-555-0666",
                uniquePlate,
                "Car",
                studentEmail
        );

        String responseStr = mockMvc.perform(post("/api/vehicles/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        VehicleRegistration created = objectMapper.readValue(responseStr, VehicleRegistration.class);
        Long regId = created.getId();

        // Attempt denial without providing a reason
        mockMvc.perform(patch("/api/vehicles/" + regId + "/deny")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"deniedBy\": \"Admin Eleanor\", \"reason\": \"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(containsString("reason must be provided")));
    }

    @Test
    void testDenyVehicleNotifiesStudentGuardAndSupervisorWithWrittenReason() throws Exception {
        String uniquePlate = "DENY-PLATE-" + System.currentTimeMillis();
        String studentEmail = "deniedstudent@campus.edu";
        String adminReason = "Plate documentation is expired and unverified";
        VehicleRegistrationRequest req = new VehicleRegistrationRequest(
                "STU-9905",
                "Deny Candidate",
                "+1-555-0555",
                uniquePlate,
                "Sedan",
                studentEmail
        );

        String responseStr = mockMvc.perform(post("/api/vehicles/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        VehicleRegistration created = objectMapper.readValue(responseStr, VehicleRegistration.class);
        Long regId = created.getId();

        int initStudentCount = notificationRepo.findForRecipient("Student", studentEmail).size();
        int initGuardCount = notificationRepo.findByRecipientRoleIgnoreCaseOrRecipientRoleIgnoreCaseOrderByCreatedAtDesc("Security Guard", "ALL").size();
        int initSupervisorCount = notificationRepo.findByRecipientRoleIgnoreCaseOrRecipientRoleIgnoreCaseOrderByCreatedAtDesc("Shift Supervisor", "ALL").size();

        // Admin denies registration with required reason
        mockMvc.perform(patch("/api/vehicles/" + regId + "/deny")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"deniedBy\": \"Admin Eleanor\", \"reason\": \"" + adminReason + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("Denied"))
                .andExpect(jsonPath("$.deniedBy").value("Admin Eleanor"))
                .andExpect(jsonPath("$.rejectionReason").value(adminReason));

        // 1. Verify notification sent to Student with written reason
        List<Notification> studentNotifs = notificationRepo.findForRecipient("Student", studentEmail);
        assertTrue(studentNotifs.size() > initStudentCount, "Student must receive denial notification");
        Notification latestStudent = studentNotifs.get(0);
        assertEquals("Vehicle Registration Denied", latestStudent.getTitle());
        assertTrue(latestStudent.getMessage().contains(uniquePlate));
        assertTrue(latestStudent.getMessage().contains(adminReason));
        assertEquals(regId, latestStudent.getVehicleRegistrationId());

        // 2. Verify notification sent to Security Guard with written reason
        List<Notification> guardNotifs = notificationRepo.findByRecipientRoleIgnoreCaseOrRecipientRoleIgnoreCaseOrderByCreatedAtDesc("Security Guard", "ALL");
        assertTrue(guardNotifs.size() > initGuardCount, "Guard must receive denial notification");
        Notification latestGuard = guardNotifs.get(0);
        assertEquals("Vehicle Registration Denied", latestGuard.getTitle());
        assertTrue(latestGuard.getMessage().contains(uniquePlate));
        assertTrue(latestGuard.getMessage().contains(adminReason));
        assertEquals(regId, latestGuard.getVehicleRegistrationId());

        // 3. Verify notification sent to Shift Supervisor with written reason
        List<Notification> supervisorNotifs = notificationRepo.findByRecipientRoleIgnoreCaseOrRecipientRoleIgnoreCaseOrderByCreatedAtDesc("Shift Supervisor", "ALL");
        assertTrue(supervisorNotifs.size() > initSupervisorCount, "Supervisor must receive denial notification");
        Notification latestSupervisor = supervisorNotifs.get(0);
        assertEquals("Vehicle Registration Denied", latestSupervisor.getTitle());
        assertTrue(latestSupervisor.getMessage().contains(uniquePlate));
        assertTrue(latestSupervisor.getMessage().contains(adminReason));
        assertEquals(regId, latestSupervisor.getVehicleRegistrationId());
    }
}
