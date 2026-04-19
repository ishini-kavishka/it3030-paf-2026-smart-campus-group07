package backend.config;

import backend.model.User;
import backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByUsername("testuser")) {
            User testUser = new User(
                    "testuser",
                    passwordEncoder.encode("password123"),
                    "Test",
                    "User",
                    LocalDate.of(1995, 5, 20),
                    "testuser@smartcampus.com",
                    "0701234567",
                    "123 Smart Ave, Techville",
                    "",
                    "ROLE_STUDENT",
                    "ACTIVE",
                    LocalDateTime.now()
            );

            userRepository.save(testUser);
            System.out.println("Test user 'testuser' with password 'password123' created.");
        }
        
        if (!userRepository.existsByUsername("admin")) {
            User adminUser = new User(
                    "admin",
                    passwordEncoder.encode("admin123"),
                    "System",
                    "Administrator",
                    LocalDate.of(1990, 1, 1),
                    "admin@smartcampus.com",
                    "0771234567",
                    "Admin Block, Smart Campus",
                    "",
                    "ROLE_ADMIN",
                    "ACTIVE",
                    LocalDateTime.now()
            );

            userRepository.save(adminUser);
            System.out.println("Admin user 'admin' with password 'admin123' created.");
        }
    }
}
