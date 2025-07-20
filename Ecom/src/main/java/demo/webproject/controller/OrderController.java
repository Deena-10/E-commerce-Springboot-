package demo.webproject.controller;

import demo.webproject.dto.OrderDTO;
import demo.webproject.dto.OrderItemRequestDTO;
import demo.webproject.security.CustomUserDetails;
import demo.webproject.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ✅ Place order using authenticated user details
    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@RequestBody List<OrderItemRequestDTO> orderItems,
                                        @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        String userEmail = userDetails.getUsername();
        orderService.placeOrder(orderItems, userEmail);
        return ResponseEntity.ok("Order placed successfully");
    }

    // ✅ Get all orders for logged-in user
    @GetMapping("/my")
    public ResponseEntity<List<OrderDTO>> getMyOrders(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String userEmail = userDetails.getUsername();
        List<OrderDTO> orders = orderService.getOrdersForUser(userEmail);
        return ResponseEntity.ok(orders);
    }

    // ✅ Admin-only: Get all orders in system
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
}
