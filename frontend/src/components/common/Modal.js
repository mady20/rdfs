import React from 'react';

export const Modal = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-lg p-6 max-w-lg w-[90%] shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold m-0">{title}</h2>
          <button onClick={onClose} className="text-2xl leading-none">×</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
