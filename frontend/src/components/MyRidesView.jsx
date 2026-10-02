import React, { useState } from 'react';
import { 
  BookmarkCheck, 
  Car, 
  MapPin, 
  Navigation, 
  Clock, 
  QrCode, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle,
  Users
} from './Icons';

export default function MyRidesView({ 
  currentUser, 
  bookedRides, 
  postedRides, 
  onCancelBooking, 
  onViewBoardingPass,
  onCompleteRide,
  setActiveTab
}) {
  const [subTab, setSubTab] = useState('bookings'); // 'bookings' | 'driver-rides'

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span className="hero-pill">
          <BookmarkCheck size={15} /> Your College Commute Center
        </span>
        <h2 style={{ fontSize: '32px', fontWeight: '800' }}>My Trips & Carpools</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '540px', margin: '0 auto' }}>
          Manage your booked seats, digital boarding passes, and rides offered to classmates.
        </p>
      </div>

      {/* Sub-Tabs Switcher */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
        <div className="filter-pills-bar">
          <button 
            className={`filter-pill-tab ${subTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setSubTab('bookings')}
          >
            <BookmarkCheck size={16} />
            <span>Booked as Passenger ({bookedRides.length})</span>
          </button>

          <button 
            className={`filter-pill-tab ${subTab === 'driver-rides' ? 'active' : ''}`}
            onClick={() => setSubTab('driver-rides')}
          >
            <Car size={16} />
            <span>Offered as Driver ({postedRides.length})</span>
          </button>
        </div>
      </div>

      {/* Booked Rides Section */}
      {subTab === 'bookings' && (
        <div>
          {bookedRides.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎒</div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>No Active Bookings</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 20px' }}>
                You haven't booked any rides yet. Search for upcoming campus carpools and reserve your seat.
              </p>
              <button className="btn btn-primary" onClick={() => setActiveTab('explore')}>
                Find Available Rides
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {bookedRides.map((booking) => (
                <div 
                  key={booking.id}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-subtle)',
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '20px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: 'var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '18px'
                    }}>
                      🚗
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: '800', fontSize: '16px' }}>
                          {booking.source} → {booking.destination}
                        </span>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#10b981'
                        }}>
                          Confirmed
                        </span>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <span>🕒 {booking.departureTime}</span>
                        <span>•</span>
                        <span>Driver: <strong style={{ color: 'var(--text-primary)' }}>{booking.driverName}</strong></span>
                        <span>•</span>
                        <span>Fare: <strong style={{ color: 'var(--accent-secondary)' }}>₹{booking.totalPrice}</strong></span>
                        <span>•</span>
                        <span>Pass: <code style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>{booking.bookingRef || 'UNI-PASS'}</code></span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => onViewBoardingPass(booking)}
                    >
                      <QrCode size={16} />
                      <span>Boarding Pass</span>
                    </button>

                    <button 
                      className="btn btn-outline btn-sm"
                      style={{ color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.3)' }}
                      onClick={() => onCancelBooking(booking.id)}
                    >
                      <Trash2 size={16} />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Driver Rides Section */}
      {subTab === 'driver-rides' && (
        <div>
          {postedRides.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🚗</div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>No Rides Offered Yet</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 20px' }}>
                Share your empty seats with peers, reduce campus parking rush, and split petrol expense.
              </p>
              <button className="btn btn-emerald" onClick={() => setActiveTab('offer')}>
                Offer a Ride
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {postedRides.map((ride) => (
                <div 
                  key={ride.id}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-subtle)',
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '20px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '800', fontSize: '16px' }}>
                        {ride.source} → {ride.destination}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(99, 102, 241, 0.15)',
                        color: 'var(--accent-primary)'
                      }}>
                        Active
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <span>🕒 {ride.departureTime}</span>
                      <span>•</span>
                      <span>Vehicle: {ride.carModel}</span>
                      <span>•</span>
                      <span>{ride.seatsAvailable} of {ride.totalSeats} seats open</span>
                      <span>•</span>
                      <span>Fare: ₹{ride.price}/seat</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button 
                      className="btn btn-emerald btn-sm"
                      onClick={() => onCompleteRide(ride.id)}
                    >
                      <CheckCircle2 size={16} />
                      <span>Complete Ride</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
