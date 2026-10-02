import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;

/**
 * WebServer - Core Java HTTP Server for College Ride Sharing.
 * Supports HTML views and JSON REST APIs for multi-profile management and zero demo accounts.
 */
public class WebServer {
    private static final int PORT = 8080;
    private static final UserManager userManager = new UserManager();
    private static final RideManager rideManager = new RideManager();

    public static void main(String[] args) {
        try {
            HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);

            // Web Page Routes
            server.createContext("/", new HomeHandler());
            server.createContext("/register", new RegisterHandler());
            server.createContext("/login", new LoginHandler());
            server.createContext("/logout", new LogoutHandler());
            server.createContext("/profiles", new ProfilesHandler());
            server.createContext("/post-ride", new PostRideHandler());
            server.createContext("/search-rides", new SearchRidesHandler());
            server.createContext("/book-ride", new BookRideHandler());
            server.createContext("/style.css", new StyleHandler());

            // REST API Routes (Supports JSON for frontend sync)
            server.createContext("/api/profiles", new ApiProfilesHandler());
            server.createContext("/api/rides", new ApiRidesHandler());
            server.createContext("/api/logout", new ApiLogoutHandler());

            // Multi-threaded executor
            server.setExecutor(Executors.newFixedThreadPool(10));
            server.start();

            System.out.println("=================================================");
            System.out.println("   College Ride Sharing System is RUNNING!");
            System.out.println("   URL: http://localhost:" + PORT);
            System.out.println("   Multi-Profile & Zero Demo Mode Active");
            System.out.println("=================================================");
        } catch (IOException e) {
            System.err.println("Failed to start server: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // =========================================================================
    // HTTP HANDLERS (WEB PAGES)
    // =========================================================================

    /**
     * GET / -> Home page
     */
    static class HomeHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            if (!"/".equals(path)) {
                sendHtml(exchange, 404, renderPage("404 Not Found", "",
                    "<div class='card text-center' style='text-align: center; padding: 48px;'>" +
                    "  <div class='empty-icon'>&#128269;</div>" +
                    "  <h2 class='card-title'>Page Not Found</h2>" +
                    "  <p class='card-description'>The page you are looking for does not exist.</p>" +
                    "  <div style='margin-top: 20px;'><a href='/' class='btn btn-primary'>Back to Home</a></div>" +
                    "</div>"
                ));
                return;
            }

            StringBuilder html = new StringBuilder();

            // Hero Card
            html.append("<div class='hero-card'>");
            html.append("  <span class='hero-tag'>Campus Commuter Network</span>");
            html.append("  <h1 class='hero-title'>College Ride Sharing System</h1>");
            html.append("  <p class='hero-subtitle'>Share rides across campus landmarks, metro stations, and tech parks. Split fuel in ₹ and travel safely.</p>");
            html.append("  <div class='hero-actions'>");
            html.append("    <a href='/search-rides' class='btn btn-white'>&#128269; Find a Ride</a>");
            html.append("    <a href='/post-ride' class='btn btn-outline-white'>&#128663; Offer a Ride</a>");
            html.append("    <a href='/profiles' class='btn btn-outline-white'>&#128101; Manage Profiles</a>");
            html.append("  </div>");
            html.append("</div>");

            // Feature Cards
            html.append("<div class='grid-3'>");
            html.append("  <div class='feature-card'>");
            html.append("    <div class='feature-icon'>&#127891;</div>");
            html.append("    <h3>Custom Profiles</h3>");
            html.append("    <p>Create real student & driver profiles with branch, phone, and vehicle info. Add multiple profiles anytime.</p>");
            html.append("  </div>");
            html.append("  <div class='feature-card'>");
            html.append("    <div class='feature-icon'>&#8377;</div>");
            html.append("    <h3>INR Fare Split</h3>");
            html.append("    <p>Transparent fuel cost splitting in Indian Rupees (₹) with zero commissions or hidden fees.</p>");
            html.append("  </div>");
            html.append("  <div class='feature-card'>");
            html.append("    <div class='feature-icon'>&#127793;</div>");
            html.append("    <h3>Eco Friendly</h3>");
            html.append("    <p>Reduce campus traffic congestion and cut CO2 emissions on every shared trip.</p>");
            html.append("  </div>");
            html.append("</div>");

            // Current Active Rides Section
            List<Ride> activeRides = rideManager.getAllRides();
            html.append("<div class='section-header'>");
            html.append("  <h2 class='section-title'>Active Campus Carpools (").append(activeRides.size()).append(")</h2>");
            html.append("  <a href='/search-rides' class='btn btn-primary btn-sm'>Search & Filter</a>");
            html.append("</div>");

            html.append(renderRideCards(activeRides));

            sendHtml(exchange, 200, renderPage("Home - College Ride Sharing", "home", html.toString()));
        }
    }

    /**
     * GET  /register -> Show registration form
     * POST /register -> Register real profile with name, email, phone, dept, role, vehicle
     */
    static class RegisterHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String method = exchange.getRequestMethod();

            if ("POST".equalsIgnoreCase(method)) {
                Map<String, String> params = parseFormData(exchange);
                String name = params.get("name");
                String email = params.get("email");
                String password = params.get("password");
                String role = params.get("role");
                String phone = params.get("phone");
                String department = params.get("department");
                String vehicleModel = params.get("vehicleModel");

                String error = userManager.register(name, email, password, role, phone, department, vehicleModel);

                if (error == null) {
                    StringBuilder successHtml = new StringBuilder();
                    successHtml.append("<div class='card' style='max-width: 540px; margin: 20px auto;'>");
                    successHtml.append("  <div class='alert alert-success'>");
                    successHtml.append("    <span>&#127881; <strong>Profile Created Successfully!</strong> ").append(escapeHtml(name)).append(" (").append(escapeHtml(email)).append(")</span>");
                    successHtml.append("  </div>");
                    successHtml.append("  <div class='card-header text-center' style='text-align: center;'>");
                    successHtml.append("    <h2 class='card-title'>Welcome to CampusRide!</h2>");
                    successHtml.append("    <p class='card-description'>Your custom ").append(escapeHtml(role)).append(" profile has been saved.</p>");
                    successHtml.append("  </div>");
                    successHtml.append("  <div style='display: flex; gap: 12px; margin-top: 24px;'>");
                    successHtml.append("    <a href='/profiles' class='btn btn-primary btn-block'>View All Profiles</a>");
                    successHtml.append("    <a href='/search-rides' class='btn btn-secondary btn-block'>Find Rides</a>");
                    successHtml.append("  </div>");
                    successHtml.append("</div>");

                    sendHtml(exchange, 200, renderPage("Registration Successful", "register", successHtml.toString()));
                } else {
                    sendHtml(exchange, 200, renderPage("Register - College Ride Sharing", "register",
                        renderRegisterForm(error, name, email, role, phone, department, vehicleModel)));
                }
            } else {
                sendHtml(exchange, 200, renderPage("Register - College Ride Sharing", "register",
                    renderRegisterForm(null, "", "", "RIDER", "", "", "")));
            }
        }

        private String renderRegisterForm(String error, String name, String email, String role,
                                         String phone, String dept, String vehicle) {
            StringBuilder html = new StringBuilder();
            html.append("<div class='card' style='max-width: 540px; margin: 0 auto;'>");
            html.append("  <div class='card-header'>");
            html.append("    <h2 class='card-title'>Add Your Profile</h2>");
            html.append("    <p class='card-description'>Enter your real details to create a student rider or driver profile.</p>");
            html.append("  </div>");

            if (error != null) {
                html.append("  <div class='alert alert-error'>");
                html.append("    <span>&#9888;&#65039; ").append(escapeHtml(error)).append("</span>");
                html.append("  </div>");
            }

            html.append("  <form method='POST' action='/register'>");
            html.append("    <div class='form-group'>");
            html.append("      <label class='form-label' for='name'>Full Name</label>");
            html.append("      <input type='text' id='name' name='name' class='form-control' placeholder='e.g. Rakesh Kumar' required value='").append(escapeHtml(name)).append("'>");
            html.append("    </div>");

            html.append("    <div class='form-group'>");
            html.append("      <label class='form-label' for='email'>College Email Address</label>");
            html.append("      <input type='email' id='email' name='email' class='form-control' placeholder='e.g. rakesh@college.edu.in' required value='").append(escapeHtml(email)).append("'>");
            html.append("    </div>");

            html.append("    <div class='grid-2'>");
            html.append("      <div class='form-group'>");
            html.append("        <label class='form-label' for='phone'>Phone / WhatsApp</label>");
            html.append("        <input type='tel' id='phone' name='phone' class='form-control' placeholder='+91 98765 43210' value='").append(escapeHtml(phone)).append("'>");
            html.append("      </div>");
            html.append("      <div class='form-group'>");
            html.append("        <label class='form-label' for='department'>Branch / Department</label>");
            html.append("        <input type='text' id='department' name='department' class='form-control' placeholder='e.g. CS Engg' value='").append(escapeHtml(dept)).append("'>");
            html.append("      </div>");
            html.append("    </div>");

            html.append("    <div class='form-group'>");
            html.append("      <label class='form-label' for='password'>Password</label>");
            html.append("      <input type='password' id='password' name='password' class='form-control' placeholder='Create a password' required minlength='4'>");
            html.append("    </div>");

            html.append("    <div class='form-group'>");
            html.append("      <label class='form-label'>Primary Role</label>");
            html.append("      <div class='role-pills'>");
            html.append("        <div class='role-pill'>");
            html.append("          <input type='radio' id='role-rider' name='role' value='RIDER' ").append(!"DRIVER".equalsIgnoreCase(role) ? "checked" : "").append(">");
            html.append("          <label for='role-rider' class='role-label'><span>&#127890; Rider</span><small style='font-weight: normal; color: var(--text-muted); font-size: 0.8rem;'>I need rides</small></label>");
            html.append("        </div>");
            html.append("        <div class='role-pill'>");
            html.append("          <input type='radio' id='role-driver' name='role' value='DRIVER' ").append("DRIVER".equalsIgnoreCase(role) ? "checked" : "").append(">");
            html.append("          <label for='role-driver' class='role-label'><span>&#128663; Driver</span><small style='font-weight: normal; color: var(--text-muted); font-size: 0.8rem;'>I offer rides</small></label>");
            html.append("        </div>");
            html.append("      </div>");
            html.append("    </div>");

            html.append("    <div class='form-group'>");
            html.append("      <label class='form-label' for='vehicleModel'>Vehicle Model (if offering rides)</label>");
            html.append("      <input type='text' id='vehicleModel' name='vehicleModel' class='form-control' placeholder='e.g. Tata Nexon EV, Swift, Activa' value='").append(escapeHtml(vehicle)).append("'>");
            html.append("    </div>");

            html.append("    <button type='submit' class='btn btn-primary btn-block' style='margin-top: 20px;'>Save & Register Profile</button>");
            html.append("  </form>");

            html.append("  <p style='text-align: center; margin-top: 20px; font-size: 0.92rem; color: var(--text-muted);'>");
            html.append("    Already have a profile? <a href='/login' style='color: var(--primary); font-weight: 600;'>Sign in here</a> or <a href='/profiles' style='color: var(--primary); font-weight: 600;'>Manage Profiles</a>");
            html.append("  </p>");
            html.append("</div>");

            return html.toString();
        }
    }

    /**
     * GET  /login -> Show login form
     * POST /login -> Authenticate
     */
    static class LoginHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String method = exchange.getRequestMethod();

            if ("POST".equalsIgnoreCase(method)) {
                Map<String, String> params = parseFormData(exchange);
                String email = params.get("email");
                String password = params.get("password");

                User user = userManager.login(email, password);

                if (user != null) {
                    StringBuilder html = new StringBuilder();
                    html.append("<div class='card' style='max-width: 540px; margin: 20px auto; text-align: center;'>");
                    html.append("  <div class='alert alert-success' style='justify-content: center;'>");
                    html.append("    <span>&#128075; Welcome, <strong>").append(escapeHtml(user.getName())).append("</strong>!</span>");
                    html.append("  </div>");
                    html.append("  <div style='margin: 20px 0;'>");
                    html.append("    <span class='badge badge-role' style='font-size: 0.9rem; padding: 6px 14px;'>").append(escapeHtml(user.getRole())).append("</span>");
                    html.append("    <p style='margin-top: 10px; color: var(--text-muted);'>").append(escapeHtml(user.getEmail())).append(" &bull; ").append(escapeHtml(user.getDepartment())).append("</p>");
                    html.append("  </div>");
                    html.append("  <div style='display: flex; gap: 12px; margin-top: 24px;'>");
                    html.append("    <a href='/search-rides' class='btn btn-primary btn-block'>&#128269; Find a Ride</a>");
                    html.append("    <a href='/profiles' class='btn btn-secondary btn-block'>Manage Profiles</a>");
                    html.append("    <a href='/logout' class='btn' style='background:#f43f5e; color:white;'>Log Out</a>");
                    html.append("  </div>");
                    html.append("</div>");

                    sendHtml(exchange, 200, renderPage("Welcome " + user.getName(), "login", html.toString()));
                } else {
                    sendHtml(exchange, 200, renderPage("Login - College Ride Sharing", "login",
                        renderLoginForm("Invalid email or password. You can add a new profile below.", email)));
                }
            } else {
                sendHtml(exchange, 200, renderPage("Login - College Ride Sharing", "login",
                    renderLoginForm(null, "")));
            }
        }

        private String renderLoginForm(String error, String email) {
            StringBuilder html = new StringBuilder();
            html.append("<div class='card' style='max-width: 480px; margin: 0 auto;'>");
            html.append("  <div class='card-header'>");
            html.append("    <h2 class='card-title'>Sign In</h2>");
            html.append("    <p class='card-description'>Enter your profile email and password.</p>");
            html.append("  </div>");

            if (error != null) {
                html.append("  <div class='alert alert-error'>");
                html.append("    <span>&#9888;&#65039; ").append(escapeHtml(error)).append("</span>");
                html.append("  </div>");
            }

            html.append("  <form method='POST' action='/login'>");
            html.append("    <div class='form-group'>");
            html.append("      <label class='form-label' for='email'>Email Address</label>");
            html.append("      <input type='email' id='email' name='email' class='form-control' placeholder='e.g. rakesh@college.edu.in' required value='").append(escapeHtml(email)).append("'>");
            html.append("    </div>");

            html.append("    <div class='form-group'>");
            html.append("      <label class='form-label' for='password'>Password</label>");
            html.append("      <input type='password' id='password' name='password' class='form-control' placeholder='Enter your password' required>");
            html.append("    </div>");

            html.append("    <button type='submit' class='btn btn-primary btn-block' style='margin-top: 24px;'>Sign In</button>");
            html.append("  </form>");

            html.append("  <p style='text-align: center; margin-top: 20px; font-size: 0.92rem; color: var(--text-muted);'>");
            html.append("    Need to add a new profile? <a href='/register' style='color: var(--primary); font-weight: 600;'>Create Profile</a> or <a href='/profiles' style='color: var(--primary); font-weight: 600;'>View Profiles</a>");
            html.append("  </p>");
            html.append("</div>");

            return html.toString();
        }
    }

    /**
     * GET /logout -> Clears user session and redirects
     */
    static class LogoutHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            StringBuilder html = new StringBuilder();
            html.append("<div class='card text-center' style='max-width: 500px; margin: 40px auto; text-align: center;'>");
            html.append("  <div class='empty-icon'>&#128075;</div>");
            html.append("  <h2 class='card-title'>Logged Out Successfully</h2>");
            html.append("  <p class='card-description'>You have been logged out of your profile session.</p>");
            html.append("  <div style='display: flex; gap: 12px; justify-content: center; margin-top: 24px;'>");
            html.append("    <a href='/' class='btn btn-primary'>Campus Home</a>");
            html.append("    <a href='/login' class='btn btn-secondary'>Sign In Again</a>");
            html.append("    <a href='/register' class='btn' style='background: #e2e8f0; color: #334155;'>+ Add Profile</a>");
            html.append("  </div>");
            html.append("</div>");

            sendHtml(exchange, 200, renderPage("Logged Out", "", html.toString()));
        }
    }

    /**
     * GET /profiles -> Lists all registered profiles and allows adding/removing
     */
    static class ProfilesHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            List<User> users = userManager.getAllUsers();
            StringBuilder html = new StringBuilder();

            html.append("<div class='section-header'>");
            html.append("  <div>");
            html.append("    <h2 class='section-title'>User Profiles (").append(users.size()).append(")</h2>");
            html.append("    <p style='color: var(--text-muted); font-size: 0.95rem; margin-top: 4px;'>Manage multiple user profiles, add new accounts, or switch credentials.</p>");
            html.append("  </div>");
            html.append("  <a href='/register' class='btn btn-primary btn-sm'>+ Add New Profile</a>");
            html.append("</div>");

            if (users.isEmpty()) {
                html.append("<div class='empty-state'>");
                html.append("  <div class='empty-icon'>&#128101;</div>");
                html.append("  <h3 class='empty-title'>No Profiles Created Yet</h3>");
                html.append("  <p class='empty-subtitle'>Add your student rider or driver profile to get started with campus carpooling.</p>");
                html.append("  <a href='/register' class='btn btn-primary'>Create Your Profile</a>");
                html.append("</div>");
            } else {
                html.append("<div class='grid-2'>");
                for (User u : users) {
                    html.append("<div class='card'>");
                    html.append("  <div style='display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;'>");
                    html.append("    <div style='display: flex; gap: 12px; align-items: center;'>");
                    html.append("      <div style='width: 44px; height: 44px; border-radius: 50%; background: #6366f1; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;'>").append(escapeHtml(u.getAvatar())).append("</div>");
                    html.append("      <div>");
                    html.append("        <h3 style='margin: 0; font-size: 1.1rem;'>").append(escapeHtml(u.getName())).append("</h3>");
                    html.append("        <span style='font-size: 0.85rem; color: var(--text-muted);'>").append(escapeHtml(u.getEmail())).append("</span>");
                    html.append("      </div>");
                    html.append("    </div>");
                    html.append("    <span class='badge badge-role'>").append(escapeHtml(u.getRole())).append("</span>");
                    html.append("  </div>");
                    html.append("  <div style='font-size: 0.88rem; color: var(--text-muted); line-height: 1.6;'>");
                    html.append("    <div><strong>Branch:</strong> ").append(escapeHtml(u.getDepartment())).append("</div>");
                    html.append("    <div><strong>Phone:</strong> ").append(escapeHtml(u.getPhone())).append("</div>");
                    if (u.isDriver()) {
                        html.append("    <div><strong>Vehicle:</strong> ").append(escapeHtml(u.getVehicleModel())).append("</div>");
                    }
                    html.append("  </div>");
                    html.append("</div>");
                }
                html.append("</div>");
            }

            sendHtml(exchange, 200, renderPage("Manage Profiles - College Ride Sharing", "profiles", html.toString()));
        }
    }

    /**
     * GET  /post-ride -> Show post ride form
     * POST /post-ride -> Handle ride submission
     */
    static class PostRideHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String method = exchange.getRequestMethod();

            if ("POST".equalsIgnoreCase(method)) {
                Map<String, String> params = parseFormData(exchange);
                String source = params.get("source");
                String destination = params.get("destination");
                String driverName = params.get("driverName");
                String time = params.get("time");
                int seats = 1;

                try {
                    String seatsStr = params.get("seatsAvailable");
                    if (seatsStr != null) {
                        seats = Integer.parseInt(seatsStr.trim());
                    }
                } catch (NumberFormatException ignored) {
                    seats = 1;
                }

                if (source == null || source.trim().isEmpty() ||
                    destination == null || destination.trim().isEmpty() ||
                    driverName == null || driverName.trim().isEmpty() ||
                    time == null || time.trim().isEmpty()) {
                    sendHtml(exchange, 200, renderPage("Offer a Ride", "post-ride",
                        renderPostRideForm("All fields are required. Please fill out the form completely.", source, destination, driverName, time, seats)));
                    return;
                }

                Ride ride = rideManager.postRide(source, destination, driverName, time, seats);

                if (ride != null) {
                    StringBuilder html = new StringBuilder();
                    html.append("<div class='card' style='max-width: 580px; margin: 20px auto;'>");
                    html.append("  <div class='alert alert-success'>");
                    html.append("    <span>&#9989; <strong>Ride Posted Successfully!</strong> Reference: <strong>").append(escapeHtml(ride.getRideId())).append("</strong></span>");
                    html.append("  </div>");
                    html.append("  <div class='card-header'>");
                    html.append("    <h2 class='card-title'>Your Ride is Now Live</h2>");
                    html.append("    <p class='card-description'>Students and campus peers can now view and book seats.</p>");
                    html.append("  </div>");
                    html.append("  <div class='ride-meta' style='flex-direction: column; align-items: flex-start; gap: 8px;'>");
                    html.append("    <div><strong>Route:</strong> ").append(escapeHtml(ride.getSource())).append(" &rarr; ").append(escapeHtml(ride.getDestination())).append("</div>");
                    html.append("    <div><strong>Driver:</strong> ").append(escapeHtml(ride.getDriverName())).append("</div>");
                    html.append("    <div><strong>Departure Time:</strong> ").append(escapeHtml(ride.getTime())).append("</div>");
                    html.append("    <div><strong>Available Seats:</strong> ").append(ride.getSeatsAvailable()).append("</div>");
                    html.append("  </div>");
                    html.append("  <div style='display: flex; gap: 12px; margin-top: 24px;'>");
                    html.append("    <a href='/search-rides' class='btn btn-primary btn-block'>View All Rides</a>");
                    html.append("    <a href='/post-ride' class='btn btn-secondary btn-block'>Post Another Ride</a>");
                    html.append("  </div>");
                    html.append("</div>");

                    sendHtml(exchange, 200, renderPage("Ride Posted", "post-ride", html.toString()));
                } else {
                    sendHtml(exchange, 200, renderPage("Offer a Ride", "post-ride",
                        renderPostRideForm("Failed to post ride. Please check input values.", source, destination, driverName, time, seats)));
                }
            } else {
                sendHtml(exchange, 200, renderPage("Offer a Ride - College Ride Sharing", "post-ride",
                    renderPostRideForm(null, "", "", "", "", 3)));
            }
        }

        private String renderPostRideForm(String error, String src, String dst, String driver, String time, int seats) {
            StringBuilder html = new StringBuilder();
            html.append("<div class='card' style='max-width: 600px; margin: 0 auto;'>");
            html.append("  <div class='card-header'>");
            html.append("    <h2 class='card-title'>&#128663; Offer a Campus Ride</h2>");
            html.append("    <p class='card-description'>Heading off campus or commuting in? Share your ride with peers.</p>");
            html.append("  </div>");

            if (error != null) {
                html.append("  <div class='alert alert-error'>");
                html.append("    <span>&#9888;&#65039; ").append(escapeHtml(error)).append("</span>");
                html.append("  </div>");
            }

            html.append("  <form method='POST' action='/post-ride'>");
            html.append("    <div class='form-group'>");
            html.append("      <label class='form-label' for='driverName'>Driver Name</label>");
            html.append("      <input type='text' id='driverName' name='driverName' class='form-control' placeholder='e.g. Rakesh Kumar' required value='").append(escapeHtml(driver)).append("'>");
            html.append("    </div>");

            html.append("    <div class='grid-2'>");
            html.append("      <div class='form-group'>");
            html.append("        <label class='form-label' for='source'>Starting Location (Source)</label>");
            html.append("        <input type='text' id='source' name='source' class='form-control' placeholder='e.g. Campus Main Gate' required value='").append(escapeHtml(src)).append("'>");
            html.append("      </div>");
            html.append("      <div class='form-group'>");
            html.append("        <label class='form-label' for='destination'>Destination</label>");
            html.append("        <input type='text' id='destination' name='destination' class='form-control' placeholder='e.g. Central Metro Station' required value='").append(escapeHtml(dst)).append("'>");
            html.append("      </div>");
            html.append("    </div>");

            html.append("    <div class='grid-2'>");
            html.append("      <div class='form-group'>");
            html.append("        <label class='form-label' for='time'>Departure Date & Time</label>");
            html.append("        <input type='text' id='time' name='time' class='form-control' placeholder='e.g. Today 5:00 PM' required value='").append(escapeHtml(time)).append("'>");
            html.append("      </div>");
            html.append("      <div class='form-group'>");
            html.append("        <label class='form-label' for='seatsAvailable'>Available Seats</label>");
            html.append("        <input type='number' id='seatsAvailable' name='seatsAvailable' class='form-control' min='1' max='8' value='").append(seats > 0 ? seats : 3).append("' required>");
            html.append("      </div>");
            html.append("    </div>");

            html.append("    <button type='submit' class='btn btn-secondary btn-block' style='margin-top: 20px;'>Publish Ride Offer</button>");
            html.append("  </form>");
            html.append("</div>");

            return html.toString();
        }
    }

    /**
     * GET  /search-rides -> Show search form & matching rides
     */
    static class SearchRidesHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String method = exchange.getRequestMethod();
            String source = "";
            String destination = "";

            if ("POST".equalsIgnoreCase(method)) {
                Map<String, String> params = parseFormData(exchange);
                source = params.getOrDefault("source", "");
                destination = params.getOrDefault("destination", "");
            } else {
                String query = exchange.getRequestURI().getRawQuery();
                if (query != null && !query.isEmpty()) {
                    Map<String, String> qparams = parseQueryString(query);
                    source = qparams.getOrDefault("source", "");
                    destination = qparams.getOrDefault("destination", "");
                }
            }

            List<Ride> results = rideManager.searchRides(source, destination);

            StringBuilder html = new StringBuilder();

            html.append("<div class='search-card'>");
            html.append("  <h2 style='font-size: 1.25rem; font-weight: 700; margin-bottom: 16px;'>&#128269; Search Campus Rides</h2>");
            html.append("  <form method='POST' action='/search-rides'>");
            html.append("    <div class='search-form-row'>");
            html.append("      <div class='search-col'>");
            html.append("        <label class='form-label' for='search-src'>From (Source)</label>");
            html.append("        <input type='text' id='search-src' name='source' class='form-control' placeholder='e.g. Main Gate or Hostels' value='").append(escapeHtml(source)).append("'>");
            html.append("      </div>");
            html.append("      <div class='search-col'>");
            html.append("        <label class='form-label' for='search-dst'>To (Destination)</label>");
            html.append("        <input type='text' id='search-dst' name='destination' class='form-control' placeholder='e.g. Metro or Cyber City' value='").append(escapeHtml(destination)).append("'>");
            html.append("      </div>");
            html.append("      <div style='display: flex; gap: 8px;'>");
            html.append("        <button type='submit' class='btn btn-primary'>Search</button>");
            html.append("        <a href='/search-rides' class='btn' style='background: #e2e8f0; color: #475569;'>Clear</a>");
            html.append("      </div>");
            html.append("    </div>");
            html.append("  </form>");
            html.append("</div>");

            html.append("<div class='section-header'>");
            html.append("  <h2 class='section-title'>Active Rides (").append(results.size()).append(")</h2>");
            html.append("  <a href='/post-ride' class='btn btn-secondary btn-sm'>+ Offer a Ride</a>");
            html.append("</div>");

            if (results.isEmpty()) {
                html.append("<div class='empty-state'>");
                html.append("  <div class='empty-icon'>&#128663;&#128168;</div>");
                html.append("  <h3 class='empty-title'>No rides found for this route</h3>");
                html.append("  <p class='empty-subtitle'>Try another campus location or post your own ride offer!</p>");
                html.append("  <div style='display: flex; gap: 12px; justify-content: center;'>");
                html.append("    <a href='/search-rides' class='btn btn-primary btn-sm'>Show All Rides</a>");
                html.append("    <a href='/post-ride' class='btn btn-secondary btn-sm'>Offer This Ride</a>");
                html.append("  </div>");
                html.append("</div>");
            } else {
                html.append(renderRideCards(results));
            }

            sendHtml(exchange, 200, renderPage("Find a Ride - College Ride Sharing", "search", html.toString()));
        }
    }

    /**
     * POST /book-ride -> Handle seat booking
     */
    static class BookRideHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendRedirect(exchange, "/search-rides");
                return;
            }

            Map<String, String> params = parseFormData(exchange);
            String rideId = params.get("rideId");

            StringBuilder outcomeMsg = new StringBuilder();
            boolean success = rideManager.bookRide(rideId, outcomeMsg);
            Ride ride = rideManager.getRideById(rideId);

            StringBuilder html = new StringBuilder();
            html.append("<div class='card' style='max-width: 580px; margin: 20px auto;'>");

            if (success) {
                html.append("  <div class='alert alert-success'>");
                html.append("    <span>&#127881; <strong>Booking Confirmed!</strong></span>");
                html.append("  </div>");
                html.append("  <div class='card-header'>");
                html.append("    <h2 class='card-title'>Your Seat is Reserved</h2>");
                html.append("    <p class='card-description'>").append(escapeHtml(outcomeMsg.toString())).append("</p>");
                html.append("  </div>");

                if (ride != null) {
                    html.append("  <div class='ride-meta' style='flex-direction: column; align-items: flex-start; gap: 8px; margin: 20px 0;'>");
                    html.append("    <div><strong>Ride ID:</strong> ").append(escapeHtml(ride.getRideId())).append("</div>");
                    html.append("    <div><strong>Route:</strong> ").append(escapeHtml(ride.getSource())).append(" &rarr; ").append(escapeHtml(ride.getDestination())).append("</div>");
                    html.append("    <div><strong>Driver:</strong> ").append(escapeHtml(ride.getDriverName())).append("</div>");
                    html.append("    <div><strong>Departure:</strong> ").append(escapeHtml(ride.getTime())).append("</div>");
                    html.append("    <div><strong>Remaining Seats:</strong> ").append(ride.getSeatsAvailable()).append("</div>");
                    html.append("  </div>");
                }

                html.append("  <div style='display: flex; gap: 12px; margin-top: 24px;'>");
                html.append("    <a href='/search-rides' class='btn btn-primary btn-block'>Find More Rides</a>");
                html.append("    <a href='/' class='btn btn-secondary btn-block'>Return to Home</a>");
                html.append("  </div>");
            } else {
                html.append("  <div class='alert alert-error'>");
                html.append("    <span>&#9888;&#65039; <strong>Booking Error:</strong> ").append(escapeHtml(outcomeMsg.toString())).append("</span>");
                html.append("  </div>");
                html.append("  <div class='card-header'>");
                html.append("    <h2 class='card-title'>Unable to Reserve Seat</h2>");
                html.append("    <p class='card-description'>This ride may be full or has just reached maximum capacity.</p>");
                html.append("  </div>");
                html.append("  <div style='margin-top: 24px;'>");
                html.append("    <a href='/search-rides' class='btn btn-primary btn-block'>Browse Available Rides</a>");
                html.append("  </div>");
            }

            html.append("</div>");

            sendHtml(exchange, 200, renderPage(success ? "Booking Confirmed" : "Booking Failed", "search", html.toString()));
        }
    }

    /**
     * GET /style.css
     */
    static class StyleHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            byte[] cssBytes = loadStyleCssBytes();
            exchange.getResponseHeaders().set("Content-Type", "text/css; charset=UTF-8");
            exchange.getResponseHeaders().set("Cache-Control", "no-cache");
            exchange.sendResponseHeaders(200, cssBytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(cssBytes);
            }
        }
    }

    // =========================================================================
    // REST API HANDLERS (JSON)
    // =========================================================================

    /**
     * /api/profiles -> GET (list all JSON), POST (create new), DELETE (remove)
     */
    static class ApiProfilesHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            String method = exchange.getRequestMethod();

            if ("OPTIONS".equalsIgnoreCase(method)) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            if ("GET".equalsIgnoreCase(method)) {
                String json = userManager.getAllUsersJson();
                sendJson(exchange, 200, json);
            } else if ("POST".equalsIgnoreCase(method)) {
                Map<String, String> params = parseFormData(exchange);
                String name = params.get("name");
                String email = params.get("email");
                String password = params.get("password");
                String role = params.get("role");
                String phone = params.get("phone");
                String department = params.get("department");
                String vehicleModel = params.get("vehicleModel");

                String err = userManager.register(name, email, password, role, phone, department, vehicleModel);
                if (err == null) {
                    User u = userManager.getUserByEmail(email);
                    sendJson(exchange, 201, "{\"success\":true,\"profile\":" + (u != null ? u.toJson() : "{}") + "}");
                } else {
                    sendJson(exchange, 400, "{\"success\":false,\"error\":\"" + escapeJson(err) + "\"}");
                }
            } else if ("DELETE".equalsIgnoreCase(method)) {
                String query = exchange.getRequestURI().getRawQuery();
                Map<String, String> qparams = parseQueryString(query);
                String id = qparams.get("id");
                String email = qparams.get("email");
                boolean ok = userManager.removeUser(id != null ? id : email);
                sendJson(exchange, 200, "{\"success\":" + ok + "}");
            } else {
                sendJson(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
            }
        }
    }

    /**
     * /api/rides -> GET list of rides in JSON format
     */
    static class ApiRidesHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            List<Ride> list = rideManager.getAllRides();
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < list.size(); i++) {
                Ride r = list.get(i);
                sb.append("{")
                  .append("\"id\":\"").append(escapeJson(r.getRideId())).append("\",")
                  .append("\"source\":\"").append(escapeJson(r.getSource())).append("\",")
                  .append("\"destination\":\"").append(escapeJson(r.getDestination())).append("\",")
                  .append("\"driverName\":\"").append(escapeJson(r.getDriverName())).append("\",")
                  .append("\"time\":\"").append(escapeJson(r.getTime())).append("\",")
                  .append("\"seatsAvailable\":").append(r.getSeatsAvailable()).append(",")
                  .append("\"price\":60")
                  .append("}");
                if (i < list.size() - 1) sb.append(",");
            }
            sb.append("]");
            sendJson(exchange, 200, sb.toString());
        }
    }

    /**
     * /api/logout -> POST / GET
     */
    static class ApiLogoutHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            addCorsHeaders(exchange);
            sendJson(exchange, 200, "{\"success\":true,\"message\":\"Logged out successfully\"}");
        }
    }

    // =========================================================================
    // HELPERS & RENDERING
    // =========================================================================

    public static String renderPage(String title, String activeNav, String bodyContent) {
        StringBuilder sb = new StringBuilder();
        sb.append("<!DOCTYPE html>\n<html lang='en'>\n<head>\n");
        sb.append("  <meta charset='UTF-8'>\n");
        sb.append("  <meta name='viewport' content='width=device-width, initial-scale=1.0'>\n");
        sb.append("  <title>").append(escapeHtml(title)).append("</title>\n");
        sb.append("  <link rel='stylesheet' href='/style.css'>\n");
        sb.append("</head>\n<body>\n");

        sb.append("  <header class='navbar'>\n");
        sb.append("    <div class='nav-container'>\n");
        sb.append("      <a href='/' class='brand'>\n");
        sb.append("        <span class='brand-icon'>&#128664;</span>\n");
        sb.append("        <span class='brand-text'>Campus<span>Ride</span></span>\n");
        sb.append("      </a>\n");
        sb.append("      <nav>\n");
        sb.append("        <ul class='nav-links'>\n");
        sb.append("          <li><a href='/' class='nav-link ").append("home".equals(activeNav) ? "active" : "").append("'>Home</a></li>\n");
        sb.append("          <li><a href='/search-rides' class='nav-link ").append("search".equals(activeNav) ? "active" : "").append("'>Find a Ride</a></li>\n");
        sb.append("          <li><a href='/post-ride' class='nav-link ").append("post-ride".equals(activeNav) ? "active" : "").append("'>Offer a Ride</a></li>\n");
        sb.append("          <li><a href='/profiles' class='nav-link ").append("profiles".equals(activeNav) ? "active" : "").append("'>Profiles</a></li>\n");
        sb.append("          <li><a href='/login' class='nav-link ").append("login".equals(activeNav) ? "active" : "").append("'>Sign In</a></li>\n");
        sb.append("          <li><a href='/register' class='nav-link nav-btn ").append("register".equals(activeNav) ? "active" : "").append("'>+ Add Profile</a></li>\n");
        sb.append("        </ul>\n");
        sb.append("      </nav>\n");
        sb.append("    </div>\n");
        sb.append("  </header>\n");

        sb.append("  <main>\n");
        sb.append("    <div class='container'>\n");
        sb.append(bodyContent);
        sb.append("    </div>\n");
        sb.append("  </main>\n");

        sb.append("  <footer>\n");
        sb.append("    <div class='container'>\n");
        sb.append("      <p><strong>College Ride Sharing System</strong> &bull; Multi-Profile Verified Edition</p>\n");
        sb.append("      <div class='footer-links'>\n");
        sb.append("        <a href='/'>Home</a>\n");
        sb.append("        <a href='/search-rides'>Find Rides</a>\n");
        sb.append("        <a href='/post-ride'>Offer Ride</a>\n");
        sb.append("        <a href='/profiles'>Profiles</a>\n");
        sb.append("        <a href='/logout'>Log Out</a>\n");
        sb.append("      </div>\n");
        sb.append("    </div>\n");
        sb.append("  </footer>\n");

        sb.append("</body>\n</html>\n");
        return sb.toString();
    }

    private static String renderRideCards(List<Ride> rides) {
        if (rides == null || rides.isEmpty()) {
            return "<div class='empty-state'><p class='empty-subtitle'>No rides currently listed.</p></div>";
        }

        StringBuilder html = new StringBuilder();
        html.append("<div class='grid-2'>");

        for (Ride ride : rides) {
            int seatsLeft = ride.getSeatsAvailable();
            boolean isFull = seatsLeft <= 0;

            String seatsBadgeClass = isFull ? "seats-full" : (seatsLeft == 1 ? "seats-warning" : "");
            String seatsBadgeText = isFull ? "Full (0 seats)" : seatsLeft + " seats available";

            html.append("<div class='ride-card'>");
            html.append("  <div class='ride-card-top'>");
            html.append("    <span class='badge badge-id'>").append(escapeHtml(ride.getRideId())).append("</span>");
            html.append("    <span class='badge badge-seats ").append(seatsBadgeClass).append("'>").append(seatsBadgeText).append("</span>");
            html.append("  </div>");

            html.append("  <div class='ride-route'>");
            html.append("    <div class='route-point'>");
            html.append("      <span class='point-dot dot-src'></span>");
            html.append("      <span class='point-label'>From</span>");
            html.append("      <span class='point-value'>").append(escapeHtml(ride.getSource())).append("</span>");
            html.append("    </div>");
            html.append("    <div class='route-point'>");
            html.append("      <span class='point-dot dot-dst'></span>");
            html.append("      <span class='point-label'>To</span>");
            html.append("      <span class='point-value'>").append(escapeHtml(ride.getDestination())).append("</span>");
            html.append("    </div>");
            html.append("  </div>");

            html.append("  <div class='ride-meta'>");
            html.append("    <div class='meta-item'>");
            html.append("      <span>&#128100;</span> <span class='meta-driver'>").append(escapeHtml(ride.getDriverName())).append("</span>");
            html.append("    </div>");
            html.append("    <div class='meta-item'>");
            html.append("      <span>&#128340;</span> <span>").append(escapeHtml(ride.getTime())).append("</span>");
            html.append("    </div>");
            html.append("  </div>");

            if (isFull) {
                html.append("  <button class='btn btn-block' disabled>Sold Out</button>");
            } else {
                html.append("  <form method='POST' action='/book-ride' style='margin: 0;'>");
                html.append("    <input type='hidden' name='rideId' value='").append(escapeHtml(ride.getRideId())).append("'>");
                html.append("    <button type='submit' class='btn btn-primary btn-block'>Book Seat</button>");
                html.append("  </form>");
            }

            html.append("</div>");
        }

        html.append("</div>");
        return html.toString();
    }

    private static Map<String, String> parseFormData(HttpExchange exchange) throws IOException {
        Map<String, String> map = new HashMap<String, String>();
        InputStream is = exchange.getRequestBody();
        BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8));
        StringBuilder body = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            body.append(line);
        }

        String raw = body.toString();
        if (raw.isEmpty()) return map;

        String[] pairs = raw.split("&");
        for (String pair : pairs) {
            int idx = pair.indexOf('=');
            if (idx > 0) {
                String key = URLDecoder.decode(pair.substring(0, idx), "UTF-8");
                String val = (idx < pair.length() - 1) ? URLDecoder.decode(pair.substring(idx + 1), "UTF-8") : "";
                map.put(key, val);
            }
        }
        return map;
    }

    private static Map<String, String> parseQueryString(String rawQuery) {
        Map<String, String> map = new HashMap<String, String>();
        if (rawQuery == null || rawQuery.isEmpty()) return map;

        String[] pairs = rawQuery.split("&");
        for (String pair : pairs) {
            int idx = pair.indexOf('=');
            if (idx > 0) {
                try {
                    String key = URLDecoder.decode(pair.substring(0, idx), "UTF-8");
                    String val = (idx < pair.length() - 1) ? URLDecoder.decode(pair.substring(idx + 1), "UTF-8") : "";
                    map.put(key, val);
                } catch (Exception ignored) {}
            }
        }
        return map;
    }

    private static void sendHtml(HttpExchange exchange, int statusCode, String html) throws IOException {
        byte[] bytes = html.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "text/html; charset=UTF-8");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private static void sendJson(HttpExchange exchange, int statusCode, String json) throws IOException {
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private static void addCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    private static void sendRedirect(HttpExchange exchange, String location) throws IOException {
        exchange.getResponseHeaders().set("Location", location);
        exchange.sendResponseHeaders(303, -1);
    }

    private static String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                   .replace("<", "&lt;")
                   .replace(">", "&gt;")
                   .replace("\"", "&quot;")
                   .replace("'", "&#39;");
    }

    private static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r");
    }

    private static byte[] loadStyleCssBytes() {
        File cssFile = new File("style.css");
        if (cssFile.exists() && cssFile.isFile()) {
            try (FileInputStream fis = new FileInputStream(cssFile)) {
                byte[] data = new byte[(int) cssFile.length()];
                int read = fis.read(data);
                if (read == data.length) return data;
            } catch (Exception ignored) {}
        }

        String fallbackCss = "body{font-family:sans-serif;background:#f8fafc;color:#1e293b;padding:20px;}" +
            ".container{max-width:960px;margin:auto;}" +
            ".card{background:#fff;border-radius:12px;padding:24px;border:1px solid #e2e8f0;margin-bottom:20px;}" +
            ".btn{padding:10px 20px;border-radius:8px;border:none;cursor:pointer;font-weight:bold;}" +
            ".btn-primary{background:#2563eb;color:#fff;}" +
            ".btn-secondary{background:#059669;color:#fff;}";
        return fallbackCss.getBytes(StandardCharsets.UTF_8);
    }
}
