package demo.webproject.dto;

public class UserProfileDTO {
    private String name;
    private String email;
    private String phoneNumber;
    private String address;

    // ✅ No-arg constructor (required for Spring serialization)
    public UserProfileDTO() {}

    // ✅ All-args constructor
    public UserProfileDTO(String name, String email, String phoneNumber, String address) {
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
    }

    // ✅ Getters
    public String getName() {
        return name;
    }
    public String getEmail() {
        return email;
    }
    public String getPhoneNumber() {
        return phoneNumber;
    }
    public String getAddress() {
        return address;
    }

    // ✅ Setters
    public void setName(String name) {
        this.name = name;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    public void setAddress(String address) {
        this.address = address;
    }
}
