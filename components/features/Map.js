import styles from "../../styles/components/Map.module.css";

export default function Map({
  embedUrl = "https://www.google.com/maps?q=38+ter+rue+des+Ursulines+78100+Saint-Germain-en-Laye&output=embed",
  title = "Cabinet Stéphanie Habert",
  businessName = "Stéphanie Habert - Sophrologue",
  address = "38 ter, rue des Ursulines, 78100 Saint-Germain-en-Laye, France",
}) {
  return (
    <div className={styles.mapContainer}>
      <iframe
        title={title}
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
      <div className={styles.locationText}>
        <p>
          <strong>Localisation :</strong>
          <br />
          {businessName}
          <br />
          {address}
        </p>
      </div>
    </div>
  );
}
