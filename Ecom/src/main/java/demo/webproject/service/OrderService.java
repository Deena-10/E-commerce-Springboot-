package demo.webproject.service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

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

    // ✅ Place a new order
    public void placeOrder(List<OrderItemRequestDTO> itemRequests, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setOrderDate(new Date());
        order.setUser(user);
        order.setCustomerName(user.getName());
        order.setCustomerEmail(user.getEmail());

        List<OrderItem> orderItems = itemRequests.stream().map(request -> {
            Product product = productRepository.findById(request.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + request.getProductId()));

            if (product.getStock() < request.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            product.setStock(product.getStock() - request.getQuantity());
            productRepository.save(product);

            OrderItem item = new OrderItem();
            item.setOrder(order); // ✅ Important for FK mapping
            item.setProduct(product);
            item.setProductName(product.getName()); // avoid lazy loading issues
            item.setQuantity(request.getQuantity());
            item.setPrice(product.getPrice());

            return item;
        }).collect(Collectors.toList());

        double totalPrice = orderItems.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();

        order.setItems(orderItems); // ✅ Important for bi-directional mapping
        order.setTotalPrice(totalPrice); // ✅ Save total

        orderRepository.save(order); // ✅ Cascade saves Order + Items
    }

    // ✅ Get orders for logged-in user
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
                                        item.getProductName(),
                                        item.getQuantity(),
                                        item.getPrice()
                                ))
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());
    }

    // ✅ Admin: Get all orders with user info
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
                                            item.getProductName(),
                                            item.getQuantity(),
                                            item.getPrice()
                                    ))
                                    .collect(Collectors.toList()),
                            user.getName(),
                            user.getEmail(),
                            user.getPhoneNumber(),
                            user.getAddress()
                    );
                })
                .collect(Collectors.toList());
    }
}
