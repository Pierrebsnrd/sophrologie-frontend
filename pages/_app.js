import Head from 'next/head';
import '../styles/globals.css';

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Stéphanie Habert Sophrologue</title>
        <meta name="description" content="Prenez rendez-vous facilement avec notre cabinet de sophrologie" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />

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