import styles from "../../styles/components/LoadingSpinner.module.css";

export default function LoadingSpinner({
  size = "medium", // 'small', 'medium', 'large'
  text = "",
  color = "primary", // 'primary', 'white', 'dark'
}) {
  return (
    <div className={`${styles.container} ${styles[size]}`}>
      <div className={`${styles.spinner} ${styles[color]}`}>
        <div className={styles.bounce1}></div>
        <div className={styles.bounce2}></div>
        <div className={styles.bounce3}></div>
      </div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
}

// Composant pour un overlay de chargement pleine page
export function LoadingOverlay({ text = "Chargement..." }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.overlayContent}>
        <LoadingSpinner size="large" color="white" />
        <p className={styles.overlayText}>{text}</p>
      </div>
    </div>
  );
}
