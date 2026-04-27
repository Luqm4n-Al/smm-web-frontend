import '@/app/globals.css';
import { Providers } from '@/lib/providers';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'SMM Web',
  description: 'Social Media Management Web Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
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
