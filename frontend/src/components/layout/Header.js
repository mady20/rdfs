import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const Header = ({ title }) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <header className="layout-header">
      <h1 className="layout-header-title">{title}</h1>
      <div className="layout-header-user">
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 600, fontSize: 'var(--font-size-md)' }}>{user.name}</div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--on-surface-variant)' }}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
