import React, { useEffect } from 'react';
import { useNotificationStore } from '../../store/notificationStore';
import './Notification.style.css';

export default function Notification() {
  const notifications = useNotificationStore((s) => s.notifications);
  const remove = useNotificationStore((s) => s.removeNotification);

  const last = notifications.length ? notifications[notifications.length - 1] : null;
  useEffect(() => {
    if (!last) return;
    const t = setTimeout(() => remove(last.id), 5000);
    return () => clearTimeout(t);
  }, [last, remove]);

  if (!last) return null;

  const detailsText =
    last.details == null
      ? null
      : typeof last.details === 'string'
        ? last.details
        : JSON.stringify(last.details, null, 2);

  return (
    <div className="osc-notification-wrapper">
      <div key={last.id} className="osc-notification osc-notification-error">
        <div className="osc-notification-glow" aria-hidden="true" />

        <button
          className="osc-notification-close"
          aria-label="Fermer la notification"
          onClick={() => remove(last.id)}
        >
          ×
        </button>

        <div className="osc-notification-head">
          <span className="osc-notification-icon" aria-hidden="true">
            !
          </span>
          <div>
            <div className="osc-notification-title">Erreur</div>
        </div>
      </div>
      <div className="osc-notification-message">{last.message}</div>

        {detailsText ? (
          <pre className="osc-notification-details">{detailsText}</pre>
        ) : null}

        <div className="osc-notification-footer">
          {last.statusCode ? (
            <span className="osc-notification-status">HTTP {last.statusCode}</span>
          ) : (
            <span className="osc-notification-status">Erreur interne</span>
          )}
        </div>
      </div>
    </div>
  );
}
