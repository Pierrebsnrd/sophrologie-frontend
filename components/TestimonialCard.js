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
    return (
        <div className={styles.temoignageCard}>
            <p className={styles.temoignageText}>
                "{message}"
            </p>
            <div className={styles.temoignageFooter}>
                {date && (
                    <p className={styles.temoignageDate}>
                        Publié le {typeof date === 'string' ? date : formatDate(date)}
                    </p>
                )}
                <p className={styles.temoignageAuthor}>– {author}</p>
            </div>
        </div>
    );
}