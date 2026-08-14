import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { DonationCard } from '../components/DonationCard';
import { useAuth } from '../context/AuthContext';
import { Compass, Filter, MapPin } from 'lucide-react';

export const NearbyDonations = () => {
  const { user } = useAuth();
  const [lat, setLat] = useState(user?.latitude || 19.0760);
  const [lng, setLng] = useState(user?.longitude || 72.8777);
  const [radiusKm, setRadiusKm] = useState(10.0);
  const [nearby, setNearby] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNearby();
  }, [lat, lng, radiusKm]);

  const fetchNearby = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/donations/nearby?latitude=${lat}&longitude=${lng}&radiusKm=${radiusKm}`);
      setNearby(res.data);
    } catch (err) {
      console.error('Failed to fetch nearby donations', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimPickup = async (donationId) => {
    try {
      await api.post('/pickups/assign', { donationId });
      alert('Pickup assigned successfully!');
      fetchNearby();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to claim pickup.');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '6px' }}>Geofenced Nearby Matching</h1>
        <p style={{ color: 'var(--text-muted)' }}>Haversine Great-Circle distance formula matching engine</p>
      </div>

      <div className="glass-card" style={{ padding: '24px', marginBottom: '36px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Center Latitude</label>
            <input type="number" step="any" className="form-control" value={lat} onChange={(e) => setLat(parseFloat(e.target.value) || 0)} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Center Longitude</label>
            <input type="number" step="any" className="form-control" value={lng} onChange={(e) => setLng(parseFloat(e.target.value) || 0)} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Radius (km): {radiusKm} km</label>
            <input type="range" min="1" max="100" value={radiusKm} onChange={(e) => setRadiusKm(parseFloat(e.target.value))} style={{ accentColor: 'var(--primary)', width: '100%' }} />
          </div>
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Calculating distances...</p>
      ) : nearby.length === 0 ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>No food donations found within {radiusKm} km of coordinates ({lat}, {lng}).</p>
        </div>
      ) : (
        <div className="grid-cols-3">
          {nearby.map(item => (
            <DonationCard
              key={item.donation.id}
              donation={item.donation}
              distanceKm={item.distanceKm}
              onClaim={handleClaimPickup}
            />
          ))}
        </div>
      )}
    </div>
  );
};
