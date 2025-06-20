package demo.webproject.repository;

import demo.webproject.Entity.Product;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.stock = p.stock - :qty WHERE p.id = :id AND p.stock >= :qty")
    int decreaseStockIfAvailable(@Param("id") Long id, @Param("qty") int qty);

    // ✅ Add this method to support category filtering
    List<Product> findByCategoryIgnoreCase(String category);
}
