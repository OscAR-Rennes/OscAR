import "./ConfirmModal.style.css";

export default function ConfirmModal({
  isOpen,
  message,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="confirm-modal-overlay" role="dialog" aria-modal="true">
      <div className="confirm-modal-content">
        <p className="confirm-modal-message">{message}</p>
        <p className="confirm-modal-warning">Cette action est définitive</p>

        <div className="confirm-modal-actions">
          <button className="confirm-modal-btn confirm-modal-btn-cancel" onClick={onCancel}>
            Annuler
          </button>
          <button className="confirm-modal-btn confirm-modal-btn-confirm" onClick={onConfirm}>
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}
