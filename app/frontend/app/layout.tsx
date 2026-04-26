import './globals.css';
import { Fraunces, Nunito } from "next/font/google";
import type { Metadata } from 'next';

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["600", "700", "800"],
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Plant Health Studio - Disease Detection',
  description: 'AI-powered plant disease detection using Machine Learning and Deep Learning models',
  icons: {
    icon: './leaf1.png',
    shortcut: '/images/leaf1.png',
    apple: '/images/leaf1.png',
  },
  openGraph: {
    title: 'Plant Health Studio',
    description: 'AI-powered plant disease detection',
    images: ['./images/leaf1.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="organic">
      <body className={`${fraunces.variable} ${nunito.variable}`}>
        {children}
      </body>
    </html>
  );
}
