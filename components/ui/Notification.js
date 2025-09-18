import { useEffect, useState } from "react";
import styles from "../../styles/components/Notification.module.css";

export default function Notification({
  message,
  type = "success", // 'success', 'error', 'info'
  duration = 5000,
  onClose,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      setIsLeaving(false);

      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible || !message) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "info":
        return "ℹ️";
      default:
        return "✅";
    }
  };

  return (
    <div
      className={`${styles.notification} ${styles[type]} ${isLeaving ? styles.leaving : ""}`}
    >
      <div className={styles.content}>
        <span className={styles.icon}>{getIcon()}</span>
        <span className={styles.message}>{message}</span>
        <button
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Fermer"
        >
          ×
        </button>
      </div>
    </div>
  );
}
