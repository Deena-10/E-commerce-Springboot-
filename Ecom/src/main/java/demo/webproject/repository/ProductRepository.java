package demo.webproject.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import demo.webproject.Entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // ✅ Decrease stock if enough is available
    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.stock = p.stock - :qty WHERE p.id = :id AND p.stock >= :qty")
    int decreaseStockIfAvailable(@Param("id") Long id, @Param("qty") int qty);

    // ✅ Filter by category (case-insensitive)
    List<Product> findByCategoryIgnoreCase(String category);
    Optional<Product> findById(Long id);

    // ✅ Only return products that are NOT soft-deleted
    List<Product> findByDeletedFalse();
    List<Product> findByNameContainingIgnoreCase(String query);

}
