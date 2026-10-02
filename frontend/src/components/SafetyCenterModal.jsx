import React, { useState } from 'react';
import { X, ShieldCheck, AlertTriangle, PhoneCall, CheckCircle2, Lock, Users } from './Icons';

export default function SafetyCenterModal({ onClose }) {
  const [sosActivated, setSosActivated] = useState(false);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div className="hero-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10b981' }}>
            <ShieldCheck size={14} /> Zero-Tolerance Safety Protocol
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Campus Trust & Safety Hub</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Built strictly for verified university peers, students, faculty, and campus staff.
          </p>
        </div>

        {/* Safety Highlights Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          <div style={{
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            gap: '12px'
          }}>
            <div style={{ color: '#38bdf8' }}><CheckCircle2 size={20} /></div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '14px' }}>100% .edu Email Verification</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Every rider and driver is authenticated with active university single sign-on credentials.
              </div>
            </div>
          </div>

          <div style={{
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            gap: '12px'
          }}>
            <div style={{ color: 'var(--accent-secondary)' }}><Lock size={20} /></div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '14px' }}>Two-Way Rating & Accountability</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Riders and drivers rate each trip. Drivers with ratings below 4.5 are automatically reviewed.
              </div>
            </div>
          </div>

          <div style={{
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            gap: '12px'
          }}>
            <div style={{ color: '#ec4899' }}><Users size={20} /></div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '14px' }}>Women-Only Carpool Options</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Female students can filter and book rides restricted exclusively to female drivers and peers.
              </div>
            </div>
          </div>
        </div>

        {/* Emergency SOS Simulator */}
        <div style={{
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '18px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--accent-rose)', fontWeight: '800', marginBottom: '6px' }}>
            <AlertTriangle size={18} />
            <span>Emergency Rapid Response Simulator</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            In an emergency, this broadcasts your live GPS coordinates to Campus Safety & Emergency Dispatch.
          </p>

          {!sosActivated ? (
            <button 
              className="btn btn-sm"
              style={{ background: 'var(--accent-rose)', color: 'white' }}
              onClick={() => setSosActivated(true)}
            >
              <PhoneCall size={15} />
              <span>Test Campus Safety Alert</span>
            </button>
          ) : (
            <div style={{
              background: 'rgba(244, 63, 94, 0.2)',
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              color: '#fecdd3',
              fontWeight: '700'
            }}>
              🚨 Alert Test Broadcast Sent: Campus Police Dispatch (555-0199) Notified.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
