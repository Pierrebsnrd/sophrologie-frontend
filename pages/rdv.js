import Head from 'next/head';
import Header from '../components/Header';
import RdvForm from '../components/RdvForm';
import Footer from '../components/Footer';

function RdvPage() {
  return (
    <div>
      <Head>
        <title>Prendre rendez-vous - Stéphanie Habert Sophrologue à Villepreux</title>
        <meta
          name="description"
          content="Prenez rendez-vous facilement avec Stéphanie Habert, sophrologue certifiée à Villepreux, en ligne ou en cabinet."
        />

        {/* Open Graph */}
        <meta property="og:title" content="Prendre rendez-vous - Stéphanie Habert Sophrologue" />
        <meta
          property="og:description"
          content="Réservez votre séance avec Stéphanie Habert, sophrologue à Villepreux, pour un accompagnement personnalisé."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.sophrologuevillepreux.fr/rdv" />
        <meta property="og:image" content="https://www.sophrologuevillepreux.fr/bannieres/rdv.jpg" />
        <meta property="og:image:alt" content="Note de musique symbolisant l'harmonie et l'équilibre" />
      </Head>
      <Header/>
      <RdvForm />
      <Footer />
    </div>
  );
}

export default RdvPage;