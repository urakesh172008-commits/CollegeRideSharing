import React, { useState } from 'react';
import { Leaf, DollarSign, TreePine, Sparkles, Car } from './Icons';

export default function EcoCalculator() {
  const [kmPerDay, setKmPerDay] = useState(25);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [carpoolers, setCarpoolers] = useState(3);
  const [fuelPrice, setFuelPrice] = useState(102); // ₹102 / Litre (Indian Petrol Average)

  // Calculations:
  // Assuming average car mileage of 15 km/Litre
  const weeklyKm = kmPerDay * daysPerWeek;
  const annualKm = weeklyKm * 36; // 36 college weeks
  const totalLitres = annualKm / 15;
  const singleDriverCost = totalLitres * fuelPrice;
  const splitCost = singleDriverCost / carpoolers;
  const annualSavings = singleDriverCost - splitCost;

  // CO2: ~2.3 kg CO2 per Litre of petrol burned
  const totalCo2SavedKg = Math.round(totalLitres * 2.3 * ((carpoolers - 1) / carpoolers));
  const treesEquivalent = Math.max(1, Math.round(totalCo2SavedKg / 20)); // 1 tree ~20kg CO2/year

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span className="hero-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10b981' }}>
          <Leaf size={15} /> Student Savings & Carbon Footprint
        </span>
        <h2 style={{ fontSize: '32px', fontWeight: '800' }}>Carpool Petrol Split & Eco Calculator</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto' }}>
          See how sharing empty car seats cuts your semester commute expenses while reducing campus traffic congestion.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '32px',
        maxWidth: '1040px',
        margin: '0 auto',
        alignItems: 'center'
      }}>
        {/* Sliders Input Panel */}
        <div className="form-card">
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Car size={18} color="var(--accent-primary)" />
            <span>Customize Your Daily Route</span>
          </h3>

          {/* Daily Km Slider */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                Round-trip Daily Distance
              </span>
              <strong style={{ color: 'var(--accent-primary)', fontSize: '14px' }}>
                {kmPerDay} km / day
              </strong>
            </div>
            <input 
              type="range"
              min="5"
              max="80"
              value={kmPerDay}
              onChange={(e) => setKmPerDay(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }}
            />
          </div>

          {/* Days Per Week Slider */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                Campus Days per Week
              </span>
              <strong style={{ color: 'var(--accent-primary)', fontSize: '14px' }}>
                {daysPerWeek} days / week
              </strong>
            </div>
            <input 
              type="range"
              min="1"
              max="6"
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }}
            />
          </div>

          {/* Carpoolers */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                Students Sharing Ride
              </span>
              <strong style={{ color: 'var(--accent-secondary)', fontSize: '14px' }}>
                {carpoolers} students total
              </strong>
            </div>
            <input 
              type="range"
              min="2"
              max="5"
              value={carpoolers}
              onChange={(e) => setCarpoolers(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
            />
          </div>

          {/* Petrol Price */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                Petrol Price (₹ / Litre)
              </span>
              <strong style={{ color: 'var(--accent-amber)', fontSize: '14px' }}>
                ₹{fuelPrice} / Litre
              </strong>
            </div>
            <input 
              type="range"
              min="90"
              max="115"
              step="1"
              value={fuelPrice}
              onChange={(e) => setFuelPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Results Showcase Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Money Saved */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.08) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--accent-secondary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800'
              }}>
                ₹
              </div>
              <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                Estimated Annual Savings
              </span>
            </div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: '#10b981', fontFamily: 'var(--font-heading)' }}>
              ₹{Math.round(annualSavings).toLocaleString('en-IN')} <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-muted)' }}>/ academic year</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
              Per student, compared to taking individual autos/cabs or solo driving.
            </p>
          </div>

          {/* Carbon Cut */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(59, 130, 246, 0.08) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--accent-primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Leaf size={20} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                CO₂ Emissions Prevented
              </span>
            </div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: '#818cf8', fontFamily: 'var(--font-heading)' }}>
              {totalCo2SavedKg} kg CO₂
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
              <TreePine size={15} color="#10b981" />
              <span>Equivalent to planting <strong>{treesEquivalent} campus trees</strong> every year.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
