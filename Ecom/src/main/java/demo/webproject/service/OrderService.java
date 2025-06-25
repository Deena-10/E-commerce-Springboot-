package demo.webproject.service;

import demo.webproject.Entity.Order;
import demo.webproject.Entity.OrderItem;
import demo.webproject.Entity.Product;
import demo.webproject.Entity.User;
import demo.webproject.dto.OrderDTO;
import demo.webproject.dto.OrderItemDTO;
import demo.webproject.dto.OrderItemRequestDTO;
import demo.webproject.repository.OrderRepository;
import demo.webproject.repository.ProductRepository;
import demo.webproject.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public OrderService(ProductRepository productRepository,
                        OrderRepository orderRepository,
                        UserRepository userRepository) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    // ✅ Place Order with stock check and product reference
    public void placeOrder(List<OrderItemRequestDTO> itemRequests, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setOrderDate(new Date());
        order.setUser(user);

        List<OrderItem> orderItems = itemRequests.stream().map(request -> {
            Product product = productRepository.findById(request.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + request.getProductId()));

            if (product.getStock() < request.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            // Update stock
            product.setStock(product.getStock() - request.getQuantity());
            productRepository.save(product);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setProductId(product.getId());
            item.setProductName(product.getName());
            item.setQuantity(request.getQuantity());
            item.setPrice(product.getPrice());

            return item;
        }).collect(Collectors.toList());

        // Total price calculation
        double totalPrice = orderItems.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();

        order.setItems(orderItems);
        order.setTotalPrice(totalPrice);
        orderRepository.save(order);
    }

    // ✅ Get orders for a specific user
    public List<OrderDTO> getOrdersForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderRepository.findByUserId(user.getId()).stream()
                .map(order -> new OrderDTO(
                        order.getId(),
                        order.getOrderDate(),
                        order.getItems().stream()
                                .map(item -> new OrderItemDTO(
                                        item.getProduct().getId(),
                                        item.getProduct().getName(),
                                        item.getQuantity(),
                                        item.getPrice()
                                ))
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());
    }

    // ✅ Admin: Get all orders
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(order -> {
                    User user = order.getUser();
                    return new OrderDTO(
                            order.getId(),
                            order.getOrderDate(),
                            order.getItems().stream()
                                    .map(item -> new OrderItemDTO(
                                            item.getProduct().getId(),
                                            item.getProduct().getName(),
                                            item.getQuantity(),
                                            item.getPrice()
                                    ))
                                    .collect(Collectors.toList()),
                            user.getName(),
                            user.getEmail(),
                            String.valueOf(user.getPhoneNumber()),
                            user.getAddress()
                    );
                })
                .collect(Collectors.toList());
    }
}
