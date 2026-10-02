import React from 'react';
import { 
  CheckCircle2, 
  Star, 
  MapPin, 
  Navigation, 
  Clock, 
  Car, 
  ShieldCheck, 
  Leaf, 
  Users, 
  Check
} from './Icons';

export default function RideCard({ ride, onBookClick, currentUserId, isBookedByMe }) {
  const isFull = ride.seatsAvailable <= 0;
  const isMyRide = ride.driverId === currentUserId;

  return (
    <div className="ride-card">
      {/* Top Driver Bar */}
      <div className="ride-card-top">
        <div className="driver-info-badge">
          <div className="driver-avatar-circle">
            {ride.driverAvatar || ride.driverName.substring(0, 2).toUpperCase()}
            <span className="driver-online-dot" />
          </div>
          <div>
            <div className="driver-name">
              <span>{ride.driverName}</span>
              <CheckCircle2 size={15} className="verified-icon" title="Verified College Student" />
            </div>
            <div className="driver-meta">
              <span>{ride.driverDept || "Campus Driver"}</span>
              <span>•</span>
              <span className="rating-badge">
                <Star size={13} fill="#f59e0b" color="#f59e0b" />
                {ride.driverRating}
              </span>
            </div>
          </div>
        </div>

        {/* Price Tag in Indian Rupees */}
        <div className="ride-price-tag">
          <div className="ride-price-val">₹{Math.round(ride.price)}</div>
          <div className="ride-price-unit">per seat</div>
        </div>
      </div>

      {/* Route Timeline */}
      <div className="route-timeline">
        {/* Origin */}
        <div className="route-stop">
          <div className="route-node start" />
          <div className="route-place-name">{ride.source}</div>
          <div className="route-subtext" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <Clock size={12} />
            <span>Departs: {ride.departureTime}</span>
          </div>
        </div>

        {/* Destination */}
        <div className="route-stop" style={{ marginTop: '12px' }}>
          <div className="route-node end" />
          <div className="route-place-name">{ride.destination}</div>
          <div className="route-subtext">{ride.carModel || "Standard Campus Commute"}</div>
        </div>
      </div>

      {/* Amenities & Feature Pills */}
      <div className="ride-features-bar">
        {ride.amenities?.map((amenity, idx) => (
          <span key={idx} className="feature-pill">
            <Check size={11} color="var(--accent-secondary)" />
            <span>{amenity}</span>
          </span>
        ))}
        {ride.femaleOnly && (
          <span className="feature-pill" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' }}>
            👭 Women Only
          </span>
        )}
        <span className="feature-pill" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#34d399' }}>
          <Leaf size={11} />
          <span>-{ride.co2SavedKg || 2.5}kg CO₂</span>
        </span>
      </div>

      {/* Bottom Seats & Booking Action */}
      <div className="seats-status-row">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div className="seat-dots-wrap">
            {Array.from({ length: ride.totalSeats }).map((_, idx) => (
              <span 
                key={idx} 
                className={`seat-dot ${idx < ride.seatsAvailable ? 'available' : 'occupied'}`}
                title={idx < ride.seatsAvailable ? "Seat Available" : "Seat Occupied"}
              />
            ))}
          </div>
          <span className="seats-text">
            {isFull ? (
              <span style={{ color: 'var(--accent-rose)' }}>Full</span>
            ) : (
              <span>{ride.seatsAvailable} of {ride.totalSeats} seats open</span>
            )}
          </span>
        </div>

        {/* Action Button */}
        <div>
          {isMyRide ? (
            <span className="btn btn-secondary btn-sm" style={{ cursor: 'default', opacity: 0.8 }}>
              Your Offered Ride
            </span>
          ) : isBookedByMe ? (
            <button className="btn btn-emerald btn-sm" onClick={() => onBookClick(ride)}>
              <CheckCircle2 size={15} />
              <span>Booked (View Pass)</span>
            </button>
          ) : (
            <button 
              className={`btn ${isFull ? 'btn-secondary' : 'btn-primary'} btn-sm`}
              disabled={isFull}
              onClick={() => onBookClick(ride)}
            >
              {isFull ? 'Full' : 'Book Seat'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
