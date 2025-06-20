package demo.webproject.controller;

import demo.webproject.Entity.User;
import demo.webproject.dto.LoginRequest;
import demo.webproject.repository.UserRepository;
import demo.webproject.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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

    /* ----------  SIGN‑UP  ---------- */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            if (userRepo.findByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Email already in use");
            }

            user.setPassword(passwordEncoder.encode(user.getPassword()));
            if (user.getRole() == null || user.getRole().isBlank()) {
                user.setRole("USER");
            }

            userRepo.save(user);
            return ResponseEntity.ok("Signup successful");
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Signup failed");
        }
    }

    /* ----------  LOGIN  ---------- */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest creds) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            creds.getEmail(), creds.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userRepo.findByEmail(creds.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String token = jwtService.generateToken((org.springframework.security.core.userdetails.User) authentication.getPrincipal(), user.getRole());

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "role", user.getRole()
            ));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }
    }
}
