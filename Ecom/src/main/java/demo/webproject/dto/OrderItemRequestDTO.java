package demo.webproject.dto;

public class OrderItemRequestDTO {

    private Long productId;
    private int quantity;

    // No-arg constructor
    public OrderItemRequestDTO() {
    }

    // All-arg constructor
    public OrderItemRequestDTO(Long productId, int quantity) {
        this.productId = productId;
        this.quantity = quantity;
    }

    // Getters
    public Long getProductId() {
        return productId;
    }

    public int getQuantity() {
        return quantity;
    }
}
