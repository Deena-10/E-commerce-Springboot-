package demo.webproject.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;
    private int  quantity;
    private double price;     // if you store price per item

    // 🔑  NEW: Many‑to‑one link back to Order
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")   
    private Order order;

    /* ---------- getters & setters ---------- */

    public Long getId() { return id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    /**  NEW: getter & setter for the parent order  */
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
}
