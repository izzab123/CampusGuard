package com.campusguard.config;

import com.campusguard.model.ShiftHandoff;
import com.campusguard.model.ShiftHandoffAcknowledgement;
import com.campusguard.repository.ShiftHandoffAcknowledgementRepository;
import com.campusguard.repository.ShiftHandoffRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class ShiftHandoffDataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(ShiftHandoffDataInitializer.class);

    private final ShiftHandoffRepository handoffRepo;
    private final ShiftHandoffAcknowledgementRepository ackRepo;

    public ShiftHandoffDataInitializer(
            ShiftHandoffRepository handoffRepo,
            ShiftHandoffAcknowledgementRepository ackRepo
    ) {
        this.handoffRepo = handoffRepo;
        this.ackRepo = ackRepo;
    }

    @Override
    public void run(String... args) {
        if (handoffRepo.count() == 0) {
            LocalDate today = LocalDate.now();

            // 1. Pending handoff at North Gate Checkpoint (for incoming guard Officer Marcus Vance to view and acknowledge)
            ShiftHandoff pendingHandoff = new ShiftHandoff(
                    "North Gate Checkpoint",
                    7L,
                    "Officer Sarah Jenkins",
                    "Shield #4120",
                    "s.jenkins@campusguard.edu",
                    "MORNING",
                    today,
                    "06:00",
                    "14:00",
                    "Vehicle gate barrier sensor recalibrated. High commercial deliveries scheduled between 14:00 and 16:00. Visitor logs up to date on desk.",
                    "Radios (2/2) OK, Barrier Keyring #04, RFID Handheld Reader Operational",
                    "North Gate Master Key, Emergency Manual Override Crank"
            );
            pendingHandoff.setStatus("PENDING_ACKNOWLEDGEMENT");
            pendingHandoff.setAcknowledged(false);
            pendingHandoff.setResponsibilityTransferred(false);
            handoffRepo.save(pendingHandoff);

            // 2. Previously acknowledged handoff at Science & Engineering Quad
            ShiftHandoff acknowledgedHandoff = new ShiftHandoff(
                    "Science & Engineering Quad",
                    6L,
                    "Officer David Chen",
                    "Shield #3910",
                    "d.chen@campusguard.edu",
                    "MORNING",
                    today,
                    "08:00",
                    "16:00",
                    "Research lab exterior perimeter secured. Hazardous chemical staging dock cleared.",
                    "Patrol Radio Unit #12, Lab Access Fob",
                    "Science Quad Master Fob #2"
            );
            acknowledgedHandoff.setStatus("ACKNOWLEDGED");
            acknowledgedHandoff.setAcknowledged(true);
            LocalDateTime ackTime = LocalDateTime.now().minusHours(1);
            acknowledgedHandoff.setAcknowledgedAt(ackTime);
            acknowledgedHandoff.setAcknowledgedByGuardId(3L);
            acknowledgedHandoff.setAcknowledgedByGuardName("Officer Marcus Vance");
            acknowledgedHandoff.setAcknowledgedByGuardBadge("Shield #4082");
            acknowledgedHandoff.setResponsibilityTransferred(true);
            acknowledgedHandoff.setAcknowledgementNotes("Physical asset inventory verified. Relieved Officer Chen on post.");

            ShiftHandoff savedAckHandoff = handoffRepo.save(acknowledgedHandoff);

            ShiftHandoffAcknowledgement ack = new ShiftHandoffAcknowledgement(
                    savedAckHandoff.getId(),
                    savedAckHandoff.getGatePost(),
                    3L,
                    "Officer Marcus Vance",
                    "Shield #4082",
                    "guard@campusguard.edu",
                    ackTime,
                    "Physical asset inventory verified. Relieved Officer Chen on post.",
                    6L,
                    "Officer David Chen",
                    "Shield #3910"
            );
            ack.setResponsibilityTransferred(true);
            ShiftHandoffAcknowledgement savedAck = ackRepo.save(ack);

            savedAckHandoff.setAcknowledgement(savedAck);
            handoffRepo.save(savedAckHandoff);

            logger.info("Initialized Shift Handoff test seed records (1 pending, 1 acknowledged).");
        }
    }
}
