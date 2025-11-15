package demo.webproject.service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import demo.webproject.Entity.User;
import demo.webproject.repository.UserRepository;

@Service
public class EmailVerificationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public String generateOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999)); // 6-digit OTP

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setVerificationCode(otp);
        user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        emailService.sendEmail(email, "Your Verification Code", "Your OTP is: " + otp);

        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        return userRepository.findByEmail(email)
            .filter(user -> otp.equals(user.getVerificationCode()) 
                && user.getOtpExpiryTime().isAfter(LocalDateTime.now()))
            .map(user -> {
                user.setVerified(true);
                user.setVerificationCode(null); // Clear OTP
                userRepository.save(user);
                return true;
            }).orElse(false);
    }
}
