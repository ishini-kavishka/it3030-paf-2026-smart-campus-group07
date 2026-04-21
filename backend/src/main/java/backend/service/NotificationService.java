package backend.service;

import backend.model.Notification;
import backend.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void createNotification(String username, String message) {
        Notification notification = new Notification(username, message, LocalDateTime.now());
        notificationRepository.save(notification);
    }
}
