import React from 'react';
import { 
  Car, 
  Search, 
  PlusCircle, 
  BookmarkCheck, 
  Compass, 
  Leaf, 
  Moon, 
  Sun, 
  ShieldCheck, 
  User as UserIcon,
  LogOut,
  Sparkles,
  Plus
} from './Icons';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  theme, 
  toggleTheme, 
  currentUser, 
  onOpenAuth, 
  onOpenSafety,
  onLogoutUser,
  bookingsCount
}) {
  return (
    <header className="navbar-wrap">
      <div className="container">
        <nav className="navbar">
          {/* Brand Logo */}
          <div className="nav-brand" onClick={() => setActiveTab('explore')}>
            <div className="nav-logo-icon">
              <Car size={20} />
            </div>
            <span className="nav-title">UniRide</span>
          </div>

          {/* Navigation Links - Strictly Single Lined */}
          <div className="nav-links">
            <button 
              className={`nav-item-btn ${activeTab === 'explore' ? 'active' : ''}`}
              onClick={() => setActiveTab('explore')}
            >
              <Search size={15} />
              <span>Find Rides</span>
            </button>

            <button 
              className={`nav-item-btn ${activeTab === 'offer' ? 'active' : ''}`}
              onClick={() => setActiveTab('offer')}
            >
              <PlusCircle size={15} />
              <span>Offer Ride</span>
            </button>

            <button 
              className={`nav-item-btn ${activeTab === 'my-rides' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-rides')}
            >
              <BookmarkCheck size={15} />
              <span>My Trips</span>
              {bookingsCount > 0 && (
                <span className="nav-count-badge">
                  {bookingsCount}
                </span>
              )}
            </button>

            <button 
              className={`nav-item-btn ${activeTab === 'radar' ? 'active' : ''}`}
              onClick={() => setActiveTab('radar')}
            >
              <Compass size={15} />
              <span>Campus Radar</span>
            </button>

            <button 
              className={`nav-item-btn ${activeTab === 'eco' ? 'active' : ''}`}
              onClick={() => setActiveTab('eco')}
            >
              <Leaf size={15} />
              <span>Eco Split</span>
            </button>
          </div>

          {/* Right Actions & Profile */}
          <div className="nav-actions">
            {/* Safety Hub */}
            <button 
              className="btn btn-outline btn-sm"
              onClick={onOpenSafety}
              title="Campus Safety & Verification"
              style={{ padding: '6px 10px', fontSize: '12px', whiteSpace: 'nowrap' }}
            >
              <ShieldCheck size={14} color="var(--accent-secondary)" />
              <span>Safety</span>
            </button>

            {/* Dark/Light Theme */}
            <button 
              className="theme-toggle-btn" 
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{ width: '36px', height: '36px' }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* User Account / Profile & Quick Logout */}
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'nowrap' }}>
                <div 
                  className="user-pill" 
                  onClick={onOpenAuth} 
                  title="Switch Profile / Manage Accounts"
                  style={{ cursor: 'pointer' }}
                >
                  <div 
                    className="user-avatar" 
                    style={{ background: currentUser.avatarBg || 'var(--gradient-brand)', width: '28px', height: '28px', fontSize: '12px' }}
                  >
                    {currentUser.avatar}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="user-name-text">{currentUser.name.split(' ')[0]}</span>
                    <span className="user-role-badge">
                      {currentUser.role === 'driver' ? 'Driver' : 'Rider'}
                    </span>
                  </div>
                </div>

                {/* 1-Click Direct Logout Button */}
                <button
                  type="button"
                  onClick={onLogoutUser}
                  title="Log out of current profile"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(244, 63, 94, 0.1)',
                    border: '1px solid rgba(244, 63, 94, 0.25)',
                    color: 'var(--accent-rose)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)'}
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <button 
                className="btn btn-primary btn-sm" 
                onClick={onOpenAuth} 
                style={{ padding: '6px 14px', fontSize: '12px', whiteSpace: 'nowrap' }}
              >
                <UserIcon size={14} />
                <span>Sign In / Profile</span>
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
