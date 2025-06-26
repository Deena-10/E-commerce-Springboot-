package demo.webproject.repository;

import demo.webproject.Entity.Product;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // ✅ Decrease stock if enough is available
    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.stock = p.stock - :qty WHERE p.id = :id AND p.stock >= :qty")
    int decreaseStockIfAvailable(@Param("id") Long id, @Param("qty") int qty);

    // ✅ Filter by category (case-insensitive)
    List<Product> findByCategoryIgnoreCase(String category);

    // ✅ Only return products that are NOT soft-deleted
    List<Product> findByDeletedFalse();
    List<Product> findByNameContainingIgnoreCase(String query);

}
