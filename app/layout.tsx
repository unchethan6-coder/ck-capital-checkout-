import type { Metadata, Viewport } from 'next'
import { Inter, DM_Sans, Karla, Rubik, Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { SupportChat } from '@/components/SupportChat'


const _inter = Inter({ subsets: ['latin'], display: 'swap' })
const _dmSans = DM_Sans({ subsets: ['latin'], display: 'swap' })
const _karla = Karla({ subsets: ['latin'], display: 'swap' })
const _rubik = Rubik({ subsets: ['latin'], display: 'swap' })
const _poppins = Poppins({ weight: ['300', '400', '500', '600', '700'], subsets: ['latin'], display: 'swap' })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#D4AF37',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://ckcapital.co.uk'),
  title: 'CK Capital – Premium Prop Trading Firm | Funded Accounts Up to $1.2M | 100% Profit Split',
  description: 'Join CK Capital, a leading prop trading firm offering instant funded simulated accounts up to $1.2M with 100% profit splits, flexible payouts, and 24/7 support. Trade Forex, Crypto, and Commodities with no restrictions.',
  keywords: [
    'prop trading',
    'prop firm',
    'funded trading',
    'trading firm',
    'forex trading',
    'crypto trading',
    'instant funding',
    'trading capital',
    'funded trading accounts',
    'proprietary trading',
    'prop trading firm UK',
    'forex prop firm',
    'cryptocurrency trading',
    'trading challenge',
    'trading evaluation',
    'funded trader',
    'trading account',
    'profitable trading',
    'day trading',
    'swing trading',
    'algorithmic trading',
    'forex broker',
    'trading platform',
    'trading rules',
    'profit split',
    'trading education',
    'trading signals',
    'technical analysis',
    'risk management',
    'money management',
    'trading psychology',
    'trader evaluation',
    'trading verification',
    'instant trading account',
    'risk-free trading',
    'simulated trading',
    'demo trading account',
  ],
  authors: [{ name: 'CK Capital Group' }],
  creator: 'CK Capital Group',
  publisher: 'CK Capital Group Ltd',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://ckcapital.co.uk',
    siteName: 'CK Capital',
    title: 'CK Capital – Best Prop Trading Firm | Funded Trading Accounts Up to $1.2M',
    description: 'Join CK Capital, the leading prop trading firm. Get instant funded trading accounts with 100% profit splits, 24/7 support, and no restrictions on trading styles. Trade Forex, Crypto & Commodities.',
    images: [
      {
        url: 'https://ckcapital.co.uk/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CK Capital - Leading Prop Trading Firm with Funded Accounts',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CK Capital – Best Prop Trading Firm | Funded Trading Accounts Up to $1.2M',
    description: 'Join 50,000+ traders at CK Capital. Get instant funded trading accounts with 100% profit splits and 24/7 support. Start your prop trading journey today.',
    creator: '@ckcapital',
    images: ['https://ckcapital.co.uk/twitter-image.png'],
  },
  alternates: {
    canonical: 'https://ckcapital.co.uk',
  },
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
    other: [
      {
        rel: 'mask-icon',
        url: '/mask-icon.svg',
        color: '#E8C547',
      },
    ],
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID ? (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        ) : null}

        {/* Google Ads Conversion Tracking */}
        {process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ? (
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}`}
          />
        ) : null}

        {/* Google Tag Manager - AW-18140473298 */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-18140473298"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-18140473298');
            `,
          }}
        />

        {/* Google Analytics 4 - G-TMM875YWHK */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-TMM875YWHK"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-TMM875YWHK');
            `,
          }}
        />

        {/* Structured Data - Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'CK Capital',
              alternateName: 'CK Capital Group',
              url: 'https://ckcapital.co.uk',
              logo: 'https://ckcapital.co.uk/logo.png',
              description: 'CK Capital is a leading prop trading firm offering funded trading accounts with up to 100% profit splits and 24/7 support.',
              sameAs: [
                'https://twitter.com/ckcapital',
                'https://linkedin.com/company/ckcapital',
                'https://discord.gg/ckcapital',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+44-xxx-xxx-xxxx',
                contactType: 'Customer Support',
                contactOption: 'TollFree',
              },
            }),
          }}
        />

        {/* Structured Data - Service Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: 'Prop Trading Account',
              provider: {
                '@type': 'Organization',
                name: 'CK Capital',
              },
              description: 'Funded trading accounts with up to $1.2M capital and flexible profit splits for professional traders.',
              offers: {
                '@type': 'Offer',
                priceCurrency: 'GBP',
                price: '13',
                pricingUnit: 'CHALLENGE_FEE',
              },
              areaServed: 'Worldwide',
            }),
          }}
        />

        {/* Structured Data - FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What is CK Capital?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'CK Capital is a proprietary trading firm that provides qualified traders with funded trading accounts up to $1.2M in capital with flexible profit splits.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How much is the challenge fee?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Challenge fees range from $13 to $88 depending on the account size and challenge type selected.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What is the profit split percentage?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'CK Capital traders receive up to 100% of their profits. There are no commissions or hidden fees.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Can I trade the news?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, news trading is allowed on CK Capital accounts. We encourage traders to capitalize on market-moving events with proper risk management.',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <SupportChat />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
