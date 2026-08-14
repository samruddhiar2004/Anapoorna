import React from 'react';

export const StatusBadge = ({ status }) => {
  const normalized = status ? status.toLowerCase() : 'available';
  const label = status ? status.replace('_', ' ') : 'AVAILABLE';

  return (
    <span className={`badge badge-${normalized}`}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }}></span>
      {label}
    </span>
  );
};
