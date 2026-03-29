import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const Header = ({ title }) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <header className="flex items-center justify-between py-4 px-6 border-b border-border bg-white">
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="font-semibold">{user.name}</div>
          <div className="text-sm text-on-surface-variant">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
