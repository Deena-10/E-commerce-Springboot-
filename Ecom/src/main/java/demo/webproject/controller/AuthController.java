package demo.webproject.controller;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import demo.webproject.Entity.User;
import demo.webproject.dto.LoginRequest;
import demo.webproject.repository.UserRepository;
import demo.webproject.util.JwtTokenUtil;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtTokenUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            if (userRepo.findByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email already in use");
            }

            user.setPassword(passwordEncoder.encode(user.getPassword()));
            if (user.getRole() == null || user.getRole().isEmpty()) {
                user.setRole("USER");
            }

            userRepo.save(user);
            return ResponseEntity.ok("Signup successful");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Signup failed");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest creds) {
        try {
            User user = userRepo.findByEmail(creds.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email"));
            if (!passwordEncoder.matches(creds.getPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }

            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
            return ResponseEntity.ok(Map.of(
                "token", token,
                "role", user.getRole()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login failed");
        }
    }
}
