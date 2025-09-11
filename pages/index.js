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
        keywords="sophrologie Villepreux, Stéphanie Habert, bien-être, relaxation, gestion stress"
      />
      <Home />
    </>
  );
}

export default Index;
