import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { RecipeProvider } from '@/context/RecipeContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mein Rezeptbuch',
  description: 'Persönliches digitales Rezeptbuch',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={inter.variable}>
      <body>
        <RecipeProvider>{children}</RecipeProvider>
      </body>
    </html>
  );
}
