import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Banda de Coimbrões - Sociedade Musical 1º de Agosto',
  description: 'Website oficial e portal de gestão da Sociedade Musical 1º de Agosto (Banda de Coimbrões)',
  icons: {
    icon: '/assets/banda.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Roboto+Slab:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">{children}</body>
    </html>
  );
}

