package backend.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    // Structure: Email -> [OTP String, Expiration Time]
    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();

    private static class OtpData {
        String code;
        LocalDateTime expirationTime;

        OtpData(String code, LocalDateTime expirationTime) {
            this.code = code;
            this.expirationTime = expirationTime;
        }
    }

    public String generateAndStoreOtp(String email) {
        // Generate a random 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        // Valid for 5 minutes
        otpStorage.put(email, new OtpData(otp, LocalDateTime.now().plusMinutes(5)));
        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        OtpData data = otpStorage.get(email);
        if (data == null) return false;

        if (LocalDateTime.now().isAfter(data.expirationTime)) {
            otpStorage.remove(email); // Clean up expired
            return false;
        }

        if (data.code.equals(otp)) {
            otpStorage.remove(email); // Successful verification consumes the OTP
            return true;
        }

        return false;
    }
}
