import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import RideCard from './components/RideCard';
import BookRideModal from './components/BookRideModal';
import PostRideView from './components/PostRideView';
import MyRidesView from './components/MyRidesView';
import TransitRadar from './components/TransitRadar';
import EcoCalculator from './components/EcoCalculator';
import AuthModal from './components/AuthModal';
import SafetyCenterModal from './components/SafetyCenterModal';

import { INITIAL_RIDES } from './data/mockData';
import { 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  CheckCircle2, 
  Car, 
  ShieldCheck, 
  Compass, 
  Leaf,
  Plus,
  User as UserIcon
} from './components/Icons';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('uniride_theme') || 'dark';
  });

  // Saved user profiles list
  const [savedProfiles, setSavedProfiles] = useState(() => {
    const saved = localStorage.getItem('uniride_profiles');
    return saved ? JSON.parse(saved) : [];
  });

  // Current active logged in user profile
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('uniride_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Rides state
  const [rides, setRides] = useState(() => {
    const saved = localStorage.getItem('uniride_rides');
    return saved ? JSON.parse(saved) : INITIAL_RIDES;
  });

  // Bookings state
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('uniride_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'offer' | 'my-rides' | 'radar' | 'eco'

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [minSeats, setMinSeats] = useState(1);
  const [activeFilterChip, setActiveFilterChip] = useState('');
  const [sortOption, setSortOption] = useState('time'); // 'time' | 'price' | 'seats' | 'rating'
  const [showFemaleOnly, setShowFemaleOnly] = useState(false);

  // Modals state
  const [selectedRideForBooking, setSelectedRideForBooking] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Apply theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('uniride_theme', theme);
  }, [theme]);

  // Persist rides
  useEffect(() => {
    localStorage.setItem('uniride_rides', JSON.stringify(rides));
  }, [rides]);

  // Persist bookings
  useEffect(() => {
    localStorage.setItem('uniride_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Persist profiles list
  useEffect(() => {
    localStorage.setItem('uniride_profiles', JSON.stringify(savedProfiles));
  }, [savedProfiles]);

  // Persist active user
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('uniride_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('uniride_current_user');
    }
  }, [currentUser]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Profile Management Handlers
  const handleSelectProfile = (profile) => {
    setCurrentUser(profile);
    showToast(`Switched active profile to ${profile.name}!`, 'info');
  };

  const handleAddNewProfile = (newProfile) => {
    setSavedProfiles(prev => {
      const filtered = prev.filter(p => p.email.toLowerCase() !== newProfile.email.toLowerCase());
      return [...filtered, newProfile];
    });
    setCurrentUser(newProfile);
    showToast(`Profile for ${newProfile.name} created and active!`, 'success');
  };

  const handleDeleteProfile = (profileId) => {
    setSavedProfiles(prev => prev.filter(p => p.id !== profileId));
    if (currentUser?.id === profileId) {
      const remaining = savedProfiles.filter(p => p.id !== profileId);
      setCurrentUser(remaining.length > 0 ? remaining[0] : null);
    }
    showToast('Profile removed.', 'info');
  };

  const handleLogoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('uniride_current_user');
    showToast('Logged out successfully.', 'info');
  };

  // Filter rides based on search criteria
  const filteredRides = rides.filter(ride => {
    if (searchQuery && !ride.source.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (destinationQuery && !ride.destination.toLowerCase().includes(destinationQuery.toLowerCase())) {
      return false;
    }
    if (minSeats > 1 && ride.seatsAvailable < minSeats) {
      return false;
    }
    if (showFemaleOnly && !ride.femaleOnly) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortOption === 'price') return a.price - b.price;
    if (sortOption === 'seats') return b.seatsAvailable - a.seatsAvailable;
    if (sortOption === 'rating') return b.driverRating - a.driverRating;
    return 0; // default time order
  });

  // Handle booking click (requires active profile)
  const handleBookClick = (ride) => {
    if (!currentUser) {
      showToast('Please create or select your user profile first to book.', 'info');
      setShowAuthModal(true);
      return;
    }
    setSelectedRideForBooking(ride);
  };

  // Handle booking confirm
  const handleConfirmBooking = (rideId, seatCount, pickupNote, bookingRef) => {
    const targetRide = rides.find(r => r.id === rideId);
    if (!targetRide) return;

    // Update ride available seats
    setRides(prev => prev.map(r => {
      if (r.id === rideId) {
        return {
          ...r,
          seatsAvailable: Math.max(0, r.seatsAvailable - seatCount),
          passengers: [...(r.passengers || []), currentUser.id]
        };
      }
      return r;
    }));

    // Add to bookings
    const newBooking = {
      id: `book-${Date.now()}`,
      rideId,
      userId: currentUser.id,
      source: targetRide.source,
      destination: targetRide.destination,
      departureTime: targetRide.departureTime,
      driverName: targetRide.driverName,
      seatCount,
      totalPrice: Math.round(targetRide.price * seatCount),
      pickupNote,
      bookingRef
    };

    setBookings(prev => [newBooking, ...prev]);
    showToast(`Seat booked with ${targetRide.driverName}! Pass #${bookingRef}`, 'success');
  };

  // Handle booking cancellation
  const handleCancelBooking = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    // Restore seats
    setRides(prev => prev.map(r => {
      if (r.id === booking.rideId) {
        return {
          ...r,
          seatsAvailable: Math.min(r.totalSeats, r.seatsAvailable + (booking.seatCount || 1)),
          passengers: (r.passengers || []).filter(p => p !== (currentUser?.id || ''))
        };
      }
      return r;
    }));

    setBookings(prev => prev.filter(b => b.id !== bookingId));
    showToast('Booking cancelled and seat released.', 'info');
  };

  // Handle ride post
  const handlePostRideSuccess = (newRide) => {
    setRides(prev => [newRide, ...prev]);
    showToast(`Your ride to ${newRide.destination} is now live!`, 'success');
  };

  // Handle complete ride
  const handleCompleteRide = (rideId) => {
    setRides(prev => prev.filter(r => r.id !== rideId));
    showToast('Ride completed! Thank you for carpooling.', 'success');
  };

  // User's own bookings and posted rides
  const myBookings = currentUser ? bookings.filter(b => b.userId === currentUser.id) : [];
  const myPostedRides = currentUser ? rides.filter(r => r.driverId === currentUser.id) : [];

  return (
    <div className="app-container">
      {/* Background ambient orbs */}
      <div className="bg-ambient-orb bg-ambient-orb-1" />
      <div className="bg-ambient-orb bg-ambient-orb-2" />

      {/* Navigation Bar - Single Lined */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenSafety={() => setShowSafetyModal(true)}
        onLogoutUser={handleLogoutUser}
        bookingsCount={myBookings.length}
      />

      {/* Main Tab Content */}
      <main style={{ flex: 1 }}>
        {activeTab === 'explore' && (
          <div>
            {/* Hero & Search Form */}
            <HeroSection 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              destinationQuery={destinationQuery}
              setDestinationQuery={setDestinationQuery}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              minSeats={minSeats}
              setMinSeats={setMinSeats}
              onPerformSearch={() => {}}
              totalRidesCount={filteredRides.length}
              activeFilterChip={activeFilterChip}
              setActiveFilterChip={setActiveFilterChip}
            />

            {/* Ride Marketplace Listing */}
            <div className="container">
              <div className="view-tabs-header">
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: '800' }}>
                    Available Campus Carpools ({filteredRides.length})
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                    Verified student and faculty drivers heading your way.
                  </p>
                </div>

                {/* Filters & Sorting Bar */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'nowrap' }}>
                  {/* Women Only Quick Toggle */}
                  <button
                    type="button"
                    className={`btn btn-sm ${showFemaleOnly ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setShowFemaleOnly(!showFemaleOnly)}
                    style={{ fontSize: '12px', whiteSpace: 'nowrap' }}
                  >
                    👭 Women Only
                  </button>

                  {/* Sort Dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <SlidersHorizontal size={14} color="var(--text-muted)" />
                    <select 
                      className="input-control"
                      style={{ padding: '6px 12px', fontSize: '13px', width: 'auto' }}
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                    >
                      <option value="time">Sort: Departure Time</option>
                      <option value="price">Sort: Lowest Fare (₹)</option>
                      <option value="seats">Sort: Most Seats Open</option>
                      <option value="rating">Sort: Top Rated Driver</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Rides Grid */}
              {filteredRides.length > 0 ? (
                <div className="rides-grid">
                  {filteredRides.map(ride => {
                    const isBooked = myBookings.some(b => b.rideId === ride.id);
                    return (
                      <RideCard 
                        key={ride.id}
                        ride={ride}
                        onBookClick={handleBookClick}
                        currentUserId={currentUser?.id}
                        isBookedByMe={isBooked}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state" style={{ marginBottom: '48px' }}>
                  <div className="empty-state-icon">🚗</div>
                  <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>No Matching Rides Found</h3>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 20px' }}>
                    No carpool currently matches your search filters. Try clearing your filters or offer a ride!
                  </p>
                  <button 
                    className="btn btn-outline" 
                    onClick={() => {
                      setSearchQuery('');
                      setDestinationQuery('');
                      setActiveFilterChip('');
                      setShowFemaleOnly(false);
                    }}
                  >
                    Reset Search Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'offer' && (
          currentUser ? (
            <PostRideView 
              currentUser={currentUser}
              onPostRideSuccess={handlePostRideSuccess}
              setActiveTab={setActiveTab}
            />
          ) : (
            <div className="container" style={{ padding: '64px 24px', textAlign: 'center' }}>
              <div className="empty-state" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <div className="empty-state-icon">🚗</div>
                <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>Create Your Profile to Offer Rides</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '14px' }}>
                  Please create or select your student driver profile to publish your route and vehicle details.
                </p>
                <button className="btn btn-primary" onClick={() => setShowAuthModal(true)}>
                  Create or Select Profile
                </button>
              </div>
            </div>
          )
        )}

        {activeTab === 'my-rides' && (
          currentUser ? (
            <MyRidesView 
              currentUser={currentUser}
              bookedRides={myBookings}
              postedRides={myPostedRides}
              onCancelBooking={handleCancelBooking}
              onViewBoardingPass={(booking) => {
                const r = rides.find(ride => ride.id === booking.rideId) || {
                  id: booking.rideId,
                  source: booking.source,
                  destination: booking.destination,
                  departureTime: booking.departureTime,
                  driverName: booking.driverName,
                  price: booking.totalPrice,
                  carModel: 'Verified Vehicle'
                };
                setSelectedRideForBooking(r);
              }}
              onCompleteRide={handleCompleteRide}
              setActiveTab={setActiveTab}
            />
          ) : (
            <div className="container" style={{ padding: '64px 24px', textAlign: 'center' }}>
              <div className="empty-state" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <div className="empty-state-icon">🎒</div>
                <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>Sign In to View Trips</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '14px' }}>
                  Create or select your user profile to track your booked rides and digital boarding passes.
                </p>
                <button className="btn btn-primary" onClick={() => setShowAuthModal(true)}>
                  Sign In / Add Profile
                </button>
              </div>
            </div>
          )
        )}

        {activeTab === 'radar' && (
          <TransitRadar 
            onSelectLocation={(locName) => {
              setDestinationQuery(locName);
              setActiveFilterChip(locName);
            }}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'eco' && (
          <EcoCalculator />
        )}
      </main>

      {/* Booking Modal */}
      {selectedRideForBooking && (
        <BookRideModal 
          ride={selectedRideForBooking}
          currentUser={currentUser}
          onClose={() => setSelectedRideForBooking(null)}
          onConfirmBooking={handleConfirmBooking}
          alreadyBooked={myBookings.some(b => b.rideId === selectedRideForBooking.id)}
        />
      )}

      {/* Multi-Profile & Account Manager Modal */}
      {showAuthModal && (
        <AuthModal 
          currentUser={currentUser}
          savedProfiles={savedProfiles}
          onSelectProfile={handleSelectProfile}
          onAddNewProfile={handleAddNewProfile}
          onDeleteProfile={handleDeleteProfile}
          onLogoutUser={handleLogoutUser}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Safety & Trust Modal */}
      {showSafetyModal && (
        <SafetyCenterModal onClose={() => setShowSafetyModal(false)} />
      )}

      {/* Dynamic Toast Notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <CheckCircle2 size={18} color="var(--accent-secondary)" />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <Car size={16} />
                </div>
                <span style={{ fontWeight: '800', fontSize: '18px', color: 'var(--text-primary)' }}>UniRide India</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6' }}>
                Verified student carpooling network. Save petrol money, reduce campus traffic, and ride safely.
              </p>
            </div>

            <div>
              <div className="footer-col-title">Campus Hubs</div>
              <ul className="footer-links-list">
                <li><a href="#" onClick={(e) => { e.preventDefault(); setDestinationQuery('Campus Main Gate'); setActiveTab('explore'); }}>Campus Main Gate</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setDestinationQuery('Central Metro'); setActiveTab('explore'); }}>Central Metro</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setDestinationQuery('Cyber City'); setActiveTab('explore'); }}>Cyber Tech Park</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setDestinationQuery('Airport'); setActiveTab('explore'); }}>Domestic Airport</a></li>
              </ul>
            </div>

            <div>
              <div className="footer-col-title">Community</div>
              <ul className="footer-links-list">
                <li><a href="#" onClick={(e) => { e.preventDefault(); setShowSafetyModal(true); }}>Safety Guidelines</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('eco'); }}>Petrol Savings</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('radar'); }}>Campus Radar</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setShowAuthModal(true); }}>Student Verification</a></li>
              </ul>
            </div>

            <div>
              <div className="footer-col-title">Quick Actions</div>
              <button 
                className="btn btn-primary btn-sm btn-block" 
                style={{ marginBottom: '8px' }}
                onClick={() => {
                  if (!currentUser) {
                    setShowAuthModal(true);
                  } else {
                    setActiveTab('offer');
                  }
                }}
              >
                <Plus size={14} /> Offer a Ride
              </button>
              <button 
                className="btn btn-secondary btn-sm btn-block"
                onClick={() => setShowSafetyModal(true)}
              >
                <ShieldCheck size={14} /> Campus Safety
              </button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>© 2026 UniRide India • College Carpool Network. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span style={{ color: 'var(--accent-secondary)' }}>● Verified Student Network</span>
              <span>Zero Commission</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
