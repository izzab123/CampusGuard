package com.campusguard.controller;

import com.campusguard.dto.*;
import com.campusguard.model.PasswordResetToken;
import com.campusguard.model.User;
import com.campusguard.repository.PasswordResetTokenRepository;
import com.campusguard.repository.UserRepository;
import com.campusguard.service.EmailService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    public static final List<String> ALLOWED_ROLES = List.of(
        "Student",
        "Proctor and DSW",
        "Security Guard",
        "Shift Supervisor",
        "Admin"
    );

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;

    @Value("${campusguard.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    public AuthController(UserRepository userRepository,
                          PasswordResetTokenRepository tokenRepository,
                          EmailService emailService) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
    }

    /**
     * Login endpoint
     * Verifies email and password and returns the user's role in the response.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String trimmedEmail = request.getEmail().trim();
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(trimmedEmail);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(LoginResponse.failure("Invalid credentials. Account not found with this email."));
        }

        User user = userOpt.get();

        // Verify password
        if (!user.getPassword().equals(request.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(LoginResponse.failure("Invalid credentials. Incorrect password."));
        }

        // Optional check if role was specified in request
        if (request.getRole() != null && !request.getRole().isBlank()) {
            if (!user.getRole().equalsIgnoreCase(request.getRole().trim())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(LoginResponse.failure(String.format(
                                "Role mismatch: User has role '%s', but '%s' was selected.",
                                user.getRole(), request.getRole())));
            }
        }

        // Establish session
        HttpSession session = httpRequest.getSession(true);
        session.setAttribute("USER_ID", user.getId());
        session.setAttribute("USER_EMAIL", user.getEmail());
        session.setAttribute("USER_ROLE", user.getRole());

        String sessionToken = "cg-token-" + UUID.randomUUID();
        session.setAttribute("AUTH_TOKEN", sessionToken);

        logger.info("User {} logged in successfully with role: {}", user.getEmail(), user.getRole());

        LoginResponse response = LoginResponse.success(
                sessionToken,
                user.getEmail(),
                user.getRole(),
                user.getFullName(),
                user.getBadgeNumber(),
                user.getDepartment()
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Logout endpoint
     * Clears the user's session or token.
     */
    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        logger.info("Session invalidated on logout.");
        return ResponseEntity.ok(new MessageResponse(true, "Successfully logged out. Session terminated."));
    }

    /**
     * Forgot password flow step 1:
     * User submits email, system generates reset token, sends reset email with link.
     */
    @PostMapping("/forgot-password")
    @Transactional
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        String email = request.getEmail().trim();
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse(false, "No account registered with this institutional email."));
        }

        // Remove old unused tokens for this email
        tokenRepository.deleteByEmail(email);

        // Generate reset token valid for 15 minutes
        String token = UUID.randomUUID().toString().replace("-", "");
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(15);

        PasswordResetToken resetToken = new PasswordResetToken(token, email, expiry);
        tokenRepository.save(resetToken);

        String resetUrl = frontendUrl + "/reset-password?token=" + token;

        // Send actual reset email via EmailService
        emailService.sendPasswordResetEmail(email, resetUrl);

        return ResponseEntity.ok(new MessageResponse(
                true,
                "Password reset email has been sent to " + email + ". Please check your inbox or spam folder.",
                resetUrl
        ));
    }

    /**
     * Forgot password flow step 2:
     * Accepts token + new password to complete reset.
     */
    @PostMapping("/reset-password")
    @Transactional
    public ResponseEntity<MessageResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        String tokenStr = request.getToken().trim();
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(tokenStr);

        if (tokenOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse(false, "Invalid or non-existent password reset token."));
        }

        PasswordResetToken token = tokenOpt.get();

        if (token.isUsed()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse(false, "This reset token has already been used. Please request a new one."));
        }

        if (token.isExpired()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse(false, "This reset token has expired. Reset links are valid for 15 minutes."));
        }

        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(token.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse(false, "Associated user account was not found."));
        }

        User user = userOpt.get();
        user.setPassword(request.getNewPassword());
        userRepository.save(user);

        // Mark token as used
        token.setUsed(true);
        tokenRepository.save(token);

        logger.info("Password successfully updated for user: {}", user.getEmail());

        return ResponseEntity.ok(new MessageResponse(
                true,
                "Password has been reset successfully. You may now log in with your new credentials."
        ));
    }

    /**
     * Validate token endpoint to check validity before rendering the reset form
     */
    @GetMapping("/validate-token")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestParam("token") String tokenStr) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(tokenStr.trim());
        if (tokenOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("valid", false, "message", "Invalid token"));
        }
        PasswordResetToken token = tokenOpt.get();
        if (token.isUsed()) {
            return ResponseEntity.badRequest().body(Map.of("valid", false, "message", "Token already used"));
        }
        if (token.isExpired()) {
            return ResponseEntity.badRequest().body(Map.of("valid", false, "message", "Token has expired"));
        }
        return ResponseEntity.ok(Map.of("valid", true, "email", token.getEmail()));
    }

    /**
     * Available Roles endpoint
     */
    @GetMapping("/roles")
    public ResponseEntity<List<String>> getAvailableRoles() {
        return ResponseEntity.ok(ALLOWED_ROLES);
    }

    /**
     * Seed users list for testing / admin lookup
     */
    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getUsers() {
        List<Map<String, Object>> list = new ArrayList<>();
        for (User u : userRepository.findAll()) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("email", u.getEmail());
            map.put("role", u.getRole());
            map.put("fullName", u.getFullName());
            map.put("badgeNumber", u.getBadgeNumber());
            map.put("department", u.getDepartment());
            map.put("status", u.getStatus());
            map.put("createdAt", u.getCreatedAt());
            list.add(map);
        }
        return ResponseEntity.ok(list);
    }

    /**
     * Admin provisions a new user
     */
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody User newUser) {
        if (newUser.getEmail() == null || newUser.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }
        if (userRepository.findByEmailIgnoreCase(newUser.getEmail().trim()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User with this email already exists"));
        }
        if (newUser.getPassword() == null || newUser.getPassword().isBlank()) {
            newUser.setPassword("12345678");
        }
        if (newUser.getStatus() == null || newUser.getStatus().isBlank()) {
            newUser.setStatus("ACTIVE");
        }
        User saved = userRepository.save(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id", saved.getId(),
                "email", saved.getEmail(),
                "role", saved.getRole(),
                "fullName", saved.getFullName() != null ? saved.getFullName() : "",
                "badgeNumber", saved.getBadgeNumber() != null ? saved.getBadgeNumber() : "",
                "department", saved.getDepartment() != null ? saved.getDepartment() : "",
                "status", saved.getStatus()
        ));
    }

    /**
     * Admin activates / deactivates user status
     */
    @PatchMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newStatus = body.getOrDefault("status", "ACTIVE");
        return userRepository.findById(id).map(u -> {
            u.setStatus(newStatus.toUpperCase());
            userRepository.save(u);
            return ResponseEntity.ok(Map.of("success", true, "id", u.getId(), "status", u.getStatus()));
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Update user profile details
     */
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }
        return userRepository.findByEmailIgnoreCase(email.trim()).map(u -> {
            if (body.containsKey("fullName")) u.setFullName(body.get("fullName"));
            if (body.containsKey("department")) u.setDepartment(body.get("department"));
            if (body.containsKey("badgeNumber")) u.setBadgeNumber(body.get("badgeNumber"));
            userRepository.save(u);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "email", u.getEmail(),
                    "fullName", u.getFullName(),
                    "department", u.getDepartment(),
                    "badgeNumber", u.getBadgeNumber()
            ));
        }).orElse(ResponseEntity.notFound().build());
    }
}
