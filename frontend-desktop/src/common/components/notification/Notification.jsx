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

  if (!last || last.statusCode == 401) return null;

  return (
    <div className="osc-notification-wrapper">
      <div key={last.id} className="osc-notification osc-notification-error">
        <button
          className="osc-notification-close"
          aria-label="Fermer la notification"
          onClick={() => remove(last.id)}
        >
          ×
        </button>
        <div className="osc-notification-title">Erreur</div>
        <div className="osc-notification-message">{last.message}</div>
        {last.details ? (
          <pre className="osc-notification-details">{JSON.stringify(last.details, null, 2)}</pre>
        ) : null}
        {last.statusCode ? (
          <div className="osc-notification-status">Statut : {last.statusCode}</div>
        ) : null}
      </div>
    </div>
  );
}
