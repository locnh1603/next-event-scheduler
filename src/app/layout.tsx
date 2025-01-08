import React from "react";
import Head from "next/head";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v15-appRouter";
import './globals.css';
import {Box} from "@mui/material";
import NavBar from '@/components/navbar';

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body>
        <AppRouterCacheProvider>
          <Box sx={{ height: '100%', width: "100%" }}>
            <NavBar></NavBar>
            <Box component="main" sx={{ p: 3 }}>
              {children}
            </Box>
          </Box>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
