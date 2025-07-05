package demo.webproject.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import demo.webproject.Entity.User;
import demo.webproject.dto.UserProfileDTO;
import demo.webproject.service.UserService;
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    // ✅ Get profile of logged-in user
    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getProfile(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        UserProfileDTO profile = userService.getProfile(user);
        return ResponseEntity.ok(profile);
    }

    // ✅ Update profile of logged-in user
    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateProfile(@AuthenticationPrincipal User user,
                                                        @RequestBody UserProfileDTO updatedProfile) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

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

    // ✅ Admin-only: promote user to admin
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/promote/{userId}")
    public String promoteToAdmin(@PathVariable Long userId) {
        userService.promoteToAdmin(userId);
        return "User promoted to ADMIN successfully";
    }

    // ✅ Admin-only: demote user to normal
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/demote/{userId}")
    public String demoteToUser(@PathVariable Long userId) {
        userService.demoteToUser(userId);
        return "User demoted to USER successfully";
    }
}
