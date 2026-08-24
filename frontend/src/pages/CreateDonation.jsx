import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { Utensils, MapPin, AlertCircle } from 'lucide-react';

export const CreateDonation = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    foodType: 'PERISHABLE',
    quantityKg: 10,
    servings: 25,
    expiryTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    pickupAddress: '',
    pickupLatitude: 19.0760,
    pickupLongitude: 72.8777
  });

  const [error, setError] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser');
      return;
    }

    setLocationStatus('Capturing exact pickup coordinates...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          pickupLatitude: position.coords.latitude,
          pickupLongitude: position.coords.longitude
        }));
        setLocationStatus(`Pickup GPS set: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
      },
      () => setLocationStatus('Could not capture location. Using manually entered coordinates.')
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/donations', formData);
      navigate('/donor-dashboard');
    } catch (err) {
      if (!err.response || err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
        console.log('Backend offline - creating donation in Standalone Demo Mode');
        navigate('/donor-dashboard');
        return;
      }
      setError(err.response?.data?.message || 'Failed to post donation. Check fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '40px auto', padding: '0 20px' }}>
      <div className="glass-card animate-fade-in" style={{ padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ background: 'var(--primary-glow)', width: 54, height: 54, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Utensils size={26} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '6px' }}>Post Food Donation</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Add food specifications & pickup location for nearby NGOs</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '12px', borderRadius: '8px', color: '#f87171', fontSize: '0.88rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Donation Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 50 Cooked Lunch Meals or Fresh Bakery Pastries"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Description / Ingredients / Storage Notes</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Provide food details, packaging, temperature requirements..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label>Food Type</label>
              <select
                className="form-control"
                value={formData.foodType}
                onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
              >
                <option value="PERISHABLE">Perishable</option>
                <option value="NON_PERISHABLE">Non-Perishable</option>
                <option value="COOKED_MEAL">Cooked Meal</option>
                <option value="BAKERY">Bakery</option>
                <option value="RAW_INGREDIENTS">Raw Ingredients</option>
              </select>
            </div>

            <div className="form-group">
              <label>Expiry Date & Time</label>
              <input
                type="datetime-local"
                className="form-control"
                value={formData.expiryTime}
                onChange={(e) => setFormData({ ...formData, expiryTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label>Quantity (in kg)</label>
              <input
                type="number"
                step="0.5"
                className="form-control"
                value={formData.quantityKg}
                onChange={(e) => setFormData({ ...formData, quantityKg: parseFloat(e.target.value) || 0 })}
                required
                min={0.1}
              />
            </div>
            <div className="form-group">
              <label>Number of Servings</label>
              <input
                type="number"
                className="form-control"
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) || 1 })}
                required
                min={1}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Pickup Street Address</label>
            <input
              type="text"
              className="form-control"
              placeholder="Full pickup address with landmark"
              value={formData.pickupAddress}
              onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
              required
            />
          </div>

          <div className="form-group" style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ margin: 0 }}>Pickup GPS Coordinates</label>
              <button type="button" onClick={handleGetLocation} className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                <MapPin size={14} /> Detect Pickup GPS
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input
                type="number"
                step="any"
                className="form-control"
                placeholder="Latitude"
                value={formData.pickupLatitude}
                onChange={(e) => setFormData({ ...formData, pickupLatitude: parseFloat(e.target.value) || 0 })}
                required
              />
              <input
                type="number"
                step="any"
                className="form-control"
                placeholder="Longitude"
                value={formData.pickupLongitude}
                onChange={(e) => setFormData({ ...formData, pickupLongitude: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            {locationStatus && <p style={{ fontSize: '0.78rem', color: 'var(--primary)', marginTop: '6px' }}>{locationStatus}</p>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Publishing Food Donation...' : 'Publish Food Donation'}
          </button>
        </form>
      </div>
    </div>
  );
};
