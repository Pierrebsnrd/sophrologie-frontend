import Head from 'next/head';
import '../styles/globals.css';

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Stéphanie Habert Sophrologue</title>
        <meta name="description" content="Prenez rendez-vous facilement avec notre cabinet de sophrologie" />
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