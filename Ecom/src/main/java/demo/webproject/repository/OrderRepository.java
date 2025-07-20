package demo.webproject.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import demo.webproject.Entity.Order;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
}
