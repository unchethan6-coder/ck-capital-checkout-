import type { ReactNode } from 'react';
import './globals.css';

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};
