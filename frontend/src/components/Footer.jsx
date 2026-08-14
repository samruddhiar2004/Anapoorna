import React from 'react';

export const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '40px 0',
      marginTop: '80px',
      background: 'rgba(15, 23, 42, 0.9)',
      color: 'var(--text-muted)',
      fontSize: '0.88rem'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '6px' }}>Anapoorna Platform</h4>
          <p>Zero Food Waste & Geofenced Distribution Network</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p>© {new Date().getFullYear()} Anapoorna. Built with Java 23, Spring Boot, MySQL, React & Vite.</p>
        </div>
      </div>
    </footer>
  );
};
