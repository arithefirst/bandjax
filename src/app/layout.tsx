import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import './globals.css';
import { Register } from '@/components/registerSw';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Bandjax',
  description: 'Generated by create next app',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl={'/'}
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}>
          {children} <Toaster />
        </body>
        <Register />
      </html>
    </ClerkProvider>
  );
}
