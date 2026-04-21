package backend.service;

import backend.config.JwtUtil;
import backend.dto.*;
import backend.model.User;
import backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;



@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CustomUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;
    private final EmailService emailService;

    @Autowired
    public AuthService(UserRepository userRepository, CustomUserDetailsService userDetailsService,
                       JwtUtil jwtUtil, AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder,
                       NotificationService notificationService, EmailService emailService) {
        this.userRepository = userRepository;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.notificationService = notificationService;
        this.emailService = emailService;
    }

    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean usernameExists(String username) {
        return userRepository.existsByUsername(username);
    }

    public void signup(SignupRequest request) {
        // Validate required fields
        if (request.getFirstName() == null || request.getFirstName().trim().isEmpty()) {
            throw new RuntimeException("First name is required");
        }
        if (request.getLastName() == null || request.getLastName().trim().isEmpty()) {
            throw new RuntimeException("Last name is required");
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        
        User user = new User(
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                request.getFirstName().trim(),
                request.getLastName().trim(),
                request.getDob(),
                request.getEmail().trim(),
                request.getPhoneNumber() != null ? request.getPhoneNumber().trim() : null,
                request.getAddress() != null ? request.getAddress().trim() : null,
                request.getProfileImage(),
                "ROLE_STUDENT",
                "ACTIVE",
                LocalDateTime.now()
        );
        userRepository.save(user);
        notificationService.createNotification(request.getUsername(), "Welcome to our system, " + request.getFirstName() + "!");
        emailService.sendNewUserAlert(user);
        emailService.sendWelcomeEmail(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);
        
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        notificationService.createNotification(user.getUsername(), "Welcome back, " + user.getFirstName() + "!");

        return new AuthResponse(
                jwt,
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole(),
                user.getPhoneNumber(),
                user.getAddress(),
                user.getProfileImage(),
                user.getDob(),
                user.getCreatedAt()
        );
    }

    public AuthResponse googleLogin(String tokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList("111206311022-2cbq7i20jd0c7e555iiafkuje7ovn3h6.apps.googleusercontent.com"))
                    .build();

            GoogleIdToken idToken = verifier.verify(tokenString);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");
                String pictureUrl = (String) payload.get("picture");
                String givenName = (String) payload.get("given_name");
                String familyName = (String) payload.get("family_name");

                Optional<User> optionalUser = userRepository.findByUsernameOrEmail(email, email);
                User user;

                if (optionalUser.isEmpty()) {
                    // Auto-provision user
                    user = new User();
                    user.setUsername(email); 
                    // Set an unusable encoded password since they login via Google
                    user.setPassword(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
                    user.setFirstName(givenName != null && !givenName.trim().isEmpty() ? givenName : (name != null ? name : "User"));
                    user.setLastName(familyName != null && !familyName.trim().isEmpty() ? familyName : "");
                    user.setEmail(email);
                    user.setRole("ROLE_STUDENT");
                    user.setAccountStatus("ACTIVE");
                    user.setProfileImage(pictureUrl);
                    user.setCreatedAt(LocalDateTime.now());
                    // Initialize other fields to prevent null issues
                    user.setPhoneNumber(null);
                    user.setAddress(null);
                    user.setDob(null);

                    userRepository.save(user);
                    notificationService.createNotification(email, "Welcome to our system via Google, " + user.getFirstName() + "!");
                    emailService.sendNewUserAlert(user);
                    emailService.sendWelcomeEmail(user);
                } else {
                    user = optionalUser.get();
                    notificationService.createNotification(user.getUsername(), "Welcome back, " + user.getFirstName() + "!");
                }

                // Generate JWT using UserDetails
                UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
                String jwt = jwtUtil.generateToken(userDetails);

                return new AuthResponse(
                        jwt,
                        user.getUsername(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getPhoneNumber(),
                        user.getAddress(),
                        user.getProfileImage(),
                        user.getDob(),
                        user.getCreatedAt()
                );
            } else {
                throw new RuntimeException("Invalid Google ID token.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Google Authentication Failed: " + e.getMessage());
        }
    }

    public AuthResponse updateProfile(String username, UpdateProfileRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Validate required fields
        if (request.getFirstName() == null || request.getFirstName().trim().isEmpty()) {
            throw new RuntimeException("First name cannot be empty");
        }
        if (request.getLastName() == null || request.getLastName().trim().isEmpty()) {
            throw new RuntimeException("Last name cannot be empty");
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email cannot be empty");
        }
        
        // Check if new email is already in use by another user
        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
                
        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setEmail(request.getEmail().trim());
        if (request.getDob() != null) user.setDob(request.getDob());
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().trim().isEmpty()) {
            user.setPhoneNumber(request.getPhoneNumber().trim());
        }
        if (request.getAddress() != null && !request.getAddress().trim().isEmpty()) {
            user.setAddress(request.getAddress().trim());
        }
        
        userRepository.save(user);

        return new AuthResponse(
                jwtUtil.generateToken(userDetailsService.loadUserByUsername(username)),
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole(),
                user.getPhoneNumber(),
                user.getAddress(),
                user.getProfileImage(),
                user.getDob(),
                user.getCreatedAt()
        );
    }

    public void changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid current password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        notificationService.createNotification(username, "Your password was recently modified.");
    }

    public void deleteProfile(@NonNull String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }
}
