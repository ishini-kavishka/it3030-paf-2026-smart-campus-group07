package backend.service;

import backend.dto.*;
import backend.model.User;
import backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @PostConstruct
    public void seedUsers() {
        if (!userRepository.existsByEmail("admin@campus.edu")) {
            User testUser = new User("Admin User", "admin@campus.edu", "Admin@123", "admin");
            userRepository.save(testUser);
        }
        if (!userRepository.existsByEmail("user@campus.edu")) {
            User testUser = new User("Test User", "user@campus.edu", "User@123", "student");
            userRepository.save(testUser);
        }
    }

    public boolean checkEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setName(request.getFirstName() + " " + request.getLastName());
        user.setDob(request.getDob());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword()); // Raw for now, should be hashed in production
        user.setImageUrl(request.getImageUrl());
        user.setRole("student"); // Default role to student upon sign up
        user.setSuspended(false);

        User savedUser = userRepository.save(user);

        String token = UUID.randomUUID().toString();
        User returnUser = new User();
        returnUser.setId(savedUser.getId());
        returnUser.setName(savedUser.getName());
        returnUser.setEmail(savedUser.getEmail());
        returnUser.setRole(savedUser.getRole());
        
        return new AuthResponse(token, returnUser);
    }

    public AuthResponse login(LoginRequest request) {
        // Can be email or username
        String identifier = request.getEmail(); 
        Optional<User> userOpt = userRepository.findByEmailOrUsername(identifier, identifier);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.isSuspended()) {
                throw new RuntimeException("Your account has been suspended. Please contact the administrator.");
            }
            
            // Since we're not hashing passwords yet, we use raw string comparison
            if (user.getPassword().equals(request.getPassword())) {
                String token = UUID.randomUUID().toString(); // Dummy token
                User returnUser = new User(user.getName(), user.getEmail(), null, user.getRole());
                returnUser.setId(user.getId());
                return new AuthResponse(token, returnUser);
            }
        }
        throw new RuntimeException("Invalid credentials");
    }

    public User getUserProfile(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateProfile(String userId, UserProfileDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setName(request.getName());
        if (!user.getEmail().equals(request.getEmail())) {
            // Ensure no duplicate emails
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already in use");
            }
            user.setEmail(request.getEmail());
        }
        return userRepository.save(user);
    }

    public void changePassword(String userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(request.getCurrentPassword())) {
            throw new RuntimeException("Incorrect current password");
        }
        user.setPassword(request.getNewPassword());
        userRepository.save(user);
    }

    public void deleteProfile(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(userId);
    }

    public List<User> getAllUsersExceptAdmins() {
        // Assuming "admin" is the exact role string.
        return userRepository.findByRoleNot("admin");
    }

    public void updateSuspensionStatus(String userId, boolean suspended) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setSuspended(suspended);
        userRepository.save(user);
    }
}
