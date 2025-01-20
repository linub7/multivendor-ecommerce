import type { Metadata } from 'next';
import { Inter, Barlow } from 'next/font/google';
import { ThemeProvider } from 'next-themes';

import './globals.css';

const interFont = Inter({ subsets: ['latin'] });
const barlowFont = Barlow({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-barlow',
});

export const metadata: Metadata = {
  title: 'GoShop',
  description: 'Multi Vendor E-commerce app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${interFont.className} ${barlowFont.variable}`}>
        <ThemeProvider
          attribute={'class'}
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
