package com.profilemodule.service;

import com.profilemodule.dto.UserProfileDTO;
import com.profilemodule.entity.User;
import com.profilemodule.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserProfileDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        return new UserProfileDTO(
                user.getName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getAddress()
        );
    }
}
