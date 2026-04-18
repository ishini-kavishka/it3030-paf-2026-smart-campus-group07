package backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otpCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Your Smart Campus Registration OTP");
        message.setText("Welcome to Smart Campus!\n\nYour one-time verification code is: " + otpCode + 
                        "\n\nThis code will expire in 5 minutes. Do not share this code with anyone.");
        mailSender.send(message);
    }
}
