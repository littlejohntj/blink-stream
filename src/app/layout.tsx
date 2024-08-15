import AppWalletProvider from "../components/AppWalletProvider";
import '../styles/globals.css';
import Head from 'next/head';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <title>Blurt.gg</title>
        <meta property="og:title" content="Blurt.gg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.blurt.gg" />
        <meta property="og:image" content="https://www.blurt.gg/blurt.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="blurt.gg" />
        <meta property="twitter:url" content="https://www.blurt.gg" />
        <meta name="twitter:title" content="Blurt.gg" />
        <meta name="twitter:description" content="Donate to your favorite streamers." />
        <meta name="twitter:image" content="https://www.blurt.gg/blurt.png" />
      </Head>
      <body>
        <AppWalletProvider>{children}</AppWalletProvider>
      </body>
    </html>
  );
}