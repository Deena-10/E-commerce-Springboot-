package com.profilemodule.service;

import com.profilemodule.dto.UserProfileDTO;

public interface UserService {
    UserProfileDTO getUserByEmail(String email);
}
