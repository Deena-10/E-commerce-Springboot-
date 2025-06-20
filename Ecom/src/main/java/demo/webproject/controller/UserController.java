package demo.webproject.controller;

import demo.webproject.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class UserController {

    @Autowired
    private UserService userService;

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/promote/{userId}")
    public String promoteToAdmin(@PathVariable Long userId) {
        userService.promoteToAdmin(userId);
        return "User promoted to ADMIN successfully";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/demote/{userId}")
    public String demoteToUser(@PathVariable Long userId) {
        userService.demoteToUser(userId);
        return "User demoted to USER successfully";
    }
}
