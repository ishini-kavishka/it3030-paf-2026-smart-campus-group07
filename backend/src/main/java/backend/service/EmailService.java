package backend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import backend.model.User;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class EmailService {

    private final JavaMailSender emailSender;
    
    // Store email -> {otp, timestamp} in memory
    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();

    private static class OtpData {
        String otp;
        long timestamp;
        
        OtpData(String otp, long timestamp) {
            this.otp = otp;
            this.timestamp = timestamp;
        }
    }

    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    public void sendOtp(String toEmail) {
        String otp = generateOtp();
        
        // Store the OTP with 10 minute expiration (600,000 ms)
        otpStorage.put(toEmail, new OtpData(otp, System.currentTimeMillis() + 600000));
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("weerasuriyaminidu@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Smart Campus - Your Verification Code");
        message.setText("Your OTP verification code is: " + otp + "\n\nThis code will expire in 10 minutes.");
        
        emailSender.send(message);
    }

    public boolean verifyOtp(String email, String otp) {
        if (otpStorage.containsKey(email)) {
            OtpData data = otpStorage.get(email);
            if (data.timestamp > System.currentTimeMillis() && data.otp.equals(otp)) {
                // Remove OTP after successful verify
                otpStorage.remove(email);
                return true;
            }
            if (data.timestamp <= System.currentTimeMillis()) {
                otpStorage.remove(email); // Cleanup expired
            }
        }
        return false;
    }

    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // 6 digit OTP
        return String.valueOf(otp);
    }

    public void sendNewUserAlert(User user) {
        SimpleMailMessage message = new SimpleMailMessage();
        // Since no spring.mail.username is reliably pulled contextually for From, hardcode to system email
        message.setFrom("weerasuriyaminidu@gmail.com");
        message.setTo("weerasuriyaminidu@gmail.com");
        message.setSubject("Smart Campus - New User Registration");
        message.setText("A new user has successfully registered on the Smart Campus platform.\n\n" +
                "User Details:\n" +
                "First Name: " + user.getFirstName() + "\n" +
                "Last Name: " + user.getLastName() + "\n" +
                "Email: " + user.getEmail() + "\n" +
                "Joined Date: " + user.getCreatedAt() + "\n");
        
        emailSender.send(message);
    }

    public void sendWelcomeEmail(User user) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("weerasuriyaminidu@gmail.com");
        message.setTo(user.getEmail());
        message.setSubject("Welcome to Smart Campus, " + user.getFirstName() + "!");
        message.setText("Dear " + user.getFirstName() + ",\n\n" +
                "Welcome to Smart Campus! We are thrilled to have you on board.\n" +
                "You can now explore facilities, book resources, and join clubs through your dashboard.\n\n" +
                "Best regards,\n" +
                "The Smart Campus Team");
        
        emailSender.send(message);
    }

    public void sendAdminAlert(User user, String alertMessage) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("weerasuriyaminidu@gmail.com");
        message.setTo(user.getEmail());
        message.setSubject("🔔 Smart Campus — Official Admin Alert");
        message.setText(
                "═══════════════════════════════════════\n" +
                "   SMART CAMPUS — OFFICIAL ADMIN ALERT  \n" +
                "═══════════════════════════════════════\n\n" +
                "Dear " + user.getFirstName() + " " + user.getLastName() + ",\n\n" +
                "You have received an official message from the Smart Campus Administration:\n\n" +
                "──────────────────────────────────────\n" +
                alertMessage + "\n" +
                "──────────────────────────────────────\n\n" +
                "This message has also been sent to your in-app notification center.\n\n" +
                "Best regards,\n" +
                "Smart Campus Administration\n" +
                "═══════════════════════════════════════"
        );
        emailSender.send(message);
    }
}

