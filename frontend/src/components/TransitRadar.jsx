import React, { useState } from 'react';
import { Compass, MapPin, Sparkles, Navigation, Car, Users, ArrowRight } from './Icons';
import { RADAR_NODES } from '../data/mockData';

export default function TransitRadar({ onSelectLocation, setActiveTab }) {
  const [activeNode, setActiveNode] = useState(RADAR_NODES[0]);

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span className="hero-pill">
          <Compass size={15} /> Real-Time Campus Commute Visualizer
        </span>
        <h2 style={{ fontSize: '32px', fontWeight: '800' }}>Live Campus Transit Radar</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto' }}>
          Interactive radar tracking student carpools across major campus hubs and surrounding transit routes in real-time.
        </p>
      </div>

      <div className="radar-map-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 10px #10b981',
              display: 'inline-block'
            }} />
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
              Live Telemetry Feed
            </span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Click any campus hub to view active rides
          </span>
        </div>

        {/* Interactive Radar Canvas */}
        <div className="radar-map-canvas">
          {/* Animated concentric pulse sweeps */}
          <div className="radar-sweep-line" style={{ animationDelay: '0s' }} />
          <div className="radar-sweep-line" style={{ animationDelay: '1.5s' }} />

          {/* Grid lines */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />

          {/* Connection Lines (SVG) */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <line x1="25%" y1="35%" x2="45%" y2="22%" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="25%" y1="35%" x2="20%" y2="70%" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="45%" y1="22%" x2="75%" y2="30%" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="75%" y1="30%" x2="80%" y2="75%" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="75%" y1="30%" x2="90%" y2="15%" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="20%" y1="70%" x2="50%" y2="85%" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="50%" y1="85%" x2="80%" y2="75%" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
          </svg>

          {/* Nodes */}
          {RADAR_NODES.map((node) => {
            const isSelected = activeNode.id === node.id;
            return (
              <div
                key={node.id}
                className="map-node-pin"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                onClick={() => setActiveNode(node)}
              >
                <div 
                  className="map-pin-circle" 
                  style={{
                    borderColor: isSelected ? 'var(--accent-secondary)' : 'var(--accent-primary)',
                    boxShadow: isSelected ? '0 0 20px #10b981' : '0 0 10px rgba(99, 102, 241, 0.5)'
                  }}
                >
                  {node.icon}
                </div>
                <div className="map-pin-label">
                  {node.name} ({node.activeRides})
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Hub Quick Detail Box */}
        {activeNode && (
          <div style={{
            marginTop: '20px',
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ fontSize: '28px' }}>{activeNode.icon}</div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '16px', color: 'var(--text-primary)' }}>
                  {activeNode.name}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                  {activeNode.activeRides} active carpools departing / arriving at this hub today.
                </div>
              </div>
            </div>

            <button 
              className="btn btn-primary btn-sm"
              onClick={() => {
                onSelectLocation(activeNode.name);
                setActiveTab('explore');
              }}
            >
              <span>View Rides for this Hub</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
