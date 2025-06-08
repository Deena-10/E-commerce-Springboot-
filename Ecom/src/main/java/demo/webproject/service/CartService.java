package demo.webproject.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import demo.webproject.Entity.CartItem;
import demo.webproject.repository.CartRepository;

@Service
public class CartService {

    private final CartRepository cartRepository;

    public CartService(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    public List<CartItem> getCartItems() {
        return cartRepository.findAll();
    }

    public CartItem addCartItem(CartItem newItem) {
        Optional<CartItem> existingOpt = cartRepository.findByProductId(newItem.getProductId());

        if (existingOpt.isPresent()) {
            CartItem existing = existingOpt.get();
            // Increase quantity
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
