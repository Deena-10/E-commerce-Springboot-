package demo.webproject.dto;

public class OrderItemDTO {
    private Long productId;
    private int quantity;
    private double price;

    public OrderItemDTO(Long productId, int quantity, double price) {
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
    }

    public Long getProductId() {
        return productId;
    }

    public int getQuantity() {
        return quantity;
    }

    public double getPrice() {
        return price;
    }
}
