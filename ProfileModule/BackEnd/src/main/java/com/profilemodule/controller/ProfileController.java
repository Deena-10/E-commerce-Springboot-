package com.profilemodule.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.profilemodule.dto.UserProfileDTO;
import com.profilemodule.entity.User;
import com.profilemodule.service.UserService;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<?> getUserProfile(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        // Return only necessary fields using DTO
        UserProfileDTO dto = new UserProfileDTO(
                user.getName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getAddress()
        );

        return ResponseEntity.ok(dto);
    }
}
