package demo.webproject.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import demo.webproject.Entity.Product;
import demo.webproject.service.ProductService;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    // ✅ Public: Get all products
    @GetMapping
    public List<Product> showAllProducts() {
        return service.getAllProducts();
    }

    // ✅ Public: Get product by ID (safe with Optional)
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Public: Get products by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getByCategory(@PathVariable String category) {
        List<Product> products = service.getProductsByCategory(category);
        return ResponseEntity.ok(products);
    }

    // ✅ Public: Search by name or category
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam("query") String query) {
        List<Product> allProducts = service.getAllProducts();
        List<Product> filtered = allProducts.stream()
                .filter(p -> p.getName().toLowerCase().contains(query.toLowerCase()) ||
                        (p.getCategory() != null && p.getCategory().toLowerCase().contains(query.toLowerCase())))
                .collect(Collectors.toList());
        return ResponseEntity.ok(filtered);
    }

    // ✅ Public: Search suggestions for name/category
    @GetMapping("/search-suggestions")
    public ResponseEntity<List<String>> getSuggestions(@RequestParam("query") String query) {
        List<String> suggestions = service.getSuggestions(query);
        return ResponseEntity.ok(suggestions);
    }

    // 🔐 Admin-only: Add a new product
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Product addProduct(@RequestBody Product product) {
        return service.addProduct(product);
    }

    // 🔐 Admin-only: Update product
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        Product product = service.updateProduct(id, updatedProduct);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(product);
    }

    // 🔐 Admin-only: Delete product (soft delete)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        boolean deleted = service.deleteProduct(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok("Product deleted successfully");
    }

    // 🔐 Admin-only: Set exact stock value
    @PutMapping("/updateStock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> updateStock(@RequestBody Map<String, Object> payload) {
        Long productId = Long.valueOf(payload.get("productId").toString());
        int newStock = ((Number) payload.get("stock")).intValue();

        Product updatedProduct = service.updateStock(productId, newStock);
        if (updatedProduct == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedProduct);
    }

    // 🔐 Admin-only: Decrease stock by quantity
    @PutMapping("/{id}/stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateStockByQuantity(@PathVariable Long id, @RequestParam int quantity) {
        boolean success = service.decreaseStock(id, -quantity);
        if (!success) {
            return ResponseEntity.badRequest().body("Insufficient stock or update failed");
        }
        return ResponseEntity.ok("Stock updated successfully");
    }
}
