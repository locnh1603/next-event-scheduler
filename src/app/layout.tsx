import React from 'react';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { ToastProvider } from '@/providers/toast.provider';
const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          themes={['light', 'dark', 'blue', 'dark-blue']}
        >
          {children}
        </ThemeProvider>
        <ToastProvider />
      </body>
    </html>
  );
};

export default RootLayout;
