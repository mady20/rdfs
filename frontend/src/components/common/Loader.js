import React from 'react';

export const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex-center" style={{ padding: 'var(--spacing-2xl)' }}>
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            border: '4px solid var(--border)',
            borderTop: '4px solid var(--primary)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto var(--spacing-md)',
          }}
        ></div>
        <p style={{ color: 'var(--on-surface-variant)', margin: 0 }}>{message}</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Loader;
