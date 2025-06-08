package demo.webproject.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.*;

import demo.webproject.Entity.CartItem;
import demo.webproject.Entity.Product;
import demo.webproject.service.CartService;
import demo.webproject.service.ProductService;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    private final CartService cartService;
    private final ProductService productService;

    public CartController(CartService cartService, ProductService productService) {
        this.cartService = cartService;
        this.productService = productService;
    }

    @GetMapping
    public List<CartItemDto> getCartItems() {
        List<CartItem> cartItems = cartService.getCartItems();

        return cartItems.stream()
            .map(item -> {
                try {
                    Product product = productService.getProductById(item.getProductId());
                    return new CartItemDto(
                        product.getId(),
                        product.getName(),
                        product.getDescription(),
                        product.getPrice(),
                        item.getQuantity(),
                        product.getImg(),
                        product.getRating(),
                        product.getStock()
                    );
                } catch (RuntimeException e) {
                    System.err.println("Product not found for productId: " + item.getProductId());
                    return null;
                }
            })
            .filter(dto -> dto != null)
            .collect(Collectors.toList());
    }

    @PostMapping
    public void addToCart(@RequestBody CartItemRequest request) {
        CartItem item = new CartItem(request.getProductId(), request.getQuantity());
        cartService.addCartItem(item);
    }

    // DTO classes
    public static class CartItemRequest {
        private Long productId;
        private int quantity;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }

    public static class CartItemDto {
        private Long productId;
        private String name;
        private String description;
        private Double price;
        private int quantity;
        private String img;
        private int rating;
        private int stock;

        public CartItemDto(Long productId, String name, String description, Double price, int quantity, String img, int rating, int stock) {
            this.productId = productId;
            this.name = name;
            this.description = description;
            this.price = price;
            this.quantity = quantity;
            this.img = img;
            this.rating = rating;
            this.stock = stock;
        }

        // Getters only for response serialization
        public Long getProductId() { return productId; }
        public String getName() { return name; }
        public String getDescription() { return description; }
        public Double getPrice() { return price; }
        public int getQuantity() { return quantity; }
        public String getImg() { return img; }
        public int getRating() { return rating; }
        public int getStock() { return stock; }
    }
}
