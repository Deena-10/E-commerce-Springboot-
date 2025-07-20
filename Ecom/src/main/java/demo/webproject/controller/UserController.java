package demo.webproject.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import demo.webproject.Entity.User;
import demo.webproject.dto.UserProfileDTO;
import demo.webproject.security.CustomUserDetails;
import demo.webproject.service.UserService;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService userService;

    // ✅ Get profile of logged-in user
    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getProfile(@AuthenticationPrincipal CustomUserDetails customUser) {
        if (customUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        User user = customUser.getUser();
        UserProfileDTO profile = userService.getProfile(user);
        return ResponseEntity.ok(profile);
    }

    // ✅ Update profile of logged-in user
    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateProfile(@AuthenticationPrincipal CustomUserDetails customUser,
                                                        @RequestBody UserProfileDTO updatedProfile) {
        if (customUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        User user = customUser.getUser();
        user.setName(updatedProfile.getName());
        user.setPhoneNumber(updatedProfile.getPhoneNumber());
        user.setAddress(updatedProfile.getAddress());

        userService.save(user);

        UserProfileDTO dto = new UserProfileDTO(
                user.getName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getAddress()
        );

        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/promote/{userId}")
    public ResponseEntity<String> promoteToAdmin(@PathVariable Long userId) {
        try {
            userService.promoteToAdmin(userId);
            return ResponseEntity.ok("User promoted to ADMIN successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/demote/{userId}")
    public ResponseEntity<String> demoteToUser(@PathVariable Long userId) {
        try {
            userService.demoteToUser(userId);
            return ResponseEntity.ok("User demoted to USER successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }
}
