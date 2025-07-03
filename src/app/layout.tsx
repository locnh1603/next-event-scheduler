import React from 'react';
import './globals.css';
import { ThemeProvider } from 'next-themes';
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
      </body>
    </html>
  );
};

export default RootLayout;
