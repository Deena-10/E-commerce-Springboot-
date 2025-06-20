package demo.webproject.service;

public interface UserService {
    void promoteToAdmin(Long userId);
    void demoteToUser(Long userId);
}
