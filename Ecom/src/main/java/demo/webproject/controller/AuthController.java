package demo.webproject.controller;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;

import demo.webproject.Entity.User;
import demo.webproject.dto.LoginRequest;
import demo.webproject.repository.UserRepository;
import demo.webproject.security.GoogleTokenVerifier;
import demo.webproject.security.JwtService;
import demo.webproject.service.EmailService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private EmailService emailService;
    
    @Autowired
    private GoogleTokenVerifier googleTokenVerifier;

    
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        User existingUser = userRepo.findByEmail(user.getEmail()).orElse(null);

        if (existingUser != null) {
            if (!existingUser.isVerified()) {
                // Generate new OTP and resend
                String otp = String.format("%06d", new Random().nextInt(999999));
                existingUser.setVerificationCode(otp);
                existingUser.setOtpExpiryTime(LocalDateTime.now().plusMinutes(5));
                userRepo.save(existingUser);

                emailService.sendEmailAsync(
                    existingUser.getEmail(),
                    "Email Verification Code",
                    "Your new verification code is: " + otp + "\n(This code will expire in 5 minutes)"
                );

                return ResponseEntity.ok("An account with this email exists but is not verified. A new OTP has been sent.");
            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Email already in use");
            }
        }

        // Normal signup flow for new user
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(user.getRole() == null || user.getRole().isBlank() ? "USER" : user.getRole());
        String otp = String.format("%06d", new Random().nextInt(999999));
        user.setVerificationCode(otp);
        user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(5));
        user.setVerified(false);

        userRepo.save(user);

        emailService.sendEmailAsync(
            user.getEmail(),
            "Email Verification Code",
            "Your verification code is: " + otp + "\n(This code will expire in 5 minutes)"
        );

        return ResponseEntity.ok("Signup successful! Please check your email for the verification code.");
    }


    /* ---------- VERIFY OTP + AUTO LOGIN ---------- */
    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String code = body.get("code");

        User user = userRepo.findByEmail(email).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found");

        if (user.isVerified()) {
            // If already verified, return JWT tokens
            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);
            user.setRefreshToken(refreshToken);
            userRepo.save(user);

            return ResponseEntity.ok(Map.of(
                    "message", "User already verified.",
                    "accessToken", accessToken,
                    "refreshToken", refreshToken,
                    "role", user.getRole()
            ));
        }

        if (user.getVerificationCode() != null && user.getVerificationCode().equals(code)) {
            if (user.getOtpExpiryTime() != null && user.getOtpExpiryTime().isBefore(LocalDateTime.now())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Verification code expired");
            }

            user.setVerified(true);
            user.setVerificationCode(null);
            user.setOtpExpiryTime(null);

            // Generate JWT tokens
            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);
            user.setRefreshToken(refreshToken);
            userRepo.save(user);

            return ResponseEntity.ok(Map.of(
                    "message", "Email verified successfully!",
                    "accessToken", accessToken,
                    "refreshToken", refreshToken,
                    "role", user.getRole()
            ));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid verification code");
        }
    }


    /* ---------- RESEND OTP ---------- */
    @PostMapping("/resend-code")
    public ResponseEntity<?> resendCode(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        User user = userRepo.findByEmail(email).orElse(null);

        if (user == null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found");
        if (user.isVerified()) return ResponseEntity.ok("User already verified.");

        String otp = String.format("%06d", new Random().nextInt(999999));
        user.setVerificationCode(otp);
        user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(5));
        userRepo.save(user);

        emailService.sendEmail(user.getEmail(), "Email Verification Code",
                "Your new verification code is: " + otp + "\n(This code will expire in 5 minutes)");

        return ResponseEntity.ok("Verification code resent successfully.");
    }

    /* ---------- LOGIN ---------- */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest creds) {
        User user = userRepo.findByEmail(creds.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isVerified()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Please verify your email first.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(creds.getEmail(), creds.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        user.setRefreshToken(refreshToken);
        userRepo.save(user);

        return ResponseEntity.ok(Map.of(
                "accessToken", accessToken,
                "refreshToken", refreshToken,
                "role", user.getRole()
        ));
    }
    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {
        String googleToken = body.get("token"); // The ID token from Google

        // Verify token with Google
        GoogleIdToken.Payload payload = googleTokenVerifier.verify(googleToken);
        if (payload == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Google token");
        }

        String email = payload.getEmail();
        String name = (String) payload.get("name");

        User user = userRepo.findByEmail(email).orElse(null);
        if (user == null) {
            // Register the Google user if not exists
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setVerified(true); // Google is trusted, no OTP needed
            user.setRole("USER");
            userRepo.save(user);
        }

        // Generate JWT
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        user.setRefreshToken(refreshToken);
        userRepo.save(user);

        return ResponseEntity.ok(Map.of(
            "accessToken", accessToken,
            "refreshToken", refreshToken,
            "role", user.getRole()
        ));
    }

}
