'use client';

import React from 'react';

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Bestätigen',
  cancelLabel = 'Abbrechen',
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="confirm-dialog-backdrop" aria-modal="true" role="dialog" aria-labelledby="confirm-title">
      <div className="confirm-dialog">
        <h2 id="confirm-title" className="confirm-dialog__title">{title}</h2>
        <p className="confirm-dialog__message">{message}</p>
        <div className="confirm-dialog__actions">
          <button
            type="button"
            className="confirm-dialog__cancel"
            onClick={onCancel}
            aria-label={cancelLabel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="confirm-dialog__confirm"
            onClick={onConfirm}
            aria-label={confirmLabel}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
