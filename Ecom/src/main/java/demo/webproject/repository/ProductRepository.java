package demo.webproject.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import demo.webproject.Entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

}
