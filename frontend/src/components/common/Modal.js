import React from 'react';

export const Modal = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl animate-slide-up overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface-bright">
          <h2 className="text-xl font-bold text-on-surface m-0">{title}</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-error transition-colors rounded-full p-1 hover:bg-error/10 flex items-center justify-center w-8 h-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
