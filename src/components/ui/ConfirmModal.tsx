"use client";

import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="mt-2">
        <p className="text-sm text-gray-500">{message}</p>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button
          variant="secondary"
          onClick={onClose}
        >
          {cancelText}
        </Button>
        <Button
          variant={isDestructive ? 'danger' : 'primary'}
          onClick={handleConfirm}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}