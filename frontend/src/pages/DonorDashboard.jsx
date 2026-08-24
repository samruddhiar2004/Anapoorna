import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { DonationCard } from '../components/DonationCard';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, PackageCheck, UtensilsCrossed, AlertCircle } from 'lucide-react';

const MOCK_DONATIONS = [
  {
    id: 101,
    title: "Fresh Mutton Curry & Naan Meal Packs",
    description: "Delicious, hot Mutton Curry served with butter naan and salad. Prepared for evening banquet event.",
    foodType: "COOKED_MEAL",
    quantityKg: 12.0,
    servings: 35,
    status: "AVAILABLE",
    pickupAddress: "Bandra West, Near Carter Road, Mumbai",
    pickupLatitude: 19.0596,
    pickupLongitude: 72.8295,
    donorId: 1
  },
  {
    id: 102,
    title: "Fresh Bakery Bread & Pastries",
    description: "Assorted artisanal whole wheat loaves and fruit muffins.",
    foodType: "BAKERY",
    quantityKg: 8.0,
    servings: 30,
    status: "AVAILABLE",
    pickupAddress: "Mahim West, Station Road, Mumbai",
    pickupLatitude: 19.0410,
    pickupLongitude: 72.8400,
    donorId: 1
  },
  {
    id: 103,
    title: "Raw Vegetables & Fruit Baskets",
    description: "Cracker apples, bananas, potatoes, and tomatoes.",
    foodType: "PERISHABLE",
    quantityKg: 25.0,
    servings: 80,
    status: "ASSIGNED",
    pickupAddress: "Lower Parel, Phoenix Mills Area, Mumbai",
    pickupLatitude: 18.9950,
    pickupLongitude: 72.8270,
    donorId: 1
  }
];

export const DonorDashboard = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyDonations();
  }, []);

  const fetchMyDonations = async () => {
    try {
      const res = await api.get('/donations/my');
      setDonations(res.data);
    } catch (err) {
      console.log('Backend offline - using Standalone Demo Donations');
      setDonations(MOCK_DONATIONS);
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
      setDonations(prev => prev.map(d => d.id === id ? { ...d, status: 'CANCELLED' } : d));
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
