package com.campusguard.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@campusguard.edu}")
    private String fromEmail;

    public boolean sendPasswordResetEmail(String toEmail, String resetUrl) {
        String subject = "CampusGuard - Institutional Password Reset Request";
        String body = String.format(
            "Hello,\n\n" +
            "A password reset request has been initiated for your CampusGuard account (%s).\n\n" +
            "Click the link below to set a new password:\n" +
            "%s\n\n" +
            "This link will expire in 15 minutes.\n" +
            "If you did not request this reset, please notify Campus Security immediately.\n\n" +
            "Sincerely,\n" +
            "CampusGuard Security Operations Center",
            toEmail,
            resetUrl
        );

        logger.info("================================================================================");
        logger.info("[CampusGuard Email Service] Password Reset Request for: {}", toEmail);
        logger.info("[CampusGuard Email Service] Reset URL: {}", resetUrl);
        logger.info("================================================================================");

        if (mailSender == null) {
            logger.warn("JavaMailSender is not initialized. Email was logged above.");
            return false;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            if (fromEmail != null && !fromEmail.isBlank()) {
                message.setFrom(fromEmail);
            } else {
                message.setFrom("noreply@campusguard.edu");
            }
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            logger.info("Password reset email successfully dispatched via SMTP to {}", toEmail);
            return true;
        } catch (Exception e) {
            logger.error("Failed to send email via SMTP to {}: {}. Link was logged for testing.", toEmail, e.getMessage());
            return false;
        }
    }
}
