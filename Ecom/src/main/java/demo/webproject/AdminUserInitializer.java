package demo.webproject;

import demo.webproject.Entity.User;
import demo.webproject.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminUserInitializer {

    @Bean
    public CommandLineRunner createAdmin(UserRepository userRepo, PasswordEncoder encoder) {
        return args -> {
            String adminEmail = "mdeena910@gmail.com";
            if (userRepo.findByEmail(adminEmail).isEmpty()) {
                User admin = new User();
                admin.setName("Admin User");
                admin.setEmail(adminEmail);
                admin.setPassword(encoder.encode("deena09")); // raw password
                admin.setRole("ADMIN");
                userRepo.save(admin);
                System.out.println("✅ Admin user created: " + adminEmail);
            } else {
                System.out.println("⚠️ Admin already exists.");
            }
        };
    }
}
