import type { ReactNode } from 'react';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={geist.variable}>{children}</body>
    </html>
  );
} 

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};
