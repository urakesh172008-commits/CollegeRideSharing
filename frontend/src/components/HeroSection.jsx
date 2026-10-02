import React from 'react';
import { Search, MapPin, Navigation, Calendar, Users, DollarSign, Sparkles } from './Icons';
import { CAMPUS_LOCATIONS } from '../data/mockData';

export default function HeroSection({
  searchQuery,
  setSearchQuery,
  destinationQuery,
  setDestinationQuery,
  selectedDate,
  setSelectedDate,
  minSeats,
  setMinSeats,
  onPerformSearch,
  totalRidesCount,
  activeFilterChip,
  setActiveFilterChip
}) {
  const quickChips = [
    "All Routes",
    "Campus Gate 1",
    "Central Metro",
    "Cyber City",
    "Railway Junction",
    "Airport (T1)",
    "Hostels"
  ];

  return (
    <section className="hero-section">
      <div className="container">
        {/* Animated Pill */}
        <div className="hero-pill">
          <Sparkles size={15} />
          <span>Verified Indian College Carpool & Commuter Network</span>
        </div>

        {/* Headline */}
        <h1 className="hero-headline">
          Campus Rides. <span className="gradient-text">Fair Split.</span><br />
          Safe Student Commute across India.
        </h1>
        
        <p className="hero-subtext">
          Share verified rides with college peers, split petrol costs with zero commission, and travel safely.
        </p>

        {/* Hero Quick Stats */}
        <div className="hero-stats-grid">
          <div className="hero-stat-card">
            <div className="hero-stat-num">1,240+</div>
            <div className="hero-stat-label">Trips Shared</div>
          </div>
          <div className="hero-stat-card">
            <div className="hero-stat-num" style={{ color: 'var(--accent-secondary)' }}>₹3,85,000</div>
            <div className="hero-stat-label">Petrol Cost Saved</div>
          </div>
          <div className="hero-stat-card">
            <div className="hero-stat-num" style={{ color: 'var(--accent-cyan)' }}>14.2 Tons</div>
            <div className="hero-stat-label">CO₂ Reduced</div>
          </div>
          <div className="hero-stat-card">
            <div className="hero-stat-num" style={{ color: 'var(--accent-amber)' }}>100%</div>
            <div className="hero-stat-label">College ID Verified</div>
          </div>
        </div>

        {/* Interactive Search Widget */}
        <div className="search-widget-card">
          <form onSubmit={(e) => { e.preventDefault(); onPerformSearch(); }}>
            <div className="search-grid">
              {/* Pickup Location */}
              <div className="input-field-wrap">
                <label className="input-label">
                  <MapPin size={15} color="var(--accent-primary)" />
                  <span>Pickup Point</span>
                </label>
                <input 
                  type="text"
                  className="input-control"
                  placeholder="e.g. Campus Gate 1, Hostels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  list="campus-locations-list"
                />
              </div>

              {/* Destination */}
              <div className="input-field-wrap">
                <label className="input-label">
                  <Navigation size={15} color="var(--accent-secondary)" />
                  <span>Destination</span>
                </label>
                <input 
                  type="text"
                  className="input-control"
                  placeholder="e.g. Metro Station, Cyber City..."
                  value={destinationQuery}
                  onChange={(e) => setDestinationQuery(e.target.value)}
                  list="campus-locations-list"
                />
              </div>

              {/* Date */}
              <div className="input-field-wrap">
                <label className="input-label">
                  <Calendar size={15} color="var(--accent-cyan)" />
                  <span>Date</span>
                </label>
                <input 
                  type="date"
                  className="input-control"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              {/* Seats Needed */}
              <div className="input-field-wrap">
                <label className="input-label">
                  <Users size={15} color="var(--accent-amber)" />
                  <span>Passengers</span>
                </label>
                <select 
                  className="input-control"
                  value={minSeats}
                  onChange={(e) => setMinSeats(Number(e.target.value))}
                >
                  <option value={1}>1 Seat</option>
                  <option value={2}>2 Seats</option>
                  <option value={3}>3 Seats</option>
                  <option value={4}>4+ Seats</option>
                </select>
              </div>

              {/* Search Button */}
              <div>
                <button type="submit" className="btn btn-primary btn-block" style={{ height: '48px' }}>
                  <Search size={18} />
                  <span>Find Rides</span>
                </button>
              </div>
            </div>

            {/* Quick Autocomplete Datalist */}
            <datalist id="campus-locations-list">
              {CAMPUS_LOCATIONS.map((loc, idx) => (
                <option key={idx} value={loc} />
              ))}
            </datalist>

            {/* Quick Location Chips */}
            <div className="quick-chips-row">
              <span className="quick-chips-label">Quick Locations:</span>
              {quickChips.map((chip, idx) => {
                const isActive = activeFilterChip === chip || (chip === "All Routes" && !activeFilterChip);
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`chip-btn ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      if (chip === "All Routes") {
                        setActiveFilterChip("");
                        setSearchQuery("");
                        setDestinationQuery("");
                      } else {
                        setActiveFilterChip(chip);
                        setDestinationQuery(chip);
                      }
                    }}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
