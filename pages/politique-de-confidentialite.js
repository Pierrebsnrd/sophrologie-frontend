import SEO from "../components/SEO";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/pages/PrivacyPolicy.module.css";
import Link from 'next/link';

export default function PolitiqueDeConfidentialite() {
  return (
    <>
      <SEO
        title="Politique de confidentialité - Stéphanie Habert Sophrologue"
        description="Protection de vos données personnelles - Cabinet de sophrologie Stéphanie Habert à Villepreux."
        noIndex={true}
      />
      <Header />
      <main className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Protection de vos données</h1>
          <div className={styles.lastUpdated}>
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
          </div>

          <div className={styles.intro}>
            <p>
              🛡️ <strong>Votre vie privée nous tient à cœur.</strong> Cette page
              explique simplement comment nous protégeons vos informations
              personnelles.
            </p>
          </div>

          <section className={styles.section}>
            <h2>📝 Quelles informations collectons-nous ?</h2>

            <h3>Quand vous nous contactez :</h3>
            <ul>
              <li>Votre nom et prénom</li>
              <li>Votre email</li>
              <li>Votre numéro de téléphone</li>
              <li>Votre message</li>
            </ul>

            <h3>Si vous laissez un témoignage :</h3>
            <ul>
              <li>Votre nom (publié seulement si vous l'acceptez)</li>
              <li>Votre témoignage</li>
            </ul>

            <h3>Navigation sur le site :</h3>
            <ul>
              <li>Pages visitées (données anonymes via Google Analytics)</li>
              <li>Durée de visite</li>
              <li>
                <strong>Aucune donnée personnelle identifiable</strong>
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>🎯 Pourquoi collectons-nous ces informations ?</h2>
            <ul>
              <li>
                <strong>Vous répondre</strong> quand vous nous contactez
              </li>
              <li>
                <strong>Organiser vos rendez-vous</strong>
              </li>
              <li>
                <strong>Publier vos témoignages</strong> (avec votre accord)
              </li>
              <li>
                <strong>Améliorer notre site web</strong> (statistiques
                anonymes)
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>🔒 Comment protégeons-nous vos données ?</h2>
            <ul>
              <li>
                📧 <strong>Vos messages</strong> : stockés de manière sécurisée
                sur nos serveurs
              </li>
              <li>
                🍪 <strong>Cookies</strong> : utilisés seulement avec votre
                accord
              </li>
              <li>
                🔐 <strong>Accès limité</strong> : seule Stéphanie Habert peut
                voir vos données
              </li>
              <li>
                ⏰ <strong>Suppression automatique</strong> après 3 ans
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>🍪 Les cookies, c'est quoi ?</h2>
            <p>
              Les cookies sont de petits fichiers qui nous aident à comprendre
              comment vous utilisez notre site (pages les plus vues, temps
              passé...).
            </p>

            <div className={styles.cookieInfo}>
              <div className={styles.cookieType}>
                <h4>🔧 Cookies techniques</h4>
                <p>Nécessaires au fonctionnement du site (toujours actifs)</p>
              </div>
              <div className={styles.cookieType}>
                <h4>📊 Cookies statistiques (Google Analytics)</h4>
                <p>
                  Nous aident à améliorer le site (activés avec votre accord)
                </p>
              </div>
            </div>

            <p>
              💡 <strong>Vous gardez le contrôle :</strong> vous pouvez accepter
              ou refuser les cookies statistiques à tout moment.
            </p>
          </section>

          <section className={styles.section}>
            <h2>⚖️ Vos droits</h2>
            <p>Vous avez le droit de :</p>

            <div className={styles.rightsGrid}>
              <div className={styles.rightItem}>
                <h4>👀 Savoir</h4>
                <p>Quelles données nous avons sur vous</p>
              </div>
              <div className={styles.rightItem}>
                <h4>✏️ Corriger</h4>
                <p>Modifier vos informations</p>
              </div>
              <div className={styles.rightItem}>
                <h4>🗑️ Supprimer</h4>
                <p>Effacer toutes vos données</p>
              </div>
              <div className={styles.rightItem}>
                <h4>📦 Récupérer</h4>
                <p>Obtenir une copie de vos données</p>
              </div>
            </div>

            <p>
              📧 <strong>Pour exercer ces droits :</strong> envoyez-nous un
              email à
              <a
                href="mailto:stephanie.habert.sophrologie@gmail.com"
                className={styles.emailLink}
              >
                stephanie.habert.sophrologie@gmail.com
              </a>
            </p>
          </section>

          <section className={styles.section}>
            <h2>⏱️ Combien de temps gardons-nous vos données ?</h2>
            <div className={styles.retentionGrid}>
              <div className={styles.retentionItem}>
                <h4>📩 Messages de contact</h4>
                <p>3 ans maximum</p>
              </div>
              <div className={styles.retentionItem}>
                <h4>💬 Témoignages</h4>
                <p>Jusqu'à votre demande de suppression</p>
              </div>
              <div className={styles.retentionItem}>
                <h4>🍪 Cookies</h4>
                <p>2 ans maximum</p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>📞 Contact</h2>
            <div className={styles.contactBlock}>
              <h4>Stéphanie Habert - Sophrologue</h4>
              <p>📧 stephaniehabert.sophrologue@gmail.com</p>
              <p>📱 06 11 42 17 65</p>
              <p>📍 Villepreux, Yvelines</p>
            </div>

            <p>
              <strong>Une question sur vos données ?</strong> N'hésitez pas à
              nous contacter, nous vous répondrons rapidement et clairement.
            </p>
          </section>

          <div className={styles.contact}>
            <h3>💚 Notre engagement</h3>
            <p>
              Nous nous engageons à protéger votre vie privée avec le même soin
              que nous mettons dans nos accompagnements en sophrologie.
            </p>
            <Link href="/contact" className={styles.contactButton}>
              Contactez-nous
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
