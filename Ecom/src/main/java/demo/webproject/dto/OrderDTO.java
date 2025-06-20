package demo.webproject.dto;

import java.util.Date;
import java.util.List;

public class OrderDTO {
    private Long id;
    private Date orderDate;
    private List<OrderItemDTO> items;

    // Constructor
    public OrderDTO(Long id, Date orderDate, List<OrderItemDTO> items) {
        this.id = id;
        this.orderDate = orderDate;
        this.items = items;
    }

    // Getters
    public Long getId() { return id; }
    public Date getOrderDate() { return orderDate; }
    public List<OrderItemDTO> getItems() { return items; }
}
