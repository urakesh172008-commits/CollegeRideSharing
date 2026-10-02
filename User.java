/**
 * User model representing a college community member (student, staff, or faculty).
 * Supports rich profile details: name, email, phone, department, role, vehicleModel, etc.
 */
public class User {
    private String id;
    private String name;
    private String email;
    private String password;
    private String role; // "RIDER" or "DRIVER"
    private String phone;
    private String department;
    private String vehicleModel;
    private double rating;
    private String avatar;

    public User(String id, String name, String email, String password, String role) {
        this(id, name, email, password, role, "+91 98765 43210", "College Member", "Personal Vehicle");
    }

    public User(String id, String name, String email, String password, String role, 
                String phone, String department, String vehicleModel) {
        this.id = id;
        this.name = (name != null) ? name.trim() : "";
        this.email = (email != null) ? email.trim() : "";
        this.password = (password != null) ? password : "";
        this.role = (role != null && role.trim().equalsIgnoreCase("DRIVER")) ? "DRIVER" : "RIDER";
        this.phone = (phone != null && !phone.trim().isEmpty()) ? phone.trim() : "+91 98765 43210";
        this.department = (department != null && !department.trim().isEmpty()) ? department.trim() : "College Member";
        this.vehicleModel = (vehicleModel != null && !vehicleModel.trim().isEmpty()) ? vehicleModel.trim() : "Personal Vehicle";
        this.rating = 5.0;
        this.avatar = generateInitials(this.name);
    }

    private String generateInitials(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) return "ST";
        String[] parts = fullName.trim().split("\\s+");
        if (parts.length == 1) {
            return parts[0].substring(0, Math.min(2, parts[0].length())).toUpperCase();
        }
        return ("" + parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
        this.avatar = generateInitials(name);
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = (role != null && role.trim().equalsIgnoreCase("DRIVER")) ? "DRIVER" : "RIDER";
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getVehicleModel() {
        return vehicleModel;
    }

    public void setVehicleModel(String vehicleModel) {
        this.vehicleModel = vehicleModel;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public String getAvatar() {
        return avatar;
    }

    public boolean isDriver() {
        return "DRIVER".equalsIgnoreCase(role);
    }

    public boolean isRider() {
        return "RIDER".equalsIgnoreCase(role);
    }

    /**
     * Helper to serialize User to a JSON string without external libraries.
     */
    public String toJson() {
        return "{" +
            "\"id\":\"" + escapeJson(id) + "\"," +
            "\"name\":\"" + escapeJson(name) + "\"," +
            "\"email\":\"" + escapeJson(email) + "\"," +
            "\"role\":\"" + escapeJson(role.toLowerCase()) + "\"," +
            "\"phone\":\"" + escapeJson(phone) + "\"," +
            "\"department\":\"" + escapeJson(department) + "\"," +
            "\"carModel\":\"" + escapeJson(vehicleModel) + "\"," +
            "\"rating\":" + rating + "," +
            "\"avatar\":\"" + escapeJson(avatar) + "\"," +
            "\"verified\":true" +
            "}";
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\b", "\\b")
                .replace("\f", "\\f")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

    @Override
    public String toString() {
        return "User[id=" + id + ", name=" + name + ", email=" + email + ", role=" + role + ", dept=" + department + "]";
    }
}
