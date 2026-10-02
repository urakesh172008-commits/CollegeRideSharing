export const INITIAL_USERS = [];

export const INITIAL_RIDES = [
  {
    id: "ride-101",
    driverId: "usr-prime-1",
    driverName: "Campus Carpool (Gate 1)",
    driverDept: "Verified Student Commute",
    driverRating: 4.9,
    driverAvatar: "CC",
    source: "Campus Main Gate (Gate 1)",
    destination: "Central Metro Station",
    departureTime: "Today, 04:30 PM",
    date: "2026-10-02",
    price: 60,
    totalSeats: 3,
    seatsAvailable: 2,
    carModel: "Tata Nexon EV",
    amenities: ["AC", "Fast Tag Express", "College Verified"],
    co2SavedKg: 3.2,
    femaleOnly: false,
    recurring: "Daily Commute",
    passengers: []
  },
  {
    id: "ride-102",
    driverId: "usr-prime-2",
    driverName: "Hostel Carpool",
    driverDept: "Student Daily Commute",
    driverRating: 5.0,
    driverAvatar: "HC",
    source: "Student Hostels (Block C)",
    destination: "Cyber City Tech Park",
    departureTime: "Today, 05:15 PM",
    date: "2026-10-02",
    price: 90,
    totalSeats: 4,
    seatsAvailable: 3,
    carModel: "Hyundai i20",
    amenities: ["AC", "Music Friendly", "Luggage Space"],
    co2SavedKg: 4.1,
    femaleOnly: false,
    recurring: "Mon-Fri",
    passengers: []
  },
  {
    id: "ride-103",
    driverId: "usr-prime-3",
    driverName: "Airport Express",
    driverDept: "Campus Commuter",
    driverRating: 4.95,
    driverAvatar: "AE",
    source: "Engineering & Science Block",
    destination: "Domestic & Int'l Airport (T1)",
    departureTime: "Tomorrow, 07:30 AM",
    date: "2026-10-03",
    price: 250,
    totalSeats: 3,
    seatsAvailable: 1,
    carModel: "Tata Nexon EV",
    amenities: ["AC", "Large Boot Space", "Highway Route"],
    co2SavedKg: 8.5,
    femaleOnly: false,
    recurring: "Weekend Express",
    passengers: []
  }
];

export const CAMPUS_LOCATIONS = [
  "Campus Main Gate (Gate 1)",
  "Central University Library",
  "Engineering & Science Block",
  "Student Hostels (Block A & B)",
  "Central Metro Station",
  "Cyber City Tech Park",
  "City Railway Junction",
  "Domestic & Int'l Airport (T1)",
  "Phoenix Mall & City Center"
];

export const RADAR_NODES = [
  { id: "node-1", name: "Campus Main Gate", x: 25, y: 35, icon: "🏛️", activeRides: 4 },
  { id: "node-2", name: "Central Library", x: 45, y: 22, icon: "📚", activeRides: 3 },
  { id: "node-3", name: "Student Hostels", x: 20, y: 70, icon: "🏢", activeRides: 6 },
  { id: "node-4", name: "Cyber Tech Park", x: 75, y: 30, icon: "💻", activeRides: 5 },
  { id: "node-5", name: "Central Metro", x: 80, y: 75, icon: "🚆", activeRides: 8 },
  { id: "node-6", name: "Airport (T1)", x: 90, y: 15, icon: "✈️", activeRides: 2 },
  { id: "node-7", name: "Railway Junction", x: 50, y: 85, icon: "🚉", activeRides: 4 }
];
