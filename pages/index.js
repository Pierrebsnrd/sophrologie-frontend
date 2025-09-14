import Home from "../components/Home";
import SEO from "../components/SEO";

function Index() {
  return (
    <>
      <SEO
        title="Stéphanie Habert – Sophrologie à Villepreux"
        description="Découvrez les séances de sophrologie personnalisées avec Stéphanie Habert à Villepreux. Améliorez votre bien-être grâce à un accompagnement professionnel et bienveillant."
        canonical="https://www.sophrologuevillepreux.fr/"
        ogImage="https://www.sophrologuevillepreux.fr/bannieres/accueil.jpg"
        pageType="website"
        keywords="sophrologue Villepreux, sophrologie Villepreux, sophrologue Saint-Germain-en-Laye, sophrologie Saint-Germain-en-Laye, relaxation, gestion du stress, bien-être, Stéphanie Habert, séances personnalisées"
      />
      <Home />
    </>
  );
}

export default Index;
