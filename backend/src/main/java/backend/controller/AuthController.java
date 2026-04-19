package backend.controller;

import backend.dto.*;
import backend.service.AuthService;
import backend.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final EmailService emailService;

    public AuthController(AuthService authService, EmailService emailService) {
        this.authService = authService;
        this.emailService = emailService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/signup/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody OtpRequest request) {
        String email = request.getEmail();
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required."));
        }

        try {
            if (authService.emailExists(email)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email is already registered."));
            }
            emailService.sendOtp(email);
            return ResponseEntity.ok(Map.of("message", "OTP sent successfully to " + email));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to send OTP. Please check your email address or server settings."));
        }
    }

    @PostMapping("/signup/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpRequest request) {
        boolean isValid = emailService.verifyOtp(request.getEmail(), request.getOtp());
        if (isValid) {
            return ResponseEntity.ok("OTP verified successfully.");
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired OTP.");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        if (authService.usernameExists(request.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username is already taken."));
        }
        if (authService.emailExists(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is already registered."));
        }
        
        try {
            authService.signup(request);
            return ResponseEntity.ok(Map.of("message", "User registered successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to register user: " + e.getMessage()));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<AuthResponse> updateProfile(@RequestBody UpdateProfileRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        return ResponseEntity.ok(authService.updateProfile(currentUsername, request));
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        try {
            authService.changePassword(currentUsername, request);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/profile")
    public ResponseEntity<?> deleteProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        authService.deleteProfile(currentUsername);
        return ResponseEntity.ok().build();
    }
}
