import styles from '../styles/components/TestimonialCard.module.css';

const formatDate = (dateString) => {
    try {
        return new Date(dateString).toLocaleDateString('fr-FR');
    } catch (error) {
        console.error('Erreur formatage date:', error);
        return 'Date non disponible';
    }
};

export default function TestimonialCard({ 
    message, 
    author, 
    date
}) {
    const displayDate = (() => {
        if (!date) return null;

        // Si c'est déjà au format JJ/MM/AAAA, on ne touche pas
        if (typeof date === 'string' && date.includes('/')) return date;

        // Sinon, on parse la date
        return formatDate(date);
    })();

    return (
        <div className={styles.temoignageCard}>
            <p className={styles.temoignageText}>
                "{message}"
            </p>
            <div className={styles.temoignageFooter}>
                {displayDate && (
                    <p className={styles.temoignageDate}>
                        Publié le {displayDate}
                    </p>
                )}
                <p className={styles.temoignageAuthor}>– {author}</p>
            </div>
        </div>
    );
}
