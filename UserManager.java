import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Manages user registration, authentication, and multiple user profiles.
 * Dynamic in-memory storage with zero demo accounts.
 */
public class UserManager {
    private final Map<String, User> usersByEmail;
    private final Map<String, User> usersById;

    public UserManager() {
        this.usersByEmail = new HashMap<String, User>();
        this.usersById = new HashMap<String, User>();
    }

    /**
     * Registers a new custom user profile with full details.
     */
    public synchronized String register(String name, String email, String password, String role,
                                       String phone, String department, String vehicleModel) {
        if (name == null || name.trim().isEmpty()) {
            return "Please enter your full name.";
        }
        if (email == null || email.trim().isEmpty() || !email.contains("@")) {
            return "Please enter a valid college email address.";
        }
        if (password == null || password.trim().isEmpty()) {
            return "Please enter a password.";
        }
        if (password.length() < 4) {
            return "Password must be at least 4 characters long.";
        }

        String normalizedEmail = email.trim().toLowerCase();

        if (usersByEmail.containsKey(normalizedEmail)) {
            return "A profile with the email '" + email.trim() + "' already exists.";
        }

        String id = "usr-" + UUID.randomUUID().toString().substring(0, 8);
        User newUser = new User(id, name.trim(), normalizedEmail, password, role, phone, department, vehicleModel);
        
        usersByEmail.put(normalizedEmail, newUser);
        usersById.put(id, newUser);

        return null; // Success
    }

    /**
     * Convenience method for standard register.
     */
    public synchronized String register(String name, String email, String password, String role) {
        return register(name, email, password, role, "+91 98765 43210", "College Member", "Personal Vehicle");
    }

    /**
     * Authenticates a user profile with email and password.
     */
    public synchronized User login(String email, String password) {
        if (email == null || password == null) {
            return null;
        }

        String normalizedEmail = email.trim().toLowerCase();
        User user = usersByEmail.get(normalizedEmail);

        if (user != null && user.getPassword().equals(password)) {
            return user;
        }

        return null;
    }

    /**
     * Retrieves a user by email address.
     */
    public synchronized User getUserByEmail(String email) {
        if (email == null) return null;
        return usersByEmail.get(email.trim().toLowerCase());
    }

    /**
     * Retrieves a user by unique ID.
     */
    public synchronized User getUserById(String id) {
        if (id == null) return null;
        return usersById.get(id);
    }

    /**
     * Returns a list of all registered user profiles.
     */
    public synchronized List<User> getAllUsers() {
        return new ArrayList<User>(usersByEmail.values());
    }

    /**
     * Serializes all users to JSON array format.
     */
    public synchronized String getAllUsersJson() {
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        List<User> list = new ArrayList<User>(usersByEmail.values());
        for (int i = 0; i < list.size(); i++) {
            sb.append(list.get(i).toJson());
            if (i < list.size() - 1) {
                sb.append(",");
            }
        }
        sb.append("]");
        return sb.toString();
    }

    /**
     * Removes a profile by email or user ID.
     */
    public synchronized boolean removeUser(String emailOrId) {
        if (emailOrId == null) return false;
        
        String key = emailOrId.trim().toLowerCase();
        User user = usersByEmail.remove(key);
        if (user == null) {
            user = usersById.remove(emailOrId);
            if (user != null) {
                usersByEmail.remove(user.getEmail().toLowerCase());
            }
        } else {
            usersById.remove(user.getId());
        }
        return user != null;
    }

    /**
     * Returns total number of registered profiles.
     */
    public synchronized int getUserCount() {
        return usersByEmail.size();
    }
}
