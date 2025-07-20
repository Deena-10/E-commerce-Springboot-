package demo.webproject.service;

import demo.webproject.Entity.User;
import demo.webproject.dto.UserProfileDTO;

public interface UserService {
    void promoteToAdmin(Long userId);
    void demoteToUser(Long userId);
    void save(User user);

    // ✅ Add this method
    User findByEmail(String email);
    UserProfileDTO getProfile(User user);
}
