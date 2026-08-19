import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle style={{ color: '#C5A059' }} size={20} />,
    error: <AlertCircle style={{ color: '#E53E3E' }} size={20} />,
    info: <Info style={{ color: '#6B7A5D' }} size={20} />
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 20px',
      background: 'rgba(74, 88, 63, 0.95)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(197, 160, 89, 0.4)',
      color: '#FFFFFF',
      borderRadius: '30px',
      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3)',
      animation: 'floatGentle 3s ease-in-out infinite',
      maxWidth: '90vw'
    }}>
      {icons[toast.type] || icons.success}
      <span style={{ fontSize: '0.9rem', fontWeight: 500, fontFamily: 'var(--font-sans)' }}>
        {toast.message}
      </span>
      <button 
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#E4C889',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          padding: '2px',
          marginLeft: '8px'
        }}
        aria-label="Close toast"
      >
        <X size={16} />
      </button>
    </div>
  );
}
