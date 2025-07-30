import styles from '../styles/components/Map.module.css';

export default function Map({ 
    embedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2625.4126037209037!2d1.9877313156759884!3d48.828308979286794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e68b780bffb055%3A0x2c2a75f8e34365cd!2sVillepreux%2078450!5e0!3m2i1sfr!2sfr!4v1697890000000!5m2!1sfr!2sfr",
    title = "Cabinet Stéphanie Habert",
    businessName = "Stéphanie Habert - Sophrologue",
    address = "Villepreux, France"
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
                    <strong>Localisation :</strong><br />
                    {businessName}<br />
                    {address}
                </p>
            </div>
        </div>
    );
}