import Head from "next/head";
import Home from '../components/Home';

function Index() {
  
  return (
    <>
      <Head>
        <title>Stéphanie Habert – Sophrologie à Villepreux</title>
        <meta
          name="description"
          content="Découvrez les séances de sophrologie personnalisées avec Stéphanie Habert à Villepreux. Améliorez votre bien-être grâce à un accompagnement professionnel et bienveillant."
        />

        {/* Open Graph */}
        <meta property="og:title" content="Stéphanie Habert – Sophrologie à Villepreux" />
        <meta property="og:description" content="Découvrez les séances de sophrologie personnalisées avec Stéphanie Habert à Villepreux. Améliorez votre bien-être grâce à un accompagnement professionnel et bienveillant." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.sophrologue-villepreux.fr/" />
        <meta property="og:image" content="https://www.sophrologue-villepreux.fr/bannieres/acceuil.jpg" />
      </Head>
      <Home />
    </>
  );
}

export default Index;
