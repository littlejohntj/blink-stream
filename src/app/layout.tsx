import { Metadata } from "next";
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
      <body>
        <AppWalletProvider>{children}</AppWalletProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "Blurt.gg",
  description:
    "Solana Powered Stream Alerts",
  icons: "/blurt.png",
  openGraph: {
    title: "Blurt.gg",
    description:
      "Solana Powered Stream Alerts",
    images: "/blurt.png",
  },
  twitter: {
    card: "summary_large_image",
    site: "blurt.gg",
    creator: "@tj_littlejohn",
  },
};