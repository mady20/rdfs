import React from 'react';

export const Card = ({ title, children, className = '' }) => {
  return (
    <div
      className={`card ${className}`}
      style={{
        backgroundColor: 'white',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-xl)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {title && (
        <h3
          style={{
            marginBottom: 'var(--spacing-lg)',
            marginTop: 0,
            fontSize: 'var(--font-size-lg)',
            fontWeight: 600,
          }}
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;
