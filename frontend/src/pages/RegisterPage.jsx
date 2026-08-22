import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

export const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role')?.toUpperCase();
  const validRole = ['DONOR', 'NGO', 'VOLUNTEER'].includes(initialRole) ? initialRole : 'DONOR';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: validRole,
    address: '',
    latitude: 19.0760, // Default Mumbai coordinates
    longitude: 72.8777
  });

  useEffect(() => {
    if (initialRole && ['DONOR', 'NGO', 'VOLUNTEER'].includes(initialRole)) {
      setFormData(prev => ({ ...prev, role: initialRole }));
    }
  }, [initialRole]);

  const [error, setError] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser');
      return;
    }

    setLocationStatus('Detecting your GPS location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
        setLocationStatus(`GPS set: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
      },
      (err) => {
        setLocationStatus('Could not detect location. Used default coordinates.');
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await register(formData);
      if (user.role === 'DONOR') navigate('/donor-dashboard');
      else navigate('/ngo-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '520px', margin: '40px auto', padding: '0 20px' }}>
      <div className="glass-card animate-fade-in" style={{ padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ background: 'var(--primary-glow)', width: 54, height: 54, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <UserPlus size={26} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '6px' }}>Create Anapoorna Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join the food rescue network</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '12px', borderRadius: '8px', color: '#f87171', fontSize: '0.88rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Role</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {['DONOR', 'NGO', 'VOLUNTEER'].map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setFormData({ ...formData, role: r })}
                  className={`btn ${formData.role === r ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '10px', fontSize: '0.85rem' }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Full Name / Organization Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Green Hotel or Helping Hands NGO"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="name@example.org"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Min 6 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="Street address, City, Pincode"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ margin: 0 }}>Geolocation Coordinates</label>
              <button type="button" onClick={handleGetLocation} className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                <MapPin size={14} /> Detect My Location
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input
                type="number"
                step="any"
                className="form-control"
                placeholder="Latitude"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                required
              />
              <input
                type="number"
                step="any"
                className="form-control"
                placeholder="Longitude"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            {locationStatus && <p style={{ fontSize: '0.78rem', color: 'var(--primary)', marginTop: '6px' }}>{locationStatus}</p>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Already registered? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login Here</Link>
        </div>
      </div>
    </div>
  );
};
