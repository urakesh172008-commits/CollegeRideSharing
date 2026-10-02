import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Car, 
  LogOut, 
  Plus, 
  Trash2,
  PhoneCall,
  ArrowRight
} from './Icons';

export default function AuthModal({ 
  currentUser, 
  savedProfiles, 
  onSelectProfile, 
  onAddNewProfile, 
  onDeleteProfile, 
  onLogoutUser, 
  onClose 
}) {
  // If no saved profiles exist, default to 'create', otherwise 'profiles'
  const [activeTab, setActiveTab] = useState(
    savedProfiles && savedProfiles.length > 0 ? 'profiles' : 'create'
  );
  
  // Custom Profile Creation Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('rider');
  const [carModel, setCarModel] = useState('');
  const [formError, setFormError] = useState('');

  const handleCreateProfile = (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid college email address.');
      return;
    }

    const initials = name.trim().split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    
    const newProfile = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || '+91 98765 43210',
      department: department.trim() || 'College Member',
      role: role,
      carModel: role === 'driver' ? (carModel.trim() || 'Personal Vehicle') : undefined,
      rating: 5.0,
      verified: true,
      avatar: initials || 'ST',
      avatarBg: role === 'driver' 
        ? 'linear-gradient(135deg, #6366f1, #3b82f6)' 
        : 'linear-gradient(135deg, #10b981, #059669)',
      createdAt: new Date().toISOString()
    };

    onAddNewProfile(newProfile);
    setName('');
    setEmail('');
    setPhone('');
    setDepartment('');
    setCarModel('');
    onClose();
  };

  const handleLogoutClick = () => {
    onLogoutUser();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div className="hero-pill" style={{ marginBottom: '8px' }}>
            <Sparkles size={14} /> Profile & Multi-Account Manager
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800' }}>
            {activeTab === 'create' ? 'Add User Profile' : 'Manage User Profiles'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            {activeTab === 'create'
              ? 'Enter your real details to create your student or driver profile.'
              : 'Switch between your custom profiles, add more accounts, or log out.'}
          </p>
        </div>

        {/* Tab Toggle (Only shown when at least 1 profile exists) */}
        {savedProfiles && savedProfiles.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            background: 'var(--bg-input)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px'
          }}>
            <button
              type="button"
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: activeTab === 'profiles' ? 'var(--bg-card)' : 'transparent',
                color: activeTab === 'profiles' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === 'profiles' ? '700' : '600',
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: activeTab === 'profiles' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s'
              }}
              onClick={() => setActiveTab('profiles')}
            >
              👥 Saved Profiles ({savedProfiles.length})
            </button>
            <button
              type="button"
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: activeTab === 'create' ? 'var(--bg-card)' : 'transparent',
                color: activeTab === 'create' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === 'create' ? '700' : '600',
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: activeTab === 'create' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s'
              }}
              onClick={() => setActiveTab('create')}
            >
              ➕ Add Another Profile
            </button>
          </div>
        )}

        {/* ================= TAB 1: SAVED PROFILES & ACCOUNT SWITCHER ================= */}
        {activeTab === 'profiles' && savedProfiles && savedProfiles.length > 0 && (
          <div>
            {/* Active Profile Banner */}
            {currentUser ? (
              <div style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-secondary)', letterSpacing: '0.5px' }}>
                    ● Active Profile
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: currentUser.role === 'driver' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(16, 185, 129, 0.25)',
                    color: currentUser.role === 'driver' ? '#818cf8' : '#34d399'
                  }}>
                    {currentUser.role === 'driver' ? '🚗 Driver' : '🎒 Rider'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: currentUser.avatarBg || 'var(--gradient-brand)',
                    color: 'white',
                    fontWeight: '800',
                    fontSize: '17px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {currentUser.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{currentUser.name}</span>
                      <CheckCircle2 size={15} color="#38bdf8" />
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {currentUser.email} &bull; {currentUser.phone}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {currentUser.department} {currentUser.carModel ? `• ${currentUser.carModel}` : ''}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                padding: '14px 18px',
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--accent-rose)',
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>⚠️ Currently logged out. Select a profile below or add a new one.</span>
              </div>
            )}

            {/* List of All Profiles */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                  Switch Profile or Add More
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  style={{ padding: '3px 8px', fontSize: '11px' }}
                  onClick={() => setActiveTab('create')}
                >
                  <Plus size={12} /> Add Another
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                {savedProfiles.map((profile) => {
                  const isActive = currentUser?.id === profile.id;
                  return (
                    <div
                      key={profile.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: isActive ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-input)',
                        border: isActive ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          background: profile.avatarBg || 'var(--gradient-brand)',
                          color: 'white',
                          fontWeight: '700',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {profile.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-primary)' }}>
                            {profile.name} {isActive && <span style={{ color: 'var(--accent-secondary)', fontSize: '11px' }}>● (Active)</span>}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {profile.email} &bull; {profile.department} &bull; {profile.role === 'driver' ? '🚗 Driver' : '🎒 Rider'}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {!isActive ? (
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            style={{ padding: '4px 10px', fontSize: '11px' }}
                            onClick={() => {
                              onSelectProfile(profile);
                              onClose();
                            }}
                          >
                            Switch
                          </button>
                        ) : (
                          <span style={{ fontSize: '11px', color: 'var(--accent-secondary)', fontWeight: '700', paddingRight: '4px' }}>
                            ✓ Current
                          </span>
                        )}

                        <button
                          type="button"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--accent-rose)',
                            cursor: 'pointer',
                            padding: '6px',
                            opacity: 0.75,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Delete profile"
                          onClick={() => onDeleteProfile(profile.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: currentUser ? '1fr 1fr' : '1fr', gap: '10px', marginTop: '20px' }}>
              {currentUser && (
                <button
                  type="button"
                  className="btn btn-outline btn-block"
                  style={{
                    color: 'var(--accent-rose)',
                    borderColor: 'rgba(244, 63, 94, 0.4)',
                    background: 'rgba(244, 63, 94, 0.05)',
                    fontWeight: '700'
                  }}
                  onClick={handleLogoutClick}
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              )}
              <button 
                type="button" 
                className="btn btn-secondary btn-block" 
                onClick={onClose}
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 2: CREATE / REGISTER CUSTOM PROFILE ================= */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreateProfile}>
            {formError && (
              <div style={{
                padding: '10px 14px',
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--accent-rose)',
                fontSize: '13px',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>⚠️ {formError}</span>
              </div>
            )}

            <div className="input-field-wrap" style={{ marginBottom: '12px' }}>
              <label className="input-label">Full Name</label>
              <input
                type="text"
                className="input-control"
                placeholder="e.g. Rakesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-field-wrap" style={{ marginBottom: '12px' }}>
              <label className="input-label">College Email Address</label>
              <input
                type="email"
                className="input-control"
                placeholder="e.g. rakesh@college.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid-2" style={{ gap: '12px', marginBottom: '12px' }}>
              <div className="input-field-wrap">
                <label className="input-label">Phone / WhatsApp</label>
                <input
                  type="tel"
                  className="input-control"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="input-field-wrap">
                <label className="input-label">Branch / Department</label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. CS Engg '26"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
            </div>

            <div className="input-field-wrap" style={{ marginBottom: '14px' }}>
              <label className="input-label">Primary Role</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  style={{
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: role === 'rider' ? '2px solid var(--accent-secondary)' : '1px solid var(--border-subtle)',
                    background: role === 'rider' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-input)',
                    color: role === 'rider' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                  onClick={() => setRole('rider')}
                >
                  🎒 Student Rider
                </button>
                <button
                  type="button"
                  style={{
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: role === 'driver' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    background: role === 'driver' ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-input)',
                    color: role === 'driver' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                  onClick={() => setRole('driver')}
                >
                  🚗 Student Driver
                </button>
              </div>
            </div>

            {role === 'driver' && (
              <div className="input-field-wrap" style={{ marginBottom: '16px' }}>
                <label className="input-label">Vehicle Model & Details</label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. Tata Nexon EV, Swift, Activa"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              {savedProfiles && savedProfiles.length > 0 && (
                <button
                  type="button"
                  className="btn btn-secondary btn-block"
                  onClick={() => setActiveTab('profiles')}
                >
                  Back to Profiles
                </button>
              )}
              <button type="submit" className="btn btn-primary btn-block btn-lg">
                Save & Set Active Profile
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
