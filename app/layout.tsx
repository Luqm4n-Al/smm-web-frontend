import '@/app/globals.css';
import { Providers } from '@/lib/providers';

// Wrapper client-side untuk cleanup
import { ClientLayoutWrapper } from './ClientLayoutWrapper';

// Type metadata bawaan Next.js
import type { Metadata } from 'next';

// Library toast notification
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Social Vista',
  description: 'Social Media Management Web Application',

  icons: {
    // Icon utama
    icon: '/logo-icon.svg',
    // Fallback icon
    shortcut: '/logo-icon.png',
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

        {/* Global Providers */}
        <Providers>

          {/* Wrapper buat membersihkan data saat logout */}
          <ClientLayoutWrapper>

            {/* Tempat buat render semua page */}
            {children}

          </ClientLayoutWrapper>

        </Providers>

        {/*  Toast Notification dari react-hot-toast */}
        <Toaster
          position='top-right'

          toastOptions={{
            className:
              'bg-white text-gray-800 border border-gray-200',
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