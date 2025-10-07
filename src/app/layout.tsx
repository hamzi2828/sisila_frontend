import type { Metadata } from 'next';
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://silsila.example';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Silsila — Culturally‑inspired apparel',
    template: '%s — Silsila',
  },
  description:
    'Silsila merges cultural heritage with contemporary fashion — themes, series, and modern daily‑wear silhouettes.',
  applicationName: 'Silsila',
  keywords: [
    'Silsila',
    'cultural fashion',
    'poets series',
    'echoes of the winds',
    'streetwear',
    'typography',
    'lookbook',
    'modern apparel',
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
  themeColor: '#0a0a0a',
  openGraph: {
    title: 'Silsila — Culturally‑inspired apparel',
    description:
      'Themes, categories, and series shaped for modern expression. Explore lookbooks, stories, and the latest drops.',
    url: siteUrl,
    siteName: 'Silsila',
    images: [
      {
        url: '/images/og-silsila.jpg',
        width: 1200,
        height: 630,
        alt: 'Silsila — Modern editorial collage',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Silsila — Culturally‑inspired apparel',
    description:
      'Themes, categories, and series shaped for modern expression.',
    images: ['/images/og-silsila.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
  },
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