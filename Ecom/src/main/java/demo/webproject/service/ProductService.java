package demo.webproject.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import demo.webproject.Entity.Product;
import demo.webproject.repository.OrderItemRepository;
import demo.webproject.repository.ProductRepository;
import java.util.Objects;

import jakarta.transaction.Transactional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    public List<String> getSuggestions(String query) {
        List<Product> matchingProducts = productRepository.findByNameContainingIgnoreCase(query);
        List<String> productNames = matchingProducts.stream()
            .map(Product::getName)
            .collect(Collectors.toList());

        List<String> categories = matchingProducts.stream()
            .map(Product::getCategory)
            .filter(Objects::nonNull)
            .distinct()
            .collect(Collectors.toList());

        List<String> combined = new ArrayList<>();
        combined.addAll(productNames);
        combined.addAll(categories);
        return combined;
    }

    
    public List<Product> getAllProducts() {
        return productRepository.findByDeletedFalse(); // ✅ Only return active products
    }

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        return productRepository.findById(id).map(product -> {
            product.setName(updatedProduct.getName());
            product.setDescription(updatedProduct.getDescription());
            product.setPrice(updatedProduct.getPrice());
            product.setStock(updatedProduct.getStock());
            product.setImg(updatedProduct.getImg());
            product.setRating(updatedProduct.getRating()); // If needed
            product.setCategory(updatedProduct.getCategory()); 
            return productRepository.save(product);
        }).orElse(null);
    }

    public boolean deleteProduct(Long id) {
        return productRepository.findById(id).map(product -> {
            if (orderItemRepository.existsByProductId(id)) {
                throw new IllegalStateException("❌ Product cannot be deleted because it is part of one or more orders.");
            }
            product.setDeleted(true); // ✅ Soft delete
            productRepository.save(product);
            return true;
        }).orElse(false);
    }

    public Product updateStock(Long productId, int newStock) {
        return productRepository.findById(productId).map(product -> {
            product.setStock(newStock);
            return productRepository.save(product);
        }).orElse(null);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category);
    }

    @Transactional
    public boolean decreaseStock(Long productId, int qty) {
        return productRepository.decreaseStockIfAvailable(productId, qty) > 0;
    }
}
