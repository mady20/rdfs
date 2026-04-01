import React from 'react';

export const Card = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white border border-border rounded-lg p-6 shadow-sm ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;
