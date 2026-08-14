import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { StatusBadge } from '../components/StatusBadge';
import { Shield, Utensils, Users, CheckCircle, Package } from 'lucide-react';

export const AdminDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await api.get('/donations');
      setDonations(res.data);
    } catch (err) {
      console.error('Failed to load admin metrics', err);
    } finally {
      setLoading(false);
    }
  };

  const totalKg = donations.reduce((acc, curr) => acc + (curr.quantityKg || 0), 0);
  const totalServings = donations.reduce((acc, curr) => acc + (curr.servings || 0), 0);

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield color="var(--primary)" size={32} /> Platform Admin Dashboard
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>System-wide monitoring & food donation lifecycle analytics</p>
      </div>

      {/* Metrics Row */}
      <div className="grid-cols-4" style={{ marginBottom: '36px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Total Donations</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>{donations.length}</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Total Volume (Kg)</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>{totalKg} kg</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Total Servings</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '4px' }}>{totalServings}</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Platform Status</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#4ade80', marginTop: '8px' }}>HEALTHY</div>
        </div>
      </div>

      <h3 style={{ color: '#fff', marginBottom: '20px' }}>System Food Donation Feed</h3>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading system feed...</p>
      ) : (
        <div className="glass-card" style={{ padding: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>ID</th>
                <th style={{ padding: '12px' }}>Title</th>
                <th style={{ padding: '12px' }}>Type</th>
                <th style={{ padding: '12px' }}>Donor</th>
                <th style={{ padding: '12px' }}>Quantity</th>
                <th style={{ padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {donations.map(d => (
                <tr key={d.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px' }}>#{d.id}</td>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{d.title}</td>
                  <td style={{ padding: '12px' }}>{d.foodType}</td>
                  <td style={{ padding: '12px' }}>{d.donor?.name || 'Anonymous'}</td>
                  <td style={{ padding: '12px' }}>{d.quantityKg} kg</td>
                  <td style={{ padding: '12px' }}><StatusBadge status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
