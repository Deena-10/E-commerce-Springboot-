package demo.webproject.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import demo.webproject.dto.OrderDTO;
import demo.webproject.dto.OrderItemRequestDTO;
import demo.webproject.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ✅ Place order using Principal to get authenticated user's email
    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@RequestBody List<OrderItemRequestDTO> orderItems,
                                        Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        String userEmail = principal.getName(); // ✅ This will come from JWT 'sub'
        orderService.placeOrder(orderItems, userEmail);
        return ResponseEntity.ok("Order placed successfully");
    }

    // ✅ Get all orders for logged-in user
    @GetMapping("/my")
    public ResponseEntity<List<OrderDTO>> getMyOrders(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String userEmail = principal.getName();
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
