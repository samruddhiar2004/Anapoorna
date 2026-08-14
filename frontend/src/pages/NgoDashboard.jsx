import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { DonationCard } from '../components/DonationCard';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { Compass, Truck, Route, CheckCircle } from 'lucide-react';

export const NgoDashboard = () => {
  const { user } = useAuth();
  const [nearbyDonations, setNearbyDonations] = useState([]);
  const [myPickups, setMyPickups] = useState([]);
  const [radiusKm, setRadiusKm] = useState(15.0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [radiusKm]);

  const fetchDashboardData = async () => {
    try {
      const lat = user?.latitude || 19.0760;
      const lng = user?.longitude || 72.8777;

      const [nearbyRes, pickupsRes] = await Promise.all([
        api.get(`/donations/nearby?latitude=${lat}&longitude=${lng}&radiusKm=${radiusKm}`),
        api.get('/pickups/my')
      ]);

      setNearbyDonations(nearbyRes.data);
      setMyPickups(pickupsRes.data);
    } catch (err) {
      console.error('Failed to load NGO dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimPickup = async (donationId) => {
    try {
      await api.post('/pickups/assign', { donationId });
      alert('Food donation claimed successfully! Added to your active pickups.');
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to claim pickup.');
    }
  };

  const handleUpdatePickupStatus = async (pickupId, status) => {
    try {
      await api.patch(`/pickups/${pickupId}/status`, { status });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update pickup status.');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '4px' }}>NGO & Receiver Portal</h1>
          <p style={{ color: 'var(--text-muted)' }}>Real-time geofenced matching & pickup distribution</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/nearby-donations" className="btn btn-secondary">
            <Compass size={18} /> Geofenced Map Filter
          </Link>
          <Link to="/route-optimizer" className="btn btn-primary">
            <Route size={18} /> Optimize Pickup Route
          </Link>
        </div>
      </div>

      {/* Geofence Radius Selector Header */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '4px' }}>Geofence Distance Filter</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Showing available food within radius from your location ({user?.latitude?.toFixed(4)}, {user?.longitude?.toFixed(4)})</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontWeight: 600, color: 'var(--primary)' }}>{radiusKm} km radius</label>
          <input
            type="range"
            min="1"
            max="50"
            step="1"
            value={radiusKm}
            onChange={(e) => setRadiusKm(parseFloat(e.target.value))}
            style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Active Claimed Pickups Section */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Truck color="var(--secondary)" /> Your Claimed Pickups ({myPickups.length})
        </h2>

        {myPickups.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No active pickups claimed yet. Explore nearby available food below!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {myPickups.map(pickup => (
              <div key={pickup.id} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <StatusBadge status={pickup.status} />
                    <h4 style={{ color: '#fff', fontSize: '1.1rem' }}>{pickup.donation?.title}</h4>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    Pickup: {pickup.donation?.pickupAddress} | {pickup.donation?.quantityKg} kg ({pickup.donation?.servings} servings)
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {pickup.status === 'ASSIGNED' && (
                    <button onClick={() => handleUpdatePickupStatus(pickup.id, 'IN_TRANSIT')} className="btn btn-secondary">
                      Mark In Transit
                    </button>
                  )}
                  {pickup.status === 'IN_TRANSIT' && (
                    <button onClick={() => handleUpdatePickupStatus(pickup.id, 'COMPLETED')} className="btn btn-primary">
                      <CheckCircle size={16} /> Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nearby Available Donations Section */}
      <div>
        <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Compass color="var(--primary)" /> Available Food Donations Nearby ({nearbyDonations.length})
        </h2>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Calculating Haversine distances...</p>
        ) : nearbyDonations.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No available food donations found within {radiusKm} km.</p>
        ) : (
          <div className="grid-cols-3">
            {nearbyDonations.map(item => (
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
    </div>
  );
};
