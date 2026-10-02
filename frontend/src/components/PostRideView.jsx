import React, { useState } from 'react';
import { 
  Car, 
  MapPin, 
  Navigation, 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Leaf,
  Plus
} from './Icons';
import { CAMPUS_LOCATIONS } from '../data/mockData';
import RideCard from './RideCard';

export default function PostRideView({ currentUser, onPostRideSuccess, setActiveTab }) {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split('T')[0]);
  const [departureTime, setDepartureTime] = useState('05:30 PM');
  const [totalSeats, setTotalSeats] = useState(3);
  const [price, setPrice] = useState('60');
  const [carModel, setCarModel] = useState(currentUser?.carModel || 'Tata Nexon (White)');
  const [femaleOnly, setFemaleOnly] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([
    'AC',
    'College Verified'
  ]);

  const availableAmenitiesList = [
    'AC',
    'Music Friendly',
    'Luggage / Boot Space',
    'Fast Tag Express',
    'Quiet Ride'
  ];

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handlePost = (e) => {
    e.preventDefault();
    if (!source || !destination) {
      alert('Please enter both pickup point and destination!');
      return;
    }

    const newRide = {
      id: `ride-${Date.now()}`,
      driverId: currentUser ? currentUser.id : 'usr-temp',
      driverName: currentUser ? currentUser.name : 'Campus Driver',
      driverDept: currentUser ? currentUser.department : 'College Student',
      driverRating: currentUser ? currentUser.rating : 5.0,
      driverAvatar: currentUser ? currentUser.avatar : 'CD',
      source,
      destination,
      departureTime: `Today, ${departureTime}`,
      date: departureDate,
      price: parseFloat(price) || 50,
      totalSeats: parseInt(totalSeats, 10),
      seatsAvailable: parseInt(totalSeats, 10),
      carModel,
      amenities: selectedAmenities,
      co2SavedKg: parseFloat((Math.random() * 2 + 2.5).toFixed(1)),
      femaleOnly,
      recurring: 'Daily Commute',
      passengers: []
    };

    onPostRideSuccess(newRide);
    setActiveTab('explore');
  };

  // Preview object for live visual feedback
  const previewRide = {
    id: 'preview-sample',
    driverId: currentUser?.id,
    driverName: currentUser?.name || 'Your Name',
    driverDept: currentUser?.department || 'Verified Student Driver',
    driverRating: currentUser?.rating || 5.0,
    driverAvatar: currentUser?.avatar || 'YOU',
    source: source || 'Campus Main Gate',
    destination: destination || 'Central Metro Station',
    departureTime: `Today, ${departureTime}`,
    price: parseFloat(price) || 60,
    totalSeats: parseInt(totalSeats, 10),
    seatsAvailable: parseInt(totalSeats, 10),
    carModel: carModel || 'Vehicle Details',
    amenities: selectedAmenities,
    femaleOnly,
    co2SavedKg: 3.2
  };

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span className="hero-pill">
          <Car size={15} /> Offer a Ride
        </span>
        <h2 style={{ fontSize: '32px', fontWeight: '800' }}>Publish Your Campus Commute</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto' }}>
          Have empty seats during your daily college commute? Share with peers, split petrol cost, and reduce campus traffic.
        </p>
      </div>

      <div className="post-ride-container">
        {/* Post Ride Form Card */}
        <div className="form-card">
          <div className="form-title-wrap">
            <h3 className="form-section-title">Trip Route & Details</h3>
            <p className="form-section-desc">Enter your route and departure time.</p>
          </div>

          <form onSubmit={handlePost}>
            <div className="form-grid-2" style={{ marginBottom: '16px' }}>
              <div className="input-field-wrap">
                <label className="input-label">
                  <MapPin size={15} color="var(--accent-primary)" /> Pickup Location
                </label>
                <input 
                  type="text"
                  className="input-control"
                  placeholder="e.g. Campus Gate 1, Hostels..."
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  list="campus-post-locations"
                  required
                />
              </div>

              <div className="input-field-wrap">
                <label className="input-label">
                  <Navigation size={15} color="var(--accent-secondary)" /> Destination
                </label>
                <input 
                  type="text"
                  className="input-control"
                  placeholder="e.g. Metro Station, Tech Park..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  list="campus-post-locations"
                  required
                />
              </div>
            </div>

            <datalist id="campus-post-locations">
              {CAMPUS_LOCATIONS.map((loc, idx) => (
                <option key={idx} value={loc} />
              ))}
            </datalist>

            <div className="form-grid-2" style={{ marginBottom: '16px' }}>
              <div className="input-field-wrap">
                <label className="input-label">
                  <Calendar size={15} color="var(--accent-cyan)" /> Date
                </label>
                <input 
                  type="date"
                  className="input-control"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  required
                />
              </div>

              <div className="input-field-wrap">
                <label className="input-label">
                  <Clock size={15} color="var(--accent-amber)" /> Time
                </label>
                <input 
                  type="text"
                  className="input-control"
                  placeholder="e.g. 05:30 PM"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-grid-2" style={{ marginBottom: '16px' }}>
              <div className="input-field-wrap">
                <label className="input-label">
                  <Users size={15} color="var(--accent-primary)" /> Available Seats
                </label>
                <select 
                  className="input-control"
                  value={totalSeats}
                  onChange={(e) => setTotalSeats(Number(e.target.value))}
                >
                  <option value={1}>1 Seat</option>
                  <option value={2}>2 Seats</option>
                  <option value={3}>3 Seats</option>
                  <option value={4}>4 Seats</option>
                </select>
              </div>

              <div className="input-field-wrap">
                <label className="input-label">
                  <span>₹</span> Split Fare per Seat (INR)
                </label>
                <input 
                  type="number"
                  step="5"
                  min="10"
                  className="input-control"
                  placeholder="60"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-field-wrap" style={{ marginBottom: '20px' }}>
              <label className="input-label">
                <Car size={15} color="var(--accent-cyan)" /> Vehicle Model & Color
              </label>
              <input 
                type="text"
                className="input-control"
                placeholder="e.g. Tata Nexon EV, Hyundai i20, Swift Dzire"
                value={carModel}
                onChange={(e) => setCarModel(e.target.value)}
              />
            </div>

            {/* Amenities Checklist */}
            <div className="input-field-wrap" style={{ marginBottom: '20px' }}>
              <label className="input-label">Ride Features</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {availableAmenitiesList.map((amenity, idx) => {
                  const isChecked = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-full)',
                        border: isChecked ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        background: isChecked ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-input)',
                        color: isChecked ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {isChecked ? '✓ ' : '+ '} {amenity}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Women Only Toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(236, 72, 153, 0.08)',
              border: '1px solid rgba(236, 72, 153, 0.2)',
              marginBottom: '24px'
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#f472b6' }}>
                  👭 Women Passengers Only
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Restrict booking exclusively to verified female college students and faculty.
                </div>
              </div>
              <input 
                type="checkbox"
                checked={femaleOnly}
                onChange={(e) => setFemaleOnly(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: '#ec4899', cursor: 'pointer' }}
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary btn-block btn-lg">
              <Plus size={18} />
              <span>Publish Ride</span>
            </button>
          </form>
        </div>

        {/* Live Preview Card */}
        <div>
          <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Passenger Card Preview
            </span>
            <span style={{ fontSize: '12px', color: 'var(--accent-secondary)', fontWeight: '600' }}>
              ● Live Sync
            </span>
          </div>

          <RideCard 
            ride={previewRide} 
            onBookClick={() => {}} 
            currentUserId={null}
            isBookedByMe={false}
          />
        </div>
      </div>
    </div>
  );
}
