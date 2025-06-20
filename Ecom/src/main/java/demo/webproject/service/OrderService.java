package demo.webproject.service;

import demo.webproject.Entity.Order;
import demo.webproject.Entity.OrderItem;
import demo.webproject.Entity.Product;
import demo.webproject.Entity.User;
import demo.webproject.dto.OrderDTO;
import demo.webproject.dto.OrderItemDTO;
import demo.webproject.repository.OrderRepository;
import demo.webproject.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public OrderService(ProductRepository productRepository, OrderRepository orderRepository) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    // ✅ Place order
    public void placeOrder(List<OrderItem> orderItems, User user) {
        for (OrderItem item : orderItems) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductId()));
            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }
        }

        for (OrderItem item : orderItems) {
            Product product = productRepository.findById(item.getProductId()).get();
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        }

        Order order = new Order();
        order.setOrderDate(new Date());
        order.setUser(user);

        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }

        order.setItems(orderItems);
        orderRepository.save(order);
    }

    // ✅ Return orders as DTOs
    public List<OrderDTO> getOrdersForUser(User user) {
        return orderRepository.findByUserId(user.getId()).stream()
                .map(order -> new OrderDTO(
                        order.getId(),
                        order.getOrderDate(),
                        order.getItems().stream()
                                .map(item -> new OrderItemDTO(
                                        item.getProductId(),
                                        item.getQuantity(),
                                        item.getPrice()
                                ))
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());
    }
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(order -> new OrderDTO(
                        order.getId(),
                        order.getOrderDate(),
                        order.getItems().stream()
                                .map(item -> new OrderItemDTO(
                                        item.getProductId(),
                                        item.getQuantity(),
                                        item.getPrice()
                                ))
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());
    }

}
