package demo.webproject.controller;

import demo.webproject.Entity.OrderItem;
import demo.webproject.Entity.User;
import demo.webproject.dto.OrderDTO;
import demo.webproject.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ✅ Place order with authenticated user
    @PostMapping("/place")
    public ResponseEntity<String> placeOrder(@RequestBody List<OrderItem> orderItems,
                                             @AuthenticationPrincipal User user) {
        try {
            orderService.placeOrder(orderItems, user);
            return ResponseEntity.ok("Order placed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Get all orders for logged-in user
    @GetMapping("/my")
    public ResponseEntity<List<OrderDTO>> getMyOrders(@AuthenticationPrincipal User user) {
        List<OrderDTO> orders = orderService.getOrdersForUser(user);
        return ResponseEntity.ok(orders);
    }

    // ✅ Admin-only: Get all orders in system
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')") // 🔒 restrict to admins
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
}
