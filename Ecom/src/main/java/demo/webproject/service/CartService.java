package demo.webproject.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import demo.webproject.Entity.CartItem;
import demo.webproject.Entity.Product;
import demo.webproject.repository.CartRepository;
import demo.webproject.repository.ProductRepository;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    public List<CartItem> getCartItems() {
        return cartRepository.findAll();
    }

    public CartItem addCartItem(CartItem newItem) {
        Long productId = newItem.getProductId();

        // Get product info
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            throw new IllegalArgumentException("Product not found");
        }
        Product product = productOpt.get();

        int availableStock = product.getStock();

        // Find existing cart item for this product
        Optional<CartItem> existingOpt = cartRepository.findByProductId(productId);

        int totalQuantity = newItem.getQuantity();
        if (existingOpt.isPresent()) {
            totalQuantity += existingOpt.get().getQuantity();
        }

        if (totalQuantity > availableStock) {
            throw new IllegalArgumentException("Cannot add more than available stock: " + availableStock);
        }

        if (existingOpt.isPresent()) {
            CartItem existing = existingOpt.get();
            existing.setQuantity(existing.getQuantity() + newItem.getQuantity());
            return cartRepository.save(existing);
        } else {
            return cartRepository.save(newItem);
        }
    }

    public void removeCartItem(Long productId) {
        cartRepository.findByProductId(productId).ifPresent(cartRepository::delete);
    }
    

    public void clearCart() {
        cartRepository.deleteAll();
    }
}
