import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
        {type === 'success' ? '✓' : '⚠'}
      </span>
      <span className="toast-message">{message}</span>
    </div>
  );
};
