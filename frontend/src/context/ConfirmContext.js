import React, { createContext, useContext, useState, useCallback } from 'react';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';

const ConfirmContext = createContext();

export const ConfirmProvider = ({ children }) => {
  const [confirmState, setConfirmState] = useState({ open: false, message: '', resolve: null });

  const showConfirm = useCallback((message) => {
    return new Promise((resolve) => {
      setConfirmState({ open: true, message, resolve });
    });
  }, []);

  const handleClose = useCallback(() => {
    if (confirmState.resolve) confirmState.resolve(false);
    setConfirmState({ open: false, message: '', resolve: null });
  }, [confirmState]);

  const handleConfirm = useCallback(() => {
    if (confirmState.resolve) confirmState.resolve(true);
    setConfirmState({ open: false, message: '', resolve: null });
  }, [confirmState]);

  return (
    <ConfirmContext.Provider value={{ showConfirm }}>
      {children}

      <Modal isOpen={confirmState.open} title={"Confirm"} onClose={handleClose}>
        <div className="space-y-4">
          <div>{confirmState.message}</div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button variant="danger" onClick={handleConfirm}>Confirm</Button>
          </div>
        </div>
      </Modal>
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx.showConfirm;
};

export default ConfirmProvider;
