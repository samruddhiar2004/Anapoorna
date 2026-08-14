import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { Route, MapPin, ArrowDown, CheckCircle, Navigation } from 'lucide-react';

export const RouteOptimizer = () => {
  const { user } = useAuth();
  const [startLat, setStartLat] = useState(user?.latitude || 19.0760);
  const [startLng, setStartLng] = useState(user?.longitude || 72.8777);
  const [availableDonations, setAvailableDonations] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await api.get('/donations');
      const active = res.data.filter(d => d.status === 'AVAILABLE' || d.status === 'ASSIGNED');
      setAvailableDonations(active);
    } catch (err) {
      console.error('Failed to load donations for routing', err);
    }
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleOptimize = async () => {
    if (selectedIds.length === 0) {
      alert('Please select at least 1 food donation to compute an optimal route!');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/routing/optimize', {
        startLatitude: startLat,
        startLongitude: startLng,
        donationIds: selectedIds
      });
      setOptimizedRoute(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to compute route.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Route color="var(--primary)" size={32} /> Multi-Stop Route Optimizer
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Nearest-Neighbor greedy distance matrix algorithm for efficient pickup sequences</p>
      </div>

      <div className="grid-cols-2" style={{ marginBottom: '40px' }}>
        {/* Selection Column */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ color: '#fff', marginBottom: '16px' }}>1. Set Start & Select Pickups</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Depot Latitude</label>
              <input type="number" step="any" className="form-control" value={startLat} onChange={(e) => setStartLat(parseFloat(e.target.value) || 0)} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Depot Longitude</label>
              <input type="number" step="any" className="form-control" value={startLng} onChange={(e) => setStartLng(parseFloat(e.target.value) || 0)} />
            </div>
          </div>

          <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>Select Stops to Include in Route ({selectedIds.length} selected):</h4>

          <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '6px' }}>
            {availableDonations.map(d => (
              <div
                key={d.id}
                onClick={() => toggleSelect(d.id)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  background: selectedIds.includes(d.id) ? 'var(--primary-glow)' : 'rgba(0,0,0,0.2)',
                  border: selectedIds.includes(d.id) ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#fff' }}>{d.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{d.pickupAddress}</div>
                </div>
                <input type="checkbox" checked={selectedIds.includes(d.id)} readOnly style={{ accentColor: 'var(--primary)' }} />
              </div>
            ))}
          </div>

          <button onClick={handleOptimize} className="btn btn-primary" style={{ width: '100%', marginTop: '20px', padding: '12px' }} disabled={loading}>
            {loading ? 'Computing Shortest Path...' : 'Calculate Optimal Route'}
          </button>
        </div>

        {/* Results Column */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ color: '#fff', marginBottom: '16px' }}>2. Optimized Pickup Sequence</h3>

          {!optimizedRoute ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '60px' }}>Select stops and click Calculate Optimal Route to view sequence.</p>
          ) : (
            <div>
              <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '14px', borderRadius: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>{optimizedRoute.totalDistanceKm} km</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Route Distance</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{optimizedRoute.totalStops}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Pickup Stops</div>
                </div>
              </div>

              {/* Start Depot */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(59, 130, 246, 0.15)', padding: '10px 14px', borderRadius: '8px', marginBottom: '10px' }}>
                <Navigation size={18} color="var(--secondary)" />
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>START: NGO Depot</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GPS: {startLat.toFixed(4)}, {startLng.toFixed(4)}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {optimizedRoute.waypoints.map((wp) => (
                  <React.Fragment key={wp.sequenceOrder}>
                    <div style={{ textAlign: 'center', color: 'var(--primary)', fontSize: '0.8rem' }}>
                      ↓ +{wp.distanceFromPreviousKm} km
                    </div>
                    <div className="glass-card" style={{ padding: '12px 16px', borderLeft: '4px solid var(--primary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, color: 'var(--primary)' }}>STOP #{wp.sequenceOrder}</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Cumulative: {wp.cumulativeDistanceKm} km</span>
                      </div>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem', marginTop: '4px' }}>{wp.donation?.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{wp.donation?.pickupAddress}</div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
