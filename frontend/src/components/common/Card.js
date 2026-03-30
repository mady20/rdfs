import React from 'react';

export const Card = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-soft transition-shadow duration-300 ${className}`}>
      {title && (
        <h3 className="text-xl font-bold mb-5 text-on-surface">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;
