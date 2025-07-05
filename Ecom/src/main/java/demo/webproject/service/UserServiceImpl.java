package demo.webproject.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import demo.webproject.Entity.User;
import demo.webproject.dto.UserProfileDTO;
import demo.webproject.repository.UserRepository;

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
    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    // ✅ This method allows saving updated user info (name, phone, address, etc.)
    @Override
    public void save(User user) {
        userRepository.save(user);
    }
    @Override
    public UserProfileDTO getProfile(User user) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setAddress(user.getAddress());
        return dto;
    }

}
