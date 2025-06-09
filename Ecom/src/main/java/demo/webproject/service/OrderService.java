package demo.webproject.service;

import demo.webproject.Entity.Order;
import demo.webproject.Entity.OrderItem;
import demo.webproject.Entity.Product;
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

    public void placeOrder(List<OrderItem> orderItems) {
        // Check stock
        for (OrderItem item : orderItems) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductId()));
            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }
        }

        // Deduct stock
        for (OrderItem item : orderItems) {
            Product product = productRepository.findById(item.getProductId()).get();
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        }

        // Save order
        Order order = new Order();
        order.setOrderDate(new Date());
        order.setItems(orderItems);
        orderRepository.save(order);
    }
}
