package demo.webproject.dto;

import java.util.Date;
import java.util.List;

public class OrderDTO {
    private Long id;
    private Date orderDate;
    private List<OrderItemDTO> items;

    private String userName;
    private String userEmail;
    private String userPhone;
    private String userAddress;

    // ✅ Admin view constructor (includes user info)
    public OrderDTO(Long id, Date orderDate, List<OrderItemDTO> items,
                    String userName, String userEmail, String userPhone, String userAddress) {
        this.id = id;
        this.orderDate = orderDate;
        this.items = items;
        this.userName = userName;
        this.userEmail = userEmail;
        this.userPhone = userPhone;
        this.userAddress = userAddress;
    }

    // ✅ User view constructor (without user info)
    public OrderDTO(Long id, Date orderDate, List<OrderItemDTO> items) {
        this.id = id;
        this.orderDate = orderDate;
        this.items = items;
    }

    // ✅ Getters
    public Long getId() {
        return id;
    }

    public Date getOrderDate() {
        return orderDate;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public String getUserName() {
        return userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public String getUserPhone() {
        return userPhone;
    }

    public String getUserAddress() {
        return userAddress;
    }
}
