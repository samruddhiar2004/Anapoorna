import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, Compass, Route, ShieldCheck, ArrowRight, Utensils, Award } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{ padding: '80px 0 60px', textAlign: 'center', position: 'relative' }}>
        <div className="container">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--primary-glow)',
            color: 'var(--primary)',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '0.88rem',
            fontWeight: 600,
            marginBottom: '24px',
            border: '1px solid rgba(34, 197, 94, 0.3)'
          }}>
            <Award size={16} /> Enterprise Food Rescue & Geofenced Logistics Platform
          </div>

          <h1 style={{
            fontSize: '3.6rem',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #ffffff 30%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Bridge Food Surplus with <br />
            <span style={{ background: 'linear-gradient(90deg, #22c55e, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Real-Time Geofenced NGO Matching
            </span>
          </h1>

          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '720px', margin: '0 auto 36px' }}>
            Anapoorna empowers restaurants, event organizers, and donors to register surplus food, automatically matches nearby verified NGOs within a configurable radius, and optimizes delivery routes.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
              Join as Donor or NGO <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
              Explore Demo Logins
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section style={{ padding: '40px 0 60px' }}>
        <div className="container">
          <div className="grid-cols-3">
            <div className="glass-card" style={{ padding: '30px' }}>
              <div style={{ background: 'var(--primary-glow)', width: 50, height: 50, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <HeartHandshake size={26} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: 10 }}>Direct Food Donation</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                Donors list surplus meals, baked goods, or perishables with quantity, servings, and exact pickup GPS coordinates.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '30px' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.2)', width: 50, height: 50, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Compass size={26} color="var(--secondary)" />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: 10 }}>Haversine Geofencing</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                Mathematically filters nearby active receivers within a configurable radius without requiring expensive third-party mapping APIs.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '30px' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.2)', width: 50, height: 50, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Route size={26} color="var(--accent)" />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: 10 }}>Route Optimization</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                Greedy Nearest-Neighbor solver automatically orders multiple food pickup locations to save fuel and minimize travel time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Workflow Timeline */}
      <section style={{ padding: '60px 0', background: 'rgba(0, 0, 0, 0.2)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '2.2rem', color: '#fff', marginBottom: '40px' }}>
            How Anapoorna Works End-to-End
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {[
              { step: '01', title: 'Create Donation', desc: 'Donor registers food details & pickup GPS.' },
              { step: '02', title: 'Geofence Match', desc: 'System alerts NGOs within target radius.' },
              { step: '03', title: 'Claim & Assign', desc: 'NGO or Volunteer claims pickup duty.' },
              { step: '04', title: 'Optimize & Deliver', desc: 'Smart routing guides pickup to final delivery.' }
            ].map((item, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>{item.step}</div>
                <h4 style={{ color: '#fff', marginBottom: '6px' }}>{item.title}</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
