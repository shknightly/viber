import '@geist-ui/core/dist/geist.css';
import '../styles/globals.css';

import { CssBaseline, GeistProvider } from '@geist-ui/core';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Footer } from '@viber/ui';

export const metadata: Metadata = {
  title: 'Viber · Gemini Chat Orchestrator',
  description:
    'A Next.js reference implementation showcasing Google Gemini integration via the Vercel AI SDK style architecture.',
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en">
    <body>
      <GeistProvider>
        <CssBaseline />
        <div className="page-wrapper">
          <main className="page-content" role="main">
            {children}
          </main>
          <Footer />
        </div>
      </GeistProvider>
    </body>
  </html>
);

export default RootLayout;
