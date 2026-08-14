import React from 'react';
import { StatusBadge } from './StatusBadge';
import { Clock, MapPin, Package, Users, Compass } from 'lucide-react';

export const DonationCard = ({ donation, distanceKm, onClaim, onCancel, currentUserId }) => {
  const isDonorOwner = currentUserId && donation.donor && donation.donor.id === currentUserId;

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <StatusBadge status={donation.status} />
          {distanceKm !== undefined && (
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', background: 'var(--primary-glow)', padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Compass size={14} /> {distanceKm} km away
            </span>
          )}
        </div>

        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
          {donation.title}
        </h3>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px', minHeight: '40px' }}>
          {donation.description || 'No description provided.'}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Package size={16} color="var(--primary)" />
            <span>{donation.quantityKg} kg ({donation.foodType})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={16} color="var(--secondary)" />
            <span>{donation.servings} Servings</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', gridColumn: 'span 2' }}>
            <Clock size={16} color="var(--accent)" />
            <span>Expires: {new Date(donation.expiryTime).toLocaleString()}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <MapPin size={16} color="var(--danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{donation.pickupAddress}</span>
        </div>
      </div>

      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '10px' }}>
        {onClaim && donation.status === 'AVAILABLE' && (
          <button onClick={() => onClaim(donation.id)} className="btn btn-primary" style={{ flex: 1 }}>
            Claim Pickup
          </button>
        )}

        {isDonorOwner && donation.status === 'AVAILABLE' && onCancel && (
          <button onClick={() => onCancel(donation.id)} className="btn btn-danger" style={{ padding: '8px 12px' }}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};
