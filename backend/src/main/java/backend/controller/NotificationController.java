package backend.controller;

import backend.model.Notification;
import backend.repository.NotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:5173"})
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (username == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(notificationRepository.findByUsernameOrderByCreatedAtDesc(username));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable String id) {
        notificationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
