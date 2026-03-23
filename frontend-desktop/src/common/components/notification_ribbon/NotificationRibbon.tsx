import "./notification_ribbon.style.css";

type NotificationRibbonProps = {
  message: string;
  onClose?: () => void;
};

export default function NotificationRibbon({ message, onClose }: NotificationRibbonProps) {
  if (!message) return null;

  return (
    <div className="osc-notification-ribbon" role="status" aria-live="polite">
      <div className="osc-notification-ribbon-content">
        <span className="osc-notification-ribbon-label">Notification :</span>
        <span>{message}</span>
      </div>

      {onClose ? (
        <button
          type="button"
          className="osc-notification-ribbon-close"
          aria-label="Fermer la notification"
          onClick={onClose}
        >
          ×
        </button>
      ) : null}
    </div>
  );
}