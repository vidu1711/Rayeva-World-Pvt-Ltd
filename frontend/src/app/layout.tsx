import type { Metadata } from 'next';
import './globals.css';
import Layout from '@/components/Layout';

export const metadata: Metadata = {
  title: 'EcoProcure AI – Sustainable Commerce',
  description: 'B2B proposal generator and sustainability impact reporting',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
