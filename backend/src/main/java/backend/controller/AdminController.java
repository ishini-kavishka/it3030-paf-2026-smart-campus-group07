package backend.controller;

import backend.model.User;
import backend.repository.UserRepository;
import backend.service.EmailService;
import backend.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:5173"})
public class AdminController {

    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;

    public AdminController(UserRepository userRepository, NotificationService notificationService, EmailService emailService) {
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.emailService = emailService;
    }

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/users/{id}/suspend")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> suspendUser(@PathVariable String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setAccountStatus("SUSPENDED");
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/users/{id}/activate")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> activateUser(@PathVariable String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setAccountStatus("ACTIVE");
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/users/{username}/message")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> sendMessage(@PathVariable String username, @RequestBody Map<String, Object> payload) {
        String msg = (String) payload.get("message");
        Boolean sendEmail = payload.get("sendEmail") instanceof Boolean ? (Boolean) payload.get("sendEmail") : false;

        if (msg == null || msg.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Message content is required."));
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Build notification message — tag it if also emailed
        String notificationMsg = sendEmail
                ? "[EMAIL DISPATCHED] ADMIN MESSAGE: " + msg.trim()
                : "ADMIN MESSAGE: " + msg.trim();

        notificationService.createNotification(username, notificationMsg);

        // Send email if requested
        if (Boolean.TRUE.equals(sendEmail)) {
            try {
                emailService.sendAdminAlert(user, msg.trim());
            } catch (Exception e) {
                // Notification was already sent — log email failure but don't fail the request
                System.err.println("Failed to send admin alert email: " + e.getMessage());
            }
        }

        return ResponseEntity.ok().build();
    }
}
