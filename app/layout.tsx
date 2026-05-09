//app/layout.tsx

import '@/app/globals.css';
import { Providers } from '@/lib/providers';
import { ClientLayoutWrapper } from './ClientLayoutWrapper';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Social Vista',
  description: 'Social Media Management Web Application',
    icons: {
    icon: '/logo-icon.svg',   // SVG juga bisa untuk favicon modern
    shortcut: '/logo-icon.png', // Fallback PNG
    apple: '/logo-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Providers>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </Providers>
        <Toaster 
          position='top-right'
          toastOptions={{ 
            className: 'bg-white text-gray-800 border border-gray-200',
            success: {
              iconTheme: {
                primary: '#2563eb',
                secondary: 'white',
              }
            }
           }}
        />
      </body>
    </html>
  );
}
