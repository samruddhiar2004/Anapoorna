import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Utensils, LogOut, User, MapPin, Route, PlusCircle, Shield, Compass } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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
  );
};
