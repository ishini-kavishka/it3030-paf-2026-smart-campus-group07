package backend.controller;

import backend.model.User;
import backend.repository.UserRepository;
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

    public AdminController(UserRepository userRepository, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.notificationService = notificationService;
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
    public ResponseEntity<?> sendMessage(@PathVariable String username, @RequestBody Map<String, String> payload) {
        String msg = payload.get("message");
        if (msg == null || msg.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Message content is required."));
        }
        notificationService.createNotification(username, "ADMIN MESSAGE: " + msg.trim());
        return ResponseEntity.ok().build();
    }
}

