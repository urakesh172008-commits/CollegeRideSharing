# UniRide — Modern College Ride Sharing Web Application

A safe, verified, peer-to-peer campus ride sharing and carpooling platform built for university students, faculty, and staff.

---

## 🌟 Modern Web App Features

- 🚗 **Live Ride Marketplace**: Real-time carpool search by campus origin, destination, date, price, and available seats.
- ⚡ **Instant Seat Booking & Digital Boarding Pass**: Reserve seats in 1 click and receive a dynamic QR code college boarding pass.
- 📝 **Driver & Carpool Studio**: Step-by-step ride publisher with live card preview, vehicle specs, and amenities checklist.
- 🧭 **Interactive Campus Radar Visualizer**: Visual transit network connecting campus landmarks (North Quad, STEM Hall, Central Library, Dorms, Metro Station, Airport, Sports Arena).
- 🌿 **Eco & Fare Split Calculator**: Interactive tool computing gas money saved ($), carbon footprint prevented (kg CO₂), and equivalent trees planted.
- 🛡️ **Campus Trust & Safety Hub**: Single sign-on verification, 2-way accountability ratings, emergency SOS simulator, and female-only ride filters.
- 🌓 **Dark & Light Mode**: Curated glassmorphism design system with custom CSS tokens, smooth animations, and responsive layouts.
- 👤 **1-Click Persona Switcher**: Instant switching between Driver (`Emma`, `David`) and Rider (`Alex`, `Sophia`) demo profiles, plus custom profile registration.

---

## 🚀 Quick Start

### 1. Run the Modern React Web App (Vite)
```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

### 2. Run with 1-Click Helper Scripts
- **Windows Batch**: Double-click [`run.bat`](file:///c:/Users/Rakesh%20U/Documents/CollegeRideSharing/run.bat)
- **PowerShell**: Run [`run.ps1`](file:///c:/Users/Rakesh%20U/Documents/CollegeRideSharing/run.ps1)

---

### 3. Run the Pure Java Backend Server
```bash
javac *.java
java WebServer
```
Open **[http://localhost:8080](http://localhost:8080)** in your browser.

---

## 📁 Project Architecture

```
CollegeRideSharing/
├── frontend/                     # Modern React + Vite Web Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation, role switcher, safety, theme
│   │   │   ├── HeroSection.jsx   # Dynamic stats, campus search, location chips
│   │   │   ├── RideCard.jsx      # Animated timeline, seat visualizer, verified tags
│   │   │   ├── BookRideModal.jsx # Seat selector, split breakdown, QR pass generator
│   │   │   ├── PostRideView.jsx  # Driver studio with live sync card preview
│   │   │   ├── MyRidesView.jsx   # Passenger trips & Driver offered listings
│   │   │   ├── TransitRadar.jsx  # Interactive visual campus route visualizer
│   │   │   ├── EcoCalculator.jsx # Gas savings & CO2 emissions calculator
│   │   │   ├── AuthModal.jsx     # Single sign-on & persona switcher
│   │   │   ├── SafetyCenterModal.jsx # Safety guidelines & SOS test simulator
│   │   │   └── Icons.jsx         # Zero-dependency SVG icon system
│   │   ├── data/
│   │   │   └── mockData.js       # Pre-loaded campus routes, drivers, and hubs
│   │   ├── index.css             # Glassmorphism design tokens & responsive CSS
│   │   ├── App.jsx               # Main state orchestrator & persistent storage
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── WebServer.java                # Pure Java HttpServer backend
├── RideManager.java              # In-memory ride repository
├── UserManager.java              # User registry and authentication
├── Ride.java                     # Ride model
├── User.java                     # User model
├── run.bat                       # Interactive Windows launcher
└── run.ps1                       # Interactive PowerShell launcher
```
