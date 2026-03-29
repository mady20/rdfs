import React from 'react';

export const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="mx-auto mb-4 w-10 h-10 border-4 border-border border-t-primary rounded-full animate-spin"></div>
        <p className="text-on-surface-variant">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
