import React, { useEffect, useRef } from 'react';

export const Modal = ({ isOpen, title, onClose, children }) => {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousActive = document.activeElement;
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const dialog = dialogRef.current;
    const focusableElements = dialog?.querySelectorAll(focusableSelector) || [];
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      dialog?.focus();
    }

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        // basic focus trap
        const nodes = dialog.querySelectorAll(focusableSelector);
        if (nodes.length === 0) {
          e.preventDefault();
          return;
        }
        const firstNode = nodes[0];
        const lastNode = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === firstNode) {
          e.preventDefault();
          lastNode.focus();
        } else if (!e.shiftKey && document.activeElement === lastNode) {
          e.preventDefault();
          firstNode.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      previousActive?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex="-1"
        className="bg-white rounded-lg p-6 max-w-lg w-[90%] shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="modal-title" className="text-lg font-semibold m-0">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="text-2xl leading-none">×</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
