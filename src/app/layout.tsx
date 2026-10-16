import type { Metadata, Viewport } from 'next';
import { Poppins, Manrope } from 'next/font/google';
import ClientLayout from '@/components/ClientLayout';
import './globals.css';
import '@fortawesome/fontawesome-free/css/all.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.silsilla.pk';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Silsila — Casual clothing woven with cultural roots',
    template: '%s — Silsila',
  },
  description:
    'Silsila is a Pakistani casual clothing line woven with cultural roots, values, and emotions — creativity that uplifts your vibe, aura, and style. Shop Poets, Alphabets, Cinema and Anime series with delivery across Pakistan.',
  applicationName: 'Silsila',
  keywords: [
    'Silsila',
    'Pakistani clothing brand',
    'casual wear Pakistan',
    'graphic tees Pakistan',
    'Urdu poetry t-shirts',
    'Poets series',
    'Ghalib',
    'Faiz Ahmed Faiz',
    'Alphabets series',
    'Southeastern Hymns',
    'Echoes of the Winds',
    'cultural fashion',
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Silsila — Casual clothing woven with cultural roots',
    description:
      'A Pakistani casual clothing line woven with cultural roots, values, and emotions. Explore themes, series, lookbooks, and the latest drops.',
    url: siteUrl,
    siteName: 'Silsila',
    images: [
      {
        url: '/images/silsila-logo.png',
        width: 542,
        height: 460,
        alt: 'Silsila',
      },
    ],
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Silsila — Casual clothing woven with cultural roots',
    description:
      'A Pakistani casual clothing line woven with cultural roots, values, and emotions.',
    images: ['/images/silsila-logo.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${manrope.variable} antialiased bg-white text-gray-900 min-h-screen`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}