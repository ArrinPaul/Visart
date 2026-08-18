import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VISART — Your craft. Digitally understood.',
  description: 'Turn handmade artisan craft into professional digital listings, transparent price guidance, multilingual reach, and shareable catalogue pages.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#F5F0E8] text-[#1E211F] antialiased selection:bg-[#B85C43]/20 selection:text-[#1E211F]">
        {children}
      </body>
    </html>
  );
}
