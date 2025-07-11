package demo.webproject.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import demo.webproject.Entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
      Optional<User>findByEmail(String email);
}
