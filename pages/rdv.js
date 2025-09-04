import SEO from "../components/SEO";
import Header from '../components/Header';
import Resalib from "../components/Resalib";
import Footer from '../components/Footer';

function RdvPage() {
  return (
    <>
      <SEO
        title="Prendre rendez-vous - Stéphanie Habert Sophrologue à Villepreux"
        description="Prenez rendez-vous facilement avec Stéphanie Habert, sophrologue certifiée à Villepreux, en ligne ou en cabinet."
        canonical="https://www.sophrologuevillepreux.fr/rdv"
        ogImage="https://www.sophrologuevillepreux.fr/bannieres/rdv.jpg"
        ogImageAlt="Prise de rendez-vous sophrologie"
        pageType="appointment"
        keywords="rendez-vous sophrologie, réserver séance, planning, Stéphanie Habert Villepreux"
      />
      <Header />
      <Resalib />
      <Footer />
    </>
  );
}

export default RdvPage;