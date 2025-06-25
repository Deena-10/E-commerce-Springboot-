package demo.webproject.dto;

public class UserProfileDTO {
    private String name;
    private String email;
    private String phoneNumber; // ✅ changed from int to String
    private String address;

    // ✅ Constructor updated to use String for phoneNumber
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
}
