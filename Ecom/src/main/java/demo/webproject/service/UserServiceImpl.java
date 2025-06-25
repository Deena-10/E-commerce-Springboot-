package demo.webproject.service;

import demo.webproject.Entity.User;
import demo.webproject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void promoteToAdmin(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole("ADMIN");
        userRepository.save(user);
    }

    @Override
    public void demoteToUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole("USER");
        userRepository.save(user);
    }

    // ✅ This method allows saving updated user info (name, phone, address, etc.)
    @Override
    public void save(User user) {
        userRepository.save(user);
    }
}
