import React from 'react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onClose} className="button-secondary">
            Annuleren
          </button>
          <button onClick={onConfirm} className="button-danger">
            Verwijderen
          </button>
        </div>
      </div>
    </div>
  );
}