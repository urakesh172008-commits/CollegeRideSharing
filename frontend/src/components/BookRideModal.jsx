import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  MapPin, 
  Navigation, 
  Clock, 
  ShieldCheck, 
  QrCode, 
  AlertCircle, 
  Sparkles,
  Car,
  DollarSign
} from './Icons';

export default function BookRideModal({ ride, currentUser, onClose, onConfirmBooking, alreadyBooked }) {
  const [seatCount, setSeatCount] = useState(1);
  const [pickupNote, setPickupNote] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(alreadyBooked);
  const [bookingRef, setBookingRef] = useState(`UNI-${Math.floor(100000 + Math.random() * 900000)}`);

  const maxAvailable = ride ? ride.seatsAvailable : 1;
  const totalPrice = ride ? Math.round(ride.price * seatCount) : 0;

  const handleConfirm = () => {
    onConfirmBooking(ride.id, seatCount, pickupNote, bookingRef);
    setBookingConfirmed(true);
  };

  if (!ride) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {!bookingConfirmed ? (
          <div>
            {/* Modal Header */}
            <div style={{ marginBottom: '20px' }}>
              <span className="hero-pill" style={{ marginBottom: '8px' }}>
                <Sparkles size={14} /> Instant College Carpool Booking
              </span>
              <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Confirm Your Campus Seat</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                Riding with <strong style={{ color: 'var(--text-primary)' }}>{ride.driverName}</strong> ({ride.driverDept})
              </p>
            </div>

            {/* Trip Overview Box */}
            <div style={{
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <MapPin size={16} color="var(--accent-primary)" />
                <span style={{ fontSize: '14px', fontWeight: '700' }}>{ride.source}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Navigation size={16} color="var(--accent-secondary)" />
                <span style={{ fontSize: '14px', fontWeight: '700' }}>{ride.destination}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '12px' }}>
                <Clock size={14} />
                <span>Departure: <strong style={{ color: 'var(--text-primary)' }}>{ride.departureTime}</strong></span>
                <span>•</span>
                <Car size={14} />
                <span>{ride.carModel}</span>
              </div>
            </div>

            {/* Seat Selector */}
            <div className="input-field-wrap" style={{ marginBottom: '16px' }}>
              <label className="input-label">Select Number of Seats</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {Array.from({ length: maxAvailable }).map((_, idx) => {
                  const val = idx + 1;
                  const isSelected = seatCount === val;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSeatCount(val)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-card)',
                        color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {val} {val === 1 ? 'Seat' : 'Seats'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pickup Note / Landmark */}
            <div className="input-field-wrap" style={{ marginBottom: '20px' }}>
              <label className="input-label">Pickup Landmark / Notes for Driver (Optional)</label>
              <input 
                type="text"
                className="input-control"
                placeholder="e.g. Near Gate 1 ATM counter / Hostels entrance"
                value={pickupNote}
                onChange={(e) => setPickupNote(e.target.value)}
              />
            </div>

            {/* Split Price Summary in INR */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              marginBottom: '20px'
            }}>
              <div>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block' }}>Fair Fuel Split</span>
                <span style={{ fontSize: '12px', color: 'var(--accent-secondary)', fontWeight: '600' }}>
                  ₹{Math.round(ride.price)} × {seatCount} {seatCount === 1 ? 'seat' : 'seats'}
                </span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-secondary)' }}>
                ₹{totalPrice}
              </div>
            </div>

            {/* College Trust Guarantee */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '24px', color: 'var(--text-muted)', fontSize: '12px' }}>
              <ShieldCheck size={20} color="var(--accent-primary)" />
              <span>Verified college peer carpool. UPI / Cash split directly with driver at journey end.</span>
            </div>

            {/* Confirm Button */}
            <button className="btn btn-emerald btn-block btn-lg" onClick={handleConfirm}>
              <CheckCircle2 size={18} />
              <span>Confirm & Get Boarding Pass</span>
            </button>
          </div>
        ) : (
          /* ================= Digital Boarding Pass ================= */
          <div>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--accent-secondary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px'
              }}>
                <CheckCircle2 size={32} />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: '800' }}>Ride Confirmed!</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                Your digital boarding pass has been generated. Show it when boarding.
              </p>
            </div>

            {/* Digital Pass Card */}
            <div className="boarding-pass-card">
              <div className="boarding-pass-header">
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 }}>Campus Boarding Pass</span>
                  <div style={{ fontWeight: '800', fontSize: '16px' }}>{bookingRef}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', opacity: 0.8 }}>Total Fare</span>
                  <div style={{ fontWeight: '800', fontSize: '16px', color: '#34d399' }}>₹{totalPrice}</div>
                </div>
              </div>

              <div className="boarding-pass-body">
                <div>
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', opacity: 0.7 }}>Pickup</span>
                    <div style={{ fontWeight: '700', fontSize: '14px' }}>{ride.source}</div>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', opacity: 0.7 }}>Destination</span>
                    <div style={{ fontWeight: '700', fontSize: '14px' }}>{ride.destination}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', opacity: 0.7 }}>Driver</span>
                    <div style={{ fontWeight: '700', fontSize: '13px' }}>{ride.driverName} • {ride.carModel}</div>
                  </div>
                </div>

                {/* Simulated QR Code */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    background: 'white',
                    padding: '8px',
                    borderRadius: '8px',
                    display: 'inline-block'
                  }}>
                    <QrCode size={76} color="#0f172a" />
                  </div>
                  <div style={{ fontSize: '10px', opacity: 0.8, marginTop: '4px' }}>Show to Driver</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button className="btn btn-secondary btn-block" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
