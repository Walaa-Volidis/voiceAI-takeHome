import type { Metadata } from 'next';
import '@livekit/components-styles';
import './globals.css';
import { Public_Sans } from 'next/font/google';

const publicSans400 = Public_Sans({
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Voice AI TakeHome',
  description: 'Voice AI TakeHome',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${publicSans400.className}`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
