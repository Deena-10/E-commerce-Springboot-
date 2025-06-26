package demo.webproject.service;

import demo.webproject.Entity.User;

public interface UserService {
    void promoteToAdmin(Long userId);
    void demoteToUser(Long userId);
    void save(User user);

    // ✅ Add this method
    User findByEmail(String email);
}
