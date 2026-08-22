import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Utensils, LogOut, User, MapPin, Route, PlusCircle, Shield, Compass, QrCode, X } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showQrModal, setShowQrModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '14px 0'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              padding: '8px',
              borderRadius: '10px',
              display: 'flex'
            }}>
              <Utensils size={22} color="#fff" />
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(90deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Anapoorna
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setShowQrModal(true)}
              className="btn btn-secondary"
              style={{ padding: '8px 12px', fontSize: '0.85rem', color: 'var(--primary)', borderColor: 'rgba(34, 197, 94, 0.3)' }}
              title="Show Live Mobile QR Code"
            >
              <QrCode size={18} /> Mobile App QR
            </button>

            {user ? (
              <>
                {user.role === 'DONOR' && (
                  <>
                    <Link to="/donor-dashboard" className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.88rem' }}>
                      Dashboard
                    </Link>
                    <Link to="/create-donation" className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.88rem' }}>
                      <PlusCircle size={16} /> Donate Food
                    </Link>
                  </>
                )}

                {(user.role === 'NGO' || user.role === 'VOLUNTEER') && (
                  <>
                    <Link to="/ngo-dashboard" className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.88rem' }}>
                      Dashboard
                    </Link>
                    <Link to="/nearby-donations" className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.88rem' }}>
                      <Compass size={16} /> Nearby Food
                    </Link>
                    <Link to="/route-optimizer" className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.88rem' }}>
                      <Route size={16} /> Route Optimizer
                    </Link>
                  </>
                )}

                {user.role === 'ADMIN' && (
                  <Link to="/admin-dashboard" className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.88rem' }}>
                    <Shield size={16} /> Admin Panel
                  </Link>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 14px', borderRadius: '30px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <User size={16} color="var(--primary)" />
                  <div style={{ fontSize: '0.88rem' }}>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{user.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user.role}</div>
                  </div>
                </div>

                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 12px' }} title="Logout">
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* QR Code Modal for Live Presentation */}
      {showQrModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
          <div className="glass-card animate-fade-in" style={{
            maxWidth: '420px',
            width: '100%',
            padding: '32px',
            textAlign: 'center',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowQrModal(false)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={24} />
            </button>

            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '8px' }}>Scan with Phone Camera</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
              Connect your phone to the same Wi-Fi network to test Anapoorna live on mobile!
            </p>

            <div style={{
              background: '#fff',
              padding: '16px',
              borderRadius: '16px',
              display: 'inline-block',
              marginBottom: '16px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
            }}>
              <img src="/qr_code.png" alt="Anapoorna Mobile QR Code" style={{ width: '220px', height: '220px', display: 'block' }} />
            </div>

            <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', color: '#4ade80' }}>
              URL: http://172.16.4.13:5173
            </div>
          </div>
        </div>
      )}
    </>
  );
};
