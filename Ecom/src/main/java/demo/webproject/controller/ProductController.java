package demo.webproject.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
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

    // ✅ Get all products
    @GetMapping
    public List<Product> showAllProducts() {
        return service.getAllProducts();
    }

    // ✅ Add a new product
    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return service.addProduct(product);
    }

    // ✅ Update product details
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        Product product = service.updateProduct(id, updatedProduct);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(product);
    }

    // ✅ Delete product by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        boolean deleted = service.deleteProduct(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok("Product deleted successfully");
    }

    // ✅ Admin: Set exact stock count (absolute value)
    @PutMapping("/updateStock")
    public ResponseEntity<Product> updateStock(@RequestBody Map<String, Object> payload) {
        Long productId = Long.valueOf(payload.get("productId").toString());
        int newStock = ((Number) payload.get("stock")).intValue();

        Product updatedProduct = service.updateStock(productId, newStock);
        if (updatedProduct == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedProduct);
    }

    // ✅ Decrease (or increase) stock by quantity (pass -1 to decrease by 1)
    @PutMapping("/{id}/stock")
    public ResponseEntity<String> updateStockByQuantity(@PathVariable Long id, @RequestParam int quantity) {
        boolean success = service.decreaseStock(id, -quantity); // passing negative to decrease
        if (!success) {
            return ResponseEntity.badRequest().body("Insufficient stock or update failed");
        }
        return ResponseEntity.ok("Stock updated successfully");
    }

    // ✅ Get product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = service.getProductById(id);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(product);
    }
}
