import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { DonationCard } from '../components/DonationCard';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, PackageCheck, UtensilsCrossed, AlertCircle } from 'lucide-react';

export const DonorDashboard = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyDonations();
  }, []);

  const fetchMyDonations = async () => {
    try {
      const res = await api.get('/donations/my');
      setDonations(res.data);
    } catch (err) {
      setError('Failed to load your food donations.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDonation = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this food donation?')) return;
    try {
      await api.put(`/donations/${id}/cancel`);
      fetchMyDonations();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel donation.');
    }
  };

  const totalKg = donations.reduce((acc, curr) => acc + (curr.quantityKg || 0), 0);
  const activeCount = donations.filter(d => d.status === 'AVAILABLE' || d.status === 'ASSIGNED').length;
  const deliveredCount = donations.filter(d => d.status === 'DELIVERED').length;

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '4px' }}>Donor Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your active surplus food donations</p>
        </div>
        <Link to="/create-donation" className="btn btn-primary" style={{ padding: '12px 24px' }}>
          <PlusCircle size={18} /> Post Food Donation
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid-cols-3" style={{ marginBottom: '36px' }}>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'var(--primary-glow)', padding: '14px', borderRadius: '12px' }}>
            <UtensilsCrossed size={28} color="var(--primary)" />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{donations.length}</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Total Donations Created</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '14px', borderRadius: '12px' }}>
            <PackageCheck size={28} color="var(--secondary)" />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{totalKg} kg</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Total Food Rescued</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(168, 85, 247, 0.2)', padding: '14px', borderRadius: '12px' }}>
            <PackageCheck size={28} color="#c084fc" />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{deliveredCount}</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Completed Deliveries</div>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '20px' }}>Your Donation History</h2>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading your donations...</p>
      ) : error ? (
        <p style={{ color: 'var(--danger)' }}>{error}</p>
      ) : donations.length === 0 ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>You haven't posted any food donations yet.</p>
          <Link to="/create-donation" className="btn btn-primary">Create Your First Donation</Link>
        </div>
      ) : (
        <div className="grid-cols-3">
          {donations.map(donation => (
            <DonationCard
              key={donation.id}
              donation={donation}
              onCancel={handleCancelDonation}
              currentUserId={user?.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};
