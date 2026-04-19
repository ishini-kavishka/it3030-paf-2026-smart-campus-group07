package backend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

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
}
