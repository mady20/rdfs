import React, { createContext, useContext, useCallback, useState } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, options = {}) => {
    const id = Date.now() + Math.random().toString(36).slice(2, 9);
    const toast = {
      id,
      message,
      type: options.type || 'info',
      duration: options.duration || 4000,
    };
    setToasts((t) => [...t, toast]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, toast.duration);
  }, []);

  const removeToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`max-w-xs w-full px-4 py-2 rounded shadow-md text-sm text-white ${t.type === 'error' ? 'bg-red-600' : t.type === 'success' ? 'bg-green-600' : 'bg-gray-800'}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="truncate">{t.message}</div>
              <button onClick={() => removeToast(t.id)} className="text-white/80 hover:text-white">×</button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export default ToastProvider;
