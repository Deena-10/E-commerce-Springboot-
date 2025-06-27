package demo.webproject.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

    // ✅ Public: Get product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = service.getProductById(id);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(product);
    }

    // ✅ 🔍 Public: Get products by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getByCategory(@PathVariable String category) {
        List<Product> products = service.getProductsByCategory(category);
        return ResponseEntity.ok(products);
    }

    // 🔐 Admin-only: Add a new product
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Product addProduct(@RequestBody Product product) {
        return service.addProduct(product);
    }

    // Admin-only: Update product details
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        Product product = service.updateProduct(id, updatedProduct);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(product);
    }
    @GetMapping("/search-suggestions")
    public ResponseEntity<List<String>> getSuggestions(@RequestParam("query") String query) {
        List<String> suggestions = service.getSuggestions(query);
        return ResponseEntity.ok(suggestions);
    }


    // Admin-only: Delete product
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        boolean deleted = service.deleteProduct(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok("Product deleted successfully");
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


    // Admin-only: Set exact stock
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

    // Admin-only: Adjust stock by quantity
    @PutMapping("/{id}/stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateStockByQuantity(@PathVariable Long id, @RequestParam int quantity) {
        boolean success = service.decreaseStock(id, -quantity); // pass -1 to decrease by 1
        if (!success) {
            return ResponseEntity.badRequest().body("Insufficient stock or update failed");
        }
        return ResponseEntity.ok("Stock updated successfully");
    }
}
