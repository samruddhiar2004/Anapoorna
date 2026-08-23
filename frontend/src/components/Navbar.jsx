import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Utensils, LogOut, User, MapPin, Route, PlusCircle, Shield, Compass, QrCode, X, Menu } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showQrModal, setShowQrModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <>
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '12px 0'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              padding: '8px',
              borderRadius: '10px',
              display: 'flex',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
            }}>
              <Utensils size={20} color="#fff" />
            </div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, background: 'linear-gradient(90deg, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Anapoorna
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => setShowQrModal(true)}
              className="btn btn-secondary"
              style={{ padding: '8px 12px', fontSize: '0.82rem', color: '#4ade80', borderColor: 'rgba(34, 197, 94, 0.3)' }}
              title="Show Live Mobile QR Code"
            >
              <QrCode size={16} /> Mobile App QR
            </button>

            {user ? (
              <>
                {user.role === 'DONOR' && (
                  <>
                    <Link to="/donor-dashboard" className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                      Dashboard
                    </Link>
                    <Link to="/create-donation" className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                      <PlusCircle size={16} /> Donate Food
                    </Link>
                  </>
                )}

                {(user.role === 'NGO' || user.role === 'VOLUNTEER') && (
                  <>
                    <Link to="/ngo-dashboard" className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                      Dashboard
                    </Link>
                    <Link to="/nearby-donations" className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                      <Compass size={16} /> Nearby Food
                    </Link>
                    <Link to="/route-optimizer" className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                      <Route size={16} /> Route Optimizer
                    </Link>
                  </>
                )}

                {user.role === 'ADMIN' && (
                  <Link to="/admin-dashboard" className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                    <Shield size={16} /> Admin Panel
                  </Link>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 12px', borderRadius: '30px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <User size={15} color="var(--primary)" />
                  <div style={{ fontSize: '0.85rem' }}>
                    <div style={{ fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{user.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.role}</div>
                  </div>
                </div>

                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 12px' }} title="Logout">
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>Login</Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>Register</Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              padding: '8px',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Slide-Down Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu animate-fade-in" style={{
            background: 'rgba(15, 23, 42, 0.98)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginTop: '12px'
          }}>
            <button
              onClick={() => { setShowQrModal(true); setMobileMenuOpen(false); }}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'flex-start', color: '#4ade80', borderColor: 'rgba(34, 197, 94, 0.3)' }}
            >
              <QrCode size={18} /> Mobile App QR Code
            </button>

            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255, 255, 255, 0.05)', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <User size={18} color="var(--primary)" />
                  <div>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{user.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Role: {user.role}</div>
                  </div>
                </div>

                {user.role === 'DONOR' && (
                  <>
                    <Link to="/donor-dashboard" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                      Dashboard
                    </Link>
                    <Link to="/create-donation" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                      <PlusCircle size={18} /> Donate Food
                    </Link>
                  </>
                )}

                {(user.role === 'NGO' || user.role === 'VOLUNTEER') && (
                  <>
                    <Link to="/ngo-dashboard" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                      Dashboard
                    </Link>
                    <Link to="/nearby-donations" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                      <Compass size={18} /> Nearby Food
                    </Link>
                    <Link to="/route-optimizer" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                      <Route size={18} /> Route Optimizer
                    </Link>
                  </>
                )}

                {user.role === 'ADMIN' && (
                  <Link to="/admin-dashboard" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                    <Shield size={18} /> Admin Panel
                  </Link>
                )}

                <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%', justifyContent: 'flex-start' }}>
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ textAlign: 'center' }}>Login</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ textAlign: 'center' }}>Register</Link>
              </div>
            )}
          </div>
        )}
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
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '16px'
        }}>
          <div className="glass-card animate-fade-in" style={{
            maxWidth: '400px',
            width: '100%',
            padding: '24px',
            textAlign: 'center',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowQrModal(false)}
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={24} />
            </button>

            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '6px' }}>Scan with Phone Camera</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Scan to test Anapoorna live on your mobile device!
            </p>

            <div style={{
              background: '#fff',
              padding: '12px',
              borderRadius: '16px',
              display: 'inline-block',
              marginBottom: '16px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
            }}>
              <img src="/qr_code.png" alt="Anapoorna Mobile QR Code" style={{ width: '200px', height: '200px', display: 'block' }} />
            </div>

            <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', color: '#4ade80' }}>
              URL: https://anapoorna-xi.vercel.app
            </div>
          </div>
        </div>
      )}
    </>
  );
};
