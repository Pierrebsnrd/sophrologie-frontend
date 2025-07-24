import Head from 'next/head';
import '../styles/globals.css';

function App({ Component, pageProps }) {

  return (
    <>
      <Head>
        <title>Stéphanie Habert – Sophrologie à Villepreux</title>
        <meta name="description" content="Consultation de sophrologie personnalisée à Villepreux avec Stéphanie Habert. Prenez rendez-vous facilement pour améliorer votre bien-être." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon.png" />
        <link rel="icon" type="image/svg+xml" href="/icons/favicon.svg" />
        <link rel="shortcut icon" href="/icons/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
      </Head>
      <Component {...pageProps} />
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

export default App;