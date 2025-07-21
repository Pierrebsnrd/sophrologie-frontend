import Header from "../components/Header";

export default function QuiSuisJe() {
    return (
        <>
            <Header/>
    <div style={styles.container}>
                <div style={styles.content}>
                    <h1 style={styles.title}>Qui suis-je ?</h1>
                    <p style={styles.text}>
                        Je m'appelle [Votre Nom], sophrologue certifiée, passionnée par l'accompagnement des personnes vers un mieux-être global.
                        Après un parcours personnel et professionnel riche, j’ai choisi la sophrologie comme voie pour aider chacun à se reconnecter à lui-même.
                    </p>
                    <p style={styles.text}>
                        Mon approche est bienveillante, à l’écoute de vos besoins, et adaptée à chaque étape de votre vie : gestion du stress, confiance en soi, préparation mentale, troubles du sommeil, accompagnement à la parentalité, etc.
                    </p>
                    <p style={styles.text}>
                        Je vous accueille dans un cadre chaleureux et confidentiel, où chaque séance est un moment privilégié pour vous.
                    </p>
                </div>
            </div>
        </>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
    },
    content: {
        maxWidth: '800px',
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: '30px',
    },
    text: {
        fontSize: '1.2rem',
        lineHeight: '1.7',
        color: '#444',
        marginBottom: '20px',
    },
};
